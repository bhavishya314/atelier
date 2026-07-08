import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, ArrowRight, ShieldCheck, CreditCard, CheckCircle } from 'lucide-react';
import { CartItem } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onClearCart: () => void;
  setView: (view: 'home' | 'shop' | 'journal' | 'story') => void;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  onClearCart,
  setView
}: CheckoutModalProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 1: Shipping, 2: Payment, 3: Processing, 4: Confirmed
  const [processingState, setProcessingState] = useState(0); // 0 to 3 loading phases
  
  // Order information state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    country: 'India'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [orderId, setOrderId] = useState('');
  
  // Festive coupon states
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState('');

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const isFreeShipping = subtotal >= 5000;
  const shippingCost = isFreeShipping ? 0 : 250;
  
  // Calculate discount using applied coupon
  const discountAmount = appliedCoupon === 'FESTIVE15' ? Math.round(subtotal * 0.15) : 0;
  const finalTotal = subtotal - discountAmount + shippingCost;

  // Generate random order ID
  useEffect(() => {
    if (isOpen) {
      const rand = Math.floor(1000 + Math.random() * 9000);
      setOrderId(`ATL-2026-X${rand}`);
    }
  }, [isOpen]);

  // Handle simulated background booking phases
  useEffect(() => {
    if (step === 3) {
      const timers = [
        setTimeout(() => setProcessingState(1), 1000), // warehouse assembly
        setTimeout(() => setProcessingState(2), 2200), // courier booking
        setTimeout(() => {
          setStep(4);
          onClearCart(); // empty cart upon completion
        }, 3600)
      ];
      return () => timers.forEach(clearTimeout);
    }
  }, [step, onClearCart]);

  const handleInputChange = (field: string, val: string) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const validateStep1 = () => {
    const tempErrors: Record<string, string> = {};
    if (!formData.name.trim()) tempErrors.name = 'Full name is required';
    if (!formData.email.trim() || !formData.email.includes('@')) tempErrors.email = 'Valid email is required';
    if (!formData.address.trim()) tempErrors.address = 'Street address is required';
    if (!formData.city.trim()) tempErrors.city = 'City is required';
    if (!formData.zip.trim()) tempErrors.zip = 'ZIP/Postal code is required';
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const triggerWhatsAppOrder = () => {
    const itemsText = cartItems
      .map(
        (item) =>
          `• ${item.product.name} (Size: ${item.selectedSize}) x ${item.quantity} - ₹${(
            item.product.price * item.quantity
          ).toLocaleString('en-IN')}`
      )
      .join('\n');

    const couponText = appliedCoupon
      ? `\n*Promo Code Applied:* ${appliedCoupon} (-₹${discountAmount.toLocaleString('en-IN')})`
      : '';

    const shippingText = shippingCost === 0 ? 'COMPLIMENTARY' : `₹${shippingCost.toLocaleString('en-IN')}`;

    const message = `🌟 *ATELIER KORA - NEW ORDER REQUEST* 🌟

*Order Reference:* ${orderId}

*--- CUSTOMER INFORMATION ---*
*Name:* ${formData.name}
*Email:* ${formData.email}
*Delivery Address:* ${formData.address}, ${formData.city} - ${formData.zip}, India

*--- ORDER ITEMS ---*
${itemsText}
${couponText}

*--- PRICE SUMMARY ---*
*Subtotal:* ₹${subtotal.toLocaleString('en-IN')}
*Shipping:* ${shippingText}
*GRAND TOTAL:* ₹${finalTotal.toLocaleString('en-IN')}

_Please confirm my order and share delivery logistics details. Thank you!_`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/917470558303?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (validateStep1()) {
        triggerWhatsAppOrder();
        setStep(3);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center">
          
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-brand-charcoal/45 backdrop-blur-sm"
            onClick={step < 3 ? onClose : undefined} // lock backdrop clicking once processing
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.35 }}
            className="relative w-full max-w-4xl h-[90vh] md:h-auto md:max-h-[85vh] bg-brand-cream shadow-2xl flex flex-col z-10 overflow-hidden rounded-none"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-brand-sand flex items-center justify-between">
              <span className="font-serif text-lg font-light tracking-widest text-brand-charcoal">SECURE CHECKOUT</span>
              {step < 3 && (
                <button
                  id="cancel-checkout"
                  onClick={onClose}
                  className="p-1.5 hover:text-brand-muted transition-colors flex items-center justify-center cursor-pointer"
                >
                  <X className="w-[18px] h-[18px]" />
                </button>
              )}
            </div>

            {/* Split Grid */}
            <div className="flex-grow overflow-y-auto grid grid-cols-1 md:grid-cols-12">
              
              {/* Form panel */}
              <div className="md:col-span-7 p-6 md:p-8 border-b md:border-b-0 md:border-r border-brand-sand/55 flex flex-col justify-between">
                
                {/* Step Indicators */}
                {step < 3 && (
                  <div className="flex items-center space-x-4 mb-8 text-[10px] font-mono tracking-widest">
                    <span className={`${step === 1 ? 'text-brand-charcoal font-semibold border-b border-brand-charcoal' : 'text-brand-muted'}`}>
                      1. SHIPPING DETAILS
                    </span>
                    <span className="text-brand-sand">/</span>
                    <span className="text-brand-muted">2. WHATSAPP CONFIRMATION</span>
                  </div>
                )}

                {/* Step 1 Content: Shipping */}
                {step === 1 && (
                  <div className="space-y-4">
                    <h3 className="font-serif text-lg text-brand-charcoal font-light mb-4">Courier Shipping Details</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono tracking-wider text-brand-muted uppercase mb-1">Full Name</label>
                        <input
                          id="checkout-name"
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="w-full bg-brand-sand/15 border border-brand-sand p-2.5 text-xs focus:outline-none focus:border-brand-charcoal rounded-none"
                        />
                        {errors.name && <p className="text-[10px] text-red-600 font-mono mt-1">{errors.name}</p>}
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono tracking-wider text-brand-muted uppercase mb-1">Email Address</label>
                        <input
                          id="checkout-email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="w-full bg-brand-sand/15 border border-brand-sand p-2.5 text-xs focus:outline-none focus:border-brand-charcoal rounded-none"
                        />
                        {errors.email && <p className="text-[10px] text-red-600 font-mono mt-1">{errors.email}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono tracking-wider text-brand-muted uppercase mb-1">Delivery Address</label>
                      <input
                        id="checkout-address"
                        type="text"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className="w-full bg-brand-sand/15 border border-brand-sand p-2.5 text-xs focus:outline-none focus:border-brand-charcoal rounded-none"
                        placeholder="Apartment, suite, unit, street number"
                      />
                      {errors.address && <p className="text-[10px] text-red-600 font-mono mt-1">{errors.address}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-mono tracking-wider text-brand-muted uppercase mb-1">City</label>
                        <input
                          id="checkout-city"
                          type="text"
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          className="w-full bg-brand-sand/15 border border-brand-sand p-2.5 text-xs focus:outline-none focus:border-brand-charcoal rounded-none"
                        />
                        {errors.city && <p className="text-[10px] text-red-600 font-mono mt-1">{errors.city}</p>}
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono tracking-wider text-brand-muted uppercase mb-1">ZIP / Postal</label>
                        <input
                          id="checkout-zip"
                          type="text"
                          value={formData.zip}
                          onChange={(e) => handleInputChange('zip', e.target.value)}
                          className="w-full bg-brand-sand/15 border border-brand-sand p-2.5 text-xs focus:outline-none focus:border-brand-charcoal rounded-none"
                        />
                        {errors.zip && <p className="text-[10px] text-red-600 font-mono mt-1">{errors.zip}</p>}
                      </div>
                    </div>

                    <div className="pt-6">
                      <button
                        id="step1-continue"
                        onClick={handleNextStep}
                        className="w-full py-3.5 bg-brand-charcoal hover:bg-brand-charcoal/90 text-white text-xs font-semibold tracking-widest uppercase transition-all flex items-center justify-center space-x-2 shadow-md cursor-pointer"
                      >
                        <span>ORDER VIA WHATSAPP (₹{finalTotal.toLocaleString('en-IN')})</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3 Content: Processing Animation */}
                {step === 3 && (
                  <div className="h-64 flex flex-col items-center justify-center text-center space-y-6">
                    {/* Minimal Circular Spinner */}
                    <div className="w-10 h-10 border-2 border-brand-charcoal border-t-transparent rounded-full animate-spin" />
                    
                    <div className="space-y-2">
                      <p className="text-[10px] font-mono tracking-[0.2em] text-brand-muted uppercase">GENERATING ORDER DETAILS</p>
                      
                      <AnimatePresence mode="wait">
                        {processingState === 0 && (
                          <motion.h4
                            key="p0"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="font-serif text-lg font-light text-brand-charcoal"
                          >
                            Formulating your bespoke order invoice...
                          </motion.h4>
                        )}
                        {processingState === 1 && (
                          <motion.h4
                            key="p1"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="font-serif text-lg font-light text-brand-charcoal"
                          >
                            Reserving handloom fabric allocations in our Jaipur studio...
                          </motion.h4>
                        )}
                        {processingState === 2 && (
                          <motion.h4
                            key="p2"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="font-serif text-lg font-light text-brand-charcoal"
                          >
                            Redirecting securely to WhatsApp concierge...
                          </motion.h4>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                )}

                {/* Step 4 Content: Confirmed Success! */}
                {step === 4 && (
                  <div className="space-y-6 py-4">
                    <div className="flex flex-col items-center text-center space-y-3">
                      <CheckCircle className="w-12 h-12 text-emerald-700 animate-bounce" />
                      <span className="font-mono text-[9px] tracking-[0.3em] text-brand-muted uppercase">ORDER CONFIRMED</span>
                      <h3 className="font-serif text-2xl md:text-3xl font-light text-brand-charcoal tracking-tight leading-tight">
                        Order Transmitted
                      </h3>
                      <p className="text-xs text-brand-muted max-w-sm font-light">
                        Thank you for your interest, {formData.name}. Your order details have been successfully prepared and opened in WhatsApp. Our bespoke boutique concierge will confirm your shipping timeline and parcel logs directly.
                      </p>
                    </div>

                    <div className="bg-brand-sand/20 border border-brand-sand/50 p-4 space-y-2 text-xs font-mono text-brand-muted">
                      <div className="flex justify-between">
                        <span>ORDER REFERENCE:</span>
                        <span className="font-bold text-brand-charcoal">{orderId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>DELIVERY TYPE:</span>
                        <span className="font-medium text-brand-charcoal">BLUE DART EXPRESS</span>
                      </div>
                      <div className="flex justify-between">
                        <span>EST. DELIVERY WINDOW:</span>
                        <span className="font-bold text-emerald-800">JULY 11, 2026 - JULY 13, 2026</span>
                      </div>
                    </div>

                    <div className="pt-4 flex flex-col sm:flex-row gap-3">
                      <button
                        id="return-home-checkout"
                        onClick={() => {
                          onClose();
                          setView('home');
                        }}
                        className="flex-grow py-3 border border-brand-sand hover:bg-brand-sand/30 text-brand-charcoal text-xs font-semibold tracking-widest uppercase transition-colors text-center cursor-pointer"
                      >
                        RETURN HOME
                      </button>
                      <button
                        id="return-shop-checkout"
                        onClick={() => {
                          onClose();
                          setView('shop');
                        }}
                        className="flex-grow py-3 bg-brand-charcoal hover:bg-brand-charcoal/90 text-white text-xs font-semibold tracking-widest uppercase transition-colors text-center shadow-md cursor-pointer"
                      >
                        CONTINUE BROWSING
                      </button>
                    </div>
                  </div>
                )}

              </div>

              {/* Order Summary side */}
              <div className="md:col-span-5 p-6 md:p-8 bg-brand-sand/10 flex flex-col justify-between">
                
                {/* Cart summary list */}
                <div className="space-y-6">
                  <h4 className="text-[10px] font-mono tracking-wider text-brand-muted uppercase border-b border-brand-sand/50 pb-2">
                    BAG SUMMARY ({cartItems.length} ITEMS)
                  </h4>
                  
                  <div className="space-y-4 max-h-[30vh] overflow-y-auto no-scrollbar divide-y divide-brand-sand/30">
                    {cartItems.map((item, idx) => (
                      <div key={idx} className="flex space-x-3 items-start pt-3 first:pt-0">
                        <img src={item.product.images[0]} alt={item.product.name} className="w-10 h-13 object-cover" loading="lazy" referrerPolicy="no-referrer" />
                        <div className="flex-grow">
                          <h5 className="text-[11px] font-semibold tracking-wider text-brand-charcoal leading-tight">
                            {item.product.name}
                          </h5>
                          <p className="text-[9px] font-mono text-brand-muted mt-1">
                            SIZE: {item.selectedSize} / QTY: {item.quantity}
                          </p>
                        </div>
                        <span className="text-[11px] font-mono text-brand-charcoal">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Coupon Code block */}
                <div className="border-t border-brand-sand pt-6 mt-6 space-y-2">
                  <span className="font-mono text-[9px] tracking-wider text-brand-muted uppercase font-semibold block">OFFER OR PROMO CODE:</span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="ENTER FESTIVE15"
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value.toUpperCase());
                        setCouponError('');
                      }}
                      disabled={appliedCoupon !== null}
                      className="flex-grow bg-brand-cream border border-brand-sand p-2 text-xs font-mono tracking-widest focus:outline-none focus:border-brand-charcoal uppercase disabled:opacity-60"
                    />
                    {appliedCoupon ? (
                      <button
                        type="button"
                        onClick={() => {
                          setAppliedCoupon(null);
                          setCouponCode('');
                        }}
                        className="px-4 py-2 bg-red-800 text-white font-mono text-[10px] tracking-widest uppercase hover:bg-red-900 transition-colors cursor-pointer"
                      >
                        REMOVE
                      </button>
                    ) : (
                      <button
                        type="button"
                        id="apply-coupon-button"
                        onClick={() => {
                          if (couponCode.trim() === 'FESTIVE15') {
                            setAppliedCoupon('FESTIVE15');
                            setCouponError('');
                          } else {
                            setCouponError('Invalid coupon code');
                          }
                        }}
                        className="px-4 py-2 bg-brand-charcoal text-white font-mono text-[10px] tracking-widest uppercase hover:bg-brand-charcoal/90 transition-colors cursor-pointer"
                      >
                        APPLY
                      </button>
                    )}
                  </div>
                  {couponError && <p className="text-[10px] text-red-600 font-mono">{couponError}</p>}
                  {appliedCoupon && (
                    <p className="text-[10px] text-emerald-700 font-mono flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      <span>CODE FESTIVE15 APPLIED — 15% FESTIVE DISCOUNT SAVED</span>
                    </p>
                  )}
                </div>

                 {/* Price calculations */}
                <div className="border-t border-brand-sand pt-6 mt-6 space-y-3">
                  <div className="flex justify-between text-[11px] font-mono tracking-wider text-brand-muted">
                    <span>SUBTOTAL</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-[11px] font-mono tracking-wider text-emerald-700 font-medium">
                      <span>FESTIVE DISCOUNT (15%)</span>
                      <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[11px] font-mono tracking-wider text-brand-muted">
                    <span>EXPRESS COURIER SHIPPING</span>
                    <span>{shippingCost === 0 ? 'COMPLIMENTARY' : `₹${shippingCost.toLocaleString('en-IN')}`}</span>
                  </div>
                  <div className="h-[1px] bg-brand-sand/50" />
                  <div className="flex justify-between items-baseline">
                    <span className="font-serif text-xs text-brand-charcoal uppercase">Grand Total Est.</span>
                    <span className="font-mono text-lg font-bold text-brand-charcoal">₹{finalTotal.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="bg-brand-sand/20 p-3 flex items-start space-x-2 border border-brand-sand/40">
                    <ShieldCheck className="w-4 h-4 text-brand-muted mt-0.5 flex-shrink-0" />
                    <p className="text-[9.5px] text-brand-muted leading-relaxed font-light">
                      All orders are packed in unbleached, FSC-certified organic cotton utility bags that are reusable as laundry or storage sleeves.
                    </p>
                  </div>
                </div>

              </div>

            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
