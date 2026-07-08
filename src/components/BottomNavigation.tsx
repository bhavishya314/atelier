import React from 'react';
import { motion } from 'motion/react';
import { Home, Search, Heart, ShoppingBag } from 'lucide-react';

interface BottomNavigationProps {
  currentView: 'home' | 'shop' | 'journal' | 'story' | 'wishlist' | 'contact' | '404';
  setView: (view: 'home' | 'shop' | 'journal' | 'story' | 'wishlist' | 'contact' | '404') => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
}

export default function BottomNavigation({
  currentView,
  setView,
  cartCount,
  wishlistCount,
  onOpenCart,
}: BottomNavigationProps) {
  interface NavItem {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    action: () => void;
    isActive: boolean;
    badge?: number;
  }

  const navItems: NavItem[] = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      action: () => setView('home'),
      isActive: currentView === 'home',
    },
    {
      id: 'shop',
      label: 'Shop',
      icon: Search,
      action: () => setView('shop'),
      isActive: currentView === 'shop',
    },
    {
      id: 'wishlist',
      label: 'Wishlist',
      icon: Heart,
      action: () => setView('wishlist'),
      isActive: currentView === 'wishlist',
      badge: wishlistCount,
    },
    {
      id: 'cart',
      label: 'Bag',
      icon: ShoppingBag,
      action: onOpenCart,
      isActive: false, // Opened via drawer
      badge: cartCount,
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-brand-cream/95 backdrop-blur-md border-t border-brand-sand/50 shadow-lg px-4 pb-safe-bottom">
      <div className="h-16 flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={item.action}
              className="relative flex flex-col items-center justify-center w-16 h-full text-brand-charcoal focus:outline-none touch-manipulation cursor-pointer"
              aria-label={item.label}
            >
              {/* Active Highlight Background Dot */}
              {item.isActive && (
                <motion.span
                  layoutId="bottom-nav-indicator"
                  className="absolute top-1 w-1 h-1 rounded-full bg-brand-charcoal"
                  transition={{ type: 'spring', damping: 15, stiffness: 300 }}
                />
              )}

              <div className="relative mt-1">
                <Icon
                  className={`w-[18px] h-[18px] transition-all duration-300 ${
                    item.isActive
                      ? 'text-brand-charcoal'
                      : 'text-brand-muted/70 hover:text-brand-charcoal'
                  }`}
                />

                {/* Counter Badges */}
                {item.badge !== undefined && item.badge > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1.5 -right-2 bg-brand-charcoal text-white font-mono text-[8px] font-bold h-3.5 min-w-[14px] px-1 rounded-full flex items-center justify-center border border-brand-cream"
                  >
                    {item.badge}
                  </motion.span>
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[9px] font-mono tracking-wider mt-1 transition-all duration-300 uppercase ${
                  item.isActive
                    ? 'text-brand-charcoal font-semibold scale-102'
                    : 'text-brand-muted/75 font-normal'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
