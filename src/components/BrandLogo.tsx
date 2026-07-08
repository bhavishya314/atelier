import React from 'react';
import { motion } from 'motion/react';

interface BrandLogoProps {
  variant?: 'icon' | 'horizontal' | 'stacked';
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  theme?: 'dark' | 'light';
  showSubtitle?: boolean;
  isAnimated?: boolean;
}

export default function BrandLogo({
  variant = 'horizontal',
  className = '',
  iconClassName = '',
  textClassName = '',
  theme = 'light',
  showSubtitle = true,
  isAnimated = false
}: BrandLogoProps) {
  const isDark = theme === 'dark';
  
  // Custom colors based on theme
  const textColor = isDark ? 'text-brand-cream' : 'text-brand-charcoal';
  const subtextColor = isDark ? 'text-brand-sand/60' : 'text-brand-muted';
  const strokeColor = isDark ? '#FDFDFB' : '#1A1A1A';

  // Timeless Custom Emblem/Monogram SVG
  const logoIcon = isAnimated ? (
    <svg 
      className={`shrink-0 transition-all duration-300 ${iconClassName}`} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%' }}
    >
      {/* Exquisite outer circle with double ring accent - extremely fine lines */}
      <motion.circle 
        cx="50" 
        cy="50" 
        r="46" 
        stroke={strokeColor} 
        strokeWidth="0.5" 
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.15 }}
        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      />
      <motion.circle 
        cx="50" 
        cy="50" 
        r="42" 
        stroke={strokeColor} 
        strokeWidth="0.75" 
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.4 }}
        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      />

      {/* Intricate fine diamond framework representing structural atelier precision */}
      <motion.path 
        d="M50 12 L88 50 L50 88 L12 50 Z" 
        stroke={strokeColor} 
        strokeWidth="0.5" 
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.25 }}
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
      />

      {/* Modern, high-fashion intersecting Monogram representing A and T */}
      {/* Left stem of 'A' */}
      <motion.path 
        d="M36 68 L48 30" 
        stroke={strokeColor} 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
      />
      {/* Right stem of 'A' */}
      <motion.path 
        d="M48 30 L64 68" 
        stroke={strokeColor} 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
      />
      {/* 'T' horizontal top bar, elegantly floating over the apex */}
      <motion.path 
        d="M34 30 L66 30" 
        stroke={strokeColor} 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 1.0 }}
      />
      {/* 'T' central vertical stem, acting as 'A''s internal spine */}
      <motion.path 
        d="M50 30 L50 56" 
        stroke={strokeColor} 
        strokeWidth="1.25" 
        strokeLinecap="round" 
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 1.2 }}
      />
      {/* 'A' delicate, ultra-fine horizontal crossbar */}
      <motion.path 
        d="M40 56 L60 56" 
        stroke={strokeColor} 
        strokeWidth="0.75" 
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 1.3 }}
      />

      {/* Minimalist floating diamond motif above the monogram, representing luxury heritage */}
      <motion.path 
        d="M50 18 L53 22 L50 26 L47 22 Z" 
        fill={strokeColor} 
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.9 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 1.5 }}
      />
    </svg>
  ) : (
    <svg 
      className={`shrink-0 transition-transform duration-300 ${iconClassName}`} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%' }}
    >
      {/* Exquisite outer circle with double ring accent - extremely fine lines */}
      <circle 
        cx="50" 
        cy="50" 
        r="46" 
        stroke={strokeColor} 
        strokeWidth="0.5" 
        className="opacity-15" 
      />
      <circle 
        cx="50" 
        cy="50" 
        r="42" 
        stroke={strokeColor} 
        strokeWidth="0.75" 
        className="opacity-40" 
      />

      {/* Intricate fine diamond framework representing structural atelier precision */}
      <path 
        d="M50 12 L88 50 L50 88 L12 50 Z" 
        stroke={strokeColor} 
        strokeWidth="0.5" 
        className="opacity-25" 
        
      />

      {/* Modern, high-fashion intersecting Monogram representing A and T */}
      {/* Left stem of 'A' */}
      <path 
        d="M36 68 L48 30" 
        stroke={strokeColor} 
        strokeWidth="1.5" 
        strokeLinecap="round" 
      />
      {/* Right stem of 'A' */}
      <path 
        d="M48 30 L64 68" 
        stroke={strokeColor} 
        strokeWidth="1.5" 
        strokeLinecap="round" 
      />
      {/* 'T' horizontal top bar, elegantly floating over the apex */}
      <path 
        d="M34 30 L66 30" 
        stroke={strokeColor} 
        strokeWidth="1.5" 
        strokeLinecap="round" 
      />
      {/* 'T' central vertical stem, acting as 'A''s internal spine */}
      <path 
        d="M50 30 L50 56" 
        stroke={strokeColor} 
        strokeWidth="1.25" 
        strokeLinecap="round" 
      />
      {/* 'A' delicate, ultra-fine horizontal crossbar */}
      <path 
        d="M40 56 L60 56" 
        stroke={strokeColor} 
        strokeWidth="0.75" 
      />

      {/* Minimalist floating diamond motif above the monogram, representing luxury heritage */}
      <path 
        d="M50 18 L53 22 L50 26 L47 22 Z" 
        fill={strokeColor} 
        className="opacity-90"
      />
    </svg>
  );

  if (variant === 'icon') {
    return (
      <div className={`relative ${className}`} style={{ width: '40px', height: '40px' }}>
        {logoIcon}
      </div>
    );
  }

  if (variant === 'stacked') {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        {/* Animated Brand Icon */}
        <div className="w-16 h-16 mb-4 relative hover:scale-105 transition-transform duration-500">
          {logoIcon}
        </div>
        
        {/* Typography */}
        <div className="flex flex-col items-center">
          <span className={`font-serif text-2xl md:text-3xl tracking-[0.5em] font-light uppercase ${textColor} mr-[-0.5em]`}>
            ATELIER
          </span>
          {showSubtitle && (
            <>
              <div className={`h-[1px] w-12 my-3 opacity-30 ${isDark ? 'bg-brand-cream' : 'bg-brand-charcoal'}`} />
              <span className={`text-[9px] font-mono tracking-[0.4em] uppercase ${subtextColor} mr-[-0.4em]`}>
                HAUTE COUTURE
              </span>
            </>
          )}
        </div>
      </div>
    );
  }

  // Default: 'horizontal'
  return (
    <div className={`flex items-center space-x-2 sm:space-x-3.5 ${className}`}>
      {/* Logo Icon */}
      <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 relative group-hover:rotate-12 transition-transform duration-500">
        {logoIcon}
      </div>
      
      {/* Brand Text */}
      <div className="flex flex-col items-start leading-none">
        <span className={`font-serif text-sm sm:text-base md:text-xl tracking-[0.3em] sm:tracking-[0.4em] font-light uppercase ${textColor} ${textClassName} mr-[-0.3em] sm:mr-[-0.4em]`}>
          ATELIER
        </span>
        {showSubtitle && (
          <span className={`text-[6.5px] sm:text-[7.5px] font-mono tracking-[0.25em] sm:tracking-[0.3em] uppercase ${subtextColor} mt-0.5 sm:mt-1 mr-[-0.25em] sm:mr-[-0.3em]`}>
            STUDIO
          </span>
        )}
      </div>
    </div>
  );
}
