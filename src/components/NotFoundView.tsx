import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Compass, ArrowRight, Feather, HelpCircle } from 'lucide-react';
import BrandLogo from './BrandLogo';

interface NotFoundViewProps {
  setView: (view: 'home' | 'shop' | 'journal' | 'story' | 'wishlist' | 'contact' | '404') => void;
}

export default function NotFoundView({ setView }: NotFoundViewProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY, currentTarget } = e;
    const { width, height, left, top } = currentTarget.getBoundingClientRect();
    const x = (clientX - left) / width - 0.5;
    const y = (clientY - top) / height - 0.5;
    setMousePos({ x, y });
  };

  return (
    <section 
      id="not-found-section"
      className="relative min-h-[calc(100vh-4rem)] w-full bg-brand-cream overflow-hidden flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePos({ x: 0, y: 0 });
      }}
    >
      {/* Decorative ambient subtle lines in the background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div className="absolute top-0 left-1/4 w-[1px] h-full bg-brand-charcoal" />
        <div className="absolute top-0 left-2/4 w-[1px] h-full bg-brand-charcoal" />
        <div className="absolute top-0 left-3/4 w-[1px] h-full bg-brand-charcoal" />
        <div className="absolute top-1/3 left-0 w-full h-[1px] bg-brand-charcoal" />
        <div className="absolute top-2/3 left-0 w-full h-[1px] bg-brand-charcoal" />
      </div>

      <div className="max-w-4xl w-full mx-auto relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        
        {/* Left: Custom Exquisite Line Art Illustration (Interactive) */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <motion.div
            className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 flex items-center justify-center"
            animate={{
              y: isHovered ? -6 : 0,
            }}
            transition={{ type: 'spring', stiffness: 80, damping: 20 }}
          >
            {/* Fine rotating background circular grid */}
            <motion.div
              className="absolute inset-0 w-full h-full opacity-[0.12] pointer-events-none"
              animate={{
                rotate: 360,
              }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full text-brand-charcoal" fill="none" stroke="currentColor" strokeWidth="0.5">
                <circle cx="50" cy="50" r="48" strokeDasharray="1 3" />
                <circle cx="50" cy="50" r="38" />
                <circle cx="50" cy="50" r="28" strokeDasharray="4 2" />
                <path d="M50 0 L50 100" />
                <path d="M0 50 L100 50" />
              </svg>
            </motion.div>

            {/* Main Interactive Vector Illustration */}
            <svg
              viewBox="0 0 200 200"
              className="w-full h-full text-brand-charcoal select-none filter drop-shadow-sm"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Floating abstract geometrical elements reacting to mouse coordinates */}
              <motion.g
                animate={{
                  x: mousePos.x * 25,
                  y: mousePos.y * 25,
                }}
                transition={{ type: 'spring', stiffness: 100, damping: 30 }}
              >
                {/* Elegant Fine Golden Accent Diamond */}
                <path 
                  d="M100 20 L135 55 L100 90 L65 55 Z" 
                  stroke="#C5A880" 
                  strokeWidth="1" 
                  className="opacity-75"
                />
                {/* Secondary Offset Diamond */}
                <path 
                  d="M100 24 L131 55 L100 86 L69 55 Z" 
                  stroke="currentColor" 
                  strokeWidth="0.5" 
                  className="opacity-25"
                />
              </motion.g>

              {/* The "Broken Thread" Motif: representing an interrupted/lost coordinate in a loom */}
              <motion.g
                animate={{
                  x: mousePos.x * -15,
                  y: mousePos.y * -15,
                }}
                transition={{ type: 'spring', stiffness: 100, damping: 30 }}
              >
                {/* Horizontal guide bar */}
                <line x1="30" y1="120" x2="170" y2="120" stroke="currentColor" strokeWidth="0.75" className="opacity-30" />
                
                {/* Vertical loom threads (left side intact, right side intact, center broken) */}
                <line x1="55" y1="80" x2="55" y2="160" stroke="currentColor" strokeWidth="0.5" className="opacity-45" />
                <line x1="75" y1="80" x2="75" y2="160" stroke="currentColor" strokeWidth="0.5" className="opacity-45" />
                <line x1="125" y1="80" x2="125" y2="160" stroke="currentColor" strokeWidth="0.5" className="opacity-45" />
                <line x1="145" y1="80" x2="145" y2="160" stroke="currentColor" strokeWidth="0.5" className="opacity-45" />

                {/* Left side of the broken thread */}
                <path 
                  d="M95 80 L95 108 Q95 116 88 120" 
                  stroke="currentColor" 
                  strokeWidth="1.25" 
                  strokeLinecap="round" 
                  className="opacity-70"
                />
                
                {/* Right side of the broken thread - elegantly detached */}
                <path 
                  d="M105 160 L105 132 Q105 124 116 122" 
                  stroke="#C5A880" 
                  strokeWidth="1.25" 
                  strokeLinecap="round" 
                  className="opacity-90"
                />

                {/* Floating fine particles representing lint or dust in the studio */}
                <circle cx="85" cy="95" r="1.5" fill="#C5A880" className="animate-pulse" />
                <circle cx="115" cy="150" r="1.2" fill="currentColor" className="opacity-40" />
                <circle cx="130" cy="100" r="1" fill="#C5A880" className="opacity-60" />
                <circle cx="68" cy="140" r="1.5" fill="currentColor" className="opacity-35" />
              </motion.g>

              {/* Empty Minimal Hanger/Art Frame Centerpiece */}
              <motion.g
                animate={{
                  rotate: isHovered ? [0, -1, 1, 0] : 0,
                  y: isHovered ? -4 : 0
                }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              >
                {/* Hanger hook */}
                <path 
                  d="M100 102 C100 95 106 94 104 90 C102 86 98 86 97 90" 
                  stroke="currentColor" 
                  strokeWidth="1" 
                  strokeLinecap="round"
                  className="opacity-60"
                />
                {/* Hanger structure */}
                <path 
                  d="M80 114 L100 102 L120 114 Z" 
                  stroke="currentColor" 
                  strokeWidth="1" 
                  strokeLinejoin="round"
                  className="opacity-75"
                />
              </motion.g>

              {/* Large, beautiful high-contrast stylized '404' numerals acting as an elegant watermarked backdrop */}
              <text 
                x="50%" 
                y="112" 
                textAnchor="middle" 
                className="font-serif text-[44px] tracking-[0.25em] opacity-5 pointer-events-none fill-current font-extralight"
              >
                404
              </text>
            </svg>
          </motion.div>
        </div>

        {/* Right: Premium Editorial Text and Call to Action */}
        <div className="w-full lg:w-1/2 text-center lg:text-left space-y-7 px-4">
          
          <div className="space-y-3.5">
            {/* Fine Chapter Mark / Index */}
            <div className="flex items-center justify-center lg:justify-start space-x-2">
              <Compass className="w-3.5 h-3.5 text-brand-sand animate-spin" style={{ animationDuration: '10s' }} />
              <span className="text-[10px] font-mono tracking-[0.3em] text-brand-charcoal uppercase font-medium">
                CHAPTER IV.04 / ERROR
              </span>
            </div>
            
            {/* High-fashion typography headline */}
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl tracking-tight leading-[1.1] font-extralight text-brand-charcoal">
              A Thread Lost <br />
              <span className="italic text-brand-muted font-normal mt-1 block">in the Weave.</span>
            </h1>
          </div>

          <div className="h-[1px] w-24 bg-brand-sand/60 mx-auto lg:mx-0" />

          {/* Luxury copy */}
          <p className="text-xs sm:text-sm text-brand-charcoal/70 font-light leading-relaxed tracking-wide max-w-md mx-auto lg:mx-0">
            The silhouette or archive collection you are seeking is currently unavailable. Like a bespoke fabric cut with meticulous precision, this specific page could have been retired to our private collections or has shifted coordinates.
          </p>

          {/* Quick specs section representing structural metadata */}
          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto lg:mx-0 bg-brand-sand/15 p-4 rounded-xl border border-brand-sand/30">
            <div>
              <p className="text-[8.5px] font-mono text-brand-muted tracking-wider uppercase">LOST COORDS</p>
              <p className="text-xs text-brand-charcoal font-medium font-mono mt-0.5">/archived-pattern</p>
            </div>
            <div>
              <p className="text-[8.5px] font-mono text-brand-muted tracking-wider uppercase">ATELIER STAT</p>
              <p className="text-xs text-brand-charcoal font-medium font-mono mt-0.5">DISCONNECTED</p>
            </div>
          </div>

          {/* Premium Interactive Return Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            
            <motion.button
              id="return-home-404-btn"
              onClick={() => setView('home')}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98, y: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 18 }}
              className="w-full sm:w-auto px-8 py-4 bg-brand-charcoal text-brand-cream text-[10.5px] font-mono tracking-[0.25em] font-medium uppercase rounded-full hover:bg-brand-charcoal/90 transition-all duration-300 flex items-center justify-center space-x-2.5 shadow-md cursor-pointer group"
            >
              <span>RETURN TO ATELIER</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform duration-300" />
            </motion.button>

            <motion.button
              id="explore-shop-404-btn"
              onClick={() => setView('shop')}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98, y: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 18 }}
              className="w-full sm:w-auto px-8 py-4 border border-brand-charcoal/25 bg-transparent hover:border-brand-charcoal hover:bg-brand-sand/20 text-brand-charcoal text-[10.5px] font-mono tracking-[0.25em] font-medium uppercase rounded-full transition-all duration-300 flex items-center justify-center space-x-2.5 cursor-pointer"
            >
              <Feather className="w-3.5 h-3.5 text-brand-charcoal/60" />
              <span>EXPLORE SILHOUETTES</span>
            </motion.button>

          </div>

          {/* Helpful suggestions */}
          <p className="text-[10px] text-brand-muted/80 font-mono tracking-wide pt-1 flex items-center justify-center lg:justify-start space-x-1.5">
            <HelpCircle className="w-3 h-3 text-brand-sand" />
            <span>Need assistance? Connect with Client Relations on WhatsApp.</span>
          </p>

        </div>

      </div>
    </section>
  );
}
