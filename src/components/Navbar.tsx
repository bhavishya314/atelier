import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  ShoppingBag, 
  Heart, 
  Menu, 
  X, 
  ArrowRight, 
  TrendingUp, 
  History, 
  Crown, 
  Trash2, 
  ChevronRight,
  Truck,
  Coins,
  Sparkles
} from 'lucide-react';
import { Product } from '../types';
import BrandLogo from './BrandLogo';

interface NavbarProps {
  currentView: 'home' | 'shop' | 'journal' | 'story' | 'wishlist' | 'contact' | '404';
  setView: (view: 'home' | 'shop' | 'journal' | 'story' | 'wishlist' | 'contact' | '404') => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  allProducts: Product[];
  onQuickShop: (product: Product) => void;
  onOpenQuickView?: (product: Product) => void;
  isAppLoading?: boolean;
}

export default function Navbar({
  currentView,
  setView,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  allProducts,
  onQuickShop,
  onOpenQuickView,
  isAppLoading = false
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  
  // Premium recent searches state from localStorage
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('atelier_recent_searches_v2');
      return saved ? JSON.parse(saved) : ['Khadi', 'Indigo', 'Duster', 'Linen'];
    } catch (e) {
      return ['Khadi', 'Indigo', 'Duster', 'Linen'];
    }
  });

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Elegant, responsive rotating announcements with Lucide icons
  const announcements = [
    { text: "Free Shipping Across India", icon: Truck },
    { text: "Cash on Delivery Available", icon: Coins },
    { text: "New Collection Live", icon: Sparkles }
  ];
  const [announcementIndex, setAnnouncementIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnnouncementIndex((prev) => (prev + 1) % announcements.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // Monitor scroll for premium visual treatment (solid vs transparent background)
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Focus search input when drawer opens
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isSearchOpen]);

  // Live filter products based on search input
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
    } else {
      const query = searchQuery.toLowerCase().trim();
      const filtered = allProducts.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.color.toLowerCase().includes(query)
      );
      setSearchResults(filtered.slice(0, 5));
    }
  }, [searchQuery, allProducts]);

  // Add recent search query
  const addRecentSearch = (query: string) => {
    if (!query || query.trim() === '') return;
    const trimmed = query.trim();
    setRecentSearches(prev => {
      const filtered = prev.filter(q => q.toLowerCase() !== trimmed.toLowerCase());
      const updated = [trimmed, ...filtered].slice(0, 5);
      try {
        localStorage.setItem('atelier_recent_searches_v2', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // Remove individual recent search item
  const removeRecentSearch = (e: React.MouseEvent, query: string) => {
    e.stopPropagation();
    setRecentSearches(prev => {
      const updated = prev.filter(q => q !== query);
      try {
        localStorage.setItem('atelier_recent_searches_v2', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // Clear all recent searches
  const clearAllRecentSearches = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem('atelier_recent_searches_v2');
    } catch (e) {}
  };

  // Select dynamic list of suggestions based on query input
  const keywords = ['Kora', 'Khadi', 'Indigo', 'Linen', 'Duster', 'Wool', 'Cocoon', 'Shacket', 'Vest', 'Wrap', 'Trousers', 'Bandhgala'];
  const instantSuggestions = searchQuery.trim() !== ''
    ? keywords.filter(k => k.toLowerCase().includes(searchQuery.toLowerCase()) && k.toLowerCase() !== searchQuery.toLowerCase()).slice(0, 4)
    : [];

  // Helper to render matched query with high contrast background
  const highlightMatch = (text: string, query: string) => {
    if (!query) return <span>{text}</span>;
    const parts = text.split(new RegExp(`(${query.trim()})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === query.trim().toLowerCase() 
            ? <span key={i} className="bg-brand-sand text-brand-charcoal font-semibold px-0.5">{part}</span>
            : <span key={i}>{part}</span>
        )}
      </span>
    );
  };

  // Trending Bestseller items to show when empty
  const trendingProducts = allProducts.filter(p => p.isBestseller || p.isNew).slice(0, 3);

  const navLinks = [
    { id: 'shop', label: 'COLLECTIONS' },
    { id: 'journal', label: 'JOURNAL' },
    { id: 'story', label: 'OUR STORY' },
    { id: 'contact', label: 'CONTACT' }
  ] as const;

  // Animation variants
  const navbarVariants = {
    hidden: { y: -50, opacity: 0 },
    show: { 
      y: 0, 
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
        delay: 0.1
      }
    }
  };

  const leftColVariants = {
    hidden: { x: -20, opacity: 0 },
    show: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.3 }
    }
  };

  const centerColVariants = {
    hidden: { y: -15, opacity: 0, scale: 0.97 },
    show: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.2 }
    }
  };

  const rightColVariants = {
    hidden: { x: 20, opacity: 0 },
    show: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.45 }
    }
  };

  return (
    <>
      <motion.header
        id="main-navbar"
        variants={navbarVariants}
        initial="hidden"
        animate={isAppLoading ? "hidden" : "show"}
        className="sticky top-0 w-full z-50 transition-all duration-500 ease-in-out bg-brand-cream/95 backdrop-blur-md border-b border-brand-sand/50 shadow-sm"
      >
        {/* Dynamic Cycling Announcement Bar */}
        <div className="bg-brand-charcoal text-brand-cream text-[9px] md:text-[9.5px] font-mono tracking-[0.2em] py-2 px-6 text-center border-b border-brand-sand/10 relative flex items-center justify-center min-h-[36px] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={announcementIndex}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center justify-center space-x-2 text-brand-sand uppercase tracking-wider font-semibold"
            >
              {(() => {
                const IconComponent = announcements[announcementIndex].icon;
                return <IconComponent className="w-3.5 h-3.5 stroke-[1.5] text-brand-sand animate-pulse shrink-0" />;
              })()}
              <span>{announcements[announcementIndex].text}</span>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className={`max-w-7xl mx-auto px-4 sm:px-6 md:px-12 relative flex items-center justify-between transition-all duration-300 ${
          isScrolled ? 'py-3' : 'py-5'
        }`}>
          
          {/* Left Column: Nav items (Desktop) & Hamburger (Mobile/Tablet) */}
          <motion.div 
            variants={leftColVariants}
            initial="hidden"
            animate={isAppLoading ? "hidden" : "show"}
            className="flex items-center justify-start flex-1 min-w-0"
          >
            {/* Left: Hamburger (Mobile & Tablet) */}
            <button
              id="mobile-menu-trigger"
              className="lg:hidden text-brand-charcoal hover:text-brand-muted p-1.5 focus:outline-none flex items-center justify-center cursor-pointer"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-[18px] h-[18px]" />
            </button>

            {/* Left: Nav items (Desktop) */}
            <div className="hidden lg:flex items-center space-x-4 xl:space-x-8">
              <span className="text-[10px] tracking-[0.3em] font-medium uppercase text-brand-charcoal/40 select-none hidden xl:inline-block">
                Jaipur / Mumbai
              </span>
              <nav className="flex items-center space-x-4 xl:space-x-6 text-[11px] font-medium tracking-[0.15em] text-brand-charcoal">
                {navLinks.map((link) => (
                  <button
                    id={`nav-link-${link.id}`}
                    key={link.id}
                    onClick={() => setView(link.id)}
                    className={`relative py-1 hover:text-brand-muted transition-colors whitespace-nowrap ${
                      currentView === link.id ? 'text-brand-charcoal font-semibold' : 'text-brand-charcoal/80'
                    }`}
                  >
                    {link.label}
                    {currentView === link.id && (
                      <motion.span
                        layoutId="navbar-underline"
                        className="absolute bottom-0 left-0 w-full h-[1px] bg-brand-charcoal"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </motion.div>

          {/* Center Column: Branding (Absolutely centered for immaculate visual balance) */}
          <motion.div 
            variants={centerColVariants}
            initial="hidden"
            animate={isAppLoading ? "hidden" : "show"}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center pointer-events-auto"
          >
            <button
              id="brand-home-trigger"
              onClick={() => setView('home')}
              className="hover:opacity-85 transition-all duration-300 group cursor-pointer focus:outline-none"
            >
              <BrandLogo variant="horizontal" showSubtitle={true} theme="light" className="transition-transform duration-300" />
            </button>
          </motion.div>

          {/* Right Column: Icons (Symmetrical with left container) */}
          <motion.div 
            variants={rightColVariants}
            initial="hidden"
            animate={isAppLoading ? "hidden" : "show"}
            className="flex items-center justify-end flex-1 gap-1.5 sm:gap-3.5 md:gap-6 text-brand-charcoal z-20"
          >
            <button
              id="search-trigger"
              onClick={() => setIsSearchOpen(true)}
              className="p-1.5 hover:text-brand-muted transition-colors flex items-center justify-center cursor-pointer relative"
              aria-label="Search"
            >
              <Search className="w-[18px] h-[18px]" />
            </button>

            <button
              id="wishlist-trigger"
              onClick={() => setView('wishlist')}
              className="p-1.5 hover:text-brand-muted transition-colors relative flex items-center justify-center cursor-pointer"
              aria-label="Wishlist"
            >
              <Heart className="w-[18px] h-[18px]" />
              {wishlistCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-brand-muted text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-mono font-medium scale-90">
                  {wishlistCount}
                </span>
              )}
            </button>

            <button
              id="cart-trigger"
              onClick={onOpenCart}
              className="p-1.5 hover:text-brand-muted transition-colors relative flex items-center justify-center cursor-pointer"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-[18px] h-[18px]" />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0.6 }}
                  animate={{ scale: 1 }}
                  key={cartCount}
                  className="absolute top-0.5 right-0.5 bg-brand-charcoal text-brand-cream text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-mono font-medium"
                >
                  {cartCount}
                </motion.span>
              )}
            </button>
          </motion.div>

        </div>
      </motion.header>

      {/* Slide-down Search Drawer Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-brand-charcoal/40 backdrop-blur-md"
              onClick={() => {
                setIsSearchOpen(false);
                setSearchQuery('');
              }}
            />

            <motion.div
              initial={{ y: '-100%' }}
              animate={{ y: 0 }}
              exit={{ y: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="absolute top-0 left-0 w-full bg-brand-cream border-b border-brand-sand shadow-2xl py-12 px-6 md:px-12 z-10 max-h-[92vh] overflow-y-auto"
            >
              <div className="max-w-5xl mx-auto">
                {/* Search Bar Input Row */}
                <div className="flex items-center justify-between border-b border-brand-charcoal/10 pb-5">
                  <div className="flex items-center space-x-4 flex-grow mr-6">
                    <Search className="w-5.5 h-5.5 text-brand-charcoal/70 animate-pulse" />
                    <input
                      id="search-input"
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search linen, khadi, duster, capes, tailoring..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && searchQuery.trim() !== '') {
                          addRecentSearch(searchQuery);
                        }
                        if (e.key === 'Escape') {
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }
                      }}
                      className="w-full bg-transparent border-none text-xl focus:outline-none placeholder-brand-muted/50 font-light text-brand-charcoal tracking-wide"
                    />
                    {searchQuery.trim() !== '' && (
                      <button
                        id="clear-query-btn"
                        onClick={() => {
                          setSearchQuery('');
                          searchInputRef.current?.focus();
                        }}
                        className="p-1.5 hover:bg-brand-sand/30 rounded-full transition-colors text-brand-muted"
                        aria-label="Clear search terms"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  {/* Close drawer button */}
                  <button
                    id="close-search-drawer"
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="flex items-center space-x-2 px-3 py-2 border border-brand-sand/60 hover:border-brand-charcoal hover:bg-brand-charcoal hover:text-white transition-all text-[10px] font-mono tracking-widest uppercase text-brand-charcoal cursor-pointer"
                  >
                    <span>CLOSE</span>
                    <X className="w-[18px] h-[18px]" />
                  </button>
                </div>

                {/* Main panel - Staggered layout */}
                <div className="mt-10">
                  {searchQuery.trim() === '' ? (
                    /* EMPTY SEARCH STATE: Recent + Trending + Categories Grid */
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                      
                      {/* Left: Recent Searches */}
                      <div className="col-span-1 md:col-span-4 space-y-4">
                        <div className="flex items-center justify-between border-b border-brand-sand/50 pb-2">
                          <p className="text-[10px] font-mono tracking-[0.2em] text-brand-muted uppercase flex items-center space-x-1.5">
                            <History className="w-3 h-3 text-brand-muted/70" />
                            <span>Recent Queries</span>
                          </p>
                          {recentSearches.length > 0 && (
                            <button
                              id="clear-recent-searches"
                              onClick={clearAllRecentSearches}
                              className="text-[9px] font-mono tracking-widest text-brand-muted hover:text-red-700 uppercase transition-colors"
                            >
                              Clear All
                            </button>
                          )}
                        </div>

                        {recentSearches.length > 0 ? (
                          <div className="flex flex-col space-y-1.5">
                            {recentSearches.map((query, index) => (
                              <button
                                id={`recent-search-${index}`}
                                key={`${query}-${index}`}
                                onClick={() => setSearchQuery(query)}
                                className="group flex items-center justify-between text-left py-2 px-3 hover:bg-brand-sand/20 transition-all rounded-sm text-xs font-sans text-brand-charcoal"
                              >
                                <span className="truncate group-hover:translate-x-1 transition-transform duration-200">
                                  {query}
                                </span>
                                <button
                                  id={`remove-recent-search-${index}`}
                                  onClick={(e) => removeRecentSearch(e, query)}
                                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-700 transition-all text-brand-muted/60"
                                  title="Remove query"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-brand-muted font-sans font-light italic py-2">
                            No recent searches. Try "Khadi" or "Linen".
                          </p>
                        )}
                      </div>

                      {/* Center: Trending Pieces */}
                      <div className="col-span-1 md:col-span-5 space-y-4">
                        <p className="text-[10px] font-mono tracking-[0.2em] text-brand-muted uppercase border-b border-brand-sand/50 pb-2 flex items-center space-x-1.5">
                          <TrendingUp className="w-3 h-3 text-brand-muted/70" />
                          <span>Trending Favorites</span>
                        </p>

                        <div className="space-y-3">
                          {trendingProducts.map((product) => (
                            <div
                              id={`trending-product-${product.id}`}
                              key={product.id}
                              onClick={() => {
                                setIsSearchOpen(false);
                                onQuickShop(product);
                                addRecentSearch(product.name);
                              }}
                              className="group flex items-center justify-between p-2 hover:bg-brand-sand/20 transition-all cursor-pointer rounded-sm border border-transparent hover:border-brand-sand/30"
                            >
                              <div className="flex items-center space-x-3.5">
                                <div className="w-11 h-14 overflow-hidden bg-brand-sand/10 border border-brand-sand/40">
                                  <img
                                    src={product.images[0]}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    loading="lazy"
                                    referrerPolicy="no-referrer"
                                  />
                                </div>
                                <div className="space-y-0.5">
                                  <h4 className="text-xs font-serif font-light text-brand-charcoal group-hover:text-brand-muted transition-colors line-clamp-1">
                                    {product.name}
                                  </h4>
                                  <p className="text-[9px] text-brand-muted font-mono uppercase tracking-wider">{product.category}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="text-[11px] font-mono text-brand-charcoal">₹{product.price.toLocaleString('en-IN')}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right: Discover Textures / Categories */}
                      <div className="col-span-1 md:col-span-3 space-y-4">
                        <p className="text-[10px] font-mono tracking-[0.2em] text-brand-muted uppercase border-b border-brand-sand/50 pb-2 flex items-center space-x-1.5">
                          <Crown className="w-3 h-3 text-brand-muted/70" />
                          <span>Explore Styles</span>
                        </p>

                        <div className="flex flex-wrap gap-2 pt-1">
                          {['Outerwear', 'Tailoring', 'Knitwear', 'Essentials', 'Khadi', 'Indigo', 'Linen', 'Wool'].map((cat) => (
                            <button
                              id={`search-tag-${cat}`}
                              key={cat}
                              onClick={() => {
                                setSearchQuery(cat);
                                addRecentSearch(cat);
                              }}
                              className="px-3 py-1.5 border border-brand-sand/80 bg-brand-sand/5 hover:bg-brand-charcoal hover:border-brand-charcoal hover:text-white text-[10px] font-mono tracking-wider text-brand-charcoal transition-all"
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      </div>

                    </div>
                  ) : (
                    /* ACTIVE SEARCH STATE: Instant suggestions, matching count, and live results */
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                      
                      {/* Left: Dynamic Suggestions and Metadata */}
                      <div className="col-span-1 md:col-span-4 space-y-6">
                        {instantSuggestions.length > 0 && (
                          <div className="space-y-3">
                            <p className="text-[9px] font-mono tracking-[0.2em] text-brand-muted uppercase">Suggestions</p>
                            <div className="flex flex-col space-y-1">
                              {instantSuggestions.map((sug) => (
                                <button
                                  id={`instant-sug-${sug}`}
                                  key={sug}
                                  onClick={() => {
                                    setSearchQuery(sug);
                                    addRecentSearch(sug);
                                  }}
                                  className="text-left py-1.5 px-2 hover:bg-brand-sand/25 transition-colors text-xs text-brand-charcoal flex items-center space-x-2"
                                >
                                  <Search className="w-3 h-3 text-brand-muted/60" />
                                  <span>{sug}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="border-t border-brand-sand/50 pt-5 space-y-3">
                          <p className="text-[9px] font-mono tracking-[0.2em] text-brand-muted uppercase">Search Overview</p>
                          <div className="bg-brand-sand/10 border border-brand-sand/40 p-4 space-y-2">
                            <p className="text-xs text-brand-charcoal leading-relaxed font-sans font-light">
                              Found <span className="font-semibold text-brand-charcoal">{searchResults.length}</span> matching pieces in our catalog.
                            </p>
                            <p className="text-[10px] text-brand-muted font-sans font-light italic">
                              Atelier Kora products are crafted in small artisanal batches utilizing authentic handloom traditions.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Right: Results list with Staggered Framer Motion */}
                      <div className="col-span-1 md:col-span-8 space-y-4">
                        <p className="text-[10px] font-mono tracking-[0.2em] text-brand-muted uppercase border-b border-brand-sand/50 pb-2">
                          Collection Matches ({searchResults.length})
                        </p>

                        {searchResults.length > 0 ? (
                          <motion.div
                            variants={{
                              hidden: { opacity: 0 },
                              show: {
                                opacity: 1,
                                transition: {
                                  staggerChildren: 0.05
                                }
                              }
                            }}
                            initial="hidden"
                            animate="show"
                            className="divide-y divide-brand-sand/45"
                          >
                            {searchResults.map((product) => (
                              <motion.div
                                variants={{
                                  hidden: { opacity: 0, y: 10 },
                                  show: { opacity: 1, y: 0 }
                                }}
                                key={product.id}
                                onClick={() => {
                                  addRecentSearch(searchQuery);
                                  setIsSearchOpen(false);
                                  onQuickShop(product);
                                  setSearchQuery('');
                                }}
                                className="group flex items-center justify-between py-4 cursor-pointer hover:bg-brand-sand/10 px-2 -mx-2 transition-all"
                              >
                                <div className="flex items-center space-x-4">
                                  <div className="w-12 h-16 bg-brand-sand/10 overflow-hidden border border-brand-sand/30">
                                    <img
                                      src={product.images[0]}
                                      alt={product.name}
                                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-104"
                                      loading="lazy"
                                      referrerPolicy="no-referrer"
                                    />
                                  </div>
                                  <div>
                                    <h4 className="text-xs font-semibold tracking-wider text-brand-charcoal group-hover:text-brand-muted transition-colors">
                                      {highlightMatch(product.name, searchQuery)}
                                    </h4>
                                    <div className="flex items-center space-x-2 mt-1">
                                      <span className="text-[10px] text-brand-muted font-mono uppercase tracking-wider">{product.category}</span>
                                      <span className="text-brand-sand/80">•</span>
                                      <span className="text-[10px] text-brand-muted font-sans font-light italic">Color: {product.color}</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                  <span className="text-xs font-mono font-medium text-brand-charcoal">
                                    ₹{product.price.toLocaleString('en-IN')}
                                  </span>
                                  <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                                    {onOpenQuickView && (
                                      <button
                                        id={`search-quickview-${product.id}`}
                                        onClick={() => {
                                          addRecentSearch(searchQuery);
                                          setIsSearchOpen(false);
                                          onOpenQuickView(product);
                                          setSearchQuery('');
                                        }}
                                        className="hidden sm:inline-block text-[9px] font-mono tracking-wider text-brand-muted hover:text-brand-charcoal transition-colors px-2.5 py-1.5 border border-brand-sand hover:border-brand-charcoal bg-transparent cursor-pointer"
                                      >
                                        QUICK VIEW
                                      </button>
                                    )}
                                    <div 
                                      onClick={() => {
                                        addRecentSearch(searchQuery);
                                        setIsSearchOpen(false);
                                        onQuickShop(product);
                                        setSearchQuery('');
                                      }}
                                      className="w-7 h-7 border border-brand-sand/50 rounded-full flex items-center justify-center bg-brand-cream hover:bg-brand-charcoal group-hover:border-brand-charcoal group-hover:bg-brand-charcoal transition-all cursor-pointer"
                                    >
                                      <ArrowRight className="w-3.5 h-3.5 text-brand-muted group-hover:text-brand-cream group-hover:translate-x-0.5 transition-all" />
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </motion.div>
                        ) : (
                          <div className="py-16 text-center max-w-md mx-auto space-y-6 flex flex-col items-center justify-center">
                            {/* Beautiful Lens/Loom Illustration */}
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="relative flex items-center justify-center"
                            >
                              <svg className="w-20 h-20 text-brand-sand/65" viewBox="0 0 100 100" fill="none" stroke="currentColor">
                                <circle cx="50" cy="50" r="40" strokeWidth="0.5" strokeDasharray="3 3" className="opacity-40" />
                                <circle cx="50" cy="50" r="36" strokeWidth="0.75" className="opacity-20" />
                                {/* Magnifying glass search loop searching fabric threads */}
                                <line x1="38" y1="38" x2="62" y2="62" strokeWidth="1" className="opacity-40" />
                                <circle cx="38" cy="38" r="14" strokeWidth="1" />
                                <path d="M48 48 L68 68" strokeWidth="1.5" strokeLinecap="round" />
                                <path d="M30 38 H46 M38 30 V46" strokeWidth="0.5" strokeLinecap="round" className="opacity-30" />
                              </svg>
                            </motion.div>

                            <div className="space-y-2">
                              <h3 className="font-serif text-base font-light text-brand-charcoal tracking-tight">No matching pieces found</h3>
                              <p className="text-xs text-brand-muted font-sans font-light leading-relaxed px-4">
                                Our artisans craft Kora garments in small physical runs. We couldn't find matches for <span className="font-mono text-[11px] font-semibold text-brand-charcoal bg-brand-sand/20 px-1.5 py-0.5">"{searchQuery}"</span>.
                              </p>
                            </div>

                            <div className="pt-2 space-y-3.5">
                              <p className="text-[9px] font-mono tracking-[0.25em] text-brand-charcoal/70 uppercase">
                                RECOMMENDED ARCHIVE SEARCHES
                              </p>
                              <div className="flex flex-wrap items-center justify-center gap-2 px-4">
                                {['Indigo', 'Linen', 'Essentials', 'Knitwear', 'Tailoring'].map((tag) => (
                                  <button
                                    id={`empty-search-suggest-${tag}`}
                                    key={tag}
                                    onClick={() => {
                                      setSearchQuery(tag);
                                      addRecentSearch(tag);
                                    }}
                                    className="px-3 py-1.5 border border-brand-sand/80 hover:border-brand-charcoal bg-white/40 hover:bg-brand-charcoal hover:text-white text-[9.5px] font-mono tracking-wider text-brand-charcoal transition-all cursor-pointer"
                                  >
                                    {tag}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Full screen Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-brand-charcoal/20 backdrop-blur-xs"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-0 left-0 w-[80%] max-w-[320px] h-full bg-brand-cream border-r border-brand-sand shadow-2xl p-8 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-8 border-b border-brand-sand">
                  <BrandLogo variant="horizontal" showSubtitle={false} textClassName="text-base" iconClassName="w-7 h-7" />
                  <button
                    id="close-mobile-menu"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1.5 hover:text-brand-muted transition-colors flex items-center justify-center cursor-pointer"
                  >
                    <X className="w-[18px] h-[18px]" />
                  </button>
                </div>

                <nav className="flex flex-col space-y-6 mt-10 text-xs font-medium tracking-[0.2em] text-brand-charcoal">
                  {navLinks.map((link) => (
                    <button
                      id={`mobile-nav-link-${link.id}`}
                      key={link.id}
                      onClick={() => {
                        setView(link.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`text-left py-1 hover:text-brand-muted transition-colors ${
                        currentView === link.id ? 'font-semibold border-l-2 border-brand-charcoal pl-3' : 'pl-3'
                      }`}
                    >
                      {link.label}
                    </button>
                  ))}
                  <button
                    id="mobile-nav-link-home"
                    onClick={() => {
                      setView('home');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`text-left py-1 hover:text-brand-muted transition-colors pl-3 ${
                      currentView === 'home' ? 'font-semibold border-l-2 border-brand-charcoal' : ''
                    }`}
                  >
                    HOME
                  </button>
                </nav>
              </div>

              <div className="border-t border-brand-sand pt-6 text-[10px] text-brand-muted font-mono leading-relaxed">
                <p>Designed for comfort, engineered for longevity.</p>
                <p className="mt-2">© 2026 ATELIER STUDIO LLC.</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
