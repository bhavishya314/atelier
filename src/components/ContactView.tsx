import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Phone, 
  Mail, 
  Clock, 
  MessageSquare, 
  Check, 
  Send, 
  MapPin, 
  ArrowRight,
  ChevronDown,
  Sparkles,
  HelpCircle,
  ExternalLink
} from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

export default function ContactView() {
  
  // 1. Form state tracking
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    inquiryType: 'Bespoke Sizing & Styling',
    message: ''
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [activeFAQIndex, setActiveFAQIndex] = useState<number | null>(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setFormStatus('submitting');
    setTimeout(() => {
      setFormStatus('success');
      setFormData({
        name: '',
        email: '',
        inquiryType: 'Bespoke Sizing & Styling',
        message: ''
      });
      // Clear status back to idle after 5 seconds
      setTimeout(() => setFormStatus('idle'), 5000);
    }, 1500);
  };

  // 2. Curated FAQ List matching the luxury Slow Fashion brand
  const faqs: FAQItem[] = [
    {
      question: 'How are batch quantities managed at Kora Atelier?',
      answer: 'To prevent textile waste and honor our weaving families, we weave in small batch runs. Many of our silhouettes are made in single-digit numbers. When an item is sold out, we accept pre-orders with an average loom timeline of 4–6 weeks.'
    },
    {
      question: 'Do you offer custom sleeve or hem adjustments?',
      answer: 'Yes. Our physical cutting desks in Jaipur and Delhi accommodate custom sizing and hem adjustments. Reach out via our direct WhatsApp line or the contact form, specifying your order number and unique shoulder/hem requirements.'
    },
    {
      question: 'What are your courier timelines and delivery methods?',
      answer: 'We dispatch globally from our Delhi studio using carbon-conscious express air-couriers. Regional Indian orders arrive within 2–4 days. International dispatches reach major hubs (London, New York, Singapore) in 4–6 business days.'
    },
    {
      question: 'How should I care for natural botanical-dyed fabrics?',
      answer: 'As we utilize zero chemical fixatives, pure vegetable-dyed items (like natural indigo or madder clay) may breathe some color in their first few wears. We highly advise dry cleaning or a cold, single-wash separately with mild organic detergent.'
    },
    {
      question: 'What is your ethical pricing transparency charter?',
      answer: 'We secure above-market living wages for our spinning and weaving guilds in Gujarat, Rajasthan, and Madhya Pradesh. Fifty percent of all garment sales go directly back to sustaining regional artisanal infrastructure.'
    }
  ];

  return (
    <div id="contact-view" className="bg-brand-cream min-h-screen pt-10 pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* ======================================= */}
        {/* EDITORIAL PAGE HEADER */}
        {/* ======================================= */}
        <div className="max-w-3xl mb-16 space-y-4">
          <div className="flex items-center space-x-2">
            <span className="h-[1px] w-8 bg-brand-charcoal/45"></span>
            <span className="text-[10px] font-mono tracking-[0.3em] text-brand-muted uppercase">CLIENT CONCIERGE</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-brand-charcoal tracking-tight leading-[1.05]">
            Dialogue with the <br />
            <span className="italic font-normal">Atelier Team</span>
          </h1>
          <p className="text-xs text-brand-muted font-light leading-relaxed max-w-xl">
            Whether inquiring about the loom origin of a specific flax linen, checking order coordinates, or requesting customized shoulder alignments, our advisers respond with real human attention.
          </p>
        </div>

        {/* ======================================= */}
        {/* SPLIT LAYOUT: CHANNELS VS FORM */}
        {/* ======================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-24">
          
          {/* LEFT COLUMN: MULTICHANNEL COMMUNICATIONS (COL-SPAN 5) */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Quick Contact Cards */}
            <div className="space-y-4">
              
              {/* WhatsApp direct connection */}
              <a 
                id="contact-whatsapp-direct"
                href="https://wa.me/917470558303"
                target="_blank"
                rel="noreferrer"
                className="block group bg-brand-sand/10 hover:bg-brand-sand/20 border border-brand-sand/40 p-6 transition-all duration-300 relative overflow-hidden shadow-xs"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-3">
                    <p className="text-[9px] font-mono tracking-widest text-brand-muted uppercase">REAL-TIME COMMUNIQUE</p>
                    <h3 className="font-serif text-lg font-semibold text-brand-charcoal flex items-center gap-1.5">
                      <span>WhatsApp Messenger</span>
                      <ExternalLink className="w-3.5 h-3.5 text-brand-muted group-hover:text-brand-charcoal" />
                    </h3>
                    <p className="text-xs text-brand-muted font-light max-w-xs">
                      Instant sizing discussions, fabric snapshots from our loom floor, and active styling guidance.
                    </p>
                    <p className="text-xs font-mono font-bold text-brand-charcoal mt-2 flex items-center gap-1.5">
                      <MessageSquare className="w-4 h-4 text-emerald-800" />
                      <span>+91 7470558303</span>
                    </p>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-700 animate-ping self-start mr-1" />
                </div>
                <span className="absolute bottom-0 right-0 w-8 h-8 bg-brand-charcoal/5 group-hover:bg-brand-charcoal/10 transition-colors flex items-center justify-center text-xs font-mono">
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                </span>
              </a>

              {/* Email Communication */}
              <a 
                id="contact-email-direct"
                href="mailto:fuvish.web@gmail.com"
                className="block group bg-brand-sand/10 hover:bg-brand-sand/20 border border-brand-sand/40 p-6 transition-all duration-300 relative overflow-hidden shadow-xs"
              >
                <div className="space-y-3">
                  <p className="text-[9px] font-mono tracking-widest text-brand-muted uppercase">FORMAL ADVISORY</p>
                  <h3 className="font-serif text-lg font-semibold text-brand-charcoal flex items-center gap-1.5">
                    <span>Atelier Support Email</span>
                  </h3>
                  <p className="text-xs text-brand-muted font-light max-w-xs">
                    For custom collections, wedding registries, wholesale inquiry logs, and general account coordinates.
                  </p>
                  <p className="text-xs font-mono font-bold text-brand-charcoal mt-2 flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-brand-sand" />
                    <span>fuvish.web@gmail.com</span>
                  </p>
                </div>
                <span className="absolute bottom-0 right-0 w-8 h-8 bg-brand-charcoal/5 group-hover:bg-brand-charcoal/10 transition-colors flex items-center justify-center text-xs font-mono">
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                </span>
              </a>

              {/* Localized Studio lines */}
              <div className="bg-brand-sand/10 border border-brand-sand/40 p-6 space-y-4">
                <p className="text-[9px] font-mono tracking-widest text-brand-muted uppercase">DELHI & MUMBAI DESK</p>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs border-b border-brand-sand/20 pb-2">
                    <span className="font-serif text-brand-charcoal">Studio Direct Dial</span>
                    <span className="font-mono text-brand-charcoal/80 font-semibold">+91 7470558303</span>
                  </div>
                  <div className="flex justify-between items-center text-xs border-b border-brand-sand/20 pb-2">
                    <span className="font-serif text-brand-charcoal">Wholesale & Press Desk</span>
                    <span className="font-mono text-brand-charcoal/80 font-semibold">+91 7470558303</span>
                  </div>
                </div>
              </div>

              {/* Studio Hours & Local Presence */}
              <div className="bg-brand-charcoal text-brand-cream p-6 border border-brand-sand/10 space-y-4 relative">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-brand-sand" />
                  <h4 className="font-mono text-[9px] tracking-widest uppercase text-brand-sand">Advisory Studio Hours</h4>
                </div>
                <div className="space-y-2.5 text-xs font-light">
                  <div className="flex justify-between text-brand-cream/80">
                    <span>Monday to Friday</span>
                    <span className="font-mono font-bold text-brand-cream">10:00 AM – 7:00 PM IST</span>
                  </div>
                  <div className="flex justify-between text-brand-cream/80">
                    <span>Saturday</span>
                    <span className="font-mono font-bold text-brand-cream">11:00 AM – 5:00 PM IST</span>
                  </div>
                  <div className="flex justify-between text-brand-cream/45 italic">
                    <span>Sunday</span>
                    <span>Loom Floor Quiet Day</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* RIGHT COLUMN: MODERN PREMIUM CONTACT FORM (COL-SPAN 7) */}
          <div className="lg:col-span-7">
            <div className="bg-brand-sand/15 border border-brand-sand/55 p-8 md:p-10 relative">
              
              <div className="mb-8 space-y-2">
                <div className="flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5 text-brand-charcoal" />
                  <p className="text-[9px] font-mono tracking-widest text-brand-muted uppercase">THE SECURE DISPATCH</p>
                </div>
                <h3 className="font-serif text-2xl font-light text-brand-charcoal">Submit an Inquiry Letter</h3>
                <p className="text-xs text-brand-muted font-light leading-relaxed">
                  Fill in your coordinates and inquiry details below. Our studio team receives this through secure channels and commits to responding within 4 business hours.
                </p>
              </div>

              <AnimatePresence mode="wait">
                {formStatus === 'success' ? (
                  <motion.div
                    key="success-form-state"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="py-12 flex flex-col items-center text-center space-y-5"
                  >
                    <div className="w-14 h-14 bg-brand-charcoal text-brand-cream border border-brand-sand rounded-full flex items-center justify-center shadow-lg">
                      <Check className="w-6 h-6 text-brand-sand animate-bounce" />
                    </div>
                    <div className="space-y-2 max-w-sm">
                      <h4 className="font-serif text-xl font-semibold text-brand-charcoal">Inquiry Safely Dispatched</h4>
                      <p className="text-xs text-brand-muted font-light leading-relaxed">
                        Thank you for initiating the dialogue. A notification was sent to our advisors. We will review your requests and follow up via email shortly.
                      </p>
                    </div>
                    <motion.button
                      onClick={() => setFormStatus('idle')}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                      className="px-6 py-2.5 bg-brand-charcoal text-white text-[10px] font-mono tracking-widest uppercase hover:bg-brand-muted transition-colors cursor-pointer"
                    >
                      Write Another Letter
                    </motion.button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-6">
                    
                    {/* Name & Email inputs inside grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      
                      {/* Full Name */}
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-mono tracking-widest text-brand-muted uppercase block">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Arjun Dev"
                          className="w-full bg-brand-cream border border-brand-sand/85 focus:border-brand-charcoal/50 text-xs px-3.5 py-3 focus:outline-none transition-colors rounded-none font-sans text-brand-charcoal"
                        />
                      </div>

                      {/* Email Address */}
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-mono tracking-widest text-brand-muted uppercase block">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="arjun@slowliving.com"
                          className="w-full bg-brand-cream border border-brand-sand/85 focus:border-brand-charcoal/50 text-xs px-3.5 py-3 focus:outline-none transition-colors rounded-none font-sans text-brand-charcoal"
                        />
                      </div>

                    </div>

                    {/* Dropdown: Inquiry Type */}
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-mono tracking-widest text-brand-muted uppercase block">
                        Nature of Dialogue
                      </label>
                      <select
                        name="inquiryType"
                        value={formData.inquiryType}
                        onChange={handleInputChange}
                        className="w-full bg-brand-cream border border-brand-sand/85 focus:border-brand-charcoal/50 text-xs px-3.5 py-3 focus:outline-none transition-colors rounded-none font-sans text-brand-charcoal cursor-pointer"
                      >
                        <option value="Bespoke Sizing & Styling">Bespoke Sizing & Styling Advice</option>
                        <option value="Order Tracking & Couriers">Order Tracking & Courier Delivery</option>
                        <option value="Artisanal Raw Materials">Artisanal Loom & Material Traceability</option>
                        <option value="Wholesale Partnerships">Wholesale & Gallery Curation</option>
                        <option value="Returns & Exchanges">Complimentary Return & Exchange Log</option>
                      </select>
                    </div>

                    {/* Textarea: Message content */}
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-mono tracking-widest text-brand-muted uppercase block">
                        Your Message / Letter *
                      </label>
                      <textarea
                        name="message"
                        required
                        rows={5}
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Please share sizing requirements, hem modifications, or custom requests..."
                        className="w-full bg-brand-cream border border-brand-sand/85 focus:border-brand-charcoal/50 text-xs px-3.5 py-3 focus:outline-none transition-colors rounded-none font-sans text-brand-charcoal resize-none leading-relaxed"
                      />
                    </div>

                    {/* Submit CTA Button */}
                    <motion.button
                      type="submit"
                      disabled={formStatus === 'submitting'}
                      whileHover={formStatus !== 'submitting' ? { scale: 1.01, y: -1 } : {}}
                      whileTap={formStatus !== 'submitting' ? { scale: 0.99, y: 0 } : {}}
                      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                      className="w-full bg-brand-charcoal text-white hover:bg-brand-muted py-4 px-6 text-[10px] font-mono tracking-[0.2em] uppercase transition-all duration-300 flex items-center justify-center space-x-3.5 cursor-pointer font-bold shadow-xs"
                    >
                      {formStatus === 'submitting' ? (
                        <>
                          <div className="w-4 h-4 border-2 border-brand-sand border-t-white rounded-full animate-spin" />
                          <span>Dispatching Letter...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5 stroke-[1.5]" />
                          <span>DISPATCH INQUIRY LETTER</span>
                        </>
                      )}
                    </motion.button>

                  </form>
                )}
              </AnimatePresence>

            </div>
          </div>

        </div>

        {/* ======================================= */}
        {/* PREMIUM CURATED COLLAPSIBLE FAQ SECTION */}
        {/* ======================================= */}
        <div className="border-t border-brand-sand/45 pt-20">
          
          <div className="max-w-3xl mb-12 space-y-2">
            <div className="flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-brand-charcoal" />
              <p className="text-[10px] font-mono tracking-[0.3em] text-brand-muted uppercase">TEXTILE FREQUENT INQUIRIES</p>
            </div>
            <h2 className="font-serif text-3xl font-light text-brand-charcoal tracking-tight">Concierge FAQ Matrix</h2>
            <p className="text-xs text-brand-muted font-light leading-relaxed">
              Find transparent explanations regarding batch schedules, material sourcing, dry-cleaning methods, and ethical trade rates.
            </p>
          </div>

          <div className="max-w-4xl divide-y divide-brand-sand/45 border-y border-brand-sand/45">
            {faqs.map((faq, index) => {
              const isOpen = activeFAQIndex === index;
              return (
                <div key={index} className="py-4">
                  
                  {/* Accordion trigger line */}
                  <button
                    id={`faq-trigger-${index}`}
                    onClick={() => setActiveFAQIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between text-left py-2 hover:text-brand-muted transition-colors cursor-pointer group"
                  >
                    <span className="font-serif text-[15px] font-semibold text-brand-charcoal group-hover:text-brand-muted transition-colors leading-snug">
                      {faq.question}
                    </span>
                    <span className={`p-1 bg-brand-sand/15 group-hover:bg-brand-sand/35 border border-brand-sand/40 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                      <ChevronDown className="w-3.5 h-3.5 text-brand-charcoal" />
                    </span>
                  </button>

                  {/* Accordion content */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="text-xs text-brand-muted font-light leading-relaxed pt-2.5 pb-3 max-w-3xl">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              );
            })}
          </div>

        </div>

      </div>
    </div>
  );
}
