import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ShoppingBag, 
  Heart, 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  Info, 
  Sparkles,
  Maximize2
} from 'lucide-react';
import { Product } from '../types';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, quantity?: number) => void;
  wishlist: Product[];
  onToggleWishlist: (product: Product) => void;
  onOpenSizeAdvisor: () => void;
  onViewFullDetails: (product: Product) => void;
}

export default function QuickViewModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
  wishlist,
  onToggleWishlist,
  onOpenSizeAdvisor,
  onViewFullDetails
}: QuickViewModalProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [shakeSize, setShakeSize] = useState(false);

  // Zoom magnifier states
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [isZooming, setIsZooming] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  // Reset local states when active product changes
  useEffect(() => {
    if (product) {
      setActiveImageIndex(0);
      setSelectedSize('');
      setQuantity(1);
      setIsAdding(false);
      setJustAdded(false);
      setShakeSize(false);
    }
  }, [product]);

  if (!product) return null;

  const inWishlist = wishlist.some((w) => w.id === product.id);

  // Hardcoded premium reviews / ratings mapping for consistency
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
  const ratingInfo = ratings[product.id] || { val: 4.8, reviews: 42 };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const handleAddToCartClick = () => {
    if (!selectedSize) {
      setShakeSize(true);
      setTimeout(() => setShakeSize(false), 500);
      return;
    }
    setIsAdding(true);
    setTimeout(() => {
      onAddToCart(product, selectedSize, quantity);
      setIsAdding(false);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    }, 850);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="quick-view-overlay" className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 select-none overflow-y-auto">
          {/* Elegant Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 bg-brand-charcoal/60 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 28, stiffness: 240 }}
            className="relative bg-brand-cream border border-brand-sand/50 shadow-2xl w-full max-w-4xl max-h-[90vh] md:max-h-[85vh] overflow-y-auto md:overflow-hidden grid grid-cols-1 md:grid-cols-12 rounded-none z-10"
          >
            {/* Close Trigger - Fixed on mobile for persistent layout control, absolute on desktop */}
            <button
              id="close-quick-view-btn"
              onClick={onClose}
              className="fixed top-4 right-4 md:absolute md:top-4 md:right-4 bg-brand-cream/95 hover:bg-brand-charcoal hover:text-white p-2 border border-brand-sand/30 shadow-md transition-all duration-300 z-50 rounded-none cursor-pointer flex items-center justify-center"
              aria-label="Close modal"
            >
              <X className="w-[18px] h-[18px]" />
            </button>

            {/* Left Column: Image Canvas & Selection Slider */}
            <div className="md:col-span-6 relative bg-brand-sand/15 border-b md:border-b-0 md:border-r border-brand-sand/30 h-[380px] md:h-full flex flex-col justify-between overflow-hidden">
              {/* Product Badges */}
              <div className="absolute top-4 left-4 z-25 flex flex-col gap-1.5 pointer-events-none">
                {product.isNew && (
                  <span className="bg-brand-charcoal text-brand-cream border border-brand-sand/20 font-mono text-[8px] tracking-[0.25em] uppercase px-2.5 py-1">
                    NEW ARRIVAL
                  </span>
                )}
                {product.isBestseller && (
                  <span className="bg-brand-sand/90 text-brand-charcoal border border-brand-charcoal/15 font-mono text-[8px] tracking-[0.25em] uppercase px-2.5 py-1 font-semibold">
                    BESTSELLER
                  </span>
                )}
              </div>

              {/* Main Image Viewport */}
              <div 
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsZooming(true)}
                onMouseLeave={() => setIsZooming(false)}
                className="relative flex-grow flex items-center justify-center overflow-hidden bg-brand-sand/5 cursor-zoom-in group/viewport"
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.img
                    key={`${product.id}-${activeImageIndex}`}
                    src={product.images[activeImageIndex]}
                    alt={`${product.name} - View ${activeImageIndex + 1}`}
                    initial={{ opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                      transform: (isZooming && window.innerWidth >= 768) ? 'scale(2.0)' : 'scale(1)',
                      transition: isZooming ? 'transform-origin 0.08s ease-out, transform 0.12s ease-out' : 'transform-origin 0.3s ease-out, transform 0.3s ease-out'
                    }}
                    className="absolute inset-0 w-full h-full object-cover grayscale-[5%]"
                    referrerPolicy="no-referrer"
                  />
                </AnimatePresence>

                {/* Left/Right Slide Arrows */}
                <button
                  onClick={handlePrevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-brand-charcoal hover:text-white text-brand-charcoal border border-brand-sand/20 transition-all flex items-center justify-center cursor-pointer shadow-sm active:scale-90 z-20 md:opacity-0 group-hover/viewport:opacity-100 duration-300"
                  aria-label="Previous view"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-brand-charcoal hover:text-white text-brand-charcoal border border-brand-sand/20 transition-all flex items-center justify-center cursor-pointer shadow-sm active:scale-90 z-20 md:opacity-0 group-hover/viewport:opacity-100 duration-300"
                  aria-label="Next view"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Micro hover help badge */}
                <div className="absolute bottom-3 right-3 z-20 bg-brand-charcoal/70 text-brand-cream text-[7px] font-mono tracking-wider px-2 py-1 uppercase border border-brand-sand/15 pointer-events-none select-none transition-opacity duration-300 group-hover/viewport:opacity-0">
                  Hover to Zoom
                </div>
              </div>

              {/* Micro Thumbnails Indicator Row */}
              <div className="p-3 bg-brand-cream/85 backdrop-blur-xs border-t border-brand-sand/25 flex items-center justify-center gap-2 z-20 no-scrollbar overflow-x-auto">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageIndex(i)}
                    onMouseEnter={() => setActiveImageIndex(i)}
                    className={`relative w-10 h-13 border transition-all duration-300 overflow-hidden cursor-pointer ${
                      activeImageIndex === i 
                        ? 'border-brand-charcoal scale-105 shadow-sm ring-1 ring-brand-charcoal/20' 
                        : 'border-brand-sand/40 opacity-70 hover:opacity-100 hover:scale-105'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: Premium Interactive Details Panel */}
            <div className="md:col-span-6 p-6 md:p-8 flex flex-col justify-between h-auto md:h-full bg-brand-cream md:max-h-[85vh]">
              {/* Scrollable details panel on desktop to prevent cutoff */}
              <div className="flex-grow md:overflow-y-auto no-scrollbar space-y-5 pr-1 md:pb-4">
                {/* Category & Ratings Header */}
                <div className="flex justify-between items-baseline">
                  <span className="text-[10px] text-brand-muted font-mono uppercase tracking-[0.2em]">{product.category}</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span className="text-[10px] font-mono text-brand-charcoal font-semibold">{ratingInfo.val}</span>
                    <span className="text-[9px] font-mono text-brand-muted">({ratingInfo.reviews} reviews)</span>
                  </div>
                </div>

                {/* Title & Price */}
                <div className="space-y-1.5">
                  <h2 className="font-serif text-xl md:text-2xl font-light text-brand-charcoal tracking-tight leading-snug">
                    {product.name}
                  </h2>
                  <div className="flex items-baseline space-x-3">
                    <span className="text-lg font-mono font-semibold text-brand-charcoal">₹{product.price.toLocaleString('en-IN')}</span>
                    {product.originalPrice && (
                      <span className="text-xs font-mono text-brand-muted line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                    )}
                  </div>
                </div>

                <div className="h-[1px] w-full bg-brand-sand/25" />

                {/* Brief Narrative Details */}
                <p className="text-[11.5px] text-brand-muted font-light leading-relaxed">
                  {product.description}
                </p>

                {/* Atelier Fabric Specification Specs */}
                <div className="grid grid-cols-2 gap-3.5 bg-brand-sand/10 p-3 border border-brand-sand/20 text-[10px] font-mono">
                  <div className="space-y-0.5">
                    <span className="text-brand-muted uppercase tracking-wider block text-[8px]">Color</span>
                    <span className="text-brand-charcoal font-medium">{product.color}</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-brand-muted uppercase tracking-wider block text-[8px]">Craftsmanship</span>
                    <span className="text-brand-charcoal font-medium">Handloomed Weave</span>
                  </div>
                </div>

                {/* Sizes Toggler block with dynamic shake animation feedback */}
                <motion.div 
                  animate={shakeSize ? { x: [-6, 6, -6, 6, 0] } : {}}
                  transition={{ duration: 0.4 }}
                  className={`space-y-2.5 p-2.5 -m-2.5 rounded transition-all duration-300 ${
                    shakeSize ? 'bg-red-50/60 ring-1 ring-red-200 shadow-xs' : ''
                  }`}
                >
                  <div className="flex justify-between items-baseline">
                    <span className="text-[10px] font-mono tracking-[0.15em] text-brand-charcoal uppercase font-semibold">
                      Select Size {shakeSize && <span className="text-red-700 font-sans normal-case font-normal ml-1.5">&#8212; Size is required</span>}
                    </span>
                    <button 
                      onClick={onOpenSizeAdvisor}
                      className="text-[9.5px] font-mono tracking-wider text-brand-muted hover:text-brand-charcoal underline uppercase cursor-pointer"
                    >
                      Size Advisor
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((sz) => {
                      const isSelected = selectedSize === sz;
                      return (
                        <button
                          key={sz}
                          onClick={() => {
                            setSelectedSize(sz);
                            setShakeSize(false);
                          }}
                          className={`min-w-[42px] h-10 px-3 flex items-center justify-center font-mono text-xs border transition-all duration-300 cursor-pointer ${
                            isSelected
                              ? 'bg-brand-charcoal text-white border-brand-charcoal font-bold'
                              : 'border-brand-sand hover:border-brand-charcoal text-brand-charcoal/80 bg-white/20'
                          }`}
                        >
                          {sz}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>

                {/* Quantity Toggler */}
                <div className="space-y-2.5">
                  <span className="text-[10px] font-mono tracking-[0.15em] text-brand-charcoal uppercase font-semibold block">Quantity</span>
                  <div className="inline-flex items-center border border-brand-sand bg-white/20">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-9 h-9 flex items-center justify-center font-mono text-brand-charcoal hover:bg-brand-sand/20 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-mono text-xs text-brand-charcoal">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-9 h-9 flex items-center justify-center font-mono text-brand-charcoal hover:bg-brand-sand/20 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons Footer block - Always anchored at the bottom */}
              <div className="space-y-3 pt-5 border-t border-brand-sand/30 bg-brand-cream mt-auto shrink-0">
                <div className="flex gap-3">
                  {/* Direct Add to Cart trigger with multi-state loading spinner and text feedback */}
                  <button
                    id="quick-view-add-to-cart"
                    disabled={isAdding}
                    onClick={handleAddToCartClick}
                    className={`flex-grow h-12 flex items-center justify-center space-x-2 text-[10.5px] font-mono tracking-widest uppercase transition-all duration-300 cursor-pointer ${
                      justAdded
                        ? 'bg-emerald-800 text-brand-cream hover:bg-emerald-800'
                        : 'bg-brand-charcoal text-white hover:bg-brand-charcoal/90 active:scale-[0.98]'
                    }`}
                  >
                    {isAdding ? (
                      <span className="flex items-center space-x-2">
                        <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>ADDING TO CLOSET...</span>
                      </span>
                    ) : justAdded ? (
                      <span>✓ GARMENT ADDED!</span>
                    ) : !selectedSize ? (
                      <span>ADD TO BAG</span>
                    ) : (
                      <>
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>ADD TO SHOPPING BAG</span>
                      </>
                    )}
                  </button>

                  {/* Toggle Wishlist button */}
                  <button
                    id="quick-view-wishlist"
                    onClick={() => onToggleWishlist(product)}
                    className={`w-12 h-12 flex items-center justify-center border transition-all duration-300 cursor-pointer ${
                      inWishlist 
                        ? 'border-brand-charcoal bg-white text-red-800' 
                        : 'border-brand-sand bg-white/20 hover:border-brand-charcoal text-brand-charcoal'
                    }`}
                    aria-label="Toggle wishlist selection"
                  >
                    <Heart className={`w-4 h-4 ${inWishlist ? 'fill-red-800' : ''}`} />
                  </button>
                </div>

                {/* Hyperlink View Full Details */}
                <button
                  id="quick-view-view-full-details"
                  onClick={() => onViewFullDetails(product)}
                  className="w-full text-center py-2 text-[10px] font-mono tracking-widest text-brand-charcoal hover:text-brand-muted uppercase transition-colors underline cursor-pointer flex items-center justify-center space-x-1.5"
                >
                  <Maximize2 className="w-3 h-3 text-brand-muted" />
                  <span>View Immersive Detail Page</span>
                </button>
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
