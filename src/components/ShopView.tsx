import { useState, useEffect, MouseEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Info, 
  ArrowLeft, 
  Check, 
  ShoppingBag, 
  X, 
  Search, 
  SlidersHorizontal, 
  Star,
  ChevronDown,
  RefreshCw
} from 'lucide-react';
import { Product } from '../types';
import ProductDetailsView from './ProductDetailsView';
import ProductBadge from './ProductBadge';

export const COLOR_OPTIONS = [
  { name: 'Alabaster', label: 'Alabaster / White', hex: '#F9F6F0', textDark: true },
  { name: 'Indigo', label: 'Fermented Indigo', hex: '#2B3E5B', textDark: false },
  { name: 'Ochre', label: 'Warm Ochre', hex: '#C68B34', textDark: false },
  { name: 'Sand', label: 'Ecru Sand', hex: '#D2C0A5', textDark: true },
  { name: 'Clay', label: 'Terracotta Clay', hex: '#B85D43', textDark: false },
  { name: 'Charcoal', label: 'Charcoal Madder', hex: '#4A4A4A', textDark: false },
  { name: 'Obsidian', label: 'Obsidian Brocade', hex: '#1C1C1C', textDark: false }
];

export const AVAILABILITY_OPTIONS = [
  { id: 'all', label: 'All Garments' },
  { id: 'new', label: 'New Arrivals' },
  { id: 'bestseller', label: 'Bestsellers' },
  { id: 'limited', label: 'Limited Editions' },
  { id: 'sale', label: 'On Sale' },
  { id: 'low-stock', label: 'Low Stock' }
];

interface ShopViewProps {
  products: Product[];
  onAddToCart: (product: Product, size: string, quantity?: number) => void;
  wishlist: Product[];
  onToggleWishlist: (product: Product) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  onOpenSizeAdvisor: () => void;
  onOpenQuickView: (product: Product) => void;
  recentlyViewed?: Product[];
  onClearRecentlyViewed?: () => void;
}

export default function ShopView({
  products,
  onAddToCart,
  wishlist,
  onToggleWishlist,
  selectedProduct,
  setSelectedProduct,
  onOpenSizeAdvisor,
  onOpenQuickView,
  recentlyViewed,
  onClearRecentlyViewed
}: ShopViewProps) {
  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'All' | 'Tailoring' | 'Outerwear' | 'Knitwear' | 'Essentials'>('All');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedAvailabilities, setSelectedAvailabilities] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(8000);
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'newest'>('featured');

  // Search focus states
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileSearchFocused, setIsMobileSearchFocused] = useState(false);

  // Calculate suggestions
  const getSuggestions = (query: string) => {
    const trimmed = query.trim().toLowerCase();
    
    // Matched categories/collections (Instant matching)
    const categoriesList = ['Tailoring', 'Outerwear', 'Knitwear', 'Essentials'];
    const matchedCategories = trimmed 
      ? categoriesList.filter(cat => cat.toLowerCase().includes(trimmed) || trimmed.includes(cat.toLowerCase()))
      : [];

    if (!trimmed) {
      // Return beautiful curated standard terms and bestsellers when query is empty
      return {
        categories: [],
        products: products.filter(p => p.isBestseller).slice(0, 3),
        terms: ['Linen', 'Khadi', 'Indigo', 'Tailored', 'Ivory']
      };
    }

    // Match products (up to 4 matches)
    const matchedProducts = products.filter(product => {
      const nameMatch = product.name.toLowerCase().includes(trimmed);
      const descMatch = product.description.toLowerCase().includes(trimmed);
      const colorMatch = product.color.toLowerCase().includes(trimmed);
      const catMatch = product.category.toLowerCase().includes(trimmed);
      return nameMatch || descMatch || colorMatch || catMatch;
    }).slice(0, 4);

    // Contextual suggested terms
    const matchedTerms: string[] = [];
    if ('linen'.includes(trimmed) || trimmed.includes('linen')) matchedTerms.push('Linen');
    if ('khadi'.includes(trimmed) || trimmed.includes('khadi')) matchedTerms.push('Khadi');
    if ('indigo'.includes(trimmed) || trimmed.includes('indigo')) matchedTerms.push('Indigo');
    if ('cotton'.includes(trimmed) || trimmed.includes('cotton')) matchedTerms.push('Cotton-Silk');
    if ('white'.includes(trimmed) || 'ivory'.includes(trimmed)) matchedTerms.push('Ivory');
    if ('oversized'.includes(trimmed) || 'relaxed'.includes(trimmed)) matchedTerms.push('Relaxed Fit');

    return {
      categories: matchedCategories,
      products: matchedProducts,
      terms: matchedTerms.slice(0, 3)
    };
  };

  const suggestions = getSuggestions(searchQuery);
  
  // Mobile drawer state
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Detail Overlay Local State
  const [detailActiveImageIndex, setDetailActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [isAddedFeedback, setIsAddedFeedback] = useState(false);

  // Reset detail states when product changes
  useEffect(() => {
    if (selectedProduct) {
      setDetailActiveImageIndex(0);
      setSelectedSize('');
      setIsAddedFeedback(false);
    }
  }, [selectedProduct]);

  // Size filter toggle
  const toggleSizeFilter = (size: string) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setActiveCategory('All');
    setSelectedSizes([]);
    setSelectedColors([]);
    setSelectedAvailabilities([]);
    setMaxPrice(8000);
    setSortBy('featured');
  };

  // Loading skeleton state triggered by filter or sort changes
  const [isFilterLoading, setIsFilterLoading] = useState(false);

  useEffect(() => {
    setIsFilterLoading(true);
    const timer = setTimeout(() => {
      setIsFilterLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [activeCategory, searchQuery, selectedSizes, selectedColors, selectedAvailabilities, maxPrice, sortBy]);

  // Filter & Sort Calculations
  const filteredProducts = products.filter(product => {
    // Category check
    if (activeCategory !== 'All' && product.category !== activeCategory) {
      return false;
    }
    // Search query check
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchesName = product.name.toLowerCase().includes(q);
      const matchesDesc = product.description.toLowerCase().includes(q);
      const matchesColor = product.color.toLowerCase().includes(q);
      const matchesCat = product.category.toLowerCase().includes(q);
      if (!matchesName && !matchesDesc && !matchesColor && !matchesCat) {
        return false;
      }
    }
    // Price check
    if (product.price > maxPrice) {
      return false;
    }
    // Size check
    if (selectedSizes.length > 0) {
      const hasMatchingSize = product.sizes.some(size => selectedSizes.includes(size));
      if (!hasMatchingSize) {
        return false;
      }
    }
    // Color check
    if (selectedColors.length > 0) {
      const matchesColor = selectedColors.some(col => 
        product.color.toLowerCase().includes(col.toLowerCase())
      );
      if (!matchesColor) {
        return false;
      }
    }
    // Availability check
    if (selectedAvailabilities.length > 0) {
      const matchesAvailability = selectedAvailabilities.some(av => {
        if (av === 'new') return product.isNew;
        if (av === 'bestseller') return product.isBestseller;
        if (av === 'limited') return product.isLimitedEdition;
        if (av === 'sale') return product.isSale;
        if (av === 'low-stock') return product.isLowStock;
        return true;
      });
      if (!matchesAvailability) {
        return false;
      }
    }
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') {
      return a.price - b.price;
    }
    if (sortBy === 'price-high') {
      return b.price - a.price;
    }
    if (sortBy === 'newest') {
      return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
    }
    // Featured default sort (bestsellers first)
    return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0);
  });

  const activeFilterCount = 
    (activeCategory !== 'All' ? 1 : 0) + 
    (searchQuery.trim() !== '' ? 1 : 0) + 
    selectedSizes.length + 
    selectedColors.length +
    selectedAvailabilities.length +
    (maxPrice < 8000 ? 1 : 0);

  // Helper to count products per category in real-time
  const getCategoryCount = (category: string) => {
    if (category === 'All') return products.length;
    return products.filter(p => p.category === category).length;
  };

  // Helper to count products per color in real-time
  const getColorCount = (col: string) => {
    return products.filter(p => p.color.toLowerCase().includes(col.toLowerCase())).length;
  };

  // Helper to count products per availability type in real-time
  const getAvailabilityCount = (av: string) => {
    return products.filter(p => {
      if (av === 'new') return p.isNew;
      if (av === 'bestseller') return p.isBestseller;
      if (av === 'limited') return p.isLimitedEdition;
      if (av === 'sale') return p.isSale;
      if (av === 'low-stock') return p.isLowStock;
      return true;
    }).length;
  };

  // Luxury shimmer skeleton card component
  const SkeletonCard = () => (
    <div className="flex flex-col justify-between space-y-4">
      <div className="relative aspect-[3/4] bg-brand-sand/15 border border-brand-sand/10 overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-sand/20 to-transparent"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{
            repeat: Infinity,
            duration: 1.4,
            ease: 'linear'
          }}
        />
      </div>
      <div className="space-y-2 pt-2">
        <div className="h-2.5 bg-brand-sand/25 w-1/4 rounded-none" />
        <div className="h-3.5 bg-brand-sand/20 w-3/4 rounded-none" />
        <div className="h-3 bg-brand-sand/15 w-1/2 rounded-none" />
      </div>
    </div>
  );

  const handleQuickAdd = (product: Product, size: string, e: MouseEvent) => {
    e.stopPropagation(); // Avoid opening the detail modal
    onAddToCart(product, size);
    
    // Provide a beautiful transient feedback animation on the trigger element
    const btn = e.currentTarget as HTMLElement;
    const originalText = btn.innerHTML;
    btn.innerHTML = `<span class="text-[9px] font-bold text-emerald-800 animate-pulse">✓</span>`;
    btn.style.borderColor = 'var(--color-emerald-800)';
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.style.borderColor = '';
    }, 1200);
  };

  const handleDetailAdd = (product: Product) => {
    if (!selectedSize) return;
    onAddToCart(product, selectedSize);
    setIsAddedFeedback(true);
    setTimeout(() => {
      setIsAddedFeedback(false);
    }, 2000);
  };

  const isProductInWishlist = (product: Product) => {
    return wishlist.some(w => w.id === product.id);
  };

  // Star mapping helper for aesthetic consistency
  const getProductRating = (id: string) => {
    const ratings: Record<string, { val: number; reviews: number }> = {
      p1: { val: 4.9, reviews: 84 },
      p2: { val: 4.8, reviews: 124 },
      p3: { val: 4.7, reviews: 96 },
      p4: { val: 4.8, reviews: 112 },
      p5: { val: 4.9, reviews: 148 },
      p6: { val: 4.8, reviews: 67 },
      p7: { val: 4.7, reviews: 215 },
      p8: { val: 4.9, reviews: 53 }
    };
    return ratings[id] || { val: 4.8, reviews: 42 };
  };

  return (
    <div id="shop-view" className="bg-brand-cream min-h-screen pt-10 pb-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Editorial Heading Block */}
        <div className="mb-12 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <p className="text-[10px] font-mono tracking-[0.3em] text-brand-muted uppercase">PERMANENT EDITIONS</p>
            <h1 className="font-serif text-4xl md:text-5xl font-light text-brand-charcoal tracking-tight">Atelier Kora</h1>
            <p className="text-xs text-brand-muted max-w-xl font-light leading-relaxed">
              Comfortable and simple clothing woven with premium Chanderi cotton-silk, organic hand-spun Khadi cotton, and natural dyes. Made in small batches to support local Indian weavers and artisans.
            </p>
          </div>
          
          {/* Item Count Display */}
          <div className="text-center md:text-right">
            <p className="text-[10px] font-mono tracking-widest text-brand-muted uppercase">
              Showing <span className="font-bold text-brand-charcoal">{sortedProducts.length}</span> of {products.length} garments
            </p>
          </div>
        </div>

        {/* Desktop Layout Wrapper: Sidebar + Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* DESKTOP SIDEBAR FILTERS (Hidden on Mobile/Tablet) */}
          <aside className="hidden lg:block lg:col-span-3 space-y-10 sticky top-28 bg-brand-cream/50 p-6 border border-brand-sand/45 shadow-sm">
            
            {/* Search Input */}
            <div className="space-y-3 relative">
              <span className="text-[10px] font-mono tracking-[0.25em] text-brand-muted uppercase block font-semibold">Search Catalog</span>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-muted/70" />
                <input
                  type="text"
                  placeholder="e.g. linen, indigo..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                  className="w-full bg-brand-cream border border-brand-sand/80 focus:border-brand-charcoal text-brand-charcoal pl-9 pr-8 py-2.5 text-xs tracking-wider placeholder-brand-muted/40 focus:outline-none transition-all duration-300 rounded-none font-mono"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-charcoal cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Suggestions dropdown */}
              <AnimatePresence>
                {isSearchFocused && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute top-full left-0 right-0 mt-1.5 bg-brand-cream border border-brand-sand/70 shadow-lg z-50 p-4 space-y-4 max-h-[350px] overflow-y-auto no-scrollbar"
                  >
                    {/* Category matches */}
                    {suggestions.categories.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-mono tracking-widest text-brand-muted uppercase block font-semibold">Matched Categories</span>
                        <div className="flex flex-wrap gap-1.5">
                          {suggestions.categories.map((cat) => (
                            <button
                              key={cat}
                              onMouseDown={() => {
                                setActiveCategory(cat as any);
                                setSearchQuery('');
                                setIsSearchFocused(false);
                              }}
                              className="text-[9px] font-mono tracking-wider bg-brand-sand/20 hover:bg-brand-charcoal hover:text-white text-brand-charcoal px-2 py-1 border border-brand-sand/40 transition-colors uppercase cursor-pointer"
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Suggested terms */}
                    {suggestions.terms.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-mono tracking-widest text-brand-muted uppercase block font-semibold">Suggested Terms</span>
                        <div className="flex flex-wrap gap-1.5">
                          {suggestions.terms.map((term) => (
                            <button
                              key={term}
                              onMouseDown={() => {
                                setSearchQuery(term);
                                setIsSearchFocused(false);
                              }}
                              className="text-[9px] font-mono tracking-wider bg-transparent hover:bg-brand-sand/25 text-brand-charcoal px-2 py-1 border border-brand-sand/50 transition-colors uppercase cursor-pointer"
                            >
                              {term}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Matched / Recommended Products */}
                    <div className="space-y-2">
                      <span className="text-[9px] font-mono tracking-widest text-brand-muted uppercase block font-semibold">
                        {searchQuery ? 'Matching Garments' : 'Curated Bestsellers'}
                      </span>
                      {suggestions.products.length > 0 ? (
                        <div className="divide-y divide-brand-sand/20">
                          {suggestions.products.map((p) => (
                            <div
                              key={p.id}
                              onMouseDown={() => {
                                setSelectedProduct(p);
                                setIsSearchFocused(false);
                              }}
                              className="flex items-center gap-3 py-2 cursor-pointer group/item hover:bg-brand-sand/15 px-1 transition-colors"
                            >
                              <img
                                src={p.images[0]}
                                alt={p.name}
                                className="w-8 h-10 object-cover bg-brand-sand/10 border border-brand-sand/20 grayscale-[5%] group-hover/item:grayscale-0 transition-all"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-serif text-[11px] font-light text-brand-charcoal group-hover/item:text-brand-muted transition-colors truncate">
                                  {p.name}
                                </h4>
                                <p className="font-mono text-[8px] text-brand-muted uppercase tracking-wider">{p.category} • {p.color}</p>
                              </div>
                              <div className="text-[9px] font-mono font-medium text-brand-charcoal shrink-0">
                                ₹{p.price.toLocaleString('en-IN')}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[10px] font-mono text-brand-muted italic py-1">No matches found</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Category Filter */}
            <div className="space-y-3">
              <span className="text-[10px] font-mono tracking-[0.25em] text-brand-muted uppercase block font-semibold">Categories</span>
              <div className="flex flex-col space-y-2">
                {(['All', 'Tailoring', 'Outerwear', 'Knitwear', 'Essentials'] as const).map((cat) => {
                  const isActive = activeCategory === cat;
                  const count = getCategoryCount(cat);
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`flex items-center justify-between text-xs tracking-widest text-left py-1.5 transition-all duration-200 group cursor-pointer ${
                        isActive ? 'text-brand-charcoal font-semibold' : 'text-brand-muted hover:text-brand-charcoal'
                      }`}
                    >
                      <span className="flex items-center space-x-2">
                        <span className={`w-1.5 h-1.5 rounded-full bg-brand-charcoal transition-transform ${isActive ? 'scale-100' : 'scale-0'}`} />
                        <span className="uppercase">{cat}</span>
                      </span>
                      <span className="text-[9px] font-mono text-brand-muted/75 bg-brand-sand/15 px-1.5 py-0.5 border border-brand-sand/20 font-light">
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Filter (Interactive Slider) */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-[10px] font-mono text-brand-muted uppercase tracking-wider">
                <span className="font-semibold">Maximum Price</span>
                <span className="text-brand-charcoal font-bold bg-brand-sand/20 px-2 py-0.5 border border-brand-sand/40">₹{maxPrice.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="8000"
                step="100"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full h-[3px] bg-brand-sand rounded-lg appearance-none cursor-pointer accent-brand-charcoal focus:outline-none transition-all"
              />
              <div className="flex justify-between text-[9px] font-mono text-brand-muted/70">
                <span>₹1,000</span>
                <span>₹8,000</span>
              </div>
            </div>

            {/* Size Filter */}
            <div className="space-y-3">
              <span className="text-[10px] font-mono tracking-[0.25em] text-brand-muted uppercase block font-semibold">Filter by Size</span>
              <div className="grid grid-cols-5 gap-1.5">
                {['XS', 'S', 'M', 'L', 'XL'].map((sz) => {
                  const isSelected = selectedSizes.includes(sz);
                  return (
                    <button
                      key={sz}
                      onClick={() => toggleSizeFilter(sz)}
                      className={`aspect-square flex items-center justify-center font-mono text-xs border transition-all duration-300 cursor-pointer ${
                        isSelected
                          ? 'bg-brand-charcoal text-white border-brand-charcoal font-bold'
                          : 'border-brand-sand/65 hover:border-brand-charcoal text-brand-charcoal/80 bg-brand-cream/30'
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Color Filter */}
            <div className="space-y-3">
              <span className="text-[10px] font-mono tracking-[0.25em] text-brand-muted uppercase block font-semibold">Filter by Color</span>
              <div className="grid grid-cols-2 gap-1.5">
                {COLOR_OPTIONS.map((opt) => {
                  const isSelected = selectedColors.includes(opt.name);
                  const count = getColorCount(opt.name);
                  return (
                    <button
                      key={opt.name}
                      onClick={() => {
                        setSelectedColors(prev => 
                          prev.includes(opt.name) ? prev.filter(c => c !== opt.name) : [...prev, opt.name]
                        );
                      }}
                      className={`flex items-center space-x-1.5 px-2 py-2 border text-[10px] tracking-wider text-left transition-all duration-300 cursor-pointer ${
                        isSelected 
                          ? 'border-brand-charcoal bg-brand-charcoal text-white font-medium' 
                          : 'border-brand-sand/50 hover:border-brand-charcoal text-brand-charcoal bg-brand-cream/20'
                      }`}
                    >
                      <span 
                        className="w-3.5 h-3.5 rounded-full border border-brand-sand/40 shrink-0 shadow-xs flex items-center justify-center"
                        style={{ backgroundColor: opt.hex }}
                      >
                        {isSelected && (
                          <Check className={`w-2.5 h-2.5 ${opt.textDark ? 'text-brand-charcoal' : 'text-white'}`} />
                        )}
                      </span>
                      <span className="truncate uppercase flex-1 text-[9px]">{opt.name}</span>
                      <span className={`text-[8px] font-mono opacity-85 ${isSelected ? 'text-white/80' : 'text-brand-muted'}`}>
                        ({count})
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Availability Filter */}
            <div className="space-y-3">
              <span className="text-[10px] font-mono tracking-[0.25em] text-brand-muted uppercase block font-semibold">Availability</span>
              <div className="space-y-1.5">
                {AVAILABILITY_OPTIONS.map((opt) => {
                  const isSelected = selectedAvailabilities.includes(opt.id);
                  const count = getAvailabilityCount(opt.id);
                  if (count === 0 && opt.id !== 'all') return null;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => {
                        if (opt.id === 'all') {
                          setSelectedAvailabilities([]);
                        } else {
                          setSelectedAvailabilities(prev => 
                            prev.includes(opt.id) ? prev.filter(id => id !== opt.id) : [...prev, opt.id]
                          );
                        }
                      }}
                      className={`w-full flex items-center justify-between text-left text-[11px] tracking-widest py-1 transition-colors cursor-pointer ${
                        (opt.id === 'all' && selectedAvailabilities.length === 0) || isSelected
                          ? 'text-brand-charcoal font-semibold' 
                          : 'text-brand-muted hover:text-brand-charcoal'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 border border-brand-sand flex items-center justify-center rounded-none transition-colors ${
                          (opt.id === 'all' && selectedAvailabilities.length === 0) || isSelected 
                            ? 'bg-brand-charcoal border-brand-charcoal' 
                            : 'bg-transparent'
                        }`}>
                          {((opt.id === 'all' && selectedAvailabilities.length === 0) || isSelected) && (
                            <Check className="w-2 h-2 text-white" />
                          )}
                        </div>
                        <span className="uppercase">{opt.label}</span>
                      </div>
                      <span className="text-[9px] font-mono text-brand-muted/75 bg-brand-sand/15 px-1.5 py-0.5 border border-brand-sand/20 font-light">
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Clear Filters (Desktop) */}
            {activeFilterCount > 0 && (
              <button
                id="desktop-clear-all-filters"
                onClick={resetFilters}
                className="w-full flex items-center justify-center space-x-2 text-[10px] font-mono tracking-widest py-2.5 border border-dashed border-brand-sand hover:border-brand-charcoal text-brand-charcoal transition-all duration-300 bg-transparent uppercase cursor-pointer"
              >
                <RefreshCw className="w-3 h-3 text-brand-muted animate-hover" />
                <span>Reset Filters ({activeFilterCount})</span>
              </button>
            )}

          </aside>

          {/* MAIN PRODUCT AREA (Right columns) */}
          <main className="col-span-1 lg:col-span-9 space-y-6">
            
            {/* MOBILE ACTION BAR (Hidden on Desktop) */}
            <div className="lg:hidden flex items-center justify-between gap-4 border-b border-brand-sand/60 pb-5 mb-4">
              
              {/* Trigger Drawer Button */}
              <button
                id="mobile-filter-drawer-trigger"
                onClick={() => setIsMobileFilterOpen(true)}
                className="flex items-center space-x-2.5 bg-brand-sand/30 border border-brand-sand/80 px-4 py-2.5 text-xs font-mono text-brand-charcoal tracking-wider uppercase cursor-pointer transition-colors hover:bg-brand-sand/55 active:scale-95"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-brand-charcoal" />
                <span>Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
              </button>

              {/* Sorters Selection (Mobile) */}
              <div className="flex items-center space-x-2 text-xs">
                <span className="font-mono text-[9px] text-brand-muted uppercase hidden sm:inline-block">Sort:</span>
                <div className="relative">
                  <select
                    id="mobile-product-sorter"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="appearance-none bg-brand-cream border border-brand-sand/80 py-2.5 pl-4 pr-9 text-xs tracking-wider text-brand-charcoal font-medium cursor-pointer focus:outline-none focus:border-brand-charcoal rounded-none"
                  >
                    <option value="featured">Featured Editions</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="newest">New Arrivals</option>
                  </select>
                  <ChevronDown className="w-3 h-3 text-brand-charcoal absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

            </div>

            {/* DESKTOP SORTER RAIL (Hidden on Mobile) */}
            <div className="hidden lg:flex items-center justify-between border-b border-brand-sand/50 pb-4 mb-4">
              
              {/* Active Filter Badges */}
              <div className="flex-grow">
                <AnimatePresence>
                  {activeFilterCount > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-wrap gap-2 items-center"
                    >
                      <span className="text-[10px] font-mono tracking-widest text-brand-muted mr-1">ACTIVE:</span>
                      
                      {activeCategory !== 'All' && (
                        <span className="flex items-center space-x-1 px-2.5 py-1 bg-brand-sand/30 border border-brand-sand/60 text-[9px] font-mono tracking-wider text-brand-charcoal uppercase">
                          <span>{activeCategory}</span>
                          <button onClick={() => setActiveCategory('All')} className="hover:text-brand-charcoal cursor-pointer"><X className="w-2.5 h-2.5" /></button>
                        </span>
                      )}
                      
                      {searchQuery.trim() !== '' && (
                        <span className="flex items-center space-x-1 px-2.5 py-1 bg-brand-sand/30 border border-brand-sand/60 text-[9px] font-mono tracking-wider text-brand-charcoal uppercase">
                          <span>"{searchQuery}"</span>
                          <button onClick={() => setSearchQuery('')} className="hover:text-brand-charcoal cursor-pointer"><X className="w-2.5 h-2.5" /></button>
                        </span>
                      )}

                      {selectedSizes.map(sz => (
                        <span key={sz} className="flex items-center space-x-1 px-2.5 py-1 bg-brand-sand/30 border border-brand-sand/60 text-[9px] font-mono tracking-wider text-brand-charcoal uppercase">
                          <span>Size: {sz}</span>
                          <button onClick={() => toggleSizeFilter(sz)} className="hover:text-brand-charcoal cursor-pointer"><X className="w-2.5 h-2.5" /></button>
                        </span>
                      ))}

                      {maxPrice < 8000 && (
                        <span className="flex items-center space-x-1 px-2.5 py-1 bg-brand-sand/30 border border-brand-sand/60 text-[9px] font-mono tracking-wider text-brand-charcoal uppercase">
                          <span>&lt; ₹{maxPrice.toLocaleString('en-IN')}</span>
                          <button onClick={() => setMaxPrice(8000)} className="hover:text-brand-charcoal cursor-pointer"><X className="w-2.5 h-2.5" /></button>
                        </span>
                      )}

                      {selectedColors.map(col => (
                        <span key={col} className="flex items-center space-x-1.5 px-2.5 py-1 bg-brand-sand/30 border border-brand-sand/60 text-[9px] font-mono tracking-wider text-brand-charcoal uppercase">
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLOR_OPTIONS.find(o => o.name === col)?.hex || '#ccc' }} />
                          <span>Color: {col}</span>
                          <button onClick={() => setSelectedColors(prev => prev.filter(c => c !== col))} className="hover:text-brand-charcoal cursor-pointer"><X className="w-2.5 h-2.5" /></button>
                        </span>
                      ))}

                      {selectedAvailabilities.map(av => (
                        <span key={av} className="flex items-center space-x-1 px-2.5 py-1 bg-brand-sand/30 border border-brand-sand/60 text-[9px] font-mono tracking-wider text-brand-charcoal uppercase">
                          <span>{AVAILABILITY_OPTIONS.find(o => o.id === av)?.label}</span>
                          <button onClick={() => setSelectedAvailabilities(prev => prev.filter(id => id !== av))} className="hover:text-brand-charcoal cursor-pointer"><X className="w-2.5 h-2.5" /></button>
                        </span>
                      ))}

                      <button 
                        onClick={resetFilters}
                        className="text-[9px] font-mono tracking-widest text-brand-charcoal/65 hover:text-brand-charcoal underline uppercase ml-2 cursor-pointer"
                      >
                        Clear All
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Sorter Dropdown (Desktop) */}
              <div className="flex items-center space-x-3 text-xs shrink-0 pl-4">
                <span className="font-mono text-[9px] tracking-widest text-brand-muted uppercase">Sort By:</span>
                <div className="relative">
                  <select
                    id="desktop-product-sorter"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="appearance-none bg-transparent border border-brand-sand/80 py-1.5 pl-3 pr-8 focus:outline-none focus:border-brand-charcoal font-medium text-brand-charcoal cursor-pointer text-xs rounded-none"
                  >
                    <option value="featured">Featured Editions</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="newest">New Arrivals</option>
                  </select>
                  <ChevronDown className="w-3 h-3 text-brand-charcoal absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

            </div>

            {/* Search filter result indicator (Mobile) */}
            <div className="lg:hidden px-1">
              {activeFilterCount > 0 && (
                <div className="flex items-center justify-between text-[11px] font-mono text-brand-muted">
                  <p>Active Filters: {activeFilterCount}</p>
                  <button onClick={resetFilters} className="underline text-brand-charcoal uppercase">Reset Filters</button>
                </div>
              )}
            </div>

            {/* Smooth Touch-Swipeable Categories Bar (Mobile-only) */}
            <div className="lg:hidden flex items-center space-x-2 overflow-x-auto pb-4 pt-1 mb-2 no-scrollbar snap-x -mx-6 px-6">
              {(['All', 'Tailoring', 'Outerwear', 'Knitwear', 'Essentials'] as const).map((cat) => {
                const isActive = activeCategory === cat;
                const count = getCategoryCount(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`shrink-0 snap-start px-4.5 py-3.5 text-[10px] font-mono tracking-widest uppercase border transition-all duration-300 rounded-none cursor-pointer flex items-center space-x-2 active:scale-95 touch-manipulation min-h-[44px] ${
                      isActive
                        ? 'bg-brand-charcoal text-white border-brand-charcoal font-semibold shadow-sm'
                        : 'bg-brand-cream text-brand-muted border-brand-sand/70 hover:text-brand-charcoal hover:border-brand-sand'
                    }`}
                  >
                    <span>{cat}</span>
                    <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded-none ${isActive ? 'bg-white/15 text-white/95' : 'bg-brand-sand/35 text-brand-muted'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Dynamic Product Grid */}
            <AnimatePresence mode="popLayout">
              <motion.div
                layout
                className="grid grid-cols-2 md:grid-cols-3 gap-x-3.5 gap-y-8 sm:gap-x-6 sm:gap-y-12"
              >
                {isFilterLoading ? (
                  Array.from({ length: 6 }).map((_, idx) => (
                    <motion.div
                      key={`skeleton-${idx}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <SkeletonCard />
                    </motion.div>
                  ))
                ) : sortedProducts.map((product) => {
                  const inWish = isProductInWishlist(product);
                  const { val: rating, reviews } = getProductRating(product.id);

                  return (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                      className="group flex flex-col justify-between"
                    >
                      <div 
                        className="relative aspect-[3/4] bg-brand-sand/20 overflow-hidden cursor-pointer border border-brand-sand/15" 
                        onClick={() => setSelectedProduct(product)}
                      >
                        {/* Primary Image with hover zoom */}
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105 grayscale-[10%]"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />

                        {/* Subtle sand overlay tint */}
                        <div className="absolute inset-0 bg-brand-sand/5 mix-blend-color-burn opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Centered Premium Quick View Trigger (Desktop Only) */}
                        <div className="absolute inset-0 bg-brand-charcoal/15 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10 hidden md:flex">
                          <button
                            id={`shop-quick-view-overlay-${product.id}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenQuickView(product);
                            }}
                            className="px-5 py-2.5 bg-brand-cream text-brand-charcoal hover:bg-brand-charcoal hover:text-white text-[9px] font-mono tracking-[0.2em] uppercase transition-all duration-300 shadow-md transform translate-y-3 group-hover:translate-y-0 cursor-pointer border-none"
                          >
                            QUICK VIEW
                          </button>
                        </div>

                        {/* Wishlist Toggle Button with spring bounce */}
                        <motion.button
                          id={`shop-wishlist-toggle-${product.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleWishlist(product);
                          }}
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.85 }}
                          className="absolute top-4 right-4 z-20 bg-brand-cream/90 hover:bg-brand-cream p-2 shadow-sm border border-brand-sand/40 rounded-full transition-colors duration-300 flex items-center justify-center cursor-pointer"
                          aria-label="Toggle Wishlist"
                        >
                          <motion.div
                            key={inWish ? 'liked' : 'unliked'}
                            initial={{ scale: 0.7 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', damping: 11, stiffness: 320 }}
                          >
                            <Heart className={`w-3.5 h-3.5 ${inWish ? 'fill-red-800 text-red-800' : 'text-brand-charcoal/80'}`} />
                          </motion.div>
                        </motion.button>

                        {/* Decorative Badge Overlay */}
                        <ProductBadge
                          product={product}
                          className="absolute top-4 left-4 z-20"
                        />

                        {/* Fast-Add Size Overlay on Hover */}
                        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 via-black/20 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out hidden md:block z-10">
                          <p className="text-[9px] font-mono tracking-[0.15em] text-brand-cream/80 text-center mb-2 uppercase font-light">Fast-Add Size</p>
                          <div className="flex justify-center gap-1.5">
                            {product.sizes.map((sz) => (
                              <button
                                id={`shop-quick-add-${product.id}-${sz}`}
                                key={sz}
                                onClick={(e) => handleQuickAdd(product, sz, e)}
                                className="bg-brand-cream hover:bg-brand-sand text-brand-charcoal font-mono text-[10px] w-8 h-8 flex items-center justify-center font-medium border border-brand-sand/10 transition-colors duration-200 cursor-pointer shadow-sm active:scale-90"
                              >
                                {sz}
                              </button>
                            ))}
                          </div>
                        </div>

                      </div>

                      {/* Info block */}
                      <div className="mt-4 space-y-1 cursor-pointer" onClick={() => setSelectedProduct(product)}>
                        <div className="flex justify-between items-baseline gap-2">
                          <span className="text-[9px] text-brand-muted font-mono uppercase tracking-wider">{product.category}</span>
                          <div className="flex items-center space-x-1 shrink-0">
                            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                            <span className="text-[9px] font-mono text-brand-charcoal font-semibold">{rating}</span>
                            <span className="text-[8px] font-mono text-brand-muted">({reviews})</span>
                          </div>
                        </div>

                        <h3 className="text-xs font-serif font-light tracking-wide text-brand-charcoal group-hover:text-brand-muted transition-colors leading-relaxed line-clamp-1">
                          {product.name}
                        </h3>

                        <div className="flex justify-between items-center pt-1.5 border-t border-brand-sand/30">
                          <p className="text-[10px] text-brand-muted font-mono">{product.color}</p>
                          <div className="flex items-center space-x-2">
                            {product.originalPrice && (
                              <span className="text-[10px] font-mono text-brand-muted line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                            )}
                            <span className="text-xs font-mono font-semibold text-brand-charcoal">₹{product.price.toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      </div>

                      {/* Mobile-only Quick View Trigger Button */}
                      <button
                        id={`shop-quick-view-mobile-${product.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenQuickView(product);
                        }}
                        className="md:hidden w-full mt-3 py-2 border border-brand-sand hover:border-brand-charcoal bg-transparent text-brand-charcoal hover:bg-brand-charcoal hover:text-white text-[8.5px] font-mono tracking-widest uppercase transition-all duration-200 cursor-pointer"
                      >
                        QUICK VIEW
                      </button>

                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>

            {/* Empty State */}
            {!isFilterLoading && sortedProducts.length === 0 && (
              <div className="space-y-12">
                <div className="text-center py-16 border border-brand-sand bg-brand-cream/40 flex flex-col items-center justify-center space-y-6">
                  {/* Premium Tailoring Measurement Tape / Scissors Line Art */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="relative flex items-center justify-center"
                  >
                    <svg className="w-20 h-20 text-brand-charcoal/80" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                      {/* Background circular layout guideline */}
                      <circle cx="50" cy="50" r="44" strokeWidth="0.5" strokeDasharray="3 3" className="text-brand-muted/30" />
                      
                      {/* Stylized Measuring Tape Wave */}
                      <path d="M25 50 C 35 40, 40 60, 50 50 C 60 40, 65 60, 75 50" strokeWidth="1" className="text-brand-sand" />
                      {/* Small tick markers on measuring tape */}
                      <path d="M28 47 L28 50 M34 46 L34 49 M40 48 L40 51 M46 51 L46 54 M52 49 L52 52 M58 46 L58 49 M64 48 L64 51 M70 52 L70 55" strokeWidth="0.75" />
                      
                      {/* Minimalist Shears/Scissors Silhouette */}
                      <circle cx="42" cy="65" r="5" strokeWidth="1" />
                      <circle cx="58" cy="65" r="5" strokeWidth="1" />
                      <line x1="45" y1="61" x2="50" y2="42" strokeWidth="1" />
                      <line x1="55" y1="61" x2="50" y2="42" strokeWidth="1" />
                      <line x1="50" y1="42" x2="44" y2="28" strokeWidth="1.25" className="text-brand-charcoal" />
                      <line x1="50" y1="42" x2="56" y2="28" strokeWidth="1.25" className="text-brand-charcoal" />
                    </svg>
                  </motion.div>

                  <div className="space-y-2 max-w-sm px-6">
                    <span className="text-[9px] font-mono tracking-[0.35em] text-brand-muted uppercase font-semibold">Zero Results</span>
                    <h3 className="font-serif text-xl font-light text-brand-charcoal tracking-tight">No garments match your selection</h3>
                    <p className="text-[11px] text-brand-muted font-sans font-light leading-relaxed">
                      Our catalog is crafted using slowly fermented organic dyes and handspun textiles. Try relaxing your filters or starting a fresh query.
                    </p>
                  </div>

                  <button
                    id="reset-filters-button"
                    onClick={resetFilters}
                    className="px-8 py-3.5 bg-brand-charcoal hover:bg-brand-charcoal/90 text-white text-[9.5px] font-mono tracking-[0.25em] uppercase transition-all duration-300 shadow-sm cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
                  >
                    Reset All Filters
                  </button>
                </div>

                {/* No-Results Recommendations */}
                <div className="border-t border-brand-sand/30 pt-12">
                  <div className="space-y-2 mb-8 text-center sm:text-left">
                    <p className="text-[9px] font-mono tracking-[0.3em] text-brand-muted uppercase">our recommendations</p>
                    <h3 className="font-serif text-lg md:text-xl font-light text-brand-charcoal tracking-tight">Curated Pieces You May Enjoy</h3>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8">
                    {products.filter(p => p.isBestseller || p.isNew).slice(0, 4).map((recProduct) => {
                      return (
                        <div 
                          key={`no-res-rec-${recProduct.id}`}
                          onClick={() => setSelectedProduct(recProduct)}
                          className="group cursor-pointer flex flex-col justify-between space-y-3"
                        >
                          <div className="relative aspect-[3/4] bg-brand-sand/15 overflow-hidden border border-brand-sand/20">
                            <img
                              src={recProduct.images[0]}
                              alt={recProduct.name}
                              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 grayscale-[2%]"
                              loading="lazy"
                              referrerPolicy="no-referrer"
                            />
                            {recProduct.images[1] && (
                              <img
                                src={recProduct.images[1]}
                                alt={`${recProduct.name} alt`}
                                className="absolute inset-0 w-full h-full object-cover transition-all duration-750 ease-in-out opacity-0 group-hover:opacity-100 group-hover:scale-105 grayscale-[2%]"
                                loading="lazy"
                                referrerPolicy="no-referrer"
                              />
                            )}
                            <div className="absolute inset-0 bg-brand-charcoal/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none mix-blend-multiply" />
                            
                            <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-brand-cream/95 backdrop-blur-xs py-2 text-center border border-brand-sand/40 opacity-0 group-hover:opacity-100 translate-y-1.5 group-hover:translate-y-0 transition-all duration-300 ease-out z-20">
                              <span className="font-mono text-[8px] tracking-widest text-brand-charcoal uppercase font-semibold">VIEW ARTICLE</span>
                            </div>

                            <ProductBadge
                              product={recProduct}
                              className="absolute top-2.5 left-2.5 z-10"
                            />
                          </div>

                          <div className="space-y-1 pt-1">
                            <div className="flex justify-between items-center text-[8px] font-mono text-brand-muted uppercase tracking-wider">
                              <span>{recProduct.category}</span>
                              <span className="font-bold text-brand-charcoal text-[9px]">₹{recProduct.price.toLocaleString('en-IN')}</span>
                            </div>
                            <h4 className="text-[11px] font-serif font-light text-brand-charcoal group-hover:text-brand-muted transition-colors truncate leading-normal">
                              {recProduct.name}
                            </h4>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

          </main>

        </div>

        {/* Recently Viewed in Shop Catalog */}
        {recentlyViewed && recentlyViewed.length > 0 && (
          <section className="border-t border-brand-sand/30 pt-16 mt-16 pb-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 mb-10">
              <div className="space-y-2 text-center sm:text-left">
                <p className="text-[10px] font-mono tracking-[0.3em] text-brand-muted uppercase font-semibold">YOUR BROWSING JOURNAL</p>
                <h2 className="font-serif text-2xl md:text-3xl font-light text-brand-charcoal tracking-tight">Recently Viewed</h2>
              </div>
              {onClearRecentlyViewed && (
                <button 
                  onClick={onClearRecentlyViewed}
                  className="text-[9px] font-mono tracking-[0.2em] text-brand-muted hover:text-brand-charcoal transition-colors uppercase underline cursor-pointer"
                >
                  Clear History
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
              {recentlyViewed.map((recentItem) => (
                <div 
                  key={recentItem.id} 
                  onClick={() => {
                    setSelectedProduct(recentItem);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="group cursor-pointer flex flex-col justify-between space-y-3 select-none"
                >
                  <div className="relative aspect-[3/4] bg-brand-sand/15 overflow-hidden border border-brand-sand/25">
                    <img
                      src={recentItem.images[0]}
                      alt={recentItem.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 grayscale-[2%]"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-brand-charcoal/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none mix-blend-multiply" />
                    
                    <div className="absolute bottom-2 left-2 right-2 bg-brand-cream/95 backdrop-blur-xs py-2 text-center border border-brand-sand/40 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300 ease-out z-20">
                      <span className="font-mono text-[8px] tracking-widest text-brand-charcoal uppercase font-semibold">VIEW ARTICLE</span>
                    </div>

                    <ProductBadge
                      product={recentItem}
                      className="absolute top-2 left-2 z-10"
                    />
                  </div>
                  
                  <div className="space-y-1 pt-1">
                    <span className="text-[8px] text-brand-muted font-mono uppercase tracking-wider block">{recentItem.category}</span>
                    <h4 className="text-[11px] font-serif font-light text-brand-charcoal group-hover:text-brand-muted transition-colors truncate leading-normal">
                      {recentItem.name}
                    </h4>
                    <p className="text-[10px] font-mono font-semibold text-brand-charcoal mt-0.5">₹{recentItem.price.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>

      {/* MOBILE过滤侧边抽屉 FILTERS DRAWER (AnimatePresence) */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-end lg:hidden">
            
            {/* Drawer Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-brand-charcoal/45 backdrop-blur-xs"
              onClick={() => setIsMobileFilterOpen(false)}
            />

            {/* Drawer Sheet */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="relative w-full max-w-sm h-full bg-brand-cream shadow-2xl overflow-y-auto flex flex-col z-10"
            >
              {/* Header */}
              <div className="sticky top-0 bg-brand-cream/90 backdrop-blur-sm px-6 py-5 border-b border-brand-sand/50 flex items-center justify-between z-20">
                <div className="flex items-center space-x-2">
                  <SlidersHorizontal className="w-4 h-4 text-brand-charcoal" />
                  <span className="font-mono text-xs tracking-widest uppercase text-brand-charcoal font-semibold">Filter & Refine</span>
                </div>
                <button
                  id="close-mobile-filters"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 hover:opacity-60 transition-opacity"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Filters Content */}
              <div className="p-6 space-y-8 flex-grow">
                
                {/* Search Bar (Mobile) */}
                <div className="space-y-3 relative">
                  <span className="text-[10px] font-mono tracking-[0.25em] text-brand-muted uppercase block font-semibold">Search Catalog</span>
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted/70" />
                    <input
                      type="text"
                      placeholder="e.g. linen, duster..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setIsMobileSearchFocused(true)}
                      onBlur={() => setTimeout(() => setIsMobileSearchFocused(false), 200)}
                      className="w-full bg-brand-cream border border-brand-sand focus:border-brand-charcoal text-brand-charcoal pl-10 pr-8 py-3 text-xs tracking-wider placeholder-brand-muted/40 focus:outline-none transition-all duration-300 rounded-none font-mono"
                    />
                    {searchQuery && (
                      <button onClick={() => setSearchQuery('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-charcoal">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Mobile suggestions dropdown */}
                  <AnimatePresence>
                    {isMobileSearchFocused && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute top-full left-0 right-0 mt-1.5 bg-brand-cream border border-brand-sand/70 shadow-xl z-50 p-4 space-y-4 max-h-[300px] overflow-y-auto no-scrollbar"
                      >
                        {/* Category matches */}
                        {suggestions.categories.length > 0 && (
                          <div className="space-y-1.5">
                            <span className="text-[9px] font-mono tracking-widest text-brand-muted uppercase block font-semibold">Matched Categories</span>
                            <div className="flex flex-wrap gap-1.5">
                              {suggestions.categories.map((cat) => (
                                <button
                                  key={cat}
                                  onMouseDown={() => {
                                    setActiveCategory(cat as any);
                                    setSearchQuery('');
                                    setIsMobileSearchFocused(false);
                                  }}
                                  className="text-[9px] font-mono tracking-wider bg-brand-sand/20 hover:bg-brand-charcoal hover:text-white text-brand-charcoal px-2 py-1 border border-brand-sand/40 transition-colors uppercase cursor-pointer"
                                >
                                  {cat}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Suggested terms */}
                        {suggestions.terms.length > 0 && (
                          <div className="space-y-1.5">
                            <span className="text-[9px] font-mono tracking-widest text-brand-muted uppercase block font-semibold">Suggested Terms</span>
                            <div className="flex flex-wrap gap-1.5">
                              {suggestions.terms.map((term) => (
                                <button
                                  key={term}
                                  onMouseDown={() => {
                                    setSearchQuery(term);
                                    setIsMobileSearchFocused(false);
                                  }}
                                  className="text-[9px] font-mono tracking-wider bg-transparent hover:bg-brand-sand/25 text-brand-charcoal px-2 py-1 border border-brand-sand/50 transition-colors uppercase cursor-pointer"
                                >
                                  {term}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Matched / Recommended Products */}
                        <div className="space-y-2">
                          <span className="text-[9px] font-mono tracking-widest text-brand-muted uppercase block font-semibold">
                            {searchQuery ? 'Matching Garments' : 'Curated Bestsellers'}
                          </span>
                          {suggestions.products.length > 0 ? (
                            <div className="divide-y divide-brand-sand/20">
                              {suggestions.products.map((p) => (
                                <div
                                  key={p.id}
                                  onMouseDown={() => {
                                    setSelectedProduct(p);
                                    setIsMobileSearchFocused(false);
                                  }}
                                  className="flex items-center gap-3 py-2 cursor-pointer group/item hover:bg-brand-sand/15 px-1 transition-colors"
                                >
                                  <img
                                    src={p.images[0]}
                                    alt={p.name}
                                    className="w-8 h-10 object-cover bg-brand-sand/10 border border-brand-sand/20 grayscale-[5%] group-hover/item:grayscale-0 transition-all"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-serif text-[11px] font-light text-brand-charcoal group-hover/item:text-brand-muted transition-colors truncate">
                                      {p.name}
                                    </h4>
                                    <p className="font-mono text-[8px] text-brand-muted uppercase tracking-wider">{p.category} • {p.color}</p>
                                  </div>
                                  <div className="text-[9px] font-mono font-medium text-brand-charcoal shrink-0">
                                    ₹{p.price.toLocaleString('en-IN')}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-[10px] font-mono text-brand-muted italic py-1">No matches found</p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Category (Mobile) */}
                <div className="space-y-3">
                  <span className="text-[10px] font-mono tracking-[0.25em] text-brand-muted uppercase block font-semibold">Categories</span>
                  <div className="flex flex-col space-y-1.5">
                    {(['All', 'Tailoring', 'Outerwear', 'Knitwear', 'Essentials'] as const).map((cat) => {
                      const isActive = activeCategory === cat;
                      const count = getCategoryCount(cat);
                      return (
                        <button
                          key={cat}
                          onClick={() => {
                            setActiveCategory(cat);
                          }}
                          className={`flex items-center justify-between text-xs tracking-widest text-left py-2 px-3 border border-brand-sand/30 transition-all ${
                            isActive ? 'bg-brand-charcoal text-white font-semibold' : 'bg-transparent text-brand-muted'
                          }`}
                        >
                          <span className="uppercase">{cat}</span>
                          <span className={`text-[9px] font-mono px-1.5 py-0.5 font-light ${isActive ? 'bg-white/15 text-white' : 'bg-brand-sand/15'}`}>
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Price (Mobile) */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-mono text-brand-muted uppercase tracking-wider">
                    <span className="font-semibold">Maximum Price</span>
                    <span className="text-brand-charcoal font-bold bg-brand-sand/20 px-2 py-0.5 border border-brand-sand/40">₹{maxPrice.toLocaleString('en-IN')}</span>
                  </div>
                  <input
                    type="range"
                    min="1000"
                    max="8000"
                    step="100"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full h-1 bg-brand-sand rounded-lg appearance-none cursor-pointer accent-brand-charcoal focus:outline-none"
                  />
                  <div className="flex justify-between text-[9px] font-mono text-brand-muted">
                    <span>₹1,000</span>
                    <span>₹8,000</span>
                  </div>
                </div>

                {/* Sizes (Mobile) */}
                <div className="space-y-3">
                  <span className="text-[10px] font-mono tracking-[0.25em] text-brand-muted uppercase block font-semibold">Filter by Size</span>
                  <div className="grid grid-cols-5 gap-2">
                    {['XS', 'S', 'M', 'L', 'XL'].map((sz) => {
                      const isSelected = selectedSizes.includes(sz);
                      return (
                        <button
                          key={sz}
                          onClick={() => toggleSizeFilter(sz)}
                          className={`aspect-square flex items-center justify-center font-mono text-xs border transition-all duration-300 cursor-pointer ${
                            isSelected
                              ? 'bg-brand-charcoal text-white border-brand-charcoal font-semibold'
                              : 'border-brand-sand/80 text-brand-charcoal bg-brand-cream/30'
                          }`}
                        >
                          {sz}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Color Filter (Mobile) */}
                <div className="space-y-3">
                  <span className="text-[10px] font-mono tracking-[0.25em] text-brand-muted uppercase block font-semibold">Filter by Color</span>
                  <div className="grid grid-cols-2 gap-2">
                    {COLOR_OPTIONS.map((opt) => {
                      const isSelected = selectedColors.includes(opt.name);
                      const count = getColorCount(opt.name);
                      return (
                        <button
                          key={`mobile-${opt.name}`}
                          onClick={() => {
                            setSelectedColors(prev => 
                              prev.includes(opt.name) ? prev.filter(c => c !== opt.name) : [...prev, opt.name]
                            );
                          }}
                          className={`flex items-center space-x-2 px-3 py-2.5 border text-xs tracking-wider text-left transition-all duration-300 cursor-pointer ${
                            isSelected 
                              ? 'border-brand-charcoal bg-brand-charcoal text-white font-medium' 
                              : 'border-brand-sand/60 hover:border-brand-charcoal text-brand-charcoal bg-brand-cream/20'
                          }`}
                        >
                          <span 
                            className="w-4 h-4 rounded-full border border-brand-sand/40 shrink-0 shadow-xs flex items-center justify-center"
                            style={{ backgroundColor: opt.hex }}
                          >
                            {isSelected && (
                              <Check className={`w-3 h-3 ${opt.textDark ? 'text-brand-charcoal' : 'text-white'}`} />
                            )}
                          </span>
                          <span className="truncate uppercase flex-1 text-[10px]">{opt.name}</span>
                          <span className={`text-[9px] font-mono opacity-85 ${isSelected ? 'text-white/85' : 'text-brand-muted'}`}>
                            ({count})
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Availability Filter (Mobile) */}
                <div className="space-y-3">
                  <span className="text-[10px] font-mono tracking-[0.25em] text-brand-muted uppercase block font-semibold">Availability</span>
                  <div className="space-y-2">
                    {AVAILABILITY_OPTIONS.map((opt) => {
                      const isSelected = selectedAvailabilities.includes(opt.id);
                      const count = getAvailabilityCount(opt.id);
                      if (count === 0 && opt.id !== 'all') return null;
                      return (
                        <button
                          key={`mobile-${opt.id}`}
                          onClick={() => {
                            if (opt.id === 'all') {
                              setSelectedAvailabilities([]);
                            } else {
                              setSelectedAvailabilities(prev => 
                                prev.includes(opt.id) ? prev.filter(id => id !== opt.id) : [...prev, opt.id]
                              );
                            }
                          }}
                          className={`w-full flex items-center justify-between text-left text-xs tracking-widest py-2.5 px-3 border border-brand-sand/30 transition-all cursor-pointer ${
                            (opt.id === 'all' && selectedAvailabilities.length === 0) || isSelected
                              ? 'bg-brand-charcoal text-white font-semibold' 
                              : 'bg-transparent text-brand-muted'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <div className={`w-3.5 h-3.5 border flex items-center justify-center rounded-none transition-colors ${
                              (opt.id === 'all' && selectedAvailabilities.length === 0) || isSelected 
                                ? 'bg-white border-white' 
                                : 'border-brand-sand bg-transparent'
                            }`}>
                              {((opt.id === 'all' && selectedAvailabilities.length === 0) || isSelected) && (
                                <Check className={`w-2.5 h-2.5 ${
                                  (opt.id === 'all' && selectedAvailabilities.length === 0) || isSelected 
                                    ? 'text-brand-charcoal' 
                                    : 'text-white'
                                }`} />
                              )}
                            </div>
                            <span className="uppercase">{opt.label}</span>
                          </div>
                          <span className={`text-[9px] font-mono px-1.5 py-0.5 font-light ${
                            (opt.id === 'all' && selectedAvailabilities.length === 0) || isSelected
                              ? 'bg-white/15 text-white' 
                              : 'bg-brand-sand/15'
                          }`}>
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Drawer Footer Actions */}
              <div className="p-6 border-t border-brand-sand/50 bg-brand-cream/90 flex flex-col gap-3">
                <button
                  id="mobile-drawer-apply-button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-full bg-brand-charcoal hover:bg-brand-charcoal/90 text-white font-mono text-xs tracking-widest py-4 uppercase shadow-md font-semibold cursor-pointer text-center"
                >
                  Apply Filters ({sortedProducts.length})
                </button>
                <button
                  id="mobile-drawer-reset-button"
                  onClick={() => {
                    resetFilters();
                    setIsMobileFilterOpen(false);
                  }}
                  className="w-full bg-transparent hover:bg-brand-sand/20 text-brand-charcoal border border-brand-sand/85 font-mono text-xs tracking-widest py-3 uppercase transition-all duration-300 cursor-pointer text-center"
                >
                  Clear All
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PREMIUM IMmersive PRODUCT DETAILS PAGE */}
      <AnimatePresence mode="wait">
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="fixed inset-0 z-50 overflow-y-auto bg-brand-cream"
          >
            {/* Immersive Header Nav */}
            <div className="sticky top-0 bg-brand-cream/90 backdrop-blur-md z-30 border-b border-brand-sand/40">
              <div className="max-w-7xl mx-auto px-6 md:px-12 py-5 flex items-center justify-between">
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="flex items-center space-x-2 text-[10px] font-mono tracking-widest text-brand-muted hover:text-brand-charcoal transition-colors uppercase cursor-pointer group"
                >
                  <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                  <span>Return to Collection</span>
                </button>
                <div className="font-serif text-xl font-light tracking-widest text-brand-charcoal uppercase">Atelier Kora</div>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="p-1.5 hover:opacity-60 transition-opacity cursor-pointer text-brand-charcoal"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <ProductDetailsView
              product={selectedProduct}
              allProducts={products}
              onAddToCart={onAddToCart}
              onClose={() => setSelectedProduct(null)}
              wishlist={wishlist}
              onToggleWishlist={onToggleWishlist}
              onOpenSizeAdvisor={onOpenSizeAdvisor}
              onSelectProduct={(p) => {
                setSelectedProduct(p);
                // Dispatch event or standard state change
              }}
              recentlyViewed={recentlyViewed}
              onClearRecentlyViewed={onClearRecentlyViewed}
            />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
