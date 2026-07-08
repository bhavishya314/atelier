import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { products as allProducts } from '../data/products';
import { 
  MapPin, 
  Check, 
  Sparkles, 
  Compass, 
  Calendar,
  RotateCcw,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  Bookmark
} from 'lucide-react';

interface MaterialStory {
  name: string;
  origin: string;
  metric: string;
  desc: string;
  image: string;
}

export default function StoryView() {
  const [activeTab, setActiveTab] = useState<'provenance' | 'circularity' | 'craftsmanship'>('provenance');

  const materials: MaterialStory[] = [
    {
      name: 'Organic Khadi Cotton',
      origin: 'Maheshwar, India',
      metric: '100% Cotton Fiber',
      desc: 'Hand-spun on wooden charkhas. This natural, unbleached fabric is highly breathable and perfect for everyday comfort.',
      image: allProducts.find(p => p.id === 'p1')?.images[0] || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Natural Indigo Dye',
      origin: 'Jaipur, Rajasthan',
      metric: 'Natural Vat Fermented',
      desc: 'Made using natural indigo plants. The fabric is dyed several times to achieve a rich, beautiful blue shade that stays vibrant.',
      image: allProducts.find(p => p.id === 'p2')?.images[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Premium Chanderi Cotton-Silk',
      origin: 'Pranpur, Madhya Pradesh',
      metric: '60% Silk / 40% Cotton',
      desc: 'Woven on traditional wooden looms, this fabric blends fine silk and soft cotton to create a lightweight material with a natural, subtle shine.',
      image: allProducts.find(p => p.id === 'p3')?.images[0] || 'https://images.unsplash.com/photo-1509319117193-57bab727e09d?auto=format&fit=crop&w=800&q=80'
    }
  ];

  const philosophyPillars = [
    {
      title: "Limited Collections",
      desc: "We design just a few select collections each year. This helps us avoid waste and focus on perfecting the fit and quality of every single item before it reaches you."
    },
    {
      title: "Supporting Artisans",
      desc: "Each garment is tagged with the name of the artisan who helped make it. We value skilled handcraft over fast machine production."
    },
    {
      title: "100% Natural Materials",
      desc: "We never use polyester or synthetic materials. Everything is made from 100% natural, breathable fibers that are gentle on your skin and the environment."
    }
  ];

  return (
    <div id="story-view" className="bg-brand-cream min-h-screen pt-10 pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* ======================================= */}
        {/* 1. INTRO HERO SECTION: SPLIT LAYOUT */}
        {/* ======================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center mb-32">
          
          {/* Left Column: Beautiful Typography & Concise Copy */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="h-[1px] w-8 bg-brand-charcoal/45"></span>
                <span className="text-[10px] font-mono tracking-[0.3em] text-brand-muted uppercase">OUR PROMISE</span>
              </div>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-brand-charcoal tracking-tight leading-[1.05]">
                Timeless designs <br />
                <span className="italic font-normal">crafted with care</span>
              </h1>
            </div>

            <p className="font-serif text-lg text-brand-charcoal/85 italic leading-relaxed font-light border-l-2 border-brand-sand pl-5">
              "We reject the speed of disposable fashion. We create comfortable, long-lasting clothing that is hand-spun, organic, and made to look better with age."
            </p>

            <div className="space-y-4 text-xs text-brand-muted font-light leading-relaxed max-w-xl">
              <p>
                At Kora, we believe in the beauty of handmade products. Every thread is spun on wooden charkhas, and our patterns are printed by hand using traditional block-printing techniques. Our clothing stands out for its natural texture, comfortable fit, and premium quality.
              </p>
              <p>
                By focusing on a simple collection of versatile, hand-loomed pieces, we help you build an elegant wardrobe that is clean, unique, and proudly made in India.
              </p>
            </div>

            {/* Signature Block */}
            <div className="pt-4 flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-brand-charcoal text-brand-cream font-serif text-base font-light flex items-center justify-center">
                K
              </div>
              <div>
                <p className="text-xs font-bold font-mono tracking-widest text-brand-charcoal">ARJUN & TARA SEN</p>
                <p className="text-[9px] font-mono text-brand-muted uppercase mt-0.5">Atelier Founders & Directors</p>
              </div>
            </div>
          </div>

          {/* Right Column: Premium Layered Imagery (Visual Showcase) */}
          <div className="lg:col-span-6 relative">
            <div className="grid grid-cols-12 gap-4">
              {/* Main Large Image */}
              <div className="col-span-8 relative z-10 aspect-[4/5] bg-brand-sand/15 border border-brand-sand/40 overflow-hidden shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?auto=format&fit=crop&w=1000&q=80"
                  alt="Atelier Cutting Desk"
                  className="w-full h-full object-cover grayscale-[3%] hover:scale-105 transition-transform duration-1000"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-3 left-3 bg-brand-charcoal text-brand-cream font-mono text-[8px] tracking-[0.2em] px-3 py-1 uppercase">
                  DELHI CUTTING TABLE
                </span>
              </div>

              {/* Offset Overlapping Smaller Image */}
              <div className="col-span-4 self-end space-y-4">
                <div className="aspect-square bg-brand-sand/20 border border-brand-sand/55 overflow-hidden shadow-lg translate-y-6 lg:translate-y-12">
                  <img
                    src="https://images.unsplash.com/photo-1509319117193-57bab727e09d?auto=format&fit=crop&w=600&q=80"
                    alt="Linen Weave Details"
                    className="w-full h-full object-cover grayscale-[4%] hover:scale-110 transition-transform duration-1000"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-4 bg-brand-sand/15 border border-brand-sand/35 space-y-2 translate-y-6 lg:translate-y-12">
                  <span className="text-[8px] font-mono text-brand-muted uppercase tracking-widest block">FOUNDED</span>
                  <p className="text-[13px] font-serif italic text-brand-charcoal">"Est. 2021 in the desert foothills."</p>
                </div>
              </div>
            </div>

            {/* Back Accent Panel */}
            <div className="absolute inset-0 bg-brand-sand/5 -z-10 -m-6 pointer-events-none border border-brand-sand/10" />
          </div>

        </div>

        {/* ======================================= */}
        {/* 2. THE THREE PHILOSOPHY PILLARS */}
        {/* ======================================= */}
        <div className="border-t border-brand-sand/45 pt-20 mb-32">
          <div className="max-w-2xl mb-16 space-y-2">
            <p className="text-[10px] font-mono tracking-[0.3em] text-brand-muted uppercase">OUR PROMISE</p>
            <h2 className="font-serif text-3xl font-light text-brand-charcoal">Our Core Design Values</h2>
            <p className="text-xs text-brand-muted font-light leading-relaxed">
              We live and design by three simple rules to ensure we create the highest quality clothing for you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {philosophyPillars.map((pillar, idx) => (
              <div 
                key={idx} 
                className="bg-brand-sand/10 border border-brand-sand/35 p-8 flex flex-col justify-between min-h-[220px] hover:border-brand-charcoal/30 transition-colors"
              >
                <div className="space-y-4">
                  <span className="text-2xl font-serif font-light text-brand-sand italic">0{idx + 1}</span>
                  <h3 className="font-serif text-xl font-semibold text-brand-charcoal">{pillar.title}</h3>
                  <p className="text-xs text-brand-muted font-light leading-relaxed">{pillar.desc}</p>
                </div>
                <div className="pt-4 border-t border-brand-sand/20 mt-4 text-[9px] font-mono tracking-widest text-brand-muted uppercase flex items-center justify-between">
                  <span>Enforced Daily</span>
                  <Check className="w-3.5 h-3.5 text-brand-charcoal" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ======================================= */}
        {/* 3. INTERACTIVE STAGE: PROVENANCE & MATERIALS */}
        {/* ======================================= */}
        <div className="bg-brand-charcoal text-brand-cream p-6 md:p-16 mb-24 relative overflow-hidden">
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left: Interactive Navigation & Text block */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-2.5">
                <span className="text-[10px] font-mono tracking-[0.3em] text-brand-cream/55 uppercase block">WHERE OUR FABRICS COME FROM</span>
                <h3 className="font-serif text-3xl md:text-4xl font-light text-white leading-tight">The Source of Our Fabrics</h3>
                <p className="text-xs text-brand-cream/60 font-light leading-relaxed">
                  We partner directly with farmers and weaver families across India. Choose a section below to learn more about our premium natural materials.
                </p>
              </div>

              {/* Tab Toggles */}
              <div className="space-y-3">
                <motion.button
                  onClick={() => setActiveTab('provenance')}
                  whileHover={{ scale: 1.015, x: 2 }}
                  whileTap={{ scale: 0.985 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  className={`w-full text-left p-4 border transition-all flex items-center justify-between cursor-pointer ${
                    activeTab === 'provenance'
                      ? 'bg-brand-cream text-brand-charcoal border-brand-cream font-bold'
                      : 'bg-transparent text-brand-cream/70 border-white/10 hover:border-white/30'
                  }`}
                >
                  <span className="text-[11px] font-mono tracking-widest uppercase">01 / Premium Natural Materials</span>
                  <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${activeTab === 'provenance' ? 'rotate-90' : ''}`} />
                </motion.button>

                <motion.button
                  onClick={() => setActiveTab('craftsmanship')}
                  whileHover={{ scale: 1.015, x: 2 }}
                  whileTap={{ scale: 0.985 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  className={`w-full text-left p-4 border transition-all flex items-center justify-between cursor-pointer ${
                    activeTab === 'craftsmanship'
                      ? 'bg-brand-cream text-brand-charcoal border-brand-cream font-bold'
                      : 'bg-transparent text-brand-cream/70 border-white/10 hover:border-white/30'
                  }`}
                >
                  <span className="text-[11px] font-mono tracking-widest uppercase">02 / The Handweaving Process</span>
                  <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${activeTab === 'craftsmanship' ? 'rotate-90' : ''}`} />
                </motion.button>

                <motion.button
                  onClick={() => setActiveTab('circularity')}
                  whileHover={{ scale: 1.015, x: 2 }}
                  whileTap={{ scale: 0.985 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  className={`w-full text-left p-4 border transition-all flex items-center justify-between cursor-pointer ${
                    activeTab === 'circularity'
                      ? 'bg-brand-cream text-brand-charcoal border-brand-cream font-bold'
                      : 'bg-transparent text-brand-cream/70 border-white/10 hover:border-white/30'
                  }`}
                >
                  <span className="text-[11px] font-mono tracking-widest uppercase">03 / Lifetime Care & Support</span>
                  <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${activeTab === 'circularity' ? 'rotate-90' : ''}`} />
                </motion.button>
              </div>
            </div>

            {/* Right: Dynamic Display Panel */}
            <div className="lg:col-span-7 bg-white/5 border border-white/10 p-6 md:p-8 relative min-h-[420px] flex flex-col justify-between">
              
              <AnimatePresence mode="wait">
                {activeTab === 'provenance' && (
                  <motion.div
                    key="provenance"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.35 }}
                    className="space-y-8 flex flex-col h-full justify-between"
                  >
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono tracking-widest text-brand-sand bg-brand-cream/10 px-2.5 py-1 uppercase border border-white/5">
                          BOTANICAL & NATURAL
                        </span>
                        <span className="text-[10px] font-mono text-brand-cream/50">TRACEABLE FIBERS</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {materials.map((mat, idx) => (
                          <div key={idx} className="space-y-3 bg-white/[0.02] border border-white/10 p-4">
                            <div className="aspect-[4/5] overflow-hidden bg-brand-charcoal/20">
                              <img 
                                src={mat.image} 
                                alt={mat.name} 
                                className="w-full h-full object-cover grayscale" 
                                loading="lazy"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <div className="space-y-1">
                              <h4 className="font-serif text-sm font-semibold text-white leading-tight">{mat.name}</h4>
                              <p className="text-[9px] font-mono text-brand-sand flex items-center gap-1">
                                <MapPin className="w-2.5 h-2.5" />
                                <span>{mat.origin}</span>
                              </p>
                              <p className="text-[9.5px] text-brand-cream/60 leading-relaxed font-light mt-1.5">{mat.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-white/10 text-xs text-brand-cream/60 flex items-center justify-between">
                      <span>*Certified organic & hand-harvested ingredients only.</span>
                      <Compass className="w-4 h-4 text-brand-sand" />
                    </div>
                  </motion.div>
                )}

                {activeTab === 'craftsmanship' && (
                  <motion.div
                    key="craftsmanship"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.35 }}
                    className="space-y-6 flex flex-col justify-between h-full"
                  >
                    <div className="space-y-4">
                      <span className="text-[9px] font-mono tracking-widest text-brand-sand bg-brand-cream/10 px-2.5 py-1 uppercase border border-white/5 inline-block">
                        SLOW WEAVING
                      </span>
                      <h4 className="font-serif text-2xl font-light text-white">Crafted at a Gentle Pace</h4>
                      <p className="text-xs text-brand-cream/70 leading-relaxed font-light">
                        While modern machines produce hundreds of meters of fabric every hour, our artisans weave just 3 to 4 meters a day using traditional handlooms.
                      </p>
                      <p className="text-xs text-brand-cream/70 leading-relaxed font-light">
                        This gentle process protects the threads and keeps the fabric incredibly soft. The result is lightweight, breathable clothing that keeps you cool in summer and comfortable in milder weather.
                      </p>

                      <div className="grid grid-cols-2 gap-4 pt-4">
                        <div className="p-4 bg-white/[0.02] border border-white/10 space-y-1">
                          <span className="text-[9px] font-mono text-brand-sand block">CLEAN PRODUCTION</span>
                          <span className="text-xl font-serif text-white">Eco-Friendly Process</span>
                          <p className="text-[9px] text-brand-cream/50">Woven entirely by hand without using electricity.</p>
                        </div>
                        <div className="p-4 bg-white/[0.02] border border-white/10 space-y-1">
                          <span className="text-[9px] font-mono text-brand-sand block">THREAD COUNT</span>
                          <span className="text-xl font-serif text-white">Premium Density</span>
                          <p className="text-[9px] text-brand-cream/50">High thread density that gives the garments a beautiful, structured fit.</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-white/10 flex items-center justify-between text-xs text-brand-cream/60">
                      <span>Weaver Registry No: KA-7814</span>
                      <Calendar className="w-4 h-4 text-brand-sand" />
                    </div>
                  </motion.div>
                )}

                {activeTab === 'circularity' && (
                  <motion.div
                    key="circularity"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.35 }}
                    className="space-y-6 flex flex-col justify-between h-full"
                  >
                    <div className="space-y-4">
                      <span className="text-[9px] font-mono tracking-widest text-brand-sand bg-brand-cream/10 px-2.5 py-1 uppercase border border-white/5 inline-block">
                        LIFETIME REPAIR SERVICE
                      </span>
                      <h4 className="font-serif text-2xl font-light text-white">Designed to Last</h4>
                      <p className="text-xs text-brand-cream/70 leading-relaxed font-light">
                        Every button is carved from natural coconut husks or wood scraps. From the threads to the linings, we use organic plant fibers to create garments that are clean and environmentally friendly.
                      </p>

                      <div className="space-y-3.5 pt-2">
                        <div className="flex items-start gap-3">
                          <span className="w-5 h-5 bg-brand-sand text-brand-charcoal text-[9px] font-mono flex items-center justify-center font-bold shrink-0">1</span>
                          <div>
                            <h5 className="text-xs font-bold text-white uppercase">Free Mending & Fitting</h5>
                            <p className="text-[11px] text-brand-cream/60 font-light mt-0.5">We offer free minor repairs, custom fittings, and gentle care services to keep your garments looking fresh and new.</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <span className="w-5 h-5 bg-brand-sand text-brand-charcoal text-[9px] font-mono flex items-center justify-center font-bold shrink-0">2</span>
                          <div>
                            <h5 className="text-xs font-bold text-white uppercase">Easy Exchanges</h5>
                            <p className="text-[11px] text-brand-cream/60 font-light mt-0.5">Bring back your old Kora garments in good condition for store credit. We wash, repair, and give them a second life.</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-white/10 text-xs text-brand-cream/60 flex items-center justify-between">
                      <span>Guaranteed Circular</span>
                      <Sparkles className="w-4 h-4 text-brand-sand" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

          </div>

          {/* Background Decorative Graphic Grid lines */}
          <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        </div>

      </div>
    </div>
  );
}
