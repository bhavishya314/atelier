import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, ShoppingBag, Heart, ArrowRight, Crown } from 'lucide-react';

// Data imports
import { products } from './data/products';
import { journalEntries } from './data/journal';

// Component imports
import Navbar from './components/Navbar';
import BrandLogo from './components/BrandLogo';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import ShopView from './components/ShopView';
import JournalView from './components/JournalView';
import StoryView from './components/StoryView';
import ContactView from './components/ContactView';
import NotFoundView from './components/NotFoundView';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import SizeAdvisorModal from './components/SizeAdvisorModal';
import WishlistView from './components/WishlistView';
import BottomNavigation from './components/BottomNavigation';
import QuickViewModal from './components/QuickViewModal';

import { Product, CartItem } from './types';

export default function App() {
  const [view, setView] = useState<'home' | 'shop' | 'journal' | 'story' | 'wishlist' | 'contact' | '404'>('home');
  
  // Durable local persistence state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('atelier_cart_v1');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to parse cart from local storage', e);
      return [];
    }
  });
  
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('atelier_wishlist_v1');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to parse wishlist from local storage', e);
      return [];
    }
  });

  // Drawer & Modal control states
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSizeAdvisorOpen, setIsSizeAdvisorOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Recently viewed products (session persistence)
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>(() => {
    try {
      const saved = sessionStorage.getItem('atelier_recently_viewed_v1');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to parse recently viewed from session storage', e);
      return [];
    }
  });

  const handleClearRecentlyViewed = () => {
    setRecentlyViewed([]);
    sessionStorage.removeItem('atelier_recently_viewed_v1');
  };

  useEffect(() => {
    if (selectedProduct) {
      setRecentlyViewed((prev) => {
        const filtered = prev.filter((p) => p.id !== selectedProduct.id);
        const updated = [selectedProduct, ...filtered].slice(0, 6);
        sessionStorage.setItem('atelier_recently_viewed_v1', JSON.stringify(updated));
        return updated;
      });
    }
  }, [selectedProduct]);

  useEffect(() => {
    if (quickViewProduct) {
      setRecentlyViewed((prev) => {
        const filtered = prev.filter((p) => p.id !== quickViewProduct.id);
        const updated = [quickViewProduct, ...filtered].slice(0, 6);
        sessionStorage.setItem('atelier_recently_viewed_v1', JSON.stringify(updated));
        return updated;
      });
    }
  }, [quickViewProduct]);

  // Sync cart and wishlist with localStorage
  useEffect(() => {
    localStorage.setItem('atelier_cart_v1', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('atelier_wishlist_v1', JSON.stringify(wishlist));
  }, [wishlist]);

  // Smooth scroll recovery on page navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [view]);

  const [isLoading, setIsLoading] = useState(true);

  // Disable body scroll while loading screen is present
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isLoading]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // 3 seconds for premium animation settling
    return () => clearTimeout(timer);
  }, []);

  // Add Item to Shopping Bag
  const handleAddToCart = (product: Product, size: string, quantity: number = 1) => {
    if (quantity <= 0) return;
    setCart((prev) => {
      const existsIdx = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedSize === size
      );

      if (existsIdx > -1) {
        const copy = [...prev];
        copy[existsIdx] = {
          ...copy[existsIdx],
          quantity: copy[existsIdx].quantity + quantity
        };
        return copy;
      } else {
        return [...prev, { product, selectedSize: size, quantity }];
      }
    });
    // Open cart drawer immediately for rich positive feedback
    setIsCartOpen(true);
  };

  // Adjust Quantity
  const handleUpdateQuantity = (productId: string, size: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId && item.selectedSize === size) {
            return { ...item, quantity: item.quantity + delta };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  };

  // Delete Item from Cart
  const handleRemoveItem = (productId: string, size: string) => {
    setCart((prev) => prev.filter((item) => !(item.product.id === productId && item.selectedSize === size)));
  };

  // Clear Cart after successful Checkout transaction
  const handleClearCart = () => {
    setCart([]);
  };

  // Toggle Wishlist Closet Item
  const handleToggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((w) => w.id === product.id);
      if (exists) {
        return prev.filter((w) => w.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  // Inter-view routing triggers (e.g. click item on Lookbook opens Shop view and loads detail)
  const handleQuickShop = (product: Product) => {
    setSelectedProduct(product);
    setView('shop');
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="atelier-loader"
            initial={{ y: 0, opacity: 1 }}
            exit={{ y: '-100%', opacity: 0.98 }}
            transition={{ duration: 1.15, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-50 bg-[#0c0c0c] text-brand-cream flex flex-col items-center justify-center p-6 select-none"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center justify-center"
            >
              {/* Premium custom brand stacked logo with vector path drawing animations */}
              <BrandLogo variant="stacked" theme="dark" showSubtitle={true} iconClassName="w-24 h-24 mb-6" isAnimated={true} />

              {/* Physical Studio Locations with subtle delayed fade-in */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 1.6, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center space-x-4 text-[9px] font-mono tracking-[0.35em] text-brand-sand/50 uppercase mt-4"
              >
                <span>JAIPUR</span>
                <span className="text-brand-sand/20">&bull;</span>
                <span>MUMBAI</span>
                <span className="text-brand-sand/20">&bull;</span>
                <span>NEW DELHI</span>
              </motion.div>
            </motion.div>

            {/* Bottom accent status with breath-like luxury pulse */}
            <motion.span 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: [0, 0.45, 0.25, 0.45], y: 0 }} 
              transition={{ 
                delay: 1.8, 
                duration: 2.2, 
                ease: [0.16, 1, 0.3, 1],
                opacity: { delay: 1.8, repeat: Infinity, duration: 3, repeatType: 'reverse' }
              }} 
              className="absolute bottom-10 text-[8.5px] font-mono tracking-[0.32em] text-brand-sand/40 uppercase text-center px-4"
            >
              L’EXCELLENCE EN FIBRE
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, scale: 0.985 }}
        animate={isLoading ? { opacity: 0, scale: 0.985 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
        className="bg-brand-cream text-brand-charcoal min-h-screen flex flex-col justify-between selection:bg-brand-charcoal selection:text-brand-cream font-sans pb-16 md:pb-0"
      >
      
      {/* Premium Navbar */}
      <Navbar
        currentView={view}
        setView={setView}
        cartCount={totalCartCount}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        allProducts={products}
        onQuickShop={handleQuickShop}
        onOpenQuickView={setQuickViewProduct}
        isAppLoading={isLoading}
      />

      {/* Main Container with smooth view-shifting transitions */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 12, scale: 0.995 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.995 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            {view === 'home' && (
              <HomeView
                setView={setView}
                featuredProducts={products.slice(0, 4)}
                onQuickShop={handleQuickShop}
                onOpenQuickView={setQuickViewProduct}
                recentlyViewed={recentlyViewed}
                onClearRecentlyViewed={handleClearRecentlyViewed}
                onAddToCart={handleAddToCart}
                setIsCartOpen={setIsCartOpen}
                isAppLoading={isLoading}
              />
            )}
            {view === 'shop' && (
              <ShopView
                products={products}
                onAddToCart={handleAddToCart}
                wishlist={wishlist}
                onToggleWishlist={handleToggleWishlist}
                selectedProduct={selectedProduct}
                setSelectedProduct={setSelectedProduct}
                onOpenSizeAdvisor={() => setIsSizeAdvisorOpen(true)}
                onOpenQuickView={setQuickViewProduct}
                recentlyViewed={recentlyViewed}
                onClearRecentlyViewed={handleClearRecentlyViewed}
              />
            )}
            {view === 'journal' && (
              <JournalView journalEntries={journalEntries} />
            )}
            {view === 'story' && (
              <StoryView />
            )}
            {view === 'wishlist' && (
              <WishlistView
                wishlist={wishlist}
                allProducts={products}
                onToggleWishlist={handleToggleWishlist}
                onAddToCart={handleAddToCart}
                onQuickShop={handleQuickShop}
                setView={setView}
                onOpenQuickView={setQuickViewProduct}
              />
            )}
            {view === 'contact' && (
              <ContactView />
            )}
            {view === '404' && (
              <NotFoundView setView={setView} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Premium footer */}
      <Footer
        setView={setView}
        onOpenSizeAdvisor={() => setIsSizeAdvisorOpen(true)}
      />

      {/* OVERLAY COMPONENT 1: Cart Slide Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* OVERLAY COMPONENT 2: Wishlist Favorites Drawer */}
      <AnimatePresence>
        {isWishlistOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-brand-charcoal/45 backdrop-blur-sm"
              onClick={() => setIsWishlistOpen(false)}
            />

            {/* Sliding Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 220 }}
              className="absolute top-0 right-0 w-full max-w-md h-full bg-brand-cream border-l border-brand-sand shadow-2xl p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-5 border-b border-brand-sand">
                  <div className="flex items-center space-x-2">
                    <Heart className="w-4 h-4 text-brand-charcoal" />
                    <h2 className="font-serif text-lg font-light tracking-wide">Saved Favorites</h2>
                  </div>
                  <button
                    id="close-wishlist-drawer"
                    onClick={() => setIsWishlistOpen(false)}
                    className="p-1 hover:text-brand-muted"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="overflow-y-auto max-h-[70vh] no-scrollbar divide-y divide-brand-sand/50 pt-2">
                  {wishlist.length > 0 ? (
                    wishlist.map((item) => (
                      <div key={item.id} className="py-4 flex space-x-4 items-start group">
                        <img src={item.images[0]} alt={item.name} className="w-12 h-16 object-cover bg-brand-sand/10" />
                        <div className="flex-grow flex flex-col justify-between h-16">
                          <div>
                            <div className="flex justify-between">
                              <h4 className="text-xs font-semibold tracking-wider text-brand-charcoal">{item.name}</h4>
                              <span className="text-xs font-mono font-medium text-brand-charcoal">₹{item.price.toLocaleString('en-IN')}</span>
                            </div>
                            <p className="text-[10px] text-brand-muted font-mono mt-1">{item.category}</p>
                          </div>
                          
                          <div className="flex items-center justify-between text-[10px] font-semibold tracking-wider uppercase mt-1">
                            <button
                              id={`wishlist-buy-${item.id}`}
                              onClick={() => {
                                setIsWishlistOpen(false);
                                handleQuickShop(item);
                              }}
                              className="text-brand-charcoal hover:text-brand-muted transition-colors flex items-center space-x-1"
                            >
                              <span>SHOP ITEM</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                            <button
                              id={`wishlist-remove-${item.id}`}
                              onClick={() => handleToggleWishlist(item)}
                              className="text-brand-muted hover:text-red-700 transition-colors flex items-center space-x-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>REMOVE</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-16 text-center space-y-6 flex flex-col items-center justify-center">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative flex items-center justify-center"
                      >
                        <svg className="w-20 h-20 text-brand-sand/65" viewBox="0 0 100 100" fill="none" stroke="currentColor">
                          <circle cx="50" cy="50" r="40" strokeWidth="0.5" strokeDasharray="3 3" className="opacity-40" />
                          <circle cx="50" cy="50" r="36" strokeWidth="0.75" className="opacity-20" />
                          {/* Fine-line Heart icon nested inside a hanger */}
                          <path d="M50 25 C50 21, 54 21, 54 25 C54 29, 50 29, 50 29" strokeWidth="1" strokeLinecap="round" />
                          <path d="M30 42 L50 29 L70 42 Z" strokeWidth="1" strokeLinejoin="round" />
                          <path d="M50 42 C45 35, 34 35, 34 45 C34 53, 50 63, 50 63 C50 63, 66 53, 66 45 C66 35, 55 35, 50 42 Z" strokeWidth="1" strokeLinejoin="round" className="opacity-75" fill="none" />
                        </svg>
                        <div className="absolute -bottom-1 -right-1 bg-brand-charcoal text-brand-cream p-1 rounded-full shadow-xs">
                          <Crown className="w-2.5 h-2.5" />
                        </div>
                      </motion.div>
                      
                      <div className="space-y-2 max-w-xs px-2">
                        <h3 className="font-serif text-base font-light text-brand-charcoal tracking-tight">Your closet is empty</h3>
                        <p className="text-[11px] text-brand-muted font-light leading-relaxed">
                          Save custom tailored silhouettes, fine linens, and heritage staples as you discover them.
                        </p>
                      </div>

                      <div className="pt-1.5">
                        <button
                          id="empty-wishlist-drawer-shop-btn"
                          onClick={() => {
                            setIsWishlistOpen(false);
                            setView('shop');
                          }}
                          className="px-5 py-2.5 border border-brand-charcoal hover:bg-brand-charcoal hover:text-white text-[9.5px] font-mono tracking-widest uppercase transition-colors duration-300 cursor-pointer"
                        >
                          Discover Pieces
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-brand-sand pt-6 bg-brand-sand/5">
                <button
                  id="wishlist-shop-all"
                  onClick={() => {
                    setIsWishlistOpen(false);
                    setView('wishlist');
                  }}
                  className="w-full py-4 bg-brand-charcoal hover:bg-brand-charcoal/90 text-white text-xs font-semibold tracking-widest uppercase transition-colors text-center shadow-md"
                >
                  VIEW FULL DETAILED CLOSET
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* OVERLAY COMPONENT 3: Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cart}
        onClearCart={handleClearCart}
        setView={setView}
      />

      {/* OVERLAY COMPONENT 4: Size Advisor Modal */}
      <SizeAdvisorModal
        isOpen={isSizeAdvisorOpen}
        onClose={() => setIsSizeAdvisorOpen(false)}
      />

      {/* OVERLAY COMPONENT 5: Premium Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={quickViewProduct !== null}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        wishlist={wishlist}
        onToggleWishlist={handleToggleWishlist}
        onOpenSizeAdvisor={() => {
          setQuickViewProduct(null);
          setIsSizeAdvisorOpen(true);
        }}
        onViewFullDetails={(p) => {
          setQuickViewProduct(null);
          setSelectedProduct(p);
          setView('shop');
        }}
      />

      {/* Persistent Mobile Bottom Navigation */}
      <BottomNavigation
        currentView={view}
        setView={setView}
        cartCount={totalCartCount}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
      />

    </motion.div>
    </>
  );
}
