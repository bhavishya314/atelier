import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Crown, Star, ChevronLeft, ChevronRight, Quote, Check, Mail, Truck, Coins, RotateCcw, ShieldCheck, Compass, Feather, Sparkles, Heart, RefreshCw, Users, Plus, ShoppingBag, MapPin } from 'lucide-react';
import { Product } from '../types';
import { products as allProducts } from '../data/products';
import { lookbookItems } from '../data/lookbook';
import ProductBadge from './ProductBadge';
import LifestyleGallery from './LifestyleGallery';
import BrandCommitments from './BrandCommitments';

// Luxury, heritage-infused editorial slides capturing regional Indian traditions
const HERO_SLIDES = [
  {
    id: 'p1', // Kora Khadi Cocoon Duster
    chapter: 'CHAPTER I / KORA KHADI',
    headline: 'Modern Heritage. Spun for Daily Luxury.',
    poetry: 'A quiet statement of modern minimalism.',
    description: 'Discover timeless silhouettes crafted from organic handspun Khadi cotton. Designed for effortless confidence and daily elegance.',
    image: allProducts.find(p => p.id === 'p1')?.images[0] || 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1600&q=90',
    specs: {
      fiber: '100% Ambar Charkha Khadi',
      loom: 'Artisanal Throw-shuttle Pitloom',
      origin: 'Maheshwar, Madhya Pradesh',
    },
    ctaLabel: 'Shop Kora Duster',
    color: 'Kora Alabaster'
  },
  {
    id: 'p2', // Bandhgala Indigo Linen Blazer
    chapter: 'CHAPTER II / BOTANICAL INDIGO',
    headline: 'Classic Lines. Tailored for Every Occasion.',
    poetry: 'Natural pigments met with structural refinement.',
    description: 'A sharp, structured blazer crafted from pure organic flax linen and dyed with natural indigo. Made for timeless versatility.',
    image: allProducts.find(p => p.id === 'p2')?.images[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1600&q=90',
    specs: {
      fiber: '100% Organic Indigo Flax Linen',
      loom: 'Traditional Hand-loom Weave',
      origin: 'Bhagalpur / Jaipur Studio',
    },
    ctaLabel: 'Shop Indigo Blazer',
    color: 'Fermented Indigo'
  },
  {
    id: 'p3', // Chanderi Cotton-Silk Pleated Kurta
    chapter: 'CHAPTER III / CHANDERI SHEERS',
    headline: 'Lustrous Silk. Redefined for Modern Grace.',
    poetry: 'Lightweight fabrics designed with understated beauty.',
    description: 'An exquisite shirt-kurta woven from lightweight Chanderi silk and cotton. Perfect for subtle sophistication and lightweight comfort.',
    image: allProducts.find(p => p.id === 'p3')?.images[0] || 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=1600&q=90',
    specs: {
      fiber: '60% Mulberry Silk, 40% GOTS Cotton',
      loom: 'Maheshwari Hand-loom Jacquard',
      origin: 'Pranpur, Madhya Pradesh',
    },
    ctaLabel: 'Shop Pleated Kurta',
    color: 'Warm Ochre'
  }
];

interface HomeViewProps {
  setView: (view: 'home' | 'shop' | 'journal' | 'story') => void;
  featuredProducts: Product[];
  onQuickShop: (product: Product) => void;
  onOpenQuickView: (product: Product) => void;
  recentlyViewed?: Product[];
  onClearRecentlyViewed?: () => void;
  onAddToCart: (product: Product, size: string, quantity?: number) => void;
  setIsCartOpen: (open: boolean) => void;
  isAppLoading?: boolean;
}

export default function HomeView({ 
  setView, 
  featuredProducts, 
  onQuickShop, 
  onOpenQuickView,
  recentlyViewed,
  onClearRecentlyViewed,
  onAddToCart,
  setIsCartOpen,
  isAppLoading = false
}: HomeViewProps) {
  const [activeStoryTab, setActiveStoryTab] = useState<'philosophy' | 'craftsmanship' | 'quality'>('philosophy');
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const [isHeroHovered, setIsHeroHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Complete the Look interactive states
  const [activeLookIdx, setActiveLookIdx] = useState(0);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [addedFeedback, setAddedFeedback] = useState<Record<string, boolean>>({});
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);
  const [bundleSizes, setBundleSizes] = useState<Record<string, Record<string, string>>>({});
  const [bundleFeedback, setBundleFeedback] = useState<Record<string, boolean>>({});

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY, currentTarget } = e;
    const { width, height, left, top } = currentTarget.getBoundingClientRect();
    const x = (clientX - left) / width - 0.5; // -0.5 to 0.5
    const y = (clientY - top) / height - 0.5; // -0.5 to 0.5
    setMousePosition({ x, y });
  };

  const handleMouseLeave = () => {
    setIsHeroHovered(false);
    setMousePosition({ x: 0, y: 0 });
  };

  // Slow, atmospheric auto-play loop for lookbook/storytelling slides
  useEffect(() => {
    if (isHeroHovered) return;
    const interval = setInterval(() => {
      setActiveHeroSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 8500);
    return () => clearInterval(interval);
  }, [isHeroHovered]);

  // Animation presets for staggering
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 20 }
    }
  };

  return (
    <div id="home-view" className="relative bg-brand-cream text-brand-charcoal pt-0">
      
      {/* Full-Width Luxury Editorial Hero Section - Redesigned From Scratch */}
      <section 
        id="luxury-hero"
        className="relative min-h-[calc(100vh-7.25rem)] lg:h-[calc(100vh-7.25rem)] w-full bg-brand-cream overflow-hidden flex flex-col lg:flex-row border-b border-brand-sand/40"
        onMouseEnter={() => setIsHeroHovered(true)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Left Column: Spacious Editorial Content and Typography Masterpiece */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={isAppLoading ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full lg:w-1/2 relative flex flex-col justify-between p-6 sm:p-12 lg:p-16 xl:p-20 z-10 bg-gradient-to-br from-[#FDFDFB] via-[#FAF8F5] to-[#FDFDFB] border-r border-brand-sand/30 overflow-hidden"
        >
          
          {/* Soft ambient lighting glow effects */}
          <div className="absolute top-1/4 right-10 w-72 h-72 rounded-full bg-[#C5A880]/5 blur-[100px] pointer-events-none mix-blend-multiply animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute bottom-1/4 left-10 w-96 h-96 rounded-full bg-[#DFDDD9]/40 blur-[130px] pointer-events-none mix-blend-multiply" />
          <div className="absolute top-10 left-1/3 w-64 h-64 rounded-full bg-brand-sand/15 blur-[90px] pointer-events-none" />

          {/* Elegant floating background shapes (Premium Indian Architecture & Weaving cycle motifs) */}
          <motion.div
            animate={{
              y: [0, -12, 0],
              rotate: [0, 2, 0]
            }}
            transition={{
              duration: 14,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              x: -mousePosition.x * 20,
              y: -mousePosition.y * 20,
            }}
            className="absolute top-16 right-16 w-32 h-48 pointer-events-none opacity-[0.06] hidden lg:block"
          >
            <svg viewBox="0 0 100 150" className="w-full h-full text-brand-charcoal" fill="none" stroke="currentColor" strokeWidth="0.5">
              {/* Elegant multi-cusp arch outline */}
              <path d="M 10,140 L 10,60 C 10,35 30,10 50,10 C 70,10 90,35 90,60 L 90,140" />
              <path d="M 15,140 L 15,60 C 15,38 32,15 50,15 C 68,15 85,38 85,60 L 85,140" strokeDasharray="2,2" />
              <path d="M 50,10 L 50,5" />
              <circle cx="50" cy="5" r="1.5" />
            </svg>
          </motion.div>

          <motion.div
            animate={{
              y: [0, 14, 0],
              x: [0, 6, 0],
              rotate: [0, -3, 0]
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              x: -mousePosition.x * 30,
              y: -mousePosition.y * 30,
            }}
            className="absolute bottom-28 left-20 w-36 h-36 pointer-events-none opacity-[0.05] hidden xl:block"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full text-brand-charcoal" fill="none" stroke="currentColor" strokeWidth="0.5">
              {/* Elegant radiating concentric lines and a central lotus outline representing slow weaving cycles */}
              <circle cx="50" cy="50" r="40" />
              <circle cx="50" cy="50" r="30" strokeDasharray="3,3" />
              <path d="M 50,10 L 50,90 M 10,50 L 90,50" />
              <path d="M 50,50 C 45,40 40,35 50,20 C 60,35 55,40 50,50" />
              <path d="M 50,50 C 40,45 35,40 20,50 C 35,60 40,55 50,50" />
              <path d="M 50,50 C 45,60 40,65 50,80 C 60,65 55,60 50,50" />
              <path d="M 50,50 C 60,45 65,40 80,50 C 65,60 60,55 50,50" />
            </svg>
          </motion.div>

          {/* Subtle architectural design guides */}
          <div className="absolute top-0 left-10 w-[1px] h-full bg-brand-sand/20 pointer-events-none hidden xl:block" />
          <div className="absolute top-0 right-20 w-[1px] h-full bg-brand-sand/20 pointer-events-none hidden xl:block" />

          {/* Top Label & Coordinate Seal */}
          <motion.div 
            initial={{ opacity: 0, y: -15 }}
            animate={isAppLoading ? { opacity: 0, y: -15 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
            className="flex items-center justify-between border-b border-brand-sand/40 pb-4 mb-6 lg:mb-0"
          >
            <div className="flex items-center space-x-3">
              <Sparkles className="w-3.5 h-3.5 text-brand-charcoal/60 animate-pulse" />
              <AnimatePresence mode="wait">
                <motion.span 
                  key={activeHeroSlide}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 6 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="text-[10px] font-mono tracking-[0.35em] text-brand-charcoal uppercase font-medium"
                >
                  {HERO_SLIDES[activeHeroSlide].chapter}
                </motion.span>
              </AnimatePresence>
            </div>
            <div className="hidden sm:flex items-center space-x-2 text-[9px] font-mono tracking-widest text-brand-muted uppercase">
              <span>Atelier Studio</span>
              <span className="w-1.5 h-1.5 rounded-full bg-brand-charcoal/30" />
              <span>Jaipur 26.91° N</span>
            </div>
          </motion.div>

          {/* Main Narrative Block with staggered item animations */}
          <AnimatePresence mode="wait">
            {!isAppLoading && (
              <motion.div
                key={activeHeroSlide}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6 lg:space-y-8 my-auto"
              >
                {/* Headline */}
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                  className="space-y-4"
                >
                  <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-[68px] leading-[1.05] tracking-tight font-extralight text-brand-charcoal">
                    <span className="block overflow-hidden relative">
                      <motion.span 
                        key={`${activeHeroSlide}-head1`}
                        initial={{ y: "105%" }}
                        animate={{ y: 0 }}
                        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
                        className="block"
                      >
                        {HERO_SLIDES[activeHeroSlide].headline.split('. ')[0]}.
                      </motion.span>
                    </span>
                    {HERO_SLIDES[activeHeroSlide].headline.split('. ')[1] && (
                      <span className="block overflow-hidden relative mt-2.5">
                        <motion.span 
                          key={`${activeHeroSlide}-head2`}
                          initial={{ y: "105%" }}
                          animate={{ y: 0 }}
                          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
                          className="block italic text-brand-muted font-normal pl-4 sm:pl-8 border-l border-brand-sand/80"
                        >
                          {HERO_SLIDES[activeHeroSlide].headline.split('. ')[1]}
                        </motion.span>
                      </span>
                    )}
                  </h1>
                  
                  {/* Poetic whisper */}
                  <div className="relative pl-6 border-l border-brand-sand/50">
                    <p className="text-xs sm:text-sm italic font-serif text-brand-muted tracking-wide leading-relaxed">
                      &ldquo;{HERO_SLIDES[activeHeroSlide].poetry}&rdquo;
                    </p>
                  </div>
                </motion.div>

                {/* Description */}
                <motion.p 
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
                  className="text-xs sm:text-sm text-brand-charcoal/70 font-light leading-relaxed tracking-wide max-w-lg"
                >
                  {HERO_SLIDES[activeHeroSlide].description}
                </motion.p>

                {/* Craft Specification Table */}
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                  className="border-y border-brand-sand/60 py-4 my-6 space-y-2.5 max-w-lg"
                >
                  <div className="flex justify-between items-center text-[10px] sm:text-xs">
                    <span className="font-mono text-brand-muted uppercase tracking-widest">Weft / Fiber</span>
                    <span className="font-semibold text-brand-charcoal">{HERO_SLIDES[activeHeroSlide].specs.fiber}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] sm:text-xs border-t border-brand-sand/30 pt-2.5">
                    <span className="font-mono text-brand-muted uppercase tracking-widest">Weaving Loom</span>
                    <span className="font-semibold text-brand-charcoal">{HERO_SLIDES[activeHeroSlide].specs.loom}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] sm:text-xs border-t border-brand-sand/30 pt-2.5">
                    <span className="font-mono text-brand-muted uppercase tracking-widest">Artisan Origin</span>
                    <span className="font-semibold text-brand-charcoal">{HERO_SLIDES[activeHeroSlide].specs.origin}</span>
                  </div>
                </motion.div>

                {/* Elegant Dual CTA Buttons */}
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
                  className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4"
                >
                  <motion.button
                    id={`hero-shop-collection-${HERO_SLIDES[activeHeroSlide].id}`}
                    onClick={() => {
                      const matchedProd = allProducts.find(p => p.id === HERO_SLIDES[activeHeroSlide].id);
                      if (matchedProd) {
                        onQuickShop(matchedProd);
                      } else {
                        setView('shop');
                      }
                    }}
                    whileHover={{ scale: 1.03, y: -3 }}
                    whileTap={{ scale: 0.97, y: 0 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 15 }}
                    className="bg-brand-charcoal hover:bg-[#111111] text-brand-cream text-[11px] sm:text-xs font-mono tracking-[0.25em] px-9 py-4.5 uppercase rounded-full transition-all duration-300 flex items-center justify-center space-x-3 cursor-pointer shadow-lg hover:shadow-[0_12px_28px_rgba(26,26,26,0.15),0_0_20px_rgba(197,168,128,0.2)] border border-[#C5A880]/40 hover:border-[#C5A880] group relative overflow-hidden"
                  >
                    {/* Subtle luxurious gold shimmer sweep */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                    
                    <Sparkles className="w-3.5 h-3.5 text-[#C5A880] group-hover:rotate-12 transition-transform duration-300 animate-pulse" />
                    <span className="font-semibold">Shop Collection</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1.5 transition-transform duration-300 text-brand-sand group-hover:text-white" />
                  </motion.button>
                  
                  <motion.button
                    id="hero-explore-new-arrivals"
                    onClick={() => setView('shop')}
                    whileHover={{ scale: 1.03, y: -3 }}
                    whileTap={{ scale: 0.97, y: 0 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 15 }}
                    className="border border-brand-charcoal/25 hover:border-brand-charcoal bg-transparent hover:bg-brand-charcoal hover:text-brand-cream text-brand-charcoal text-[11px] sm:text-xs font-mono tracking-[0.25em] hover:tracking-[0.28em] px-9 py-4.5 uppercase rounded-full transition-all duration-300 flex items-center justify-center space-x-3 cursor-pointer shadow-sm hover:shadow-md group relative overflow-hidden"
                  >
                    <Feather className="w-3.5 h-3.5 text-brand-charcoal/60 group-hover:text-brand-cream/80 group-hover:rotate-12 transition-transform duration-300" />
                    <span className="font-medium">Explore New Arrivals</span>
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom Slider Navigation & indicators */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={isAppLoading ? { opacity: 0, y: 15 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
            className="flex items-center justify-between border-t border-brand-sand/40 pt-4 mt-8 lg:mt-0"
          >
            {/* Custom Dot and Numerical Trackers */}
            <div className="flex items-center space-x-4">
              <span className="font-mono text-[10px] tracking-widest text-brand-charcoal font-semibold">
                0{activeHeroSlide + 1}
              </span>
              
              {/* Dynamic Animated Progress Bar */}
              <div className="w-24 h-[1px] bg-brand-sand relative">
                <motion.div 
                  key={activeHeroSlide}
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 8.5, ease: 'linear' }}
                  className="absolute left-0 top-0 h-full bg-brand-charcoal"
                />
              </div>

              <span className="font-mono text-[10px] tracking-widest text-brand-muted">
                0{HERO_SLIDES.length}
              </span>
            </div>

            {/* Premium Hollow Circle Navigation Buttons */}
            <div className="flex items-center space-x-3">
              <motion.button
                id="hero-prev-slide"
                onClick={() => {
                  setActiveHeroSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
                }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                className="w-10 h-10 rounded-full border border-brand-charcoal/10 hover:border-brand-charcoal hover:bg-brand-charcoal hover:text-brand-cream transition-all duration-300 flex items-center justify-center text-brand-charcoal focus:outline-none cursor-pointer group"
                aria-label="Previous story slide"
              >
                <ChevronLeft className="w-4 h-4 transform group-hover:-translate-x-0.5 transition-transform" />
              </motion.button>
              
              <motion.button
                id="hero-next-slide"
                onClick={() => {
                  setActiveHeroSlide((prev) => (prev + 1) % HERO_SLIDES.length);
                }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                className="w-10 h-10 rounded-full border border-brand-charcoal/10 hover:border-brand-charcoal hover:bg-brand-charcoal hover:text-brand-cream transition-all duration-300 flex items-center justify-center text-brand-charcoal focus:outline-none cursor-pointer group"
                aria-label="Next story slide"
              >
                <ChevronRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
              </motion.button>
            </div>
          </motion.div>

        </motion.div>

        {/* Right Column: Full-Height Immersive Lifestyle Visual Frame */}
        <motion.div 
          initial={{ opacity: 0, scale: 1.02 }}
          animate={isAppLoading ? { opacity: 0, scale: 1.02 } : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
          className="w-full lg:w-1/2 relative h-[50vh] sm:h-[60vh] lg:h-full overflow-hidden bg-brand-sand/40 group"
        >
          
          {/* Zoom/Pan Ambient Image with AnimatePresence */}
          <AnimatePresence>
            <motion.div
              key={activeHeroSlide}
              initial={{ scale: 1.12, opacity: 0, x: 0, y: 0 }}
              animate={{ 
                scale: isHeroHovered ? 1.05 : 1, 
                opacity: 0.9,
                x: mousePosition.x * 20,
                y: mousePosition.y * 20,
              }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ 
                opacity: { duration: 0.8 },
                scale: { duration: 1.5, ease: [0.16, 1, 0.3, 1] },
                x: { type: 'spring', stiffness: 90, damping: 25 },
                y: { type: 'spring', stiffness: 90, damping: 25 },
              }}
              className="absolute inset-0 w-full h-full origin-center"
            >
              <img
                src={allProducts.find(p => p.id === HERO_SLIDES[activeHeroSlide].id)?.images[0] || HERO_SLIDES[activeHeroSlide].image}
                alt={HERO_SLIDES[activeHeroSlide].headline}
                className="w-full h-full object-cover object-center grayscale-[12%] contrast-[1.03]"
                referrerPolicy="no-referrer"
              />
              {/* Luxury gradient vignette overlay with premium soft gold sun-flare glow */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/90 via-transparent to-brand-charcoal/30 lg:bg-gradient-to-r lg:from-transparent lg:to-brand-charcoal/80" />
              <div className="absolute -top-1/4 -right-1/4 w-full h-full rounded-full bg-[#C5A880]/15 blur-[120px] pointer-events-none mix-blend-screen" />
              <div className="absolute -bottom-10 -left-10 w-80 h-80 rounded-full bg-[#DFDDD9]/15 blur-[100px] pointer-events-none" />
            </motion.div>
          </AnimatePresence>

          {/* Floating Artisan Stamp Emblem */}
          <motion.div 
            initial={{ opacity: 0, x: -15 }}
            animate={isAppLoading ? { opacity: 0, x: -15 } : { opacity: 1, x: 0 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
            className="absolute top-6 left-6 z-20 pointer-events-none hidden sm:block"
          >
            <div className="bg-brand-cream/10 backdrop-blur-md border border-white/15 px-4 py-2 flex items-center space-x-2 text-brand-cream text-[9px] font-mono tracking-[0.25em] uppercase shadow-lg">
              <Feather className="w-3.5 h-3.5 text-brand-sand animate-pulse" />
              <span>Certified Handloom Heritage</span>
            </div>
          </motion.div>

          {/* Slow Rotating Seal Stamp */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isAppLoading ? { opacity: 0, scale: 0.8 } : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
            className="absolute top-10 right-10 z-20 hidden xl:flex items-center justify-center w-28 h-28 pointer-events-none"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 28, ease: 'linear', repeat: Infinity }}
              className="relative w-full h-full flex items-center justify-center"
            >
              <svg viewBox="0 0 100 100" className="w-full h-full text-brand-cream/40 font-mono text-[6.5px] uppercase font-bold tracking-[0.18em]">
                <path id="heroCirclePath" d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" fill="transparent" />
                <text>
                  <textPath href="#heroCirclePath" fill="currentColor">
                    • authentic slow fashion • handloomed with honor •
                  </textPath>
                </text>
              </svg>
              <Compass className="w-4 h-4 absolute text-brand-sand/55" />
            </motion.div>
          </motion.div>

          {/* Premium Fashion Content Card - Showcasing Current Collection & Featured Product */}
          <motion.div 
            key={`premium-card-${activeHeroSlide}`}
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={isAppLoading ? { opacity: 0, y: 30, scale: 0.96 } : { opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
            className="absolute bottom-6 left-6 right-6 sm:right-auto sm:left-8 sm:bottom-8 z-20 pointer-events-auto max-w-sm w-auto bg-brand-charcoal/90 backdrop-blur-xl border border-brand-sand/30 shadow-[0_24px_60px_rgba(0,0,0,0.4)] p-5 flex flex-col space-y-4 group/premium hover:border-brand-sand transition-all duration-300"
          >
            {/* Header: Collection Tag & Gold Status */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-sand animate-pulse" />
                <span className="text-[9px] font-mono tracking-[0.25em] text-brand-sand/90 uppercase font-medium">
                  Atelier Collection / Fall '26
                </span>
              </div>
              <span className="text-[8px] font-mono text-brand-cream/60 uppercase tracking-widest bg-white/5 px-2 py-0.5 border border-white/10">
                Limited Release
              </span>
            </div>

            {/* Content Body: Small Thumbnail + Product Specs */}
            <div className="flex gap-4 items-start">
              {/* Product Thumbnail inside card */}
              <div className="w-16 h-20 bg-brand-charcoal/50 overflow-hidden border border-white/10 shrink-0 relative">
                <img
                  src={HERO_SLIDES[activeHeroSlide].image}
                  alt={HERO_SLIDES[activeHeroSlide].headline}
                  className="w-full h-full object-cover grayscale-[10%] group-hover/premium:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-brand-sand/5 mix-blend-color-burn" />
              </div>

              {/* Product details and specs */}
              <div className="space-y-1 flex-1">
                <span className="text-[8px] font-mono tracking-widest text-[#C5A880] uppercase block">
                  Featured Garment
                </span>
                <h4 className="font-serif text-sm font-light text-brand-cream tracking-wide line-clamp-1 leading-snug">
                  {allProducts.find(p => p.id === HERO_SLIDES[activeHeroSlide].id)?.name || HERO_SLIDES[activeHeroSlide].color}
                </h4>
                <p className="text-[10px] text-brand-cream/60 font-mono tracking-wide">
                  {HERO_SLIDES[activeHeroSlide].specs.fiber.split(' ')[0]} • {HERO_SLIDES[activeHeroSlide].color}
                </p>
                <div className="flex items-baseline space-x-2 pt-1">
                  <span className="text-xs font-mono text-brand-cream font-medium">
                    ₹{(allProducts.find(p => p.id === HERO_SLIDES[activeHeroSlide].id)?.price || 5800).toLocaleString('en-IN')}
                  </span>
                  <span className="text-[8.5px] font-sans italic text-brand-sand/80">
                    Incl. artisan premium
                  </span>
                </div>
              </div>
            </div>

            {/* Spec grid for detailed weave & loom */}
            <div className="grid grid-cols-2 gap-3 pt-2.5 border-t border-white/5 text-[9px] font-mono text-brand-cream/70">
              <div className="space-y-0.5">
                <span className="text-brand-cream/45 text-[7.5px] uppercase tracking-wider block">Weft Structure</span>
                <span className="text-brand-cream/90 truncate block">{HERO_SLIDES[activeHeroSlide].specs.fiber.split(' ').slice(1).join(' ') || 'Organic Yarn'}</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-brand-cream/45 text-[7.5px] uppercase tracking-wider block">Artisan Provenance</span>
                <span className="text-brand-cream/90 truncate block">{HERO_SLIDES[activeHeroSlide].specs.origin.split(',')[0]}</span>
              </div>
            </div>

            {/* Bottom action bar */}
            <div className="flex items-center justify-between pt-2 border-t border-white/10 mt-1">
              <span className="text-[8px] font-mono text-brand-cream/50 tracking-wider">
                COOP ID: IND-MH-928
              </span>
              <button
                id={`premium-card-quickview-${HERO_SLIDES[activeHeroSlide].id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  const matchedProd = allProducts.find(p => p.id === HERO_SLIDES[activeHeroSlide].id);
                  if (matchedProd) {
                    onOpenQuickView(matchedProd);
                  }
                }}
                className="text-[9px] font-mono tracking-widest text-[#C5A880] hover:text-white transition-colors flex items-center space-x-1.5 cursor-pointer bg-transparent border-none p-0 group/btn"
              >
                <span>ACQUIRE SPECIMEN</span>
                <ArrowRight className="w-3 h-3 transform group-hover/btn:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </motion.div>

        </motion.div>

      </section>

      {/* Premium Trust Section */}
      <section id="premium-trust-bar" className="bg-brand-cream border-b border-brand-sand/30 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10"
          >
            {/* Card 1: Free Shipping */}
            <motion.div 
              id="trust-shipping"
              variants={{
                hidden: { opacity: 0, y: 15 },
                show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
              }}
              className="flex flex-col space-y-4 p-6 bg-brand-cream/40 border border-brand-sand/20 hover:border-brand-charcoal/20 hover:bg-white/30 transition-all duration-300 group shadow-[0_4px_20px_-10px_rgba(0,0,0,0.02)]"
            >
              <div className="w-10 h-10 rounded-full bg-brand-sand/15 flex items-center justify-center text-brand-charcoal group-hover:scale-110 transition-transform duration-300">
                <Truck className="w-4 h-4 stroke-[1.5]" />
              </div>
              <div className="space-y-1.5">
                <h4 className="font-mono text-[11px] font-semibold tracking-wider text-brand-charcoal uppercase">
                  Free Shipping India
                </h4>
                <p className="text-[11px] text-brand-muted font-light leading-relaxed">
                  Premium complimentary courier dispatch with tracked delivery logs on all domestic parcels.
                </p>
              </div>
            </motion.div>

            {/* Card 2: Cash on Delivery */}
            <motion.div 
              id="trust-cod"
              variants={{
                hidden: { opacity: 0, y: 15 },
                show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
              }}
              className="flex flex-col space-y-4 p-6 bg-brand-cream/40 border border-brand-sand/20 hover:border-brand-charcoal/20 hover:bg-white/30 transition-all duration-300 group shadow-[0_4px_20px_-10px_rgba(0,0,0,0.02)]"
            >
              <div className="w-10 h-10 rounded-full bg-brand-sand/15 flex items-center justify-center text-brand-charcoal group-hover:scale-110 transition-transform duration-300">
                <Coins className="w-4 h-4 stroke-[1.5]" />
              </div>
              <div className="space-y-1.5">
                <h4 className="font-mono text-[11px] font-semibold tracking-wider text-brand-charcoal uppercase">
                  Cash on Delivery
                </h4>
                <p className="text-[11px] text-brand-muted font-light leading-relaxed">
                  Prefer to pay at your doorstep? Pay seamlessly via cash or any UPI app at zero extra charge.
                </p>
              </div>
            </motion.div>

            {/* Card 3: Easy Returns */}
            <motion.div 
              id="trust-returns"
              variants={{
                hidden: { opacity: 0, y: 15 },
                show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
              }}
              className="flex flex-col space-y-4 p-6 bg-brand-cream/40 border border-brand-sand/20 hover:border-brand-charcoal/20 hover:bg-white/30 transition-all duration-300 group shadow-[0_4px_20px_-10px_rgba(0,0,0,0.02)]"
            >
              <div className="w-10 h-10 rounded-full bg-brand-sand/15 flex items-center justify-center text-brand-charcoal group-hover:scale-110 transition-transform duration-300">
                <RotateCcw className="w-4 h-4 stroke-[1.5]" />
              </div>
              <div className="space-y-1.5">
                <h4 className="font-mono text-[11px] font-semibold tracking-wider text-brand-charcoal uppercase">
                  Easy 7-Day Returns
                </h4>
                <p className="text-[11px] text-brand-muted font-light leading-relaxed">
                  Complimentary reverse pickups coordinated dynamically from your home for complete convenience.
                </p>
              </div>
            </motion.div>

            {/* Card 4: Secure Shopping */}
            <motion.div 
              id="trust-secure"
              variants={{
                hidden: { opacity: 0, y: 15 },
                show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
              }}
              className="flex flex-col space-y-4 p-6 bg-brand-cream/40 border border-brand-sand/20 hover:border-brand-charcoal/20 hover:bg-white/30 transition-all duration-300 group shadow-[0_4px_20px_-10px_rgba(0,0,0,0.02)]"
            >
              <div className="w-10 h-10 rounded-full bg-brand-sand/15 flex items-center justify-center text-brand-charcoal group-hover:scale-110 transition-transform duration-300">
                <ShieldCheck className="w-4 h-4 stroke-[1.5]" />
              </div>
              <div className="space-y-1.5">
                <h4 className="font-mono text-[11px] font-semibold tracking-wider text-brand-charcoal uppercase">
                  Secure Shopping
                </h4>
                <p className="text-[11px] text-brand-muted font-light leading-relaxed">
                  Direct concierge order integration via WhatsApp with private encrypted logs and instant tracking.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Brand Ethos Statement */}
      <section className="py-24 bg-brand-cream">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="space-y-6"
          >
            <p className="text-[10px] font-mono tracking-[0.25em] text-brand-muted uppercase">OUR DESIGN PHILOSOPHY</p>
            <h2 className="font-serif text-3xl md:text-5xl font-light text-brand-charcoal leading-tight">
              &ldquo;We don't believe in temporary fashion trends. We create timeless, high-quality clothing made to last and fit you comfortably every day.&rdquo;
            </h2>
            <div className="h-[1px] w-12 bg-brand-charcoal/20 mx-auto" />
            <p className="text-xs font-mono text-brand-muted">KORA DESIGN TEAM MANIFESTO</p>
          </motion.div>
        </div>
      </section>

      {/* Customer Confidence Section */}
      <section id="customer-confidence-section" className="py-24 bg-brand-cream border-t border-brand-sand/30 relative overflow-hidden">
        {/* Subtle accent architectural background line */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none select-none z-0">
          <div className="absolute top-0 left-1/3 w-[1px] h-full bg-brand-charcoal" />
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-brand-charcoal" />
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <p className="text-[10px] font-mono tracking-[0.3em] text-brand-muted uppercase">CUSTOMER CONFIDENCE</p>
            <h2 className="font-serif text-3xl md:text-5xl font-light text-brand-charcoal tracking-tight">
              Sincerity in Every Thread
            </h2>
            <div className="h-[1px] w-12 bg-brand-charcoal/20 mx-auto" />
            <p className="text-xs md:text-sm text-brand-muted leading-relaxed font-light max-w-xl mx-auto">
              We align our centuries-old regional weaving legacy with standard modern expectations of transparency, luxury service, and smooth exchanges.
            </p>
          </div>

          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {/* Premium Quality Card */}
            <motion.div 
              id="confidence-quality"
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
              }}
              className="bg-white/40 backdrop-blur-xs border border-brand-sand/25 p-8 space-y-5 hover:-translate-y-1 hover:border-brand-charcoal/25 hover:bg-white/70 hover:shadow-xs transition-all duration-300 group flex flex-col justify-between h-full"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-full border border-brand-sand/65 flex items-center justify-center text-brand-charcoal bg-brand-cream/30 group-hover:bg-brand-charcoal group-hover:text-brand-cream transition-colors duration-300">
                  <Sparkles className="w-4 h-4 stroke-[1.25]" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-mono text-[11px] font-semibold tracking-wider uppercase text-brand-charcoal">
                    Premium Quality
                  </h3>
                  <p className="text-[11px] text-brand-muted font-light leading-relaxed">
                    Sourced from organic, GOTS-certified botanical cottons, high-gauge mulberry silk fibers, and naturally fermented indigo dye baths.
                  </p>
                </div>
              </div>
              <div className="pt-2 border-t border-brand-sand/15 flex justify-between items-center">
                <span className="text-[9px] font-mono tracking-widest text-brand-muted uppercase">Lab Tested Fibers</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-800"></span>
              </div>
            </motion.div>

            {/* Made in India Card */}
            <motion.div 
              id="confidence-heritage"
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
              }}
              className="bg-white/40 backdrop-blur-xs border border-brand-sand/25 p-8 space-y-5 hover:-translate-y-1 hover:border-brand-charcoal/25 hover:bg-white/70 hover:shadow-xs transition-all duration-300 group flex flex-col justify-between h-full"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-full border border-brand-sand/65 flex items-center justify-center text-brand-charcoal bg-brand-cream/30 group-hover:bg-brand-charcoal group-hover:text-brand-cream transition-colors duration-300">
                  <Heart className="w-4 h-4 stroke-[1.25]" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-mono text-[11px] font-semibold tracking-wider uppercase text-brand-charcoal">
                    Made in India
                  </h3>
                  <p className="text-[11px] text-brand-muted font-light leading-relaxed">
                    Sustainably hand-loomed and tailored with precision in our regional master weaver cooperatives in Maheshwar, Bhagalpur, and Jaipur.
                  </p>
                </div>
              </div>
              <div className="pt-2 border-t border-brand-sand/15 flex justify-between items-center">
                <span className="text-[9px] font-mono tracking-widest text-brand-muted uppercase">100% Handcrafted</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-800"></span>
              </div>
            </motion.div>

            {/* Easy Exchanges Card */}
            <motion.div 
              id="confidence-exchanges"
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
              }}
              className="bg-white/40 backdrop-blur-xs border border-brand-sand/25 p-8 space-y-5 hover:-translate-y-1 hover:border-brand-charcoal/25 hover:bg-white/70 hover:shadow-xs transition-all duration-300 group flex flex-col justify-between h-full"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-full border border-brand-sand/65 flex items-center justify-center text-brand-charcoal bg-brand-cream/30 group-hover:bg-brand-charcoal group-hover:text-brand-cream transition-colors duration-300">
                  <RefreshCw className="w-4 h-4 stroke-[1.25]" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-mono text-[11px] font-semibold tracking-wider uppercase text-brand-charcoal">
                    Easy Exchanges
                  </h3>
                  <p className="text-[11px] text-brand-muted font-light leading-relaxed">
                    We offer doorstep reverse pickup services and customized fit tailoring. Get the perfect silhouette, completely stress-free.
                  </p>
                </div>
              </div>
              <div className="pt-2 border-t border-brand-sand/15 flex justify-between items-center">
                <span className="text-[9px] font-mono tracking-widest text-brand-muted uppercase">Doorstep Pickup</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-800"></span>
              </div>
            </motion.div>

            {/* Trusted by Thousands Card */}
            <motion.div 
              id="confidence-trust"
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
              }}
              className="bg-white/40 backdrop-blur-xs border border-brand-sand/25 p-8 space-y-5 hover:-translate-y-1 hover:border-brand-charcoal/25 hover:bg-white/70 hover:shadow-xs transition-all duration-300 group flex flex-col justify-between h-full"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-full border border-brand-sand/65 flex items-center justify-center text-brand-charcoal bg-brand-cream/30 group-hover:bg-brand-charcoal group-hover:text-brand-cream transition-colors duration-300">
                  <Users className="w-4 h-4 stroke-[1.25]" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-mono text-[11px] font-semibold tracking-wider uppercase text-brand-charcoal">
                    Trusted by Thousands
                  </h3>
                  <p className="text-[11px] text-brand-muted font-light leading-relaxed">
                    Over 10,000 happy customers globally trust our beautifully crafted clothing for pure, natural comfort.
                  </p>
                </div>
              </div>
              <div className="pt-2 border-t border-brand-sand/15 flex justify-between items-center">
                <span className="text-[9px] font-mono tracking-widest text-brand-muted uppercase">10k+ Customers Worldwide</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-800"></span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Collections Section */}
      <section className="py-24 bg-brand-cream border-t border-brand-sand/40">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Header Block */}
          <div className="mb-16 text-center md:text-left flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="space-y-3">
              <p className="text-[10px] font-mono tracking-[0.3em] text-brand-muted uppercase">SEASONAL FOCUS</p>
              <h2 className="font-serif text-3xl md:text-5xl font-light text-brand-charcoal tracking-tight">
                Featured Collections
              </h2>
            </div>
            <p className="text-xs text-brand-muted max-w-md font-light leading-relaxed md:text-right">
              A beautiful collection of modern Indian outfits, designed to fit you comfortably for both daily wear and special occasions.
            </p>
          </div>

          {/* Grid Layout of Collections */}
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.12
                }
              }
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              {
                id: 'ethnic',
                title: 'Ethnic Wear',
                subtitle: '01 / Heritage Silhouettes',
                description: 'Elegant modern cuts woven with fine-gauge Chanderi silk and finished with delicate zari borders.',
                image: allProducts.find(p => p.id === 'p3')?.images[0] || 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=800&q=80',
                tag: 'Heritage'
              },
              {
                id: 'casual',
                title: 'Casual Wear',
                subtitle: '02 / Organic Handspun',
                description: 'Breathable ambar charkha khadi and pre-shrunk cotton mulmul designed for everyday tropical comfort.',
                image: allProducts.find(p => p.id === 'p1')?.images[0] || 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1600&q=90',
                tag: 'Everyday'
              },
              {
                id: 'festive',
                title: 'Festive Collection',
                subtitle: '03 / Refined Luxury',
                description: 'Earthy luxury featuring sand-washed raw Tussar silk, natural fermented indigo, and gold brocades.',
                image: allProducts.find(p => p.id === 'p5')?.images[0] || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80',
                tag: 'Occasion'
              },
              {
                id: 'essentials',
                title: 'Premium Essentials',
                subtitle: '04 / Permanent Staples',
                description: 'Timeless structural capsules, relaxed-fit linen drawstring trousers, and minimal outer layer dusters.',
                image: allProducts.find(p => p.id === 'p4')?.images[0] || 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80',
                tag: 'Staples'
              }
            ].map((collection, index) => (
              <motion.div
                key={collection.id}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 20 } }
                }}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => setView('shop')}
                className="group relative aspect-[3/4] md:aspect-[2/3] lg:aspect-[3/4.5] w-full bg-brand-sand/20 overflow-hidden cursor-pointer shadow-sm border border-brand-sand/30"
              >
                {/* Background Image with rich filters */}
                <img
                  src={collection.image}
                  alt={collection.title}
                  className="absolute inset-0 w-full h-full object-cover grayscale-[15%] brightness-95 transition-transform duration-[1.4s] ease-out group-hover:scale-105 group-hover:grayscale-0"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                
                {/* Luxury gradient vignette overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/90 via-brand-charcoal/40 to-transparent opacity-85 group-hover:opacity-95 transition-opacity duration-500" />

                {/* Subtle Sand Tint on hover */}
                <div className="absolute inset-0 bg-brand-sand/5 mix-blend-color-burn opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Tag Badge */}
                <div className="absolute top-5 right-5 z-10">
                  <span className="bg-brand-cream/10 backdrop-blur-md text-brand-sand border border-brand-sand/20 font-mono text-[9px] tracking-[0.2em] uppercase px-3 py-1">
                    {collection.tag}
                  </span>
                </div>

                {/* Content Block */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 text-white z-10 space-y-3">
                  <span className="text-[9px] font-mono tracking-[0.3em] text-brand-sand uppercase">
                    {collection.subtitle}
                  </span>
                  
                  <div className="space-y-2">
                    <h3 className="font-serif text-2xl font-light tracking-wide text-brand-cream flex items-center justify-between">
                      <span>{collection.title}</span>
                      <ArrowRight className="w-4 h-4 text-brand-sand opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    </h3>
                    
                    <p className="text-[11px] text-brand-cream/70 font-light leading-relaxed line-clamp-2 md:line-clamp-3 group-hover:text-brand-cream/90 transition-colors duration-300">
                      {collection.description}
                    </p>
                  </div>

                  {/* Decorative expanding line */}
                  <div className="w-8 h-[1px] bg-brand-sand group-hover:w-full transition-all duration-500 ease-out" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Interactive Horizontal Product Slider (Featured Arrivals) */}
      <section className="py-20 bg-brand-cream/60 border-y border-brand-sand/50">
        <div className="max-w-7xl mx-auto px-6 md:px-12 mb-10 flex items-end justify-between">
          <div>
            <p className="text-[10px] font-mono tracking-[0.2em] text-brand-muted uppercase mb-2">CURATED ESSENTIALS</p>
            <h2 className="font-serif text-3xl md:text-4xl font-light text-brand-charcoal">New Season Arrivals</h2>
          </div>
          <button
            id="view-all-collections"
            onClick={() => setView('shop')}
            className="text-[11px] font-medium tracking-[0.2em] text-brand-charcoal hover:text-brand-muted transition-colors flex items-center space-x-1.5 pb-1 border-b border-brand-charcoal/20"
          >
            <span>VIEW ENTIRE SHOP</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Swipeable container */}
        <div className="overflow-x-auto no-scrollbar pb-8 px-6 md:px-12 flex space-x-6">
          {featuredProducts.map((product) => (
            <motion.div
              key={product.id}
              className="flex-shrink-0 w-[280px] md:w-[320px] group cursor-pointer flex flex-col justify-between"
              onClick={() => onQuickShop(product)}
              whileHover={{ y: -6 }}
              transition={{ type: 'tween', duration: 0.3 }}
            >
              <div>
                {/* Product Frame */}
                <div className="relative aspect-[3/4] bg-brand-sand/30 overflow-hidden mb-4">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  
                  <ProductBadge
                    product={product}
                    className="absolute top-4 left-4 z-10"
                  />

                  {/* Micro hover interaction: Quick add overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/45 via-black/20 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-350 ease-out hidden md:flex justify-center z-15">
                    <button
                      id={`home-featured-quickview-${product.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenQuickView(product);
                      }}
                      className="bg-brand-cream text-brand-charcoal hover:bg-brand-charcoal hover:text-white text-[10px] font-semibold tracking-widest px-5 py-2.5 shadow-md transition-colors border-none cursor-pointer"
                    >
                      QUICK VIEW
                    </button>
                  </div>
                </div>

                {/* Info Block */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xs font-medium tracking-wider text-brand-charcoal group-hover:text-brand-muted transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-[10px] text-brand-muted font-mono mt-1">{product.category}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    {product.originalPrice && (
                      <span className="text-[10px] font-mono text-brand-muted line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                    )}
                    <span className="text-xs font-mono font-semibold text-brand-charcoal">₹{product.price.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Mobile-only Quick View Trigger Button */}
              <button
                id={`home-featured-quickview-mobile-${product.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenQuickView(product);
                }}
                className="md:hidden w-full mt-3 py-2 border border-brand-sand hover:border-brand-charcoal bg-transparent text-brand-charcoal hover:bg-brand-charcoal hover:text-white text-[8.5px] font-mono tracking-widest uppercase transition-all duration-200 cursor-pointer"
              >
                QUICK VIEW
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="py-24 bg-brand-cream border-t border-brand-sand/40">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Header Block */}
          <div className="mb-16 text-center md:text-left flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="space-y-3">
              <p className="text-[10px] font-mono tracking-[0.3em] text-brand-muted uppercase">OUR CUSTOMER FAVORITES</p>
              <h2 className="font-serif text-3xl md:text-5xl font-light text-brand-charcoal tracking-tight">
                Our Best Sellers
              </h2>
            </div>
            <p className="text-xs text-brand-muted max-w-md font-light leading-relaxed md:text-right">
              Explore our most popular pieces of the season—loved for their soft hand-spun cotton, comfortable fit, and beautiful timeless design.
            </p>
          </div>

          {/* 8 Premium Product Cards Grid */}
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.08
                }
              }
            }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12"
          >
            {allProducts.map((product) => {
              // Deterministic premium ratings and reviews based on product id
              const ratingData: Record<string, { rating: number; reviews: number }> = {
                p1: { rating: 4.9, reviews: 84 },
                p2: { rating: 4.8, reviews: 124 },
                p3: { rating: 4.7, reviews: 96 },
                p4: { rating: 4.8, reviews: 112 },
                p5: { rating: 4.9, reviews: 148 },
                p6: { rating: 4.8, reviews: 67 },
                p7: { rating: 4.7, reviews: 215 },
                p8: { rating: 4.9, reviews: 53 },
              };
              const { rating, reviews } = ratingData[product.id] || { rating: 4.8, reviews: 42 };

              return (
                <motion.div
                  id={`bestseller-card-${product.id}`}
                  key={`bestseller-${product.id}`}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 20 } }
                  }}
                  className="group cursor-pointer flex flex-col justify-between"
                  onClick={() => onQuickShop(product)}
                >
                  <div>
                    <div className="relative aspect-[3/4] bg-brand-sand/25 overflow-hidden mb-4 border border-brand-sand/10">
                      {/* Hover Image Scale */}
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover grayscale-[10%] brightness-[98%] transition-transform duration-700 ease-out group-hover:scale-105 group-hover:grayscale-0"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                      
                      {/* Sand Tint on hover */}
                      <div className="absolute inset-0 bg-brand-sand/5 mix-blend-color-burn opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* New/Bestseller badge */}
                      <ProductBadge
                        product={product}
                        className="absolute top-4 left-4 z-10"
                      />

                      {/* Quick View Button on Hover */}
                      <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/50 via-black/20 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out flex justify-center z-10">
                        <button
                          id={`bestseller-quickview-${product.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenQuickView(product);
                          }}
                          className="w-full bg-brand-cream hover:bg-brand-charcoal hover:text-white text-[10px] font-mono tracking-widest py-3 uppercase shadow-md transition-all duration-300 active:scale-95 cursor-pointer border-none"
                        >
                          QUICK VIEW
                        </button>
                      </div>
                    </div>

                    {/* Info Block */}
                    <div className="space-y-1.5 px-1">
                      <div className="flex justify-between items-baseline gap-2">
                        <span className="text-[10px] text-brand-muted font-mono uppercase tracking-wider">{product.category}</span>
                        {/* Premium Star Rating */}
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                          <span className="text-[10px] font-mono text-brand-charcoal font-semibold">{rating}</span>
                          <span className="text-[9px] font-mono text-brand-muted">({reviews})</span>
                        </div>
                      </div>

                      <h3 className="text-xs font-serif font-light tracking-wide text-brand-charcoal group-hover:text-brand-muted transition-colors leading-relaxed line-clamp-1">
                        {product.name}
                      </h3>

                      <div className="flex justify-between items-center pt-1 border-t border-brand-sand/30">
                        <span className="text-[10px] font-mono text-brand-muted">{product.color}</span>
                        <div className="flex items-center space-x-2">
                          {product.originalPrice && (
                            <span className="text-[10px] font-mono text-brand-muted line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                          )}
                          <span className="text-xs font-mono font-semibold text-brand-charcoal">₹{product.price.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mobile-only Quick View Trigger Button */}
                  <button
                    id={`bestseller-quickview-mobile-${product.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenQuickView(product);
                    }}
                    className="md:hidden w-full mt-3.5 py-2.5 border border-brand-sand hover:border-brand-charcoal bg-transparent text-brand-charcoal hover:bg-brand-charcoal hover:text-white text-[8.5px] font-mono tracking-widest uppercase transition-all duration-200 cursor-pointer"
                  >
                    QUICK VIEW
                  </button>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Premium Interactive Brand Story Section */}
      <section className="py-24 bg-brand-cream border-t border-brand-sand/30 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Section Heading */}
          <div className="mb-16 text-center md:text-left">
            <p className="text-[10px] font-mono tracking-[0.3em] text-brand-muted uppercase mb-2">OUR REASON FOR BEING</p>
            <h2 className="font-serif text-3xl md:text-5xl font-light text-brand-charcoal tracking-tight">Our Brand Story</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Image Column (Responsive & Animated) */}
            <div className="lg:col-span-7 relative">
              <div className="aspect-[4/5] overflow-hidden bg-brand-sand/20 border border-brand-sand/20 relative group">
                <AnimatePresence mode="wait">
                  {activeStoryTab === 'philosophy' && (
                    <motion.img
                      key="philosophy-img"
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1000&q=80"
                      alt="Minimalist Architecture and Drapery"
                      className="absolute inset-0 w-full h-full object-cover grayscale-[10%]"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  {activeStoryTab === 'craftsmanship' && (
                    <motion.img
                      key="craftsmanship-img"
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      src="https://images.unsplash.com/photo-1584905066893-7d5c142ba4e1?auto=format&fit=crop&w=1000&q=80"
                      alt="Artisanal Handlooming Process"
                      className="absolute inset-0 w-full h-full object-cover grayscale-[10%]"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  {activeStoryTab === 'quality' && (
                    <motion.img
                      key="quality-img"
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      src="https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?auto=format&fit=crop&w=1000&q=80"
                      alt="Detailed Stitches of Raw Linen"
                      className="absolute inset-0 w-full h-full object-cover grayscale-[10%]"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  )}
                </AnimatePresence>

                {/* Subtle visual sand tint */}
                <div className="absolute inset-0 bg-brand-sand/5 mix-blend-color-burn pointer-events-none" />

                {/* Dynamic Floating Quote Box */}
                <div className="absolute -bottom-6 -right-4 md:-right-8 bg-brand-sand p-6 max-w-xs border border-brand-beige/50 hidden md:block shadow-lg z-10">
                  <AnimatePresence mode="wait">
                    {activeStoryTab === 'philosophy' && (
                      <motion.div
                        key="philosophy-quote"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.4 }}
                      >
                        <p className="font-serif italic text-sm text-brand-charcoal/80 leading-relaxed">
                          &ldquo;Eliminating the noise of trends to find quiet resonance in raw geometry.&rdquo;
                        </p>
                        <p className="text-[9px] font-mono tracking-widest text-brand-muted uppercase mt-4">
                          - ARJUN SEN, CO-FOUNDER
                        </p>
                      </motion.div>
                    )}
                    {activeStoryTab === 'craftsmanship' && (
                      <motion.div
                        key="craftsmanship-quote"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.4 }}
                      >
                        <p className="font-serif italic text-sm text-brand-charcoal/80 leading-relaxed">
                          &ldquo;Every thread is spun on wooden ambar charkhas, preserving ancestral rhythm.&rdquo;
                        </p>
                        <p className="text-[9px] font-mono tracking-widest text-brand-muted uppercase mt-4">
                          - TARA SEN, CO-FOUNDER
                        </p>
                      </motion.div>
                    )}
                    {activeStoryTab === 'quality' && (
                      <motion.div
                        key="quality-quote"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.4 }}
                      >
                        <p className="font-serif italic text-sm text-brand-charcoal/80 leading-relaxed">
                          &ldquo;A clean stitch is a silent contract. The inner seams must be as beautiful as the face.&rdquo;
                        </p>
                        <p className="text-[9px] font-mono tracking-widest text-brand-muted uppercase mt-4">
                          - MANISH SHARMA, MASTER TAILOR
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Right Copy Column with Tab Controls */}
            <div className="lg:col-span-5 space-y-8 flex flex-col justify-center">
              
              {/* Interactive Tabs Menu */}
              <div className="flex border-b border-brand-sand/80 pb-2 space-x-6 md:space-x-8">
                {[
                  { id: 'philosophy', label: 'PHILOSOPHY' },
                  { id: 'craftsmanship', label: 'CRAFTSMANSHIP' },
                  { id: 'quality', label: 'COMMITMENT' }
                ].map((tab) => {
                  const isActive = activeStoryTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveStoryTab(tab.id as 'philosophy' | 'craftsmanship' | 'quality')}
                      className="text-[11px] font-mono tracking-[0.25em] pb-3 transition-all relative text-left outline-none cursor-pointer"
                      style={{ color: isActive ? 'var(--color-brand-charcoal)' : 'var(--color-brand-muted)' }}
                    >
                      <span className={isActive ? "font-bold text-brand-charcoal" : "text-brand-muted hover:text-brand-charcoal/80"}>
                        {tab.label}
                      </span>
                      {isActive && (
                        <motion.div
                          layoutId="activeStoryIndicator"
                          className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-charcoal"
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Animated Content Panel */}
              <AnimatePresence mode="wait">
                {activeStoryTab === 'philosophy' && (
                  <motion.div
                    key="philosophy-content"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-6"
                  >
                    <p className="text-[10px] font-mono tracking-[0.25em] text-brand-muted uppercase">01 / MODERN MINIMALIST DESIGN</p>
                    <h3 className="font-serif text-3xl md:text-4xl font-light text-brand-charcoal leading-tight">
                      Minimalist Modern Lines
                    </h3>
                    <p className="text-xs md:text-sm text-brand-muted leading-relaxed font-light">
                      We believe clothing should be simple and comfortable, not flashy. Our designs are clean and clutter-free, without any loud logos or tight, uncomfortable fits.
                    </p>
                    <p className="text-xs md:text-sm text-brand-muted leading-relaxed font-light">
                      By using organic, hand-spun fabrics, we create clothing that breathes naturally and moves with you comfortably throughout the day.
                    </p>
                  </motion.div>
                )}

                {activeStoryTab === 'craftsmanship' && (
                  <motion.div
                    key="craftsmanship-content"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-6"
                  >
                    <p className="text-[10px] font-mono tracking-[0.25em] text-brand-muted uppercase">02 / TRADITIONAL INDIAN HANDLOOMS</p>
                    <h3 className="font-serif text-3xl md:text-4xl font-light text-brand-charcoal leading-tight">
                      Ancestral Weaving Circles
                    </h3>
                    <p className="text-xs md:text-sm text-brand-muted leading-relaxed font-light">
                      Our fabrics are woven on traditional wooden looms by skilled master weavers in Maheshwar, Bhagalpur, and Jaipur, preserving India's beautiful weaving traditions.
                    </p>
                    <p className="text-xs md:text-sm text-brand-muted leading-relaxed font-light">
                      We use natural Indigo dyes, organic cotton, and soft silk. We prioritize sustainable and environmentally friendly methods that support the livelihoods of local artisans.
                    </p>
                  </motion.div>
                )}

                {activeStoryTab === 'quality' && (
                  <motion.div
                    key="quality-content"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-6"
                  >
                    <p className="text-[10px] font-mono tracking-[0.25em] text-brand-muted uppercase">03 / PREMIUM DURABLE QUALITY</p>
                    <h3 className="font-serif text-3xl md:text-4xl font-light text-brand-charcoal leading-tight">
                      Traceable, Pure Construction
                    </h3>
                    <p className="text-xs md:text-sm text-brand-muted leading-relaxed font-light">
                      We hold our products to the highest standards. Every piece is stitched carefully with clean seams and edges, ensuring the fabric is durable and gets softer with every wash.
                    </p>
                    <p className="text-xs md:text-sm text-brand-muted leading-relaxed font-light">
                      To help your garments last for years, we offer minor repairs and alterations at our studios in Delhi, Mumbai, and Bangalore.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Button */}
              <div className="pt-4">
                <button
                  id="story-learn-more-button"
                  onClick={() => setView('story')}
                  className="text-xs font-semibold tracking-[0.2em] text-brand-charcoal hover:text-brand-muted transition-colors pb-1 border-b border-brand-charcoal flex items-center space-x-2 w-max cursor-pointer duration-300"
                >
                  <span>LEARN ABOUT OUR STORY</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Premium Customer Reviews / Testimonials Section */}
      <section className="py-24 bg-brand-cream border-t border-brand-sand/30 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Section Heading */}
          <div className="mb-16 text-center md:text-left flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="space-y-3">
              <p className="text-[10px] font-mono tracking-[0.3em] text-brand-muted uppercase">CUSTOMER STORIES</p>
              <h2 className="font-serif text-3xl md:text-5xl font-light text-brand-charcoal tracking-tight">
                What Our Customers Say
              </h2>
            </div>
            <p className="text-xs text-brand-muted max-w-md font-light leading-relaxed md:text-right">
              Read about our customers' experiences with the premium quality, soft fabrics, and comfortable fits of our clothing.
            </p>
          </div>

          {/* Testimonial Carousel Container */}
          <div className="relative">
            {/* Main Content Area */}
            <div className="relative min-h-[500px] md:min-h-[420px] bg-brand-sand/15 border border-brand-sand/30 p-8 md:p-12 lg:p-16">
              <AnimatePresence mode="wait">
                {(() => {
                  const testimonials = [
                    {
                      id: 1,
                      name: "Aishwarya Iyer",
                      role: "Architectural Designer",
                      location: "Mumbai, India",
                      rating: 5,
                      review: "The Chanderi Cotton-Silk drape is exceptionally lightweight, feeling almost non-existent in the humid heat of Mumbai. The blind edge stitching is a masterclass in quiet, zero-compromise quality. It has become a definitive heirloom in my wardrobe.",
                      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
                      fabric: "Chanderi Cotton-Silk"
                    },
                    {
                      id: 2,
                      name: "Kabir Mehra",
                      role: "Creative Director",
                      location: "Delhi, India",
                      rating: 5,
                      review: "Finding premium, non-logo garments with authentic Indian origins can be impossible. The Kora Khadi Cocoon Duster completely shifts the paradigm—retaining beautiful slub structures while maintaining perfect, structured architectural lines.",
                      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
                      fabric: "Organic Kora Khadi"
                    },
                    {
                      id: 3,
                      name: "Devika Sen",
                      role: "Fine Art Curator",
                      location: "Bangalore, India",
                      rating: 5,
                      review: "The botanical indigo wash has a beautiful mineral depth that synthetic dyes simply can't reproduce. The slow, organic oxidation gives it an evolving character that gets richer with each delicate wash. Outstanding craft.",
                      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
                      fabric: "Fermented Botanical Indigo"
                    },
                    {
                      id: 4,
                      name: "Rohan Malhotra",
                      role: "Industrial Designer",
                      location: "Jaipur, India",
                      rating: 5,
                      review: "The sand-washed raw Tussar Silk jacket drapes like liquid shadow. It has a beautiful peach-skin matte texture that is cool to the touch and handles creases with incredible elegance. It’s exactly the kind of restraint modern menswear needs.",
                      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
                      fabric: "Sand-washed Raw Tussar Silk"
                    }
                  ];
                  const t = testimonials[currentReviewIndex];
                  
                  return (
                    <motion.div
                      key={t.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
                    >
                      {/* Left: Beautiful B&W Profile Portrait */}
                      <div className="lg:col-span-4 flex justify-center">
                        <div className="relative aspect-square w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 overflow-hidden border border-brand-sand/30 bg-brand-sand/10 shadow-sm group">
                          <img
                            src={t.image}
                            alt={t.name}
                            className="w-full h-full object-cover grayscale brightness-95 contrast-105 transition-transform duration-700 ease-out group-hover:scale-102"
                          />
                          <div className="absolute inset-0 bg-brand-sand/10 mix-blend-color-burn" />
                        </div>
                      </div>

                      {/* Right: Testimonial & Details */}
                      <div className="lg:col-span-8 space-y-6 flex flex-col justify-center">
                        <div className="flex items-center justify-between">
                          {/* Quote mark and stars */}
                          <div className="flex items-center space-x-2">
                            <Quote className="w-8 h-8 text-brand-sand/40 transform rotate-180" />
                            <div className="flex space-x-0.5">
                              {[...Array(t.rating)].map((_, i) => (
                                <Star key={i} className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                              ))}
                            </div>
                          </div>
                          
                          {/* Fabric Tag */}
                          <span className="hidden sm:inline-block font-mono text-[9px] tracking-widest text-brand-muted uppercase border border-brand-sand/40 px-2.5 py-1">
                            PATRONIZED: {t.fabric}
                          </span>
                        </div>

                        {/* Testimonial Quote */}
                        <blockquote className="font-serif text-lg md:text-xl lg:text-2xl font-light italic text-brand-charcoal leading-relaxed tracking-wide">
                          &ldquo;{t.review}&rdquo;
                        </blockquote>

                        {/* Patron metadata */}
                        <div className="pt-4 border-t border-brand-sand/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="space-y-0.5">
                            <h4 className="font-serif text-base text-brand-charcoal font-medium tracking-wide">
                              {t.name}
                            </h4>
                            <p className="text-[10px] font-mono tracking-widest text-brand-muted uppercase">
                              {t.role} <span className="text-brand-sand/80">•</span> {t.location}
                            </p>
                          </div>

                          {/* Navigation Controls */}
                          <div className="flex items-center space-x-3">
                            <button
                              id="review-prev-btn"
                              onClick={() => setCurrentReviewIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                              className="p-3 border border-brand-sand/60 hover:border-brand-charcoal hover:bg-brand-charcoal hover:text-white transition-all rounded-none cursor-pointer duration-300"
                              aria-label="Previous review"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                              id="review-next-btn"
                              onClick={() => setCurrentReviewIndex((prev) => (prev + 1) % testimonials.length)}
                              className="p-3 border border-brand-sand/60 hover:border-brand-charcoal hover:bg-brand-charcoal hover:text-white transition-all rounded-none cursor-pointer duration-300"
                              aria-label="Next review"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  );
                })()}
              </AnimatePresence>
            </div>

            {/* Slider Indicator Dots */}
            <div className="flex justify-center space-x-2 mt-8">
              {[0, 1, 2, 3].map((idx) => {
                const isActive = idx === currentReviewIndex;
                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentReviewIndex(idx)}
                    className="h-1.5 transition-all duration-300 rounded-none cursor-pointer"
                    style={{
                      width: isActive ? '24px' : '6px',
                      backgroundColor: isActive ? 'var(--color-brand-charcoal)' : 'var(--color-brand-sand)'
                    }}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Complete the Look - Interactive Section */}
      <section className="py-24 bg-brand-cream border-t border-brand-sand/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <p className="text-[10px] font-mono tracking-[0.3em] text-[#8E4D3E] uppercase font-bold">EDITORIAL CURATION</p>
            <h2 className="font-serif text-3xl md:text-4xl font-normal text-brand-charcoal tracking-tight">
              Complete the Look
            </h2>
            <div className="h-[1px] w-12 bg-[#8E4D3E]/30 mx-auto" />
            <p className="text-xs sm:text-sm text-brand-muted leading-relaxed font-normal">
              Explore how our handloomed natural-dye pieces complement each other. Tap hotspots on the image or customize your sizes to purchase the coordinated ensemble.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            
            {/* Left side: Interactive Look Image with Hotspots */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              <div className="relative aspect-[4/5] sm:aspect-[16/11] lg:aspect-[4/5] bg-brand-sand/10 rounded-2xl overflow-hidden border border-brand-sand/40 shadow-sm group">
                <img
                  src={lookbookItems[activeLookIdx].image}
                  alt={lookbookItems[activeLookIdx].title}
                  className="w-full h-full object-cover select-none transition-transform duration-700 group-hover:scale-101"
                />
                
                {/* Hotspot buttons overlayed */}
                {lookbookItems[activeLookIdx].hotspots.map((spot) => {
                  const prod = allProducts.find(p => p.id === spot.productId);
                  if (!prod) return null;
                  const isActive = activeHotspotId === spot.id;
                  
                  return (
                    <div
                      key={spot.id}
                      className="absolute"
                      style={{ left: `${spot.x}%`, top: `${spot.y}%`, transform: 'translate(-50%, -50%)' }}
                    >
                      <button
                        onClick={() => setActiveHotspotId(isActive ? null : spot.id)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white shadow-md transition-all duration-300 border border-white/40 cursor-pointer ${
                          isActive ? 'bg-[#8E4D3E] scale-110' : 'bg-brand-charcoal/80 hover:bg-[#8E4D3E] scale-100'
                        }`}
                        aria-label={`Hotspot for ${prod.name}`}
                      >
                        <Plus className={`w-4 h-4 transition-transform duration-300 ${isActive ? 'rotate-45' : 'rotate-0'}`} />
                      </button>

                      {/* Hotspot Hover/Click Tooltip */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 10 }}
                            className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 bg-white border border-brand-sand/40 p-3 shadow-lg rounded-xl w-48 text-center"
                          >
                            <p className="font-serif text-xs font-medium text-brand-charcoal line-clamp-1">{prod.name}</p>
                            <p className="text-[10px] text-[#8E4D3E] font-mono mt-0.5">₹{prod.price.toLocaleString('en-IN')}</p>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onQuickShop(prod);
                              }}
                              className="mt-2 text-[9px] font-mono tracking-wider uppercase text-brand-charcoal border-b border-brand-charcoal hover:text-[#8E4D3E] hover:border-[#8E4D3E] transition-colors inline-block"
                            >
                              Quick View
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}

                {/* Location and Metadata Badges on Image */}
                <div className="absolute bottom-4 left-4 bg-black/35 backdrop-blur-xs px-3 py-1.5 rounded-full text-[9px] font-mono text-white tracking-widest uppercase flex items-center space-x-1.5 border border-white/10">
                  <MapPin className="w-3 h-3 text-brand-sand" />
                  <span>{lookbookItems[activeLookIdx].location}</span>
                </div>

                <div className="absolute top-4 right-4 bg-[#FAF7F2] border border-brand-sand/30 px-3 py-1 rounded-full text-[8.5px] font-mono text-brand-charcoal tracking-widest uppercase font-semibold">
                  {lookbookItems[activeLookIdx].season}
                </div>
              </div>

              {/* Look selectors / controls */}
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  {lookbookItems.map((look, idx) => (
                    <button
                      key={look.id}
                      onClick={() => {
                        setActiveLookIdx(idx);
                        setActiveHotspotId(null);
                      }}
                      className={`px-4 py-2 text-[9px] font-mono tracking-widest rounded-full border uppercase transition-all duration-300 cursor-pointer ${
                        activeLookIdx === idx
                          ? 'bg-brand-charcoal text-white border-brand-charcoal'
                          : 'bg-white text-brand-muted border-neutral-200/60 hover:border-brand-charcoal hover:text-brand-charcoal'
                      }`}
                    >
                      LOOK 0{idx + 1}
                    </button>
                  ))}
                </div>

                {/* Arrow navigation */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setActiveLookIdx(prev => prev === 0 ? lookbookItems.length - 1 : prev - 1);
                      setActiveHotspotId(null);
                    }}
                    className="w-10 h-10 rounded-full border border-neutral-200/60 bg-white flex items-center justify-center text-brand-charcoal hover:border-brand-charcoal hover:text-brand-charcoal transition-all cursor-pointer"
                    aria-label="Previous Look"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setActiveLookIdx(prev => prev === lookbookItems.length - 1 ? 0 : prev + 1);
                      setActiveHotspotId(null);
                    }}
                    className="w-10 h-10 rounded-full border border-neutral-200/60 bg-white flex items-center justify-center text-brand-charcoal hover:border-brand-charcoal hover:text-brand-charcoal transition-all cursor-pointer"
                    aria-label="Next Look"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right side: Items details & Quick adding */}
            <div className="lg:col-span-5 flex flex-col justify-between bg-[#FDFCFB] border border-brand-sand/35 rounded-2xl p-6 sm:p-8 space-y-8">
              
              <div className="space-y-6">
                <div>
                  <span className="text-[9px] font-mono tracking-[0.25em] text-[#8E4D3E] font-bold uppercase block mb-1">
                    COORDINATED PAIR
                  </span>
                  <h3 className="font-serif text-2xl font-normal text-brand-charcoal tracking-tight">
                    {lookbookItems[activeLookIdx].title}
                  </h3>
                  <div className="h-[1px] w-12 bg-brand-sand/60 mt-3" />
                </div>

                {/* List of Products in the current Look */}
                <div className="space-y-6">
                  {lookbookItems[activeLookIdx].hotspots.map((spot) => {
                    const prod = allProducts.find(p => p.id === spot.productId);
                    if (!prod) return null;
                    const selectedSize = selectedSizes[prod.id] || '';
                    const isAdded = addedFeedback[prod.id] || false;

                    return (
                      <div key={prod.id} className="flex gap-4 p-4 rounded-xl border border-brand-sand/20 bg-white/50 hover:bg-white transition-all duration-300">
                        {/* Tiny product thumb */}
                        <div className="w-16 h-20 bg-brand-sand/15 overflow-hidden rounded-lg flex-shrink-0 border border-brand-sand/30">
                          <img src={prod.images[0]} alt={prod.name} className="w-full h-full object-cover" />
                        </div>

                        {/* Product info */}
                        <div className="flex-grow flex flex-col justify-between">
                          <div className="space-y-1">
                            <h4 className="font-serif text-sm font-medium text-brand-charcoal line-clamp-1 leading-snug hover:text-[#8E4D3E] cursor-pointer" onClick={() => onQuickShop(prod)}>
                              {prod.name}
                            </h4>
                            <div className="flex items-center space-x-2 text-[10px] text-brand-muted font-mono">
                              <span>{prod.color}</span>
                              <span>•</span>
                              <span>₹{prod.price.toLocaleString('en-IN')}</span>
                            </div>
                          </div>

                          {/* Size selector & Add buttons */}
                          <div className="flex flex-wrap items-center gap-2.5 pt-2">
                            {/* Simple inline size pill selector */}
                            <div className="flex gap-1.5">
                              {prod.sizes.map((sz) => (
                                <button
                                  key={sz}
                                  onClick={() => setSelectedSizes(prev => ({ ...prev, [prod.id]: sz }))}
                                  className={`w-7 h-7 text-[9px] font-mono rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                                    selectedSize === sz
                                      ? 'bg-brand-charcoal text-white border-brand-charcoal font-semibold'
                                      : 'bg-white text-brand-muted border-neutral-200/50 hover:border-brand-charcoal hover:text-brand-charcoal'
                                  }`}
                                >
                                  {sz}
                                </button>
                              ))}
                            </div>

                            {/* Add button */}
                            <button
                              onClick={() => {
                                const finalSize = selectedSize || prod.sizes[0] || 'S';
                                onAddToCart(prod, finalSize, 1);
                                setAddedFeedback(prev => ({ ...prev, [prod.id]: true }));
                                setTimeout(() => {
                                  setAddedFeedback(prev => ({ ...prev, [prod.id]: false }));
                                }, 1500);
                              }}
                              className={`h-7 px-3 rounded-full text-[8.5px] font-mono tracking-wider uppercase transition-all duration-300 inline-flex items-center space-x-1 cursor-pointer ${
                                isAdded
                                  ? 'bg-[#5A7E4F] text-[#EEF3EA] border border-[#5A7E4F]'
                                  : 'bg-brand-charcoal hover:bg-[#8E4D3E] text-[#FAF7F2] border border-brand-charcoal hover:border-[#8E4D3E]'
                              }`}
                            >
                              {isAdded ? (
                                <>
                                  <Check className="w-3 h-3" />
                                  <span>ADDED</span>
                                </>
                              ) : (
                                <>
                                  <ShoppingBag className="w-3 h-3" />
                                  <span>ADD</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Shop Entire Look Bundle Button */}
              <div className="pt-6 border-t border-brand-sand/30 flex flex-col space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[9px] font-mono text-brand-muted tracking-widest uppercase">LOOK COMBINATION TOTAL</p>
                    <p className="text-lg font-serif text-brand-charcoal font-medium mt-0.5">
                      ₹{(() => {
                        const total = lookbookItems[activeLookIdx].hotspots.reduce((sum, spot) => {
                          const prod = allProducts.find(p => p.id === spot.productId);
                          return sum + (prod ? prod.price : 0);
                        }, 0);
                        return total.toLocaleString('en-IN');
                      })()}
                    </p>
                  </div>

                  {/* Add Entire Look Button */}
                  <button
                    onClick={() => {
                      const look = lookbookItems[activeLookIdx];
                      look.hotspots.forEach(spot => {
                        const prod = allProducts.find(p => p.id === spot.productId);
                        if (prod) {
                          const finalSize = selectedSizes[prod.id] || prod.sizes[0] || 'S';
                          onAddToCart(prod, finalSize, 1);
                        }
                      });
                      const bundleKey = look.id;
                      setBundleFeedback(prev => ({ ...prev, [bundleKey]: true }));
                      setTimeout(() => {
                        setBundleFeedback(prev => ({ ...prev, [bundleKey]: false }));
                      }, 2000);
                    }}
                    className={`px-6 py-3 rounded-full text-[10px] font-mono tracking-widest uppercase transition-all duration-300 inline-flex items-center space-x-2 cursor-pointer ${
                      bundleFeedback[lookbookItems[activeLookIdx].id]
                        ? 'bg-[#5A7E4F] text-[#EEF3EA] border border-[#5A7E4F] shadow-sm'
                        : 'bg-[#8E4D3E] hover:bg-brand-charcoal text-[#FAF7F2] border border-[#8E4D3E] hover:border-brand-charcoal shadow-sm'
                    }`}
                  >
                    {bundleFeedback[lookbookItems[activeLookIdx].id] ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>COORDINATES ADDED</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>SHOP ENTIRE LOOK</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Indian Shoppers Trust Grid Section */}
      <section className="py-24 bg-brand-sand/10 border-t border-brand-sand/30">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <p className="text-[10px] font-mono tracking-[0.3em] text-brand-muted uppercase">OUR QUALITY PROMISE</p>
            <h2 className="font-serif text-3xl md:text-5xl font-light text-brand-charcoal tracking-tight">
              Crafted in India, Delivered with Care
            </h2>
            <div className="h-[1px] w-12 bg-brand-charcoal/20 mx-auto" />
            <p className="text-xs text-brand-muted leading-relaxed font-light">
              We combine India's rich handloom heritage with modern convenience to give you an easy, premium shopping experience.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-brand-cream border border-brand-sand/50 p-8 space-y-4 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 border border-brand-sand flex items-center justify-center text-brand-charcoal">
                <Truck className="w-5 h-5 stroke-[1.25]" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-mono text-xs font-semibold tracking-wider uppercase text-brand-charcoal">Free Shipping Across India</h3>
                <p className="text-xs text-brand-muted font-light leading-relaxed">
                  Complimentary express shipping across all pin codes in India. Dispatched securely via Blue Dart & Delhivery.
                </p>
              </div>
            </div>

            <div className="bg-brand-cream border border-brand-sand/50 p-8 space-y-4 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 border border-brand-sand flex items-center justify-center text-brand-charcoal">
                <Coins className="w-5 h-5 stroke-[1.25]" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-mono text-xs font-semibold tracking-wider uppercase text-brand-charcoal">Cash on Delivery (COD)</h3>
                <p className="text-xs text-brand-muted font-light leading-relaxed">
                  Prefer to pay at your doorstep? Choose Cash on Delivery at checkout and seamlessly coordinate with our courier partners.
                </p>
              </div>
            </div>

            <div className="bg-brand-cream border border-brand-sand/50 p-8 space-y-4 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 border border-brand-sand flex items-center justify-center text-brand-charcoal">
                <RotateCcw className="w-5 h-5 stroke-[1.25]" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-mono text-xs font-semibold tracking-wider uppercase text-brand-charcoal">Easy 14-Day Returns</h3>
                <p className="text-xs text-brand-muted font-light leading-relaxed">
                  If the fit or drape is not perfect, we offer complimentary doorstep pickup for hassle-free returns and size exchanges.
                </p>
              </div>
            </div>

            <div className="bg-brand-cream border border-brand-sand/50 p-8 space-y-4 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 border border-brand-sand flex items-center justify-center text-brand-charcoal">
                <ShieldCheck className="w-5 h-5 stroke-[1.25]" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-mono text-xs font-semibold tracking-wider uppercase text-brand-charcoal">WhatsApp Direct Order</h3>
                <p className="text-xs text-brand-muted font-light leading-relaxed">
                  Fast checkout and concierge support. Complete your purchase via WhatsApp for instant communication and order dispatch logs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recently Viewed Section on Home Page */}
      {recentlyViewed && recentlyViewed.length > 0 && (
        <section className="py-20 border-t border-brand-sand/30 bg-brand-sand/5">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 mb-12">
              <div className="space-y-2 text-center sm:text-left">
                <span className="text-[10px] font-mono tracking-[0.3em] text-brand-muted uppercase block font-semibold">YOUR BROWSING JOURNAL</span>
                <h2 className="font-serif text-2xl md:text-3xl font-light text-brand-charcoal tracking-tight">Resume Your Exploration</h2>
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
                  onClick={() => onQuickShop(recentItem)}
                  className="group cursor-pointer flex flex-col justify-between space-y-3.5 select-none bg-brand-cream p-3 border border-brand-sand/30 hover:border-brand-sand/80 hover:shadow-sm transition-all duration-300"
                >
                  <div className="relative aspect-[3/4] bg-brand-sand/15 overflow-hidden border border-brand-sand/20">
                    <img
                      src={recentItem.images[0]}
                      alt={recentItem.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 grayscale-[2%]"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-brand-charcoal/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none mix-blend-multiply" />
                    
                    <div className="absolute bottom-2 left-2 right-2 bg-brand-cream/95 backdrop-blur-xs py-2 text-center border border-brand-sand/40 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300 ease-out z-20">
                      <span className="font-mono text-[8px] tracking-widest text-brand-charcoal uppercase font-semibold">SHOP NOW</span>
                    </div>

                    <ProductBadge
                      product={recentItem}
                      className="absolute top-2 left-2 z-10"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <span className="text-[8px] text-brand-muted font-mono uppercase tracking-wider block">{recentItem.category}</span>
                    <h4 className="text-[11px] font-serif font-light text-brand-charcoal group-hover:text-brand-muted transition-colors truncate leading-normal">
                      {recentItem.name}
                    </h4>
                    <p className="text-[10px] font-mono font-semibold text-brand-charcoal mt-0.5">₹{recentItem.price.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Premium section highlighting brand commitments with elegant icons and subtle animations */}
      <BrandCommitments />

      {/* Instagram-inspired lifestyle photo gallery with hover effects and shop details */}
      <LifestyleGallery
        allProducts={allProducts}
        onAddToCart={onAddToCart}
        onQuickShop={onQuickShop}
        setIsCartOpen={setIsCartOpen}
      />

      {/* Premium Newsletter Section */}
      <section className="py-24 bg-brand-charcoal text-brand-cream relative overflow-hidden border-t border-brand-sand/20">
        {/* Abstract subtle architectural lines or graphics */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none z-0">
          <div className="absolute top-0 left-10 w-[1px] h-full bg-brand-cream" />
          <div className="absolute top-0 right-1/4 w-[1px] h-full bg-brand-cream" />
          <div className="absolute bottom-12 left-0 w-full h-[1px] bg-brand-cream" />
        </div>

        <div className="max-w-4xl mx-auto px-6 md:px-12 relative z-10 text-center space-y-10">
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex items-center justify-center space-x-2"
            >
              <span className="h-[1px] w-6 bg-brand-sand/60"></span>
              <span className="text-[10px] font-mono tracking-[0.4em] text-brand-sand uppercase">
                THE WEAVING CIRCLE
              </span>
              <span className="h-[1px] w-6 bg-brand-sand/60"></span>
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-serif text-3xl md:text-5xl font-light text-brand-cream tracking-tight leading-tight"
            >
              Join Our Global Community
            </motion.h2>

            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xs md:text-sm text-brand-cream/70 font-light max-w-xl mx-auto leading-relaxed"
            >
              Subscribe to receive early access to our limited-run collections, special offers, and new launches. No spam, just beautifully crafted clothing.
            </motion.p>
          </div>

          {/* Form Area */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-md mx-auto"
          >
            <AnimatePresence mode="wait">
              {!subscribed ? (
                <motion.form
                  key="newsletter-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (email.trim()) {
                      setSubscribed(true);
                    }
                  }}
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col sm:flex-row items-stretch gap-3 w-full"
                >
                  <div className="relative flex-grow">
                    <span className="absolute inset-y-0 left-4 flex items-center text-brand-sand/60">
                      <Mail className="w-4 h-4" />
                    </span>
                    <input
                      type="email"
                      required
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-brand-cream/5 border border-brand-sand/30 focus:border-brand-sand text-brand-cream px-11 py-4 text-xs tracking-wider placeholder-brand-cream/40 focus:outline-none transition-all duration-300 rounded-none font-mono"
                    />
                  </div>
                  <motion.button
                    type="submit"
                    id="newsletter-subscribe-button"
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97, y: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                    className="bg-brand-sand hover:bg-brand-cream text-brand-charcoal hover:text-brand-charcoal text-xs font-mono tracking-[0.2em] px-8 py-4 uppercase transition-all duration-300 font-semibold cursor-pointer shrink-0 shadow-lg"
                  >
                    SUBSCRIBE
                  </motion.button>
                </motion.form>
              ) : (
                <motion.div
                  key="newsletter-success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-brand-sand/10 border border-brand-sand/30 p-6 flex flex-col items-center justify-center space-y-3"
                >
                  <div className="p-3 bg-brand-sand text-brand-charcoal rounded-full">
                    <Check className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <h3 className="font-serif text-lg font-light text-brand-cream">You are subscribed</h3>
                  <p className="text-[11px] text-brand-cream/70 font-mono tracking-wider">
                    Welcome to the Circle. We have sent a confirmation to {email}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Privacy reassurance */}
          <p className="text-[9px] font-mono tracking-[0.2em] text-brand-sand/40 uppercase">
            WE VALUE SPATIAL QUIET — UNCOMPROMISING PRIVACY. UNSUBSCRIBE ANYTIME.
          </p>
        </div>
      </section>

    </div>
  );
}
