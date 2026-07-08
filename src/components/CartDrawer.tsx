import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  Tag, 
  Truck, 
  Check, 
  AlertCircle, 
  Sparkles, 
  Percent, 
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, size: string, delta: number) => void;
  onRemoveItem: (productId: string, size: string) => void;
  onCheckout: () => void;
}

const PROMO_CODES = [
  { code: 'FESTIVE15', discount: 0.15, type: 'percent', label: '15% Festive Discount' },
  { code: 'KORA10', discount: 0.10, type: 'percent', label: '10% Atelier Handspun' },
  { code: 'WELCOME5', discount: 500, type: 'flat', label: '₹500 Flat Off' }
];

const PINCODE_DELIVERY_ZONES: Record<string, { city: string; daysExpress: number; daysStandard: number }> = {
  '110001': { city: 'New Delhi', daysExpress: 2, daysStandard: 4 },
  '400001': { city: 'Mumbai', daysExpress: 2, daysStandard: 3 },
  '560001': { city: 'Bengaluru', daysExpress: 3, daysStandard: 5 },
  '600001': { city: 'Chennai', daysExpress: 3, daysStandard: 5 },
  '700001': { city: 'Kolkata', daysExpress: 3, daysStandard: 6 },
  '302001': { city: 'Jaipur Studio', daysExpress: 1, daysStandard: 2 }
};

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout
}: CartDrawerProps) {
  // Coupon State
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<typeof PROMO_CODES[number] | null>(null);
  const [promoError, setPromoError] = useState('');
  const [isPromoOpen, setIsPromoOpen] = useState(false);
  const [showPromoSuccessToast, setShowPromoSuccessToast] = useState(false);

  // Delivery / Pincode State
  const [pincode, setPincode] = useState('110001');
  const [pincodeInput, setPincodeInput] = useState('110001');
  const [isPincodeChecking, setIsPincodeChecking] = useState(false);
  const [isPincodeValid, setIsPincodeValid] = useState(true);
  const [activeZone, setActiveZone] = useState<{ city: string; daysExpress: number; daysStandard: number } | null>({
    city: 'New Delhi',
    daysExpress: 2,
    daysStandard: 4
  });

  // Calculate base metrics
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  
  // Calculate Catalog Savings (Items with originalPrice > price)
  const catalogSavings = cartItems.reduce((acc, item) => {
    if (item.product.originalPrice && item.product.originalPrice > item.product.price) {
      return acc + (item.product.originalPrice - item.product.price) * item.quantity;
    }
    return acc;
  }, 0);

  // Calculate Coupon Discount
  let couponDiscount = 0;
  if (appliedPromo) {
    if (appliedPromo.type === 'percent') {
      couponDiscount = Math.round(subtotal * appliedPromo.discount);
    } else if (appliedPromo.type === 'flat') {
      couponDiscount = Math.min(appliedPromo.discount, subtotal);
    }
  }

  const netSubtotal = subtotal - couponDiscount;

  // Free Shipping Threshold
  const FREE_SHIPPING_LIMIT = 5000;
  const isFreeShipping = netSubtotal >= FREE_SHIPPING_LIMIT;
  const remainingForFree = FREE_SHIPPING_LIMIT - netSubtotal;
  const shippingPercent = Math.min((netSubtotal / FREE_SHIPPING_LIMIT) * 100, 100);
  const shippingCost = isFreeShipping || subtotal === 0 ? 0 : 250;

  const grandTotal = netSubtotal + shippingCost;
  const totalSavings = catalogSavings + couponDiscount;

  // Format delivery dates based on current local time (July 7, 2026)
  const getFormattedDate = (daysAhead: number) => {
    const date = new Date(); // Represents current time (synced to 2026-07-07)
    date.setDate(date.getDate() + daysAhead);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  // Run Pin Code lookup
  const handlePincodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincodeInput.trim() || pincodeInput.length < 6) {
      setIsPincodeValid(false);
      return;
    }

    setIsPincodeChecking(true);
    setIsPincodeValid(true);

    setTimeout(() => {
      setIsPincodeChecking(false);
      setPincode(pincodeInput);
      const zone = PINCODE_DELIVERY_ZONES[pincodeInput];
      if (zone) {
        setActiveZone(zone);
      } else {
        // Standard general zone fallback
        setActiveZone({
          city: 'Domestic Courier Hub',
          daysExpress: 3,
          daysStandard: 6
        });
      }
    }, 600);
  };

  // Run Promo Code application
  const handleApplyPromo = (codeStr: string) => {
    const targetCode = codeStr.trim().toUpperCase();
    if (!targetCode) return;

    const matched = PROMO_CODES.find(p => p.code === targetCode);
    if (matched) {
      setAppliedPromo(matched);
      setPromoError('');
      setPromoInput(targetCode);
      setShowPromoSuccessToast(true);
      setTimeout(() => setShowPromoSuccessToast(false), 2500);
    } else {
      setPromoError('This coupon is invalid or expired.');
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoInput('');
    setPromoError('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-brand-charcoal/45 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Core Drawer Canvas */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 240 }}
            className="absolute top-0 right-0 w-full max-w-lg h-full bg-brand-cream border-l border-brand-sand/60 shadow-2xl flex flex-col justify-between overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-brand-sand flex items-center justify-between bg-brand-cream z-10">
              <div className="flex items-center space-x-3">
                <ShoppingBag className="w-[18px] h-[18px] text-brand-charcoal" />
                <h2 className="font-serif text-xl font-light tracking-wide text-brand-charcoal">Your Shopping Bag</h2>
                <div className="font-mono text-[10px] bg-brand-sand/20 border border-brand-sand/40 px-2 py-0.5 font-bold text-brand-charcoal rounded-none">
                  {cartItems.reduce((acc, item) => acc + item.quantity, 0)} UNITS
                </div>
              </div>
              <button
                id="close-cart-drawer"
                onClick={onClose}
                className="p-1.5 border border-transparent hover:border-brand-sand/40 hover:bg-brand-sand/10 transition-all rounded-none cursor-pointer text-brand-charcoal flex items-center justify-center"
                aria-label="Close cart"
              >
                <X className="w-[18px] h-[18px]" />
              </button>
            </div>

            {/* Micro Alerts Panel */}
            <AnimatePresence>
              {showPromoSuccessToast && appliedPromo && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-emerald-800 text-white text-[10px] font-mono tracking-widest uppercase px-6 py-2 flex items-center justify-between"
                >
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 animate-bounce text-brand-sand" />
                    COUPON "{appliedPromo.code}" ENGAGED &bull; SAVED ₹{couponDiscount.toLocaleString('en-IN')}
                  </span>
                  <Check className="w-3.5 h-3.5" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Scrollable Content Container */}
            <div className="flex-grow overflow-y-auto px-6 py-4 no-scrollbar space-y-6">
              
              {/* Shipping tracker progress bar */}
              {cartItems.length > 0 && (
                <div className="bg-brand-sand/15 border border-brand-sand/40 p-4 space-y-2.5">
                  <div className="flex justify-between text-[10px] font-mono tracking-wider">
                    {isFreeShipping ? (
                      <span className="text-emerald-800 font-bold uppercase flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-800 shrink-0" />
                        Free Shipping Unlocked Across India
                      </span>
                    ) : (
                      <span className="text-brand-muted">
                        Spend <span className="font-bold text-brand-charcoal">₹{remainingForFree.toLocaleString('en-IN')}</span> more for <span className="font-bold text-brand-charcoal">Free Shipping</span>
                      </span>
                    )}
                    <span className="text-brand-charcoal font-bold">
                      ₹{netSubtotal.toLocaleString('en-IN')} / ₹5,000
                    </span>
                  </div>
                  {/* Progress track */}
                  <div className="h-1.5 w-full bg-brand-sand/35 relative overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${shippingPercent}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      className={`h-full ${isFreeShipping ? 'bg-emerald-800' : 'bg-brand-charcoal'}`}
                    />
                  </div>
                </div>
              )}

              {/* Cart List */}
              <div className="divide-y divide-brand-sand/40">
                {cartItems.length > 0 ? (
                  <AnimatePresence initial={false} mode="popLayout">
                    {cartItems.map((item) => (
                      <motion.div 
                        key={`${item.product.id}-${item.selectedSize}`} 
                        layout
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 50, filter: 'blur(2px)' }}
                        className="py-5 flex space-x-4 items-start group"
                      >
                        {/* Item Image */}
                        <div className="w-20 h-26 bg-brand-sand/20 shrink-0 border border-brand-sand/30 overflow-hidden relative">
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-full h-full object-cover grayscale-[3%]"
                            loading="lazy"
                            referrerPolicy="no-referrer"
                          />
                          {item.product.isSale && (
                            <span className="absolute top-1 left-1 bg-red-800 text-white text-[7px] font-mono tracking-widest px-1 py-0.5 font-bold uppercase">
                              SALE
                            </span>
                          )}
                        </div>

                        {/* Item Description */}
                        <div className="flex-grow flex flex-col justify-between min-h-26">
                          <div>
                            <div className="flex justify-between items-start gap-2">
                              <h4 className="text-xs font-semibold tracking-wider text-brand-charcoal uppercase line-clamp-1 flex-1">
                                {item.product.name}
                              </h4>
                              <div className="text-right shrink-0">
                                <span className="text-xs font-mono font-bold text-brand-charcoal block">
                                  ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                                </span>
                                {item.product.originalPrice && item.product.originalPrice > item.product.price && (
                                  <span className="text-[9px] font-mono text-brand-muted line-through block">
                                    ₹{(item.product.originalPrice * item.quantity).toLocaleString('en-IN')}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-x-2.5 gap-y-1 items-center mt-1 text-[9px] font-mono text-brand-muted uppercase">
                              <span>SIZE: <strong className="text-brand-charcoal font-bold">{item.selectedSize}</strong></span>
                              <span>|</span>
                              <span>COLOR: <strong className="text-brand-charcoal">{item.product.color}</strong></span>
                            </div>

                            {/* Catalog Itemized Discount Indicator */}
                            {item.product.originalPrice && item.product.originalPrice > item.product.price && (
                              <div className="mt-1 text-[8px] font-mono text-emerald-800 font-semibold bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded-none inline-block uppercase tracking-wider">
                                Saved ₹{((item.product.originalPrice - item.product.price) * item.quantity).toLocaleString('en-IN')}
                              </div>
                            )}
                          </div>

                          {/* Modifier Buttons */}
                          <div className="flex items-center justify-between pt-3">
                            <div className="flex items-center border border-brand-sand bg-brand-cream/60 divide-x divide-brand-sand">
                              <button
                                id={`qty-decrease-${item.product.id}-${item.selectedSize}`}
                                onClick={() => onUpdateQuantity(item.product.id, item.selectedSize, -1)}
                                className="w-8 h-8 flex items-center justify-center hover:bg-brand-sand/15 transition-colors cursor-pointer"
                                aria-label="Decrease quantity"
                              >
                                {item.quantity === 1 ? (
                                  <Trash2 className="w-3 h-3 text-brand-muted hover:text-red-800 transition-colors" />
                                ) : (
                                  <Minus className="w-2.5 h-2.5 text-brand-charcoal" />
                                )}
                              </button>
                              <span className="font-mono text-xs w-8 text-center text-brand-charcoal font-bold">
                                {item.quantity}
                              </span>
                              <button
                                id={`qty-increase-${item.product.id}-${item.selectedSize}`}
                                onClick={() => onUpdateQuantity(item.product.id, item.selectedSize, 1)}
                                className="w-8 h-8 flex items-center justify-center hover:bg-brand-sand/15 transition-colors cursor-pointer"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-2.5 h-2.5 text-brand-charcoal" />
                              </button>
                            </div>

                            {/* Direct Delete */}
                            <button
                              id={`remove-item-${item.product.id}-${item.selectedSize}`}
                              onClick={() => onRemoveItem(item.product.id, item.selectedSize)}
                              className="p-1.5 text-brand-muted hover:text-red-800 transition-colors flex items-center gap-1 text-[9px] font-mono uppercase tracking-widest border border-transparent hover:border-brand-sand/30"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span className="hidden sm:inline">Delete</span>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center py-16 text-center space-y-6">
                    {/* Elegant Hand-spun Spool Line-art */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 5 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      className="relative flex items-center justify-center"
                    >
                      <svg className="w-20 h-20 text-brand-charcoal/80" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                        {/* Background balance circles */}
                        <circle cx="50" cy="50" r="44" strokeWidth="0.5" strokeDasharray="3 3" className="text-brand-muted/30" />
                        <circle cx="50" cy="50" r="38" strokeWidth="0.5" className="text-brand-muted/20" />
                        
                        {/* Wooden Thread Spool / Loom Outline */}
                        <path d="M30 30 L70 30" strokeWidth="1.25" className="text-brand-charcoal" />
                        <path d="M30 70 L70 70" strokeWidth="1.25" className="text-brand-charcoal" />
                        <line x1="38" y1="30" x2="38" y2="70" strokeWidth="1" />
                        <line x1="62" y1="30" x2="62" y2="70" strokeWidth="1" />
                        
                        {/* Thread wind wraps */}
                        <path d="M38 35 C42 34, 58 34, 62 35 M38 41 C42 40, 58 40, 62 41 M38 47 C42 46, 58 46, 62 47 M38 53 C42 52, 58 52, 62 53 M38 59 C42 58, 58 58, 62 59 M38 65 C42 64, 58 64, 62 65" strokeWidth="0.75" className="text-brand-sand" />
                        
                        {/* Free hanging single thread loop */}
                        <path d="M62 53 C72 53, 70 75, 50 82 C42 86, 32 82, 32 75" strokeWidth="0.75" strokeDasharray="2 2" className="text-brand-muted/60" />
                      </svg>
                      <div className="absolute top-1 right-1 bg-brand-charcoal text-brand-cream p-1.5 rounded-full shadow-md">
                        <ShoppingBag className="w-3 h-3 text-brand-sand" />
                      </div>
                    </motion.div>
 
                    <div className="space-y-2.5 max-w-xs px-4">
                      <span className="text-[9px] font-mono tracking-[0.35em] text-brand-muted uppercase block font-semibold">Slow Fashion</span>
                      <h3 className="font-serif text-xl font-light text-brand-charcoal tracking-tight">Your Shopping Bag is Empty</h3>
                      <p className="text-[11px] text-brand-muted font-sans font-light leading-relaxed">
                        Atelier Kora garments are spun slowly to last long. Discover handcrafted, timeless clothing made for everyday comfort.
                      </p>
                    </div>

                    <div className="pt-2">
                      <button
                        id="cart-drawer-empty-cta"
                        onClick={onClose}
                        className="px-8 py-3 bg-brand-charcoal hover:bg-brand-charcoal/90 text-white text-[9.5px] font-mono tracking-[0.25em] uppercase transition-all duration-300 shadow-sm cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
                      >
                        Explore Our Collection
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* INTERACTIVE DELIVERY ESTIMATOR & PINCODE LOOKUP */}
              {cartItems.length > 0 && (
                <div className="pt-4 border-t border-brand-sand/40 space-y-3">
                  <div className="flex items-center space-x-2 text-[10px] font-mono tracking-[0.2em] text-brand-muted uppercase">
                    <Truck className="w-3.5 h-3.5" />
                    <span>Liner Courier Logistics Delivery</span>
                  </div>

                  <form onSubmit={handlePincodeSubmit} className="flex gap-2">
                    <div className="relative flex-grow">
                      <input
                        type="text"
                        placeholder="ENTER PIN CODE (E.G. 400001)"
                        value={pincodeInput}
                        maxLength={6}
                        onChange={(e) => {
                          setPincodeInput(e.target.value.replace(/\D/g, ''));
                          setIsPincodeValid(true);
                        }}
                        className={`w-full bg-brand-sand/10 border p-2.5 text-xs font-mono tracking-wider focus:outline-none focus:border-brand-charcoal rounded-none ${
                          isPincodeValid ? 'border-brand-sand/65' : 'border-red-600'
                        }`}
                      />
                      {pincodeInput && (
                        <button
                          type="button"
                          onClick={() => setPincodeInput('')}
                          className="absolute right-2.5 top-2.5 text-brand-muted hover:text-brand-charcoal"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <button
                      type="submit"
                      disabled={isPincodeChecking}
                      className="px-4 bg-brand-charcoal hover:bg-brand-charcoal/95 text-white font-mono text-[10px] tracking-widest uppercase cursor-pointer transition-colors disabled:opacity-50"
                    >
                      {isPincodeChecking ? 'CHECKING...' : 'ESTIMATE'}
                    </button>
                  </form>

                  {!isPincodeValid && (
                    <p className="text-[10px] text-red-700 font-mono flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>Please specify a valid 6-digit Indian PIN code.</span>
                    </p>
                  )}

                  {activeZone && isPincodeValid && !isPincodeChecking && (
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-brand-sand/10 border border-brand-sand/20 p-3.5 space-y-2 text-[11px] leading-relaxed"
                    >
                      <div className="flex justify-between font-mono text-[9px] text-brand-muted tracking-wider">
                        <span>DELIVERY TO: {activeZone.city.toUpperCase()} ({pincode})</span>
                        <span className="text-emerald-800 font-semibold uppercase">ACTIVE COURIER ROUTE</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 pt-1.5 border-t border-brand-sand/25">
                        <div className="space-y-1">
                          <span className="text-[8px] font-mono text-brand-muted uppercase block">EXPRESS AIR COURIER:</span>
                          <span className="font-bold text-brand-charcoal block text-[11px]">
                            {getFormattedDate(activeZone.daysExpress)} &bull; Free above ₹5k
                          </span>
                        </div>
                        <div className="space-y-1 border-l border-brand-sand/30 pl-4">
                          <span className="text-[8px] font-mono text-brand-muted uppercase block">STANDARD GROUND COURIER:</span>
                          <span className="text-brand-muted block text-[11px]">
                            {getFormattedDate(activeZone.daysStandard)} &bull; Sustainable
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1.5 pt-1 text-[9px] text-brand-muted font-sans font-light italic">
                        <Info className="w-3 h-3 text-brand-muted" />
                        <span>All Atelier packages are hand-packed in chemical-free unbleached cotton pouches.</span>
                      </div>
                    </motion.div>
                  )}

                  {/* Quick ZIP selection */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[8px] font-mono text-brand-muted uppercase">Try major cities:</span>
                    {Object.keys(PINCODE_DELIVERY_ZONES).map((pinCode) => (
                      <button
                        type="button"
                        key={pinCode}
                        onClick={() => {
                          setPincodeInput(pinCode);
                          setPincode(pinCode);
                          setActiveZone(PINCODE_DELIVERY_ZONES[pinCode]);
                          setIsPincodeValid(true);
                        }}
                        className={`text-[8.5px] font-mono border px-2 py-0.5 transition-colors cursor-pointer ${
                          pincode === pinCode
                            ? 'bg-brand-charcoal text-white border-brand-charcoal font-bold'
                            : 'border-brand-sand hover:border-brand-charcoal text-brand-muted hover:text-brand-charcoal'
                        }`}
                      >
                        {PINCODE_DELIVERY_ZONES[pinCode].city.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* COLLAPSIBLE PROMO CODE ENGINE */}
              {cartItems.length > 0 && (
                <div className="border-t border-brand-sand/40 pt-4 space-y-2.5">
                  <button
                    type="button"
                    onClick={() => setIsPromoOpen(!isPromoOpen)}
                    className="w-full flex items-center justify-between text-[10px] font-mono tracking-[0.2em] text-brand-muted hover:text-brand-charcoal uppercase cursor-pointer py-1"
                  >
                    <div className="flex items-center space-x-2">
                      <Tag className="w-3.5 h-3.5 text-brand-muted" />
                      <span>Apply Atelier Promo Offers</span>
                      {appliedPromo && (
                        <span className="ml-2 px-1.5 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-200 text-[8px] font-bold">
                          1 COU APPLIED
                        </span>
                      )}
                    </div>
                    {isPromoOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  <AnimatePresence initial={false}>
                    {isPromoOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden space-y-3 pt-1"
                      >
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="ENTER PROMO CODE (E.G. FESTIVE15)"
                            value={promoInput}
                            onChange={(e) => {
                              setPromoInput(e.target.value.toUpperCase());
                              setPromoError('');
                            }}
                            className="flex-grow bg-brand-sand/10 border border-brand-sand/65 p-2 text-xs font-mono tracking-widest focus:outline-none focus:border-brand-charcoal rounded-none uppercase"
                          />
                          {appliedPromo ? (
                            <button
                              type="button"
                              onClick={handleRemovePromo}
                              className="px-4 bg-red-800 hover:bg-red-900 text-white font-mono text-[10px] tracking-widest uppercase transition-colors cursor-pointer"
                            >
                              REMOVE
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleApplyPromo(promoInput)}
                              className="px-4 bg-brand-charcoal hover:bg-brand-charcoal/95 text-white font-mono text-[10px] tracking-widest uppercase transition-colors cursor-pointer"
                            >
                              APPLY
                            </button>
                          )}
                        </div>

                        {promoError && (
                          <p className="text-[10px] text-red-700 font-mono flex items-center gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>{promoError}</span>
                          </p>
                        )}

                        {/* Suggested Code Cards */}
                        <div className="space-y-1.5 pt-1">
                          <span className="text-[8px] font-mono text-brand-muted uppercase block font-semibold">Available Atelier Offers:</span>
                          <div className="grid grid-cols-1 gap-1.5">
                            {PROMO_CODES.map((promo) => {
                              const isThisApplied = appliedPromo?.code === promo.code;
                              return (
                                <button
                                  key={promo.code}
                                  type="button"
                                  onClick={() => handleApplyPromo(promo.code)}
                                  className={`w-full flex items-center justify-between p-2.5 border text-left transition-all cursor-pointer ${
                                    isThisApplied 
                                      ? 'bg-emerald-50/50 border-emerald-800' 
                                      : 'border-brand-sand/40 hover:border-brand-charcoal hover:bg-brand-sand/5'
                                  }`}
                                >
                                  <div>
                                    <div className="flex items-center space-x-1.5">
                                      <span className="font-mono text-xs font-bold text-brand-charcoal tracking-widest uppercase">{promo.code}</span>
                                      <span className="bg-brand-charcoal/5 px-1 py-0.5 text-[7.5px] font-mono tracking-wider font-semibold text-brand-muted rounded-none uppercase">
                                        {promo.type === 'percent' ? `${promo.discount * 100}% Off` : `₹${promo.discount} Off`}
                                      </span>
                                    </div>
                                    <p className="text-[10px] text-brand-muted font-sans font-light mt-0.5 leading-tight">{promo.label}</p>
                                  </div>
                                  <div className={`w-4 h-4 border flex items-center justify-center rounded-none transition-colors ${
                                    isThisApplied ? 'bg-emerald-800 border-emerald-800 text-white' : 'border-brand-sand bg-transparent'
                                  }`}>
                                    {isThisApplied && <Check className="w-2.5 h-2.5" />}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

            </div>

            {/* Bottom calculation footer block */}
            {cartItems.length > 0 && (
              <div className="border-t border-brand-sand bg-brand-sand/15 p-6 space-y-4">
                
                {/* Calculations summary */}
                <div className="space-y-2.5">
                  <div className="flex justify-between text-xs font-mono tracking-wider text-brand-muted">
                    <span>CART SUBTOTAL</span>
                    <span className="font-semibold text-brand-charcoal">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>

                  {catalogSavings > 0 && (
                    <div className="flex justify-between text-xs font-mono tracking-wider text-emerald-800">
                      <span>AUTOMATIC CLOSET DISCOUNT</span>
                      <span className="font-bold">-₹{catalogSavings.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  {appliedPromo && (
                    <div className="flex justify-between text-xs font-mono tracking-wider text-emerald-800">
                      <span>PROMO DISCOUNT ({appliedPromo.code})</span>
                      <span className="font-bold">-₹{couponDiscount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-xs font-mono tracking-wider text-brand-muted">
                    <span>DOMESTIC LOGISTICS COURIER</span>
                    <span className="font-semibold text-brand-charcoal">
                      {shippingCost === 0 ? 'COMPLIMENTARY' : `₹${shippingCost.toLocaleString('en-IN')}`}
                    </span>
                  </div>

                  <div className="h-[1px] bg-brand-sand/40 my-1" />

                  {/* Savings display summary */}
                  {totalSavings > 0 && (
                    <div className="bg-emerald-50/75 border border-emerald-800/15 p-2.5 text-center text-[10.5px] text-emerald-800 font-mono tracking-wide uppercase">
                      🎉 Sustainable saving of <strong className="font-bold">₹{totalSavings.toLocaleString('en-IN')}</strong> applied!
                    </div>
                  )}

                  <div className="flex justify-between items-baseline pt-1">
                    <div className="space-y-0.5">
                      <span className="font-serif text-sm tracking-wide text-brand-charcoal uppercase font-medium">Grand Total Est.</span>
                      <p className="text-[9px] font-mono text-brand-muted uppercase">Including central logistics & VAT</p>
                    </div>
                    <span className="font-mono text-2xl font-black text-brand-charcoal">
                      ₹{grandTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Checkout buttons */}
                <div className="space-y-2.5 pt-1">
                  <button
                    id="checkout-drawer-trigger"
                    onClick={onCheckout}
                    disabled={cartItems.length === 0}
                    className="w-full py-4 text-xs font-bold tracking-[0.2em] uppercase transition-all flex items-center justify-center space-x-2.5 cursor-pointer bg-brand-charcoal text-white hover:bg-brand-charcoal/90 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                  >
                    <span>PROCEED TO CONCIERGE CHECKOUT</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    id="continue-shopping"
                    onClick={onClose}
                    className="w-full text-center py-1.5 text-[10.5px] font-bold tracking-[0.15em] text-brand-muted hover:text-brand-charcoal transition-colors uppercase border-b border-transparent hover:border-brand-charcoal/40"
                  >
                    &larr; Continue Exploring Collections
                  </button>

                  <div className="flex items-center justify-between pt-3.5 text-[8.5px] font-mono tracking-wider text-brand-muted border-t border-brand-sand/35">
                    <span className="flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 bg-emerald-800 rounded-full" />
                      <span>COD OK</span>
                    </span>
                    <span>|</span>
                    <span className="flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 bg-emerald-800 rounded-full" />
                      <span>14-DAY EXCHANGES</span>
                    </span>
                    <span>|</span>
                    <span className="flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 bg-emerald-800 rounded-full" />
                      <span>DISPATCH LOGS</span>
                    </span>
                  </div>
                </div>

              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
