import React, { useState, useEffect, useRef, MouseEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Ruler, 
  Heart, 
  Info, 
  ArrowLeft, 
  Check, 
  ShoppingBag, 
  Star, 
  Plus, 
  Minus, 
  ChevronRight, 
  ChevronLeft, 
  MessageSquare, 
  ThumbsUp, 
  AlertCircle,
  TrendingUp,
  Award,
  Truck,
  Coins,
  RotateCcw,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { Product } from '../types';
import ProductBadge from './ProductBadge';

interface ProductDetailsViewProps {
  product: Product;
  allProducts: Product[];
  onAddToCart: (product: Product, size: string, quantity: number) => void;
  onClose: () => void;
  wishlist: Product[];
  onToggleWishlist: (product: Product) => void;
  onOpenSizeAdvisor: () => void;
  onSelectProduct?: (product: Product) => void;
  recentlyViewed?: Product[];
  onClearRecentlyViewed?: () => void;
}

interface Review {
  id: string;
  author: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  verified: boolean;
  helpfulCount: number;
}

const LOOK_PAIRINGS: Record<string, string[]> = {
  p1: ['p7', 'p4', 'p5'],
  p2: ['p3', 'p4'],
  p3: ['p2', 'p4'],
  p4: ['p7', 'p1', 'p2'],
  p5: ['p1'],
  p6: ['p8', 'p4'],
  p7: ['p4', 'p1', 'p2'],
  p8: ['p6', 'p3'],
};

// Custom curated reviews specific to the artisanal products
const productSpecificReviews: Record<string, Review[]> = {
  p1: [
    {
      id: 'rev-1',
      author: 'Anjali Deshmukh',
      rating: 5,
      title: 'A True Heirloom Duster',
      content: 'This duster is absolutely breathtaking. The slub texture of the Kora Khadi cotton is beautiful, with delicate natural irregularities. I wore it to an gallery opening and received endless compliments. The gold zari selvedges on the inside are a gorgeous secret luxury.',
      date: 'June 18, 2026',
      verified: true,
      helpfulCount: 24
    },
    {
      id: 'rev-2',
      author: 'Vikram Seth',
      rating: 5,
      title: 'Incredible Drape and Architectural Form',
      content: 'As an architect, I appreciate structures that sit perfectly in space. The cocoon silhouette of this duster does exactly that. The fabric has an organic weight that flows beautifully but holds its structural shape. Absolutely recommend.',
      date: 'May 30, 2026',
      verified: true,
      helpfulCount: 15
    },
    {
      id: 'rev-3',
      author: 'Priya Narang',
      rating: 4,
      title: 'Outstanding quality but runs large',
      content: 'The handloom textile quality is impeccable and cool to the skin. It is quite oversized, so if you prefer a slightly trimmer fit, I suggest sizing down. Otherwise, a beautiful masterpiece.',
      date: 'April 14, 2026',
      verified: true,
      helpfulCount: 9
    }
  ],
  p2: [
    {
      id: 'rev-4',
      author: 'Rohan Mehra',
      rating: 5,
      title: 'Perfect Modern Bandhgala',
      content: 'I have been looking for a contemporary Bandhgala that doesn’t feel stuffy. This is it. The natural indigo wash has a beautiful deep mineral navy shade that looks incredible in natural light. The coconut husk buttons add a perfect relaxed luxury feel.',
      date: 'July 2, 2026',
      verified: true,
      helpfulCount: 31
    },
    {
      id: 'rev-5',
      author: 'Arjun Sen',
      rating: 4,
      title: 'Beautiful Linen Quality',
      content: 'The flax linen is dense and has a premium hand-feel. Fits perfectly around the shoulders and neck. Take note that natural indigo does transfer slightly on light shirts during the first wear, but it washed off easily.',
      date: 'June 12, 2026',
      verified: true,
      helpfulCount: 18
    }
  ]
};

const defaultReviews: Review[] = [
  {
    id: 'def-1',
    author: 'Meera Johar',
    rating: 5,
    title: 'Exquisite slow craft',
    content: 'The weave density and finish on this garment are outstanding. It feels incredibly personal, far superior to mass market luxury. True slow fashion.',
    date: 'June 22, 2026',
    verified: true,
    helpfulCount: 12
  },
  {
    id: 'def-2',
    author: 'Sanjay Rao',
    rating: 5,
    title: 'Superb tactile feel',
    content: 'Exceptional texture, drapes beautifully, and sits comfortable all day long. Highly recommend supporting this label.',
    date: 'May 08, 2026',
    verified: true,
    helpfulCount: 8
  }
];

export default function ProductDetailsView({
  product,
  allProducts,
  onAddToCart,
  onClose,
  wishlist,
  onToggleWishlist,
  onOpenSizeAdvisor,
  onSelectProduct,
  recentlyViewed,
  onClearRecentlyViewed
}: ProductDetailsViewProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [isAddedFeedback, setIsAddedFeedback] = useState(false);

  // Zoom magnifier states
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [isZooming, setIsZooming] = useState(false);

  // Sticky add to cart states
  const [showStickyBar, setShowStickyBar] = useState(false);
  const buyButtonRef = useRef<HTMLButtonElement>(null);

  // Dynamic reviews states
  const [reviewsList, setReviewsList] = useState<Review[]>([]);
  const [likedReviews, setLikedReviews] = useState<string[]>([]);
  
  // Custom review form states
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [formRating, setFormRating] = useState(5);
  const [formName, setFormName] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Complete the Look States
  const [lookSizes, setLookSizes] = useState<Record<string, string>>({});
  const [lookAddedFeedback, setLookAddedFeedback] = useState<Record<string, boolean>>({});

  // Initialize and scroll to top when product changes
  useEffect(() => {
    setActiveImageIndex(0);
    setSelectedSize('');
    setQuantity(1);
    setIsAddedFeedback(false);
    setIsReviewFormOpen(false);
    setFormSubmitted(false);
    setFormName('');
    setFormTitle('');
    setFormContent('');
    
    // Reset Complete the Look states
    setLookSizes({});
    setLookAddedFeedback({});
    
    // Load reviews for this specific product or defaults
    const productReviews = productSpecificReviews[product.id] || defaultReviews;
    setReviewsList(productReviews);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product]);

  // Monitor main button visibility to trigger sticky bar
  useEffect(() => {
    const handleScroll = () => {
      if (buyButtonRef.current) {
        const rect = buyButtonRef.current.getBoundingClientRect();
        // Show sticky bar when the main button is scrolled past
        setShowStickyBar(rect.bottom < 0);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  const isProductInWishlist = wishlist.some(w => w.id === product.id);

  // Add to Bag action
  const handleAddToBag = () => {
    if (!selectedSize) return;
    onAddToCart(product, selectedSize, quantity);
    setIsAddedFeedback(true);
    setTimeout(() => {
      setIsAddedFeedback(false);
    }, 2000);
  };

  // Upvote reviews helper
  const handleHelpfulClick = (reviewId: string) => {
    if (likedReviews.includes(reviewId)) return;
    setLikedReviews(prev => [...prev, reviewId]);
    setReviewsList(prev => 
      prev.map(rev => 
        rev.id === reviewId ? { ...rev, helpfulCount: rev.helpfulCount + 1 } : rev
      )
    );
  };

  // Form Submit Handler
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formTitle || !formContent) return;

    const newReview: Review = {
      id: `custom-${Date.now()}`,
      author: formName,
      rating: formRating,
      title: formTitle,
      content: formContent,
      date: 'Today',
      verified: true,
      helpfulCount: 0
    };

    setReviewsList(prev => [newReview, ...prev]);
    setFormSubmitted(true);
    setTimeout(() => {
      setIsReviewFormOpen(false);
      setFormSubmitted(false);
      setFormName('');
      setFormTitle('');
      setFormContent('');
    }, 1500);
  };

  // Related Products Selection
  const relatedProducts = allProducts
    .filter(p => p.id !== product.id && (p.category === product.category || p.isBestseller))
    .slice(0, 4);

  // Complete the Look Products Selection
  const lookPairingIds = LOOK_PAIRINGS[product.id] || [];
  const lookProducts = allProducts.filter(p => lookPairingIds.includes(p.id));

  // Calculate Average Rating dynamically
  const averageRating = reviewsList.length > 0 
    ? (reviewsList.reduce((acc, r) => acc + r.rating, 0) / reviewsList.length).toFixed(1)
    : '4.8';

  const starPercentages = [5, 4, 3, 2, 1].map(stars => {
    if (reviewsList.length === 0) return 80;
    const count = reviewsList.filter(r => r.rating === stars).length;
    return Math.round((count / reviewsList.length) * 100);
  });

  const getExpectedDeliveryRange = () => {
    const today = new Date();
    const minDelivery = new Date(today);
    minDelivery.setDate(today.getDate() + 3);
    const maxDelivery = new Date(today);
    maxDelivery.setDate(today.getDate() + 6);
    
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    const minStr = minDelivery.toLocaleDateString('en-US', options);
    const maxStr = maxDelivery.toLocaleDateString('en-US', options);
    
    return `${minStr} – ${maxStr}`;
  };

  return (
    <div className="bg-brand-cream pt-12 pb-28 md:pb-16">
      {/* Editorial Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-8 flex items-center justify-between">
        <button
          id="product-back-to-shop"
          onClick={onClose}
          className="flex items-center space-x-2 text-xs font-mono tracking-widest text-brand-muted hover:text-brand-charcoal transition-colors cursor-pointer group uppercase"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Collection</span>
        </button>
        <div className="hidden sm:flex items-center space-x-1.5 text-[10px] font-mono tracking-widest text-brand-muted uppercase">
          <span>ATELIER</span>
          <ChevronRight className="w-2.5 h-2.5" />
          <span>{product.category}</span>
          <ChevronRight className="w-2.5 h-2.5" />
          <span className="text-brand-charcoal font-medium">{product.name}</span>
        </div>
      </div>

      {/* Main product core layout */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        
        {/* LEFT COLUMN: INTERACTIVE GALLERY & MULTIPLE IMAGES */}
        <div className="lg:col-span-7 flex flex-col md:flex-row-reverse gap-4">
          
          {/* Main big active image with zoom magnifier effect */}
          <div className="flex-grow aspect-[3/4] bg-brand-sand/15 overflow-hidden relative border border-brand-sand/30 group select-none">
            
            {/* Absolute navigation arrows (faded on desktop hover, visible on mobile) */}
            <div className="absolute inset-y-0 inset-x-3 flex items-center justify-between pointer-events-none z-20">
              <button
                id="gallery-prev-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImageIndex(prev => prev === 0 ? product.images.length - 1 : prev - 1);
                }}
                className="w-10 h-10 rounded-full bg-brand-cream/95 hover:bg-brand-charcoal hover:text-brand-cream text-brand-charcoal border border-brand-sand/30 shadow-md flex items-center justify-center transition-all duration-300 pointer-events-auto cursor-pointer active:scale-90 md:opacity-0 group-hover:opacity-100"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                id="gallery-next-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImageIndex(prev => prev === product.images.length - 1 ? 0 : prev + 1);
                }}
                className="w-10 h-10 rounded-full bg-brand-cream/95 hover:bg-brand-charcoal hover:text-brand-cream text-brand-charcoal border border-brand-sand/30 shadow-md flex items-center justify-center transition-all duration-300 pointer-events-auto cursor-pointer active:scale-90 md:opacity-0 group-hover:opacity-100"
                aria-label="Next image"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile-only Slide Indicator dots */}
            <div className="absolute bottom-4 right-4 flex space-x-1.5 md:hidden z-25 bg-brand-charcoal/40 backdrop-blur-xs px-2.5 py-1.5 rounded-full pointer-events-none">
              {product.images.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    idx === activeImageIndex ? 'bg-brand-cream w-3.5' : 'bg-brand-cream/40'
                  }`}
                />
              ))}
            </div>

            {/* Micro bestseller/new tag */}
            <ProductBadge
              product={product}
              className="absolute top-4 left-4 z-20"
              size="md"
            />

            <div
              id="product-zoom-container"
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsZooming(true)}
              onMouseLeave={() => setIsZooming(false)}
              className="w-full h-full cursor-zoom-in relative overflow-hidden"
            >
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.img
                  key={`${product.id}-${activeImageIndex}`}
                  src={product.images[activeImageIndex]}
                  alt={product.name}
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                    transform: isZooming ? 'scale(2.2)' : 'scale(1)',
                    transition: isZooming ? 'transform-origin 0.1s ease-out, transform 0.15s ease-out' : 'transform-origin 0.3s ease-out, transform 0.3s ease-out'
                  }}
                  className="absolute inset-0 w-full h-full object-cover object-center grayscale-[5%]"
                  referrerPolicy="no-referrer"
                />
              </AnimatePresence>
            </div>

            {/* Hover help tip */}
            <div className="absolute bottom-4 left-4 z-20 bg-brand-charcoal/80 text-brand-cream backdrop-blur-xs text-[8px] font-mono tracking-widest px-2.5 py-1.5 uppercase border border-brand-sand/20 pointer-events-none select-none transition-opacity duration-300 group-hover:opacity-0">
              Hover to magnify craft
            </div>
          </div>

          {/* Thumbnail list row */}
          {product.images.length > 1 && (
            <div className="flex md:flex-col gap-3 shrink-0 justify-start overflow-x-auto md:overflow-y-auto py-1 no-scrollbar">
              {product.images.map((img, idx) => {
                const isActive = idx === activeImageIndex;
                return (
                  <button
                    id={`gallery-thumb-select-${idx}`}
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    onMouseEnter={() => setActiveImageIndex(idx)}
                    className={`w-16 h-20 md:w-20 md:h-24 overflow-hidden border transition-all duration-300 relative cursor-pointer ${
                      isActive ? 'border-brand-charcoal ring-1 ring-brand-charcoal scale-[1.02] shadow-sm' : 'border-brand-sand/60 hover:border-brand-muted bg-brand-sand/10'
                    }`}
                  >
                    <img src={img} alt={`${product.name} thumbnail ${idx}`} className="w-full h-full object-cover" loading="lazy" referrerPolicy="no-referrer" />
                    <div className={`absolute inset-0 bg-brand-charcoal/10 transition-opacity ${isActive ? 'opacity-0' : 'opacity-30 hover:opacity-10'}`} />
                  </button>
                );
              })}
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: CORE PRODUCT DETAILS */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Header block with category, name, ratings, and price */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono tracking-[0.3em] text-brand-muted uppercase font-semibold">{product.category}</span>
              <div className="flex items-center space-x-1">
                <div className="flex space-x-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 text-amber-500 fill-amber-500" />
                  ))}
                </div>
                <span className="text-[10px] font-mono text-brand-charcoal font-semibold">{averageRating}</span>
                <span className="text-[9px] font-mono text-brand-muted underline cursor-pointer" onClick={() => {
                  const el = document.getElementById('customer-reviews-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}>
                  ({reviewsList.length} reviews)
                </span>
              </div>
            </div>

            <h1 className="font-serif text-3xl md:text-4xl font-light text-brand-charcoal tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Price & Color */}
            <div className="flex items-baseline space-x-6 border-b border-brand-sand/50 pb-5">
              <div className="flex items-center space-x-3">
                {product.originalPrice && (
                  <span className="text-lg font-mono text-brand-muted line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                )}
                <span className="text-2xl font-mono font-medium text-brand-charcoal">₹{product.price.toLocaleString('en-IN')}</span>
              </div>
              <span className="text-xs font-mono tracking-wider text-brand-muted border-l border-brand-sand/80 pl-6 uppercase">
                COLOR: <span className="text-brand-charcoal font-semibold">{product.color}</span>
              </span>
            </div>
          </div>

          {/* Sourcing credentials badge line */}
          <div className="flex flex-wrap gap-2 py-1">
            <span className="flex items-center space-x-1 px-2.5 py-1 bg-brand-sand/20 border border-brand-sand/40 text-[8px] font-mono tracking-widest text-brand-charcoal uppercase">
              <Award className="w-3 h-3 text-brand-muted" />
              <span>Artisanal Handloom</span>
            </span>
            <span className="flex items-center space-x-1 px-2.5 py-1 bg-brand-sand/20 border border-brand-sand/40 text-[8px] font-mono tracking-widest text-brand-charcoal uppercase">
              <TrendingUp className="w-3 h-3 text-brand-muted" />
              <span>Carbon Neutral Fiber</span>
            </span>
            <span className="flex items-center space-x-1 px-2.5 py-1 bg-brand-sand/20 border border-brand-sand/40 text-[8px] font-mono tracking-widest text-brand-charcoal uppercase">
              <span>Fair Trade Certified</span>
            </span>
          </div>

          {/* High level descriptions */}
          <div className="space-y-4">
            <p className="text-xs text-brand-charcoal leading-relaxed font-light font-sans">
              {product.description}
            </p>
            <p className="text-xs text-brand-muted leading-relaxed font-light font-sans italic border-l-2 border-brand-sand/80 pl-4">
              {product.longDescription}
            </p>
          </div>

          {/* Size Selector with Advisor */}
          <div className="space-y-3.5 pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-[10px] tracking-widest text-brand-muted uppercase font-semibold">SELECT SIZE:</span>
              <button
                id="details-size-advisor-btn"
                onClick={onOpenSizeAdvisor}
                className="font-medium tracking-wide text-brand-charcoal hover:text-brand-muted transition-colors underline flex items-center space-x-1 text-xs cursor-pointer"
              >
                <Ruler className="w-3 h-3 text-brand-muted" />
                <span>ATELIER SIZE ADVISOR</span>
              </button>
            </div>
            
            <div className="flex gap-2.5">
              {product.sizes.map((sz) => {
                const isSelected = sz === selectedSize;
                return (
                  <motion.button
                    id={`details-size-select-${sz}`}
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    className={`w-12 h-12 flex items-center justify-center font-mono text-xs border transition-colors duration-300 cursor-pointer ${
                      isSelected
                        ? 'bg-brand-charcoal text-white border-brand-charcoal font-bold shadow-md'
                        : 'border-brand-sand/85 hover:border-brand-charcoal text-brand-charcoal bg-brand-cream/30'
                    }`}
                  >
                    {sz}
                  </motion.button>
                );
              })}
            </div>
            {/* Dynamic Stock & Premium Delivery Information Panel */}
            <div className="mt-5 bg-brand-sand/10 border border-brand-sand/35 p-4 space-y-3.5 shadow-xs">
              {/* Stock Level */}
              <div className="flex items-start space-x-2.5">
                {product.isLowStock ? (
                  <AlertCircle className="w-4 h-4 text-[#8C3A3A] shrink-0 mt-0.5 stroke-[1.75]" />
                ) : (
                  <Check className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5 stroke-[2]" />
                )}
                <div className="space-y-0.5">
                  <h6 className="text-[10px] font-mono tracking-wider font-semibold uppercase leading-none text-brand-charcoal">
                    {product.isLowStock ? "LIMITED ARCHIVE QUANTITY" : "IN STOCK & DISPATCH READY"}
                  </h6>
                  <p className="text-[11px] text-brand-muted font-light leading-relaxed">
                    {product.isLowStock ? (
                      <>Only <span className="text-[#8C3A3A] font-semibold font-mono">{(product.id.charCodeAt(product.id.length - 1) % 3) + 2} pieces left</span> in our Jaipur studio. Fabric replenishment is not planned.</>
                    ) : (
                      <>Hand-loomed and prepared for immediate dispatch from our studio hubs.</>
                    )}
                  </p>
                </div>
              </div>

              {/* Delivery Date Estimation */}
              <div className="flex items-start space-x-2.5 border-t border-brand-sand/25 pt-3">
                <Calendar className="w-4 h-4 text-brand-charcoal shrink-0 mt-0.5 stroke-[1.5]" />
                <div className="space-y-0.5">
                  <h6 className="text-[10px] font-mono tracking-wider font-semibold uppercase leading-none text-brand-charcoal">
                    EXPECTED DELIVERY
                  </h6>
                  <p className="text-[11px] text-brand-muted font-light leading-relaxed">
                    Get it by <span className="text-brand-charcoal font-semibold font-mono">{getExpectedDeliveryRange()}</span>. Complete tracking logs sent via WhatsApp & Email.
                  </p>
                </div>
              </div>

              {/* Shipping Info */}
              <div className="flex items-start space-x-2.5 border-t border-brand-sand/25 pt-3">
                <Truck className="w-4 h-4 text-brand-charcoal shrink-0 mt-0.5 stroke-[1.5]" />
                <div className="space-y-0.5">
                  <h6 className="text-[10px] font-mono tracking-wider font-semibold uppercase leading-none text-brand-charcoal">
                    FREE SHIPPING ACROSS INDIA
                  </h6>
                  <p className="text-[11px] text-brand-muted font-light leading-relaxed">
                    Complimentary tracked premium shipping with hassle-free 7-day reverse pickups.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="space-y-3 pt-1">
            <span className="font-mono text-[10px] tracking-widest text-brand-muted uppercase font-semibold block">QUANTITY:</span>
            <div className="flex items-center space-x-4">
              <div className="flex items-center border border-brand-sand/80 bg-brand-cream/40">
                <button
                  id="qty-decrement"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="px-3.5 py-2.5 hover:bg-brand-sand/20 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3 h-3 text-brand-charcoal" />
                </button>
                <span className="w-10 text-center font-mono text-xs text-brand-charcoal font-medium">
                  {quantity}
                </span>
                <button
                  id="qty-increment"
                  onClick={() => setQuantity(prev => prev + 1)}
                  className="px-3.5 py-2.5 hover:bg-brand-sand/20 transition-colors cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3 h-3 text-brand-charcoal" />
                </button>
              </div>
            </div>
          </div>

          {/* Action buttons (Add to Bag & Wishlist) */}
          <div className="space-y-4 pt-4 border-t border-brand-sand/45">
            <div className="flex gap-4">
              <motion.button
                id="details-add-to-cart"
                ref={buyButtonRef}
                onClick={handleAddToBag}
                disabled={!selectedSize}
                whileHover={selectedSize ? { scale: 1.02 } : {}}
                whileTap={selectedSize ? { scale: 0.98 } : {}}
                className={`flex-grow py-4.5 text-xs font-semibold tracking-[0.2em] uppercase transition-all flex items-center justify-center space-x-3 shadow-md cursor-pointer ${
                  !selectedSize
                    ? 'bg-brand-sand text-brand-charcoal/40 cursor-not-allowed'
                    : isAddedFeedback
                    ? 'bg-emerald-800 text-white'
                    : 'bg-brand-charcoal hover:bg-brand-charcoal/90 text-white hover:-translate-y-0.5'
                }`}
              >
                {isAddedFeedback ? (
                  <>
                    <Check className="w-4 h-4 animate-bounce" />
                    <span>ADDED TO BAG</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>{selectedSize ? `ADD TO BAG` : `SELECT SIZE TO BAG`}</span>
                  </>
                )}
              </motion.button>

              <motion.button
                id="details-toggle-wishlist"
                onClick={() => onToggleWishlist(product)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`px-5 py-4 border border-brand-sand hover:border-brand-charcoal flex items-center justify-center transition-colors bg-brand-cream/20 shadow-xs cursor-pointer`}
                aria-label="Toggle Wishlist"
              >
                <motion.div
                  key={isProductInWishlist ? 'liked' : 'unliked'}
                  initial={{ scale: 0.7 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 11, stiffness: 320 }}
                >
                  <Heart className={`w-4 h-4 ${isProductInWishlist ? 'fill-red-800 text-red-800' : 'text-brand-charcoal'}`} />
                </motion.div>
              </motion.button>
            </div>

            {/* Indian Shopper Trust Badges */}
            <div className="grid grid-cols-2 gap-3.5 pt-6 pb-2 border-t border-brand-sand/40">
              <div className="flex items-center space-x-2.5 bg-brand-sand/10 border border-brand-sand/30 p-2.5">
                <div className="p-1.5 bg-brand-cream border border-brand-sand/40 rounded-none text-brand-charcoal">
                  <Truck className="w-4 h-4 stroke-[1.5]" />
                </div>
                <div>
                  <h5 className="text-[10px] font-mono tracking-wider font-semibold text-brand-charcoal uppercase leading-none">Free Shipping</h5>
                  <p className="text-[8.5px] text-brand-muted font-light leading-none mt-1">Express Delivery Across India</p>
                </div>
              </div>
              <div className="flex items-center space-x-2.5 bg-brand-sand/10 border border-brand-sand/30 p-2.5">
                <div className="p-1.5 bg-brand-cream border border-brand-sand/40 rounded-none text-brand-charcoal">
                  <Coins className="w-4 h-4 stroke-[1.5]" />
                </div>
                <div>
                  <h5 className="text-[10px] font-mono tracking-wider font-semibold text-brand-charcoal uppercase leading-none">Cash on Delivery</h5>
                  <p className="text-[8.5px] text-brand-muted font-light leading-none mt-1">Doorstep COD Available</p>
                </div>
              </div>
              <div className="flex items-center space-x-2.5 bg-brand-sand/10 border border-brand-sand/30 p-2.5">
                <div className="p-1.5 bg-brand-cream border border-brand-sand/40 rounded-none text-brand-charcoal">
                  <RotateCcw className="w-4 h-4 stroke-[1.5]" />
                </div>
                <div>
                  <h5 className="text-[10px] font-mono tracking-wider font-semibold text-brand-charcoal uppercase leading-none">Easy Returns</h5>
                  <p className="text-[8.5px] text-brand-muted font-light leading-none mt-1">14-Day Doorstep Pickup</p>
                </div>
              </div>
              <div className="flex items-center space-x-2.5 bg-brand-sand/10 border border-brand-sand/30 p-2.5">
                <div className="p-1.5 bg-brand-cream border border-brand-sand/40 rounded-none text-brand-charcoal">
                  <ShieldCheck className="w-4 h-4 stroke-[1.5]" />
                </div>
                <div>
                  <h5 className="text-[10px] font-mono tracking-wider font-semibold text-brand-charcoal uppercase leading-none">WhatsApp Order</h5>
                  <p className="text-[8.5px] text-brand-muted font-light leading-none mt-1">Direct Checkout Support</p>
                </div>
              </div>
            </div>
          </div>

          {/* Composition Specs & Care Accordion list */}
          <div className="border-t border-brand-sand/50 pt-6 space-y-6">
            
            {/* Composition Specs */}
            <div className="space-y-3">
              <span className="font-mono text-[10px] tracking-widest text-brand-muted uppercase font-semibold block">COMPOSITION & TAILORING DETAILS:</span>
              <ul className="text-xs text-brand-muted space-y-2 font-light list-disc list-inside">
                {product.details.map((detail, idx) => (
                  <li key={idx} className="leading-relaxed">{detail}</li>
                ))}
              </ul>
            </div>

            {/* Care instructions */}
            <div className="bg-brand-sand/10 border border-brand-sand/30 p-4.5 space-y-2.5">
              <div className="flex items-center space-x-2 text-brand-muted">
                <Info className="w-4 h-4" />
                <span className="font-mono text-[9px] tracking-widest uppercase font-semibold">CARE RECOMMENDATION:</span>
              </div>
              <p className="text-[11px] text-brand-muted font-light leading-relaxed italic">
                {product.careInstructions}
              </p>
            </div>

          </div>

        </div>

      </section>

      {/* COMPLETE THE LOOK SECTION */}
      {lookProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 md:px-12 py-20 border-t border-brand-sand/30 mt-12 bg-brand-cream">
          <div className="space-y-2 mb-10 text-center md:text-left">
            <p className="text-[10px] font-mono tracking-[0.3em] text-brand-muted uppercase">STYLING DIRECTIVE</p>
            <h2 className="font-serif text-2xl md:text-3xl font-light text-brand-charcoal tracking-tight">Complete the Look</h2>
            <p className="text-xs text-brand-muted font-light max-w-xl">
              Coordinated outfits hand-picked by our designers to perfectly match and style with the <span className="font-semibold text-brand-charcoal">{product.name}</span>.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Anchor: Selected Product Hero */}
            <div className="lg:col-span-4 bg-brand-sand/10 border border-brand-sand/25 p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-[9px] font-mono tracking-widest text-brand-muted uppercase bg-brand-cream border border-brand-sand/40 px-2 py-1 inline-block">
                  YOUR SELECTION
                </span>
                <div className="aspect-[3/4] overflow-hidden border border-brand-sand/20 relative">
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover grayscale-[3%]" />
                  <ProductBadge product={product} className="absolute top-3 left-3" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif text-lg font-light text-brand-charcoal">{product.name}</h3>
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-brand-muted">{product.color}</span>
                    <span className="font-bold text-brand-charcoal">₹{product.price.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-brand-sand/30 text-center">
                <p className="text-[10px] font-mono text-brand-muted uppercase leading-relaxed">
                  Combine with the complementary pieces on the right to unlock our <span className="font-bold text-brand-charcoal">complimentary luxury packaging</span>.
                </p>
              </div>
            </div>

            {/* Right Matching Garments Grid */}
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {lookProducts.map((lookProduct) => {
                const selectedLookSize = lookSizes[lookProduct.id] || '';
                const isLookAdded = lookAddedFeedback[lookProduct.id] || false;
                
                return (
                  <div key={lookProduct.id} className="border border-brand-sand/25 bg-brand-cream p-5 flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow duration-300">
                    <div className="flex gap-4">
                      {/* Image thumbnail click to view */}
                      <div 
                        onClick={() => {
                          if (onSelectProduct) {
                            onSelectProduct(lookProduct);
                          } else {
                            window.dispatchEvent(new CustomEvent('swap-active-product', { detail: lookProduct }));
                          }
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="w-24 h-32 shrink-0 bg-brand-sand/15 overflow-hidden border border-brand-sand/20 cursor-pointer relative group"
                      >
                        <img src={lookProduct.images[0]} alt={lookProduct.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-brand-charcoal/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="bg-brand-cream/90 text-[8px] font-mono tracking-widest text-brand-charcoal px-2 py-1 uppercase border border-brand-sand/30">
                            VIEW
                          </span>
                        </div>
                      </div>

                      {/* Info & Price */}
                      <div className="flex-grow flex flex-col justify-between py-1">
                        <div>
                          <span className="text-[8px] font-mono text-brand-muted uppercase tracking-wider block">{lookProduct.category}</span>
                          <h4 
                            onClick={() => {
                              if (onSelectProduct) {
                                onSelectProduct(lookProduct);
                              } else {
                                window.dispatchEvent(new CustomEvent('swap-active-product', { detail: lookProduct }));
                              }
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="font-serif text-sm font-semibold text-brand-charcoal mt-1 hover:text-brand-muted cursor-pointer transition-colors line-clamp-2"
                          >
                            {lookProduct.name}
                          </h4>
                          <p className="text-[10px] font-mono text-brand-muted uppercase mt-0.5">{lookProduct.color}</p>
                        </div>
                        
                        <div className="flex items-baseline space-x-2">
                          <span className="font-mono text-xs font-bold text-brand-charcoal">₹{lookProduct.price.toLocaleString('en-IN')}</span>
                          {lookProduct.originalPrice && (
                            <span className="font-mono text-[10px] text-brand-muted line-through">₹{lookProduct.originalPrice.toLocaleString('en-IN')}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Sizing & Quick Add Actions */}
                    <div className="space-y-3 pt-2 border-t border-brand-sand/30">
                      <div className="flex items-center justify-between text-[9px] font-mono text-brand-muted">
                        <span>SELECT SIZE FOR THE LOOK:</span>
                        {selectedLookSize && <span className="text-brand-charcoal font-bold">SIZE {selectedLookSize}</span>}
                      </div>
                      
                      {/* Size buttons */}
                      <div className="flex flex-wrap gap-1.5">
                        {lookProduct.sizes.map((sz) => {
                          const isSelected = selectedLookSize === sz;
                          return (
                            <button
                              id={`look-size-select-${lookProduct.id}-${sz}`}
                              key={sz}
                              onClick={() => setLookSizes(prev => ({ ...prev, [lookProduct.id]: sz }))}
                              className={`h-8 px-2.5 flex items-center justify-center font-mono text-[10px] border transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-brand-charcoal text-white border-brand-charcoal font-bold'
                                  : 'border-brand-sand/60 text-brand-charcoal hover:border-brand-charcoal'
                              }`}
                            >
                              {sz}
                            </button>
                          );
                        })}
                      </div>

                      {/* Add to Bag button */}
                      <button
                        id={`look-add-to-cart-${lookProduct.id}`}
                        disabled={!selectedLookSize}
                        onClick={() => {
                          onAddToCart(lookProduct, selectedLookSize, 1);
                          setLookAddedFeedback(prev => ({ ...prev, [lookProduct.id]: true }));
                          setTimeout(() => {
                            setLookAddedFeedback(prev => ({ ...prev, [lookProduct.id]: false }));
                          }, 2000);
                        }}
                        className={`w-full py-2.5 text-[9px] font-mono tracking-widest uppercase transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                          !selectedLookSize
                            ? 'bg-brand-sand/40 text-brand-charcoal/40 cursor-not-allowed border border-brand-sand/30'
                            : isLookAdded
                            ? 'bg-emerald-800 text-white border border-emerald-800'
                            : 'bg-brand-charcoal hover:bg-brand-charcoal/90 text-white border border-brand-charcoal'
                        }`}
                      >
                        {isLookAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5 animate-bounce" />
                            <span>ADDED TO BAG</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>{selectedLookSize ? 'ADD PIECE TO LOOK' : 'SELECT SIZE TO ADD'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* DETAILED INTERACTIVE REVIEWS SECTION */}
      <section id="customer-reviews-section" className="max-w-7xl mx-auto px-6 md:px-12 py-24 border-t border-brand-sand/30 mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Review Summary Breakdown Column */}
          <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-32">
            <div className="space-y-3">
              <p className="text-[10px] font-mono tracking-[0.3em] text-brand-muted uppercase">VERIFIED RATINGS</p>
              <h2 className="font-serif text-3xl font-light text-brand-charcoal tracking-tight">Patron Reviews</h2>
            </div>

            {/* Huge Average Star Rating */}
            <div className="flex items-center space-x-5">
              <span className="font-serif text-5xl font-light text-brand-charcoal">{averageRating}</span>
              <div>
                <div className="flex space-x-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4.5 h-4.5 text-amber-500 fill-amber-500" />
                  ))}
                </div>
                <p className="text-[10px] font-mono text-brand-muted tracking-wide mt-1">Based on {reviewsList.length} verified drapes</p>
              </div>
            </div>

            {/* Star Distribution Progress Bars */}
            <div className="space-y-3 border-t border-b border-brand-sand/40 py-6">
              {[5, 4, 3, 2, 1].map((stars, idx) => {
                const pct = starPercentages[idx];
                return (
                  <div key={stars} className="flex items-center text-xs text-brand-muted font-mono">
                    <span className="w-12 text-left">{stars} Stars</span>
                    <div className="flex-grow h-1.5 bg-brand-sand/30 overflow-hidden mx-3">
                      <div className="h-full bg-brand-charcoal/70 transition-all duration-500" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="w-8 text-right text-[10px]">{pct}%</span>
                  </div>
                );
              })}
            </div>

            {/* Trigger Write a Review button */}
            <div className="space-y-2">
              <h4 className="text-xs font-serif font-light text-brand-charcoal">Have you tried this garment?</h4>
              <p className="text-[11px] text-brand-muted leading-relaxed font-light">Share your honest feedback on the comfort, fabric quality, and fit.</p>
              <button
                id="write-review-btn"
                onClick={() => setIsReviewFormOpen(!isReviewFormOpen)}
                className="w-full flex items-center justify-center space-x-2 py-3 border border-brand-charcoal/60 hover:border-brand-charcoal hover:bg-brand-charcoal hover:text-white text-brand-charcoal text-[10px] font-mono tracking-widest uppercase transition-all cursor-pointer rounded-none font-semibold"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{isReviewFormOpen ? "Cancel Review" : "Write A Review"}</span>
              </button>
            </div>
          </div>

          {/* Active Reviews & Review Submission Form Column */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Inline Review Form (AnimatePresence) */}
            <AnimatePresence>
              {isReviewFormOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-brand-sand/15 border border-brand-sand/40 p-6 overflow-hidden"
                >
                  {!formSubmitted ? (
                    <form onSubmit={handleReviewSubmit} className="space-y-5">
                      <h3 className="font-serif text-lg text-brand-charcoal font-light">Submit Your Patron Log</h3>
                      
                      {/* Rating selection stars */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-mono text-brand-muted tracking-wider block font-semibold">Tactile Star Rating:</label>
                        <div className="flex space-x-1.5">
                          {[1, 2, 3, 4, 5].map((starVal) => (
                            <button
                              id={`form-star-select-${starVal}`}
                              key={starVal}
                              type="button"
                              onClick={() => setFormRating(starVal)}
                              className="p-1 cursor-pointer transition-transform hover:scale-110 focus:outline-none"
                            >
                              <Star className={`w-6 h-6 ${starVal <= formRating ? 'text-amber-500 fill-amber-500' : 'text-brand-sand/60'}`} />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Name & Title */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-brand-muted tracking-wider uppercase block font-semibold">Your Name:</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Priya Iyer"
                            value={formName}
                            onChange={(e) => setFormName(e.target.value)}
                            className="w-full bg-brand-cream border border-brand-sand focus:border-brand-charcoal text-brand-charcoal px-3 py-2.5 text-xs tracking-wider placeholder-brand-muted/40 focus:outline-none transition-all rounded-none font-mono"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-brand-muted tracking-wider uppercase block font-semibold">Review Title:</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Exceptional drape finish"
                            value={formTitle}
                            onChange={(e) => setFormTitle(e.target.value)}
                            className="w-full bg-brand-cream border border-brand-sand focus:border-brand-charcoal text-brand-charcoal px-3 py-2.5 text-xs tracking-wider placeholder-brand-muted/40 focus:outline-none transition-all rounded-none font-mono"
                          />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-brand-muted tracking-wider uppercase block font-semibold">Your honest experience:</label>
                        <textarea
                          required
                          rows={4}
                          placeholder="Tell patrons about weight, alignment, fiber character, and care comfort..."
                          value={formContent}
                          onChange={(e) => setFormContent(e.target.value)}
                          className="w-full bg-brand-cream border border-brand-sand focus:border-brand-charcoal text-brand-charcoal p-3 text-xs tracking-wider placeholder-brand-muted/40 focus:outline-none transition-all rounded-none"
                        />
                      </div>

                      <button
                        type="submit"
                        id="form-review-submit-button"
                        className="bg-brand-charcoal hover:bg-brand-charcoal/90 text-white font-mono text-[10px] tracking-widest px-6 py-3 uppercase shadow-md font-semibold cursor-pointer"
                      >
                        Publish Review
                      </button>
                    </form>
                  ) : (
                    <div className="py-8 flex flex-col items-center justify-center space-y-3 text-center">
                      <div className="p-3 bg-brand-charcoal text-brand-cream rounded-full">
                        <Check className="w-5 h-5 animate-pulse" />
                      </div>
                      <h4 className="font-serif text-lg font-light text-brand-charcoal">Review Published Successfully</h4>
                      <p className="text-[11px] text-brand-muted font-mono">Thank you for contributing to the Atelier heritage archives.</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* List of customer reviews */}
            <div className="space-y-6 divide-y divide-brand-sand/50">
              {reviewsList.map((rev, idx) => {
                const isLiked = likedReviews.includes(rev.id);
                return (
                  <div key={rev.id} className={`pt-6 ${idx === 0 ? 'pt-0' : ''} space-y-3`}>
                    
                    {/* Stars and verified indicator */}
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'text-amber-500 fill-amber-500' : 'text-brand-sand/40'}`} />
                        ))}
                      </div>
                      <div className="flex items-center space-x-2 text-[9px] font-mono text-brand-muted uppercase">
                        {rev.verified && (
                          <span className="flex items-center space-x-1 text-emerald-800 bg-emerald-800/10 px-2 py-0.5 border border-emerald-800/20 font-bold">
                            <Check className="w-2.5 h-2.5" />
                            <span>VERIFIED PATRON</span>
                          </span>
                        )}
                        <span>{rev.date}</span>
                      </div>
                    </div>

                    {/* Author & Title */}
                    <div className="space-y-1">
                      <h4 className="font-serif text-base font-semibold text-brand-charcoal tracking-wide">{rev.title}</h4>
                      <p className="text-[10px] font-mono text-brand-muted uppercase tracking-wider">{rev.author}</p>
                    </div>

                    {/* Content */}
                    <p className="text-xs text-brand-muted leading-relaxed font-light">{rev.content}</p>

                    {/* Helpful upvote button */}
                    <div className="pt-2 flex items-center space-x-3 text-[10px] font-mono text-brand-muted">
                      <span>Was this tactile description helpful?</span>
                      <button
                        id={`review-upvote-${rev.id}`}
                        onClick={() => handleHelpfulClick(rev.id)}
                        disabled={isLiked}
                        className={`flex items-center space-x-1 px-2 py-1 border border-brand-sand/60 hover:border-brand-charcoal transition-colors cursor-pointer ${
                          isLiked ? 'bg-brand-sand/40 text-brand-charcoal font-semibold border-brand-charcoal' : 'bg-transparent hover:bg-brand-sand/10'
                        }`}
                      >
                        <ThumbsUp className="w-3 h-3" />
                        <span>({rev.helpfulCount})</span>
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>

        </div>
      </section>

      {/* RELATED RECOMMENDATIONS SECTION */}
      {relatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 md:px-12 py-20 border-t border-brand-sand/30 mt-16">
          <div className="space-y-2 mb-12 text-center md:text-left">
            <p className="text-[10px] font-mono tracking-[0.3em] text-brand-muted uppercase">CURATED ALIGNMENTS</p>
            <h2 className="font-serif text-2xl md:text-3xl font-light text-brand-charcoal tracking-tight">You May Also Like</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
            {relatedProducts.map((relProduct) => (
              <div 
                key={relProduct.id} 
                onClick={() => {
                  // Navigate to this product's details page directly
                  setActiveImageIndex(0);
                  setSelectedSize('');
                  setQuantity(1);
                  setIsAddedFeedback(false);
                  
                  if (onSelectProduct) {
                    onSelectProduct(relProduct);
                  } else {
                    window.dispatchEvent(new CustomEvent('swap-active-product', { detail: relProduct }));
                  }
                  
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group cursor-pointer flex flex-col justify-between space-y-3.5 select-none"
              >
                {/* Image Container with Double Image Cross-fade and Zoom Hover Animation */}
                <div className="relative aspect-[3/4] bg-brand-sand/15 overflow-hidden border border-brand-sand/20">
                  {/* Primary Image */}
                  <img
                    src={relProduct.images[0]}
                    alt={relProduct.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 grayscale-[2%]"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Secondary Image for smooth Hover Cross-fade if available */}
                  {relProduct.images[1] && (
                    <img
                      src={relProduct.images[1]}
                      alt={`${relProduct.name} alt`}
                      className="absolute inset-0 w-full h-full object-cover transition-all duration-750 ease-in-out opacity-0 group-hover:opacity-100 group-hover:scale-105 grayscale-[2%]"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  )}

                  {/* Subtle blend overlay on hover */}
                  <div className="absolute inset-0 bg-brand-charcoal/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none mix-blend-multiply" />

                  {/* Slide up label on hover */}
                  <div className="absolute bottom-3 left-3 right-3 bg-brand-cream/95 backdrop-blur-xs py-2.5 text-center border border-brand-sand/40 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500 ease-out z-20">
                    <span className="font-mono text-[9px] tracking-widest text-brand-charcoal uppercase font-semibold">VIEW ARTICLE</span>
                  </div>

                  <ProductBadge
                    product={relProduct}
                    className="absolute top-3 left-3 z-10"
                  />
                </div>
                
                {/* Product Meta Info with modern alignments */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between items-center text-[9px] font-mono text-brand-muted uppercase tracking-wider">
                    <span>{relProduct.category}</span>
                    <div className="flex items-center space-x-1.5">
                      {relProduct.originalPrice && (
                        <span className="text-brand-muted line-through">₹{relProduct.originalPrice.toLocaleString('en-IN')}</span>
                      )}
                      <span className="font-bold text-brand-charcoal text-[10px]">₹{relProduct.price.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                  <h3 className="text-xs md:text-[13px] font-serif font-light text-brand-charcoal group-hover:text-brand-muted transition-colors truncate leading-normal">
                    {relProduct.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* RECENTLY VIEWED SECTION */}
      {(() => {
        const displayedRecent = (recentlyViewed || []).filter((p) => p.id !== product.id);
        if (displayedRecent.length === 0) return null;
        return (
          <section className="max-w-7xl mx-auto px-6 md:px-12 py-16 border-t border-brand-sand/30 mt-6 mb-12">
            <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 mb-10">
              <div className="space-y-2 text-center sm:text-left">
                <p className="text-[10px] font-mono tracking-[0.3em] text-brand-muted uppercase">YOUR EXPLORATION JOURNEY</p>
                <h2 className="font-serif text-2xl md:text-3xl font-light text-brand-charcoal tracking-tight">Recently Viewed Pieces</h2>
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

            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
              {displayedRecent.map((recentItem) => (
                <div 
                  key={recentItem.id} 
                  onClick={() => {
                    setActiveImageIndex(0);
                    setSelectedSize('');
                    setQuantity(1);
                    setIsAddedFeedback(false);

                    if (onSelectProduct) {
                      onSelectProduct(recentItem);
                    }
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="group cursor-pointer flex flex-col justify-between space-y-3.5 select-none"
                >
                  <div className="relative aspect-[3/4] bg-brand-sand/15 overflow-hidden border border-brand-sand/20">
                    <img
                      src={recentItem.images[0]}
                      alt={recentItem.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 grayscale-[2%]"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    {recentItem.images[1] && (
                      <img
                        src={recentItem.images[1]}
                        alt={`${recentItem.name} alt`}
                        className="absolute inset-0 w-full h-full object-cover transition-all duration-750 ease-in-out opacity-0 group-hover:opacity-100 group-hover:scale-105 grayscale-[2%]"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                    )}
                    <div className="absolute inset-0 bg-brand-charcoal/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none mix-blend-multiply" />
                    
                    <div className="absolute bottom-3 left-3 right-3 bg-brand-cream/95 backdrop-blur-xs py-2.5 text-center border border-brand-sand/40 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500 ease-out z-20">
                      <span className="font-mono text-[9px] tracking-widest text-brand-charcoal uppercase font-semibold">VIEW DETAILS</span>
                    </div>

                    <ProductBadge
                      product={recentItem}
                      className="absolute top-3 left-3 z-10"
                    />
                  </div>
                  
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between items-center text-[9px] font-mono text-brand-muted uppercase tracking-wider">
                      <span>{recentItem.category}</span>
                      <span className="font-bold text-brand-charcoal text-[10px]">₹{recentItem.price.toLocaleString('en-IN')}</span>
                    </div>
                    <h3 className="text-xs md:text-[13px] font-serif font-light text-brand-charcoal group-hover:text-brand-muted transition-colors truncate leading-normal">
                      {recentItem.name}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })()}

      {/* STICKY ADD TO BAG BOTTOM BAR (Visible when main Add To Cart scrolls out of viewport) */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed bottom-16 md:bottom-0 inset-x-0 bg-brand-cream border-t border-brand-sand/70 shadow-2xl py-3.5 px-4 md:py-4.5 md:px-6 z-40 lg:px-12 flex items-center justify-between gap-2.5 md:gap-4 max-w-7xl mx-auto"
          >
            {/* Left side: Thumbnail + Title */}
            <div className="flex items-center space-x-3 shrink-0">
              <img src={product.images[0]} alt={product.name} className="w-10 h-13 object-cover border border-brand-sand bg-brand-sand/10" loading="lazy" referrerPolicy="no-referrer" />
              <div className="hidden sm:block text-left">
                <h4 className="font-serif text-sm font-semibold text-brand-charcoal line-clamp-1">{product.name}</h4>
                <p className="text-[10px] font-mono text-brand-muted">
                  {product.color} <span className="text-brand-sand">•</span>{' '}
                  {product.originalPrice && <span className="line-through mr-1">₹{product.originalPrice.toLocaleString('en-IN')}</span>}
                  <span className="font-semibold text-brand-charcoal">₹{product.price.toLocaleString('en-IN')}</span>
                </p>
              </div>
            </div>

            {/* Right side: Selected size indicator & quick purchase */}
            <div className="flex items-center space-x-2.5 w-full sm:w-auto justify-end">
              
              {/* Quick Size selection inside sticky bar */}
              <div className="flex items-center space-x-1.5 shrink-0">
                <span className="hidden md:inline font-mono text-[9px] text-brand-muted uppercase">SIZE:</span>
                <select
                  id="sticky-size-selector"
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="bg-brand-cream border border-brand-sand px-3 py-2.5 text-xs font-mono text-brand-charcoal cursor-pointer focus:outline-none focus:border-brand-charcoal rounded-none min-h-[44px] min-w-[70px] touch-manipulation"
                >
                  <option value="">SIZE</option>
                  {product.sizes.map(sz => (
                    <option key={sz} value={sz}>{sz}</option>
                  ))}
                </select>
              </div>

              {/* Add To Cart button */}
              <button
                id="sticky-add-to-cart-btn"
                onClick={handleAddToBag}
                disabled={!selectedSize}
                className={`py-3 px-4 md:px-10 text-[10px] font-semibold tracking-[0.2em] uppercase transition-all flex items-center justify-center space-x-2 shadow-md cursor-pointer min-h-[44px] flex-grow sm:flex-grow-0 justify-center text-center ${
                  !selectedSize
                    ? 'bg-brand-sand text-brand-charcoal/40 cursor-not-allowed'
                    : isAddedFeedback
                    ? 'bg-emerald-800 text-white'
                    : 'bg-brand-charcoal hover:bg-brand-charcoal/90 text-white'
                }`}
              >
                {isAddedFeedback ? (
                  <>
                    <Check className="w-3.5 h-3.5 animate-bounce" />
                    <span>ADDED</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                    <span>{selectedSize ? `ADD` : `SELECT SIZE`}</span>
                  </>
                )}
              </button>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
