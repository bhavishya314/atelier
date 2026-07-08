import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trash2, 
  ShoppingBag, 
  ArrowLeft, 
  Check, 
  Heart, 
  Share2, 
  ArrowRight,
  X,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { Product } from '../types';
import ProductBadge from './ProductBadge';

interface WishlistViewProps {
  wishlist: Product[];
  allProducts: Product[];
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product, size: string, quantity?: number) => void;
  onQuickShop: (product: Product) => void;
  setView: (view: 'home' | 'shop' | 'journal' | 'story' | 'wishlist') => void;
  onOpenQuickView: (product: Product) => void;
}

export default function WishlistView({
  wishlist,
  allProducts,
  onToggleWishlist,
  onAddToCart,
  onQuickShop,
  setView,
  onOpenQuickView
}: WishlistViewProps) {
  // Selected sizes for each product in wishlist
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [addedFeedbacks, setAddedFeedbacks] = useState<Record<string, boolean>>({});
  const [isSharing, setIsSharing] = useState(false);

  // Undo Toast States for accidental removals
  const [lastRemovedProduct, setLastRemovedProduct] = useState<Product | null>(null);
  const [showUndoToast, setShowUndoToast] = useState(false);
  const [undoTimeoutId, setUndoTimeoutId] = useState<NodeJS.Timeout | null>(null);

  // Interactive Empty State Mood Filter State
  const [activeMood, setActiveMood] = useState<'all' | 'indigo' | 'earth' | 'architectural'>('all');
  const [recSelectedSizes, setRecSelectedSizes] = useState<Record<string, string>>({});
  const [recAddedFeedbacks, setRecAddedFeedbacks] = useState<Record<string, boolean>>({});

  // Pre-populate sizes for items in wishlist
  useEffect(() => {
    setSelectedSizes(prev => {
      const copy = { ...prev };
      let changed = false;
      wishlist.forEach(p => {
        if (!copy[p.id] && p.sizes && p.sizes.length > 0) {
          copy[p.id] = p.sizes[0];
          changed = true;
        }
      });
      return changed ? copy : prev;
    });
  }, [wishlist]);

  // Handle setting size
  const handleSizeSelect = (productId: string, size: string) => {
    setSelectedSizes(prev => ({
      ...prev,
      [productId]: size
    }));
  };

  // Move to bag action (adds to bag and removes from wishlist)
  const handleMoveToBag = (product: Product) => {
    const size = selectedSizes[product.id];
    if (!size) return;

    // Add to cart
    onAddToCart(product, size, 1);

    // Visual feedback
    setAddedFeedbacks(prev => ({ ...prev, [product.id]: true }));

    // Delay removing from wishlist to let progress bar and exit animation finish smoothly
    setTimeout(() => {
      onToggleWishlist(product);
      setAddedFeedbacks(prev => ({ ...prev, [product.id]: false }));
      
      // Clean up selected size
      setSelectedSizes(prev => {
        const copy = { ...prev };
        delete copy[product.id];
        return copy;
      });
    }, 1000);
  };

  // Custom Removal with Undo
  const handleRemoveWithUndo = (product: Product) => {
    setLastRemovedProduct(product);
    setShowUndoToast(true);
    onToggleWishlist(product);

    if (undoTimeoutId) clearTimeout(undoTimeoutId);
    const id = setTimeout(() => {
      setShowUndoToast(false);
    }, 6000);
    setUndoTimeoutId(id);
  };

  // Trigger restore
  const handleUndoRemove = () => {
    if (lastRemovedProduct) {
      onToggleWishlist(lastRemovedProduct);
      setLastRemovedProduct(null);
      setShowUndoToast(false);
      if (undoTimeoutId) clearTimeout(undoTimeoutId);
    }
  };

  // Share curation logic
  const handleShareCuration = () => {
    setIsSharing(true);
    const textToCopy = `Check out my curated style favorites from Atelier Kora! ${wishlist.map(p => p.name).join(', ')}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setTimeout(() => {
        setIsSharing(false);
      }, 2000);
    }).catch(() => {
      setIsSharing(false);
    });
  };

  // Curated Aesthetic Mood Options
  const moodPills = [
    { id: 'all', label: 'All Curations' },
    { id: 'indigo', label: 'Indigo Alchemy' },
    { id: 'earth', label: 'Earth & Clay' },
    { id: 'architectural', label: 'Architectural Cuts' }
  ] as const;

  // Filter recommendations based on active mood
  const getRecommendedProducts = () => {
    let filtered = allProducts;
    if (activeMood === 'indigo') {
      filtered = allProducts.filter(p => p.color.toLowerCase().includes('indigo'));
    } else if (activeMood === 'earth') {
      filtered = allProducts.filter(p => 
        p.color.toLowerCase().includes('alabaster') || 
        p.color.toLowerCase().includes('ochre') || 
        p.color.toLowerCase().includes('sand') || 
        p.color.toLowerCase().includes('clay')
      );
    } else if (activeMood === 'architectural') {
      filtered = allProducts.filter(p => p.category === 'Outerwear' || p.category === 'Tailoring');
    } else {
      // 'all' -> show default high quality curated selections
      filtered = allProducts.filter(p => p.isBestseller || p.isNew || p.isTrending);
    }
    return filtered.slice(0, 3);
  };

  const recommendedProducts = getRecommendedProducts();

  // Populate sizes for recommended items in empty state
  useEffect(() => {
    setRecSelectedSizes(prev => {
      const copy = { ...prev };
      let changed = false;
      recommendedProducts.forEach(p => {
        if (!copy[p.id] && p.sizes && p.sizes.length > 0) {
          copy[p.id] = p.sizes[0];
          changed = true;
        }
      });
      return changed ? copy : prev;
    });
  }, [recommendedProducts]);

  // Add Recommended Item to Bag
  const handleAddRecToBag = (product: Product) => {
    const size = recSelectedSizes[product.id] || (product.sizes && product.sizes[0]) || 'M';
    onAddToCart(product, size, 1);
    
    setRecAddedFeedbacks(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setRecAddedFeedbacks(prev => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  return (
    <div className="bg-brand-cream min-h-screen pt-10 pb-20 px-6 md:px-12 relative overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Navigation Breadcrumb & Share */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 border-b border-brand-sand/40 pb-6">
          <div className="space-y-1">
            <button
              id="wishlist-back-to-shop-top"
              onClick={() => setView('shop')}
              className="flex items-center space-x-2 text-[10px] font-mono tracking-widest text-brand-muted hover:text-brand-charcoal transition-all uppercase group cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Shop</span>
            </button>
            <div className="flex items-center space-x-3 pt-2">
              <h1 className="font-serif text-3xl md:text-4xl font-light text-brand-charcoal tracking-tight">
                My Saved Closet
              </h1>
              <span className="font-serif text-lg text-brand-muted italic pt-1">
                ({wishlist.length} {wishlist.length === 1 ? 'item' : 'items'})
              </span>
            </div>
          </div>

          {wishlist.length > 0 && (
            <button
              id="wishlist-share-curation"
              onClick={handleShareCuration}
              className="self-start sm:self-center flex items-center space-x-2 px-4 py-2.5 border border-brand-sand/70 hover:border-brand-charcoal text-[10px] font-mono tracking-widest uppercase text-brand-charcoal transition-all bg-brand-cream/40 cursor-pointer"
            >
              {isSharing ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-800 animate-bounce" />
                  <span className="text-emerald-800 font-semibold">Curation Link Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-brand-muted" />
                  <span>Share My Selection</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Core Layout */}
        <AnimatePresence mode="popLayout">
          {wishlist.length > 0 ? (
            <motion.div 
              key="wishlist-grid-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
            >
              {wishlist.map((product) => {
                const selectedSize = selectedSizes[product.id] || '';
                const isAdded = addedFeedbacks[product.id] || false;

                return (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, x: -60, filter: 'blur(4px)' }}
                    transition={{ type: 'spring', damping: 26, stiffness: 220 }}
                    className="group bg-brand-cream border border-brand-sand/55 flex flex-col justify-between overflow-hidden relative shadow-xs hover:shadow-md transition-all duration-300"
                  >
                    {/* Action buttons pinned on card */}
                    <motion.button
                      id={`wishlist-remove-btn-${product.id}`}
                      onClick={() => handleRemoveWithUndo(product)}
                      whileHover={{ scale: 1.1, backgroundColor: '#2B2A27', color: '#F9F6F0' }}
                      whileTap={{ scale: 0.9 }}
                      className="absolute top-4 right-4 z-10 bg-brand-cream/90 text-brand-charcoal border border-brand-sand/40 p-2.5 backdrop-blur-xs transition-colors duration-300 flex items-center justify-center cursor-pointer rounded-none"
                      aria-label="Remove item from favorites"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </motion.button>

                    {/* Product visual link to shop details */}
                    <div 
                      onClick={() => onQuickShop(product)}
                      className="aspect-[3/4] bg-brand-sand/15 overflow-hidden relative cursor-pointer"
                    >
                      {/* Interactive hover cross-fade images */}
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 grayscale-[5%]"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                      {product.images[1] && (
                        <img
                          src={product.images[1]}
                          alt={`${product.name} alt`}
                          className="absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-in-out opacity-0 group-hover:opacity-100 group-hover:scale-105 grayscale-[5%]"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                      )}
                      <div className="absolute inset-0 bg-brand-charcoal/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-color-burn" />
                      
                      {/* Centered Premium Quick View Trigger (Desktop Only) */}
                      <div className="absolute inset-0 bg-brand-charcoal/15 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10 hidden md:flex">
                        <button
                          id={`wishlist-quick-view-overlay-${product.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenQuickView(product);
                          }}
                          className="px-5 py-2.5 bg-brand-cream text-brand-charcoal hover:bg-brand-charcoal hover:text-white text-[9px] font-mono tracking-[0.2em] uppercase transition-all duration-300 shadow-md transform translate-y-3 group-hover:translate-y-0 cursor-pointer border-none"
                        >
                          QUICK VIEW
                        </button>
                      </div>

                      {/* Bestseller or new tag */}
                      <ProductBadge
                        product={product}
                        className="absolute top-4 left-4 z-20"
                      />
                    </div>

                    {/* Meta Detail Info Block */}
                    <div className="p-5 flex-grow flex flex-col justify-between space-y-4 relative">
                      
                      {/* Name, Category, Price */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-start">
                          <span className="text-[9px] font-mono tracking-[0.15em] text-brand-muted uppercase">
                            {product.category}
                          </span>
                          <div className="flex items-center space-x-1.5 text-xs font-mono">
                            {product.originalPrice && (
                              <span className="text-[10px] text-brand-muted line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                            )}
                            <span className="font-medium text-brand-charcoal">
                              ₹{product.price.toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                        <h3 
                          onClick={() => onQuickShop(product)}
                          className="font-serif text-lg font-light text-brand-charcoal hover:text-brand-muted cursor-pointer transition-colors line-clamp-1 leading-normal"
                        >
                          {product.name}
                        </h3>
                        <div className="flex justify-between items-center">
                          <p className="text-[10px] text-brand-muted font-sans font-light italic">
                            Color: {product.color}
                          </p>
                          {product.isLowStock && (
                            <span className="text-[8px] font-mono font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 uppercase tracking-wider animate-pulse">
                              Low Stock
                            </span>
                          )}
                        </div>

                        {/* Mobile-only Quick View Trigger Button */}
                        <button
                          id={`wishlist-quickview-mobile-${product.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenQuickView(product);
                          }}
                          className="md:hidden w-full mt-2.5 py-2 border border-brand-sand hover:border-brand-charcoal bg-transparent text-brand-charcoal hover:bg-brand-charcoal hover:text-white text-[8.5px] font-mono tracking-widest uppercase transition-all duration-200 cursor-pointer"
                        >
                          QUICK VIEW
                        </button>
                      </div>

                      {/* Micro sizing selector */}
                      <div className="space-y-2.5 pt-2.5 border-t border-brand-sand/40">
                        <div className="flex justify-between items-center">
                          <span className="text-[8px] font-mono tracking-widest text-brand-muted uppercase block font-semibold">
                            Choose Size:
                          </span>
                          <span className="text-[8px] font-mono text-brand-charcoal/80 bg-brand-sand/15 border border-brand-sand/30 px-1.5 py-0.5 font-bold">
                            BAG SIZE: {selectedSize}
                          </span>
                        </div>
                        <div className="flex gap-1.5 flex-wrap">
                          {product.sizes.map((sz) => {
                            const isSzSelected = sz === selectedSize;
                            return (
                              <button
                                id={`wishlist-size-select-${product.id}-${sz}`}
                                key={sz}
                                disabled={isAdded}
                                onClick={() => handleSizeSelect(product.id, sz)}
                                className={`w-8 h-8 flex items-center justify-center text-[10px] font-mono border transition-all duration-200 cursor-pointer ${
                                  isSzSelected
                                    ? 'bg-brand-charcoal text-white border-brand-charcoal font-bold'
                                    : 'border-brand-sand hover:border-brand-charcoal text-brand-charcoal bg-brand-cream/30 hover:bg-brand-cream'
                                }`}
                              >
                                {sz}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Move to bag button */}
                      <div className="relative pt-1">
                        <button
                          id={`wishlist-add-to-bag-${product.id}`}
                          onClick={() => handleMoveToBag(product)}
                          disabled={!selectedSize || isAdded}
                          className={`w-full py-3.5 text-[10px] font-mono tracking-widest uppercase transition-all flex items-center justify-center space-x-2 border cursor-pointer relative overflow-hidden ${
                            isAdded
                              ? 'bg-emerald-800 border-emerald-800 text-white font-semibold'
                              : 'bg-brand-charcoal border-brand-charcoal text-white hover:bg-brand-charcoal/90 hover:-translate-y-0.5 hover:shadow-xs active:translate-y-0 transition-transform duration-200'
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <Check className="w-3.5 h-3.5 animate-bounce" />
                              <span>MOVING TO SHOPPING BAG</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span>MOVE TO SHOPPING BAG ({selectedSize})</span>
                            </>
                          )}
                        </button>

                        {/* Charging progress bar when transferring to shopping bag */}
                        {isAdded && (
                          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-emerald-950/20 overflow-hidden">
                            <motion.div 
                              initial={{ width: '0%' }}
                              animate={{ width: '100%' }}
                              transition={{ duration: 0.95, ease: 'easeInOut' }}
                              className="h-full bg-emerald-300"
                            />
                          </div>
                        )}
                      </div>

                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            
            // Premium Elegant Empty State with Discover interactive panel
            <motion.div 
              key="wishlist-empty-state"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="py-16 md:py-20 text-center max-w-4xl mx-auto space-y-10"
            >
              <div className="relative inline-block">
                {/* Clean, high-end fine-line vector illustration */}
                <div className="p-12 bg-gradient-to-b from-brand-sand/20 to-brand-sand/5 rounded-full border border-brand-sand/40 relative flex items-center justify-center">
                  <svg className="w-20 h-20 text-brand-charcoal/85" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                    {/* Background architectural balance circle */}
                    <circle cx="50" cy="50" r="46" strokeWidth="0.5" strokeDasharray="3 3" className="text-brand-muted/30" />
                    
                    {/* The Curation Wardrobe stand / clothing rack silhouette */}
                    <line x1="30" y1="80" x2="70" y2="80" strokeWidth="1" className="text-brand-charcoal/60" />
                    <line x1="38" y1="80" x2="38" y2="35" strokeWidth="1" />
                    <line x1="62" y1="80" x2="62" y2="35" strokeWidth="1" />
                    <path d="M38 35 C38 31, 42 27, 50 27 C58 27, 62 31, 62 35" strokeWidth="1" />
                    
                    {/* Premium minimalist clothing hanger hooks */}
                    <path d="M46 44 C46 40, 50 40, 50 44 L50 48" strokeWidth="1" className="text-brand-sand" />
                    <path d="M40 48 L60 48 L50 44 Z" fill="none" strokeWidth="0.75" className="text-brand-charcoal/30" />
                    
                    {/* Fine aesthetic fabric drape lines */}
                    <path d="M43 48 L43 72 C43 74, 45 75, 50 75 C55 75, 57 74, 57 72 L57 48" strokeWidth="0.75" className="text-brand-charcoal/50" />
                    <line x1="48" y1="52" x2="48" y2="70" strokeWidth="0.5" strokeDasharray="2 2" className="text-brand-muted/40" />
                    <line x1="52" y1="52" x2="52" y2="70" strokeWidth="0.5" strokeDasharray="2 2" className="text-brand-muted/40" />
                    
                    {/* Sparkles of curations */}
                    <path d="M72 25 L73 29 L77 30 L73 31 L72 35 L71 31 L67 30 L71 29 Z" fill="currentColor" stroke="none" className="text-brand-muted animate-pulse" />
                  </svg>
                </div>
                {/* Floating Heart Accent */}
                <div className="absolute top-2 right-2 bg-brand-charcoal text-brand-cream p-2.5 rounded-full shadow-md border border-brand-cream flex items-center justify-center">
                  <Heart className="w-3.5 h-3.5 fill-brand-sand text-brand-sand" />
                </div>
              </div>

              <div className="space-y-4 max-w-md mx-auto">
                <span className="text-[10px] font-mono tracking-[0.35em] text-brand-muted uppercase block font-semibold">Your Style Sanctuary</span>
                <h2 className="font-serif text-3xl font-light text-brand-charcoal tracking-tight">Your Saved Closet is Empty</h2>
                <p className="text-xs text-brand-muted font-sans font-light leading-relaxed px-4">
                  As you browse our slow-spun kurtas, block-printed duster jackets, and raw-textured coordinates, add your favorites here to curate your ultimate capsule wardrobe.
                </p>
                <div className="pt-4">
                  <button
                    id="empty-wishlist-shop-btn"
                    onClick={() => setView('shop')}
                    className="relative px-8 py-3.5 bg-brand-charcoal text-white hover:bg-brand-charcoal/90 text-[10px] font-mono tracking-[0.25em] uppercase transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
                  >
                    Explore Collections
                  </button>
                </div>
              </div>

              {/* DYNAMIC DISCOVER WORKBENCH (EMPTY STATE INTERACTIVE UPGRADE) */}
              <div className="pt-16 border-t border-brand-sand/40 mt-12 space-y-10 text-left">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-brand-sand/20 pb-5">
                  <div className="space-y-1">
                    <p className="text-[9px] font-mono tracking-[0.3em] text-brand-muted uppercase flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-brand-sand animate-pulse" />
                      interactive capsule curation
                    </p>
                    <h3 className="font-serif text-xl md:text-2xl font-light text-brand-charcoal">
                      Find Your Capsule Aesthetic
                    </h3>
                  </div>
                  
                  {/* Interactive Vibe Pills */}
                  <div className="flex flex-wrap gap-2">
                    {moodPills.map(p => (
                      <button
                        key={p.id}
                        onClick={() => setActiveMood(p.id)}
                        className={`px-3 py-1.5 text-[9px] font-mono tracking-wider uppercase border transition-all duration-300 cursor-pointer ${
                          activeMood === p.id 
                            ? 'bg-brand-charcoal text-white border-brand-charcoal font-medium'
                            : 'bg-transparent text-brand-muted border-brand-sand/50 hover:border-brand-charcoal'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Animated Curated Items Grid */}
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={activeMood}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.35 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                  >
                    {recommendedProducts.map((p) => {
                      const recSelectedSize = recSelectedSizes[p.id] || p.sizes[0] || 'M';
                      const isRecAdded = recAddedFeedbacks[p.id] || false;
                      const isAlreadySaved = wishlist.some(item => item.id === p.id);

                      return (
                        <div 
                          key={`rec-${p.id}`}
                          className="group bg-brand-cream/40 border border-brand-sand/35 flex flex-col justify-between overflow-hidden relative hover:border-brand-sand/70 hover:shadow-xs transition-all duration-300"
                        >
                          {/* Quick Save Heart toggle */}
                          <button
                            onClick={() => onToggleWishlist(p)}
                            className="absolute top-3.5 right-3.5 z-10 p-2 bg-brand-cream/95 hover:bg-brand-charcoal hover:text-white border border-brand-sand/40 backdrop-blur-xs transition-all cursor-pointer rounded-none"
                            title={isAlreadySaved ? "Remove from Saved Closet" : "Save to Saved Closet"}
                          >
                            <Heart className={`w-3.5 h-3.5 transition-colors ${isAlreadySaved ? 'fill-brand-charcoal text-brand-charcoal hover:text-brand-cream hover:fill-brand-cream' : 'text-brand-muted hover:text-white'}`} />
                          </button>

                          <div 
                            onClick={() => onQuickShop(p)}
                            className="aspect-[3/4] overflow-hidden bg-brand-sand/10 border-b border-brand-sand/20 relative cursor-pointer"
                          >
                            <img 
                              src={p.images[0]} 
                              alt={p.name} 
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103 grayscale-[3%]" 
                              loading="lazy"
                              referrerPolicy="no-referrer"
                            />
                            {p.images[1] && (
                              <img
                                src={p.images[1]}
                                alt={`${p.name} alternate view`}
                                className="absolute inset-0 w-full h-full object-cover transition-all duration-500 opacity-0 group-hover:opacity-100 group-hover:scale-103 grayscale-[3%]"
                                loading="lazy"
                                referrerPolicy="no-referrer"
                              />
                            )}
                            <div className="absolute inset-0 bg-brand-charcoal/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                            
                            <ProductBadge
                              product={p}
                              className="absolute top-3.5 left-3.5 z-10"
                            />
                          </div>

                          <div className="p-4 flex-grow flex flex-col justify-between space-y-3.5">
                            <div className="space-y-1">
                              <span className="text-[8px] font-mono tracking-wider text-brand-muted uppercase block">{p.category}</span>
                              <h4 
                                onClick={() => onQuickShop(p)}
                                className="text-xs md:text-sm font-serif font-light text-brand-charcoal group-hover:text-brand-muted cursor-pointer truncate leading-tight transition-colors duration-200"
                              >
                                {p.name}
                              </h4>
                              <div className="flex items-center space-x-1.5 text-[10px] font-mono">
                                {p.originalPrice && (
                                  <span className="text-[9px] text-brand-muted line-through">₹{p.originalPrice.toLocaleString('en-IN')}</span>
                                )}
                                <span className="font-medium text-brand-charcoal">₹{p.price.toLocaleString('en-IN')}</span>
                              </div>
                            </div>

                            {/* Mini Sizing Pills for Quick Add to Bag */}
                            <div className="pt-2 border-t border-brand-sand/20 space-y-2">
                              <div className="flex justify-between items-center text-[8px] font-mono text-brand-muted uppercase">
                                <span>Choose Size:</span>
                                <span className="font-bold text-brand-charcoal">{recSelectedSize}</span>
                              </div>
                              <div className="flex gap-1">
                                {p.sizes.map((sz) => (
                                  <button
                                    key={`rec-sz-${p.id}-${sz}`}
                                    onClick={() => {
                                      setRecSelectedSizes(prev => ({ ...prev, [p.id]: sz }));
                                    }}
                                    className={`w-6 h-6 flex items-center justify-center text-[9px] font-mono border transition-all cursor-pointer ${
                                      recSelectedSize === sz
                                        ? 'bg-brand-charcoal text-white border-brand-charcoal font-semibold'
                                        : 'border-brand-sand/40 text-brand-charcoal hover:border-brand-charcoal bg-transparent'
                                    }`}
                                  >
                                    {sz}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Quick Add To Bag Action */}
                            <button
                              onClick={() => handleAddRecToBag(p)}
                              disabled={isRecAdded}
                              className={`w-full py-2 text-[9px] font-mono tracking-widest uppercase transition-all flex items-center justify-center space-x-1.5 border cursor-pointer ${
                                isRecAdded
                                  ? 'bg-emerald-800 border-emerald-800 text-white font-medium'
                                  : 'bg-transparent border-brand-charcoal text-brand-charcoal hover:bg-brand-charcoal hover:text-white'
                              }`}
                            >
                              {isRecAdded ? (
                                <>
                                  <Check className="w-3 h-3 animate-bounce" />
                                  <span>ADDED TO BAG</span>
                                </>
                              ) : (
                                <>
                                  <ShoppingBag className="w-3 h-3 text-brand-muted group-hover:text-inherit" />
                                  <span>ADD DIRECTLY TO BAG</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer actions for non-empty wishlist */}
        {wishlist.length > 0 && (
          <div className="mt-20 border-t border-brand-sand/40 pt-8 flex justify-center">
            <button
              id="wishlist-continue-shopping-bottom"
              onClick={() => setView('shop')}
              className="flex items-center space-x-2 px-10 py-4 border border-brand-charcoal hover:bg-brand-charcoal hover:text-white text-xs font-semibold tracking-widest uppercase text-brand-charcoal transition-all duration-300 cursor-pointer"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

      </div>

      {/* LUXURY SLIDE-IN UNDO NOTIFICATION TOAST */}
      <AnimatePresence>
        {showUndoToast && lastRemovedProduct && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-brand-charcoal text-brand-cream px-6 py-4 shadow-2xl border border-brand-sand/30 flex items-center space-x-5 max-w-md w-[90vw]"
          >
            <div className="flex-grow space-y-0.5 min-w-0">
              <p className="text-[9px] font-mono tracking-widest text-brand-sand/60 uppercase">Saved closet updated</p>
              <p className="text-xs font-serif font-light truncate">
                Removed "{lastRemovedProduct.name}"
              </p>
            </div>
            <div className="flex items-center space-x-3 shrink-0">
              <button
                onClick={handleUndoRemove}
                className="flex items-center space-x-1 text-[10px] font-mono tracking-wider font-semibold text-brand-sand hover:text-white transition-colors uppercase border-b border-brand-sand/45 cursor-pointer pb-0.5"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Undo</span>
              </button>
              <button
                onClick={() => setShowUndoToast(false)}
                className="text-brand-sand/55 hover:text-white transition-colors cursor-pointer"
                aria-label="Dismiss undo notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {/* Visual timer countdown bar */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-sand/20">
              <motion.div 
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 6, ease: 'linear' }}
                className="h-full bg-brand-sand"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
