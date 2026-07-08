import React from 'react';
import { motion } from 'motion/react';
import { Crown, Star, TrendingUp, Award, Tag, Clock } from 'lucide-react';
import { Product } from '../types';

interface ProductBadgeProps {
  product: Product;
  className?: string;
  size?: 'sm' | 'md';
}

export default function ProductBadge({ product, className = '', size = 'sm' }: ProductBadgeProps) {
  // Determine which badges to show based on priority
  // 1. Sale
  // 2. Limited Edition
  // 3. Limited Stock
  // 4. New Arrival
  // 5. Best Seller
  // 6. Trending
  
  const badges: {
    key: string;
    text: string;
    icon: React.ComponentType<any>;
    styles: string;
  }[] = [];

  if (product.isSale) {
    let discountText = 'SALE';
    if (product.originalPrice && product.price) {
      const pct = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
      discountText = `${pct}% OFF`;
    }
    badges.push({
      key: 'sale',
      text: discountText,
      icon: Tag,
      styles: 'bg-[#FAF3F3] text-[#8C3A3A] border-[#EED7D7] font-mono font-medium',
    });
  }

  if (product.isLimitedEdition) {
    badges.push({
      key: 'limited',
      text: 'LIMITED EDITION',
      icon: Award,
      styles: 'bg-[#F8F7F4] text-brand-charcoal border-[#D5D2C8] font-mono font-medium',
    });
  }

  if (product.isLowStock) {
    badges.push({
      key: 'lowstock',
      text: 'LIMITED STOCK',
      icon: Clock,
      styles: 'bg-[#FAF8F3] text-[#8C6D3A] border-[#EEDEB2] font-mono font-medium',
    });
  }

  if (product.isNew) {
    badges.push({
      key: 'new',
      text: 'NEW ARRIVAL',
      icon: Crown,
      styles: 'bg-brand-charcoal text-brand-cream border-brand-charcoal font-mono font-medium',
    });
  }

  if (product.isBestseller) {
    badges.push({
      key: 'bestseller',
      text: 'BEST SELLER',
      icon: Star,
      styles: 'bg-brand-sand text-brand-charcoal border-[#D3D1CB] font-mono font-medium',
    });
  }

  if (product.isTrending && badges.length < 2) {
    badges.push({
      key: 'trending',
      text: 'TRENDING',
      icon: TrendingUp,
      styles: 'bg-[#F4F6F4] text-[#3D6E50] border-[#D2DDD6] font-mono font-medium',
    });
  }

  if (badges.length === 0) return null;

  // We can show the most prominent badge, or up to 2 badges if stacked or side-by-side
  // Let's render the list of active badges
  return (
    <div className={`flex flex-col gap-1.5 items-start ${className}`}>
      {badges.map((badge, idx) => (
        <motion.div
          key={badge.key}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: idx * 0.1 }}
          whileHover={{ scale: 1.05 }}
          className={`
            ${badge.styles}
            flex items-center space-x-1.5 
            border uppercase tracking-[0.2em] shadow-sm
            ${size === 'sm' 
              ? 'text-[8px] px-2 py-0.5 min-h-[18px]' 
              : 'text-[9.5px] px-3 py-1 min-h-[22px]'
            }
          `}
          style={{ transformOrigin: 'left center' }}
        >
          <badge.icon className={`${size === 'sm' ? 'w-2.5 h-2.5' : 'w-3 h-3'} stroke-[1.5] shrink-0`} />
          <span className="leading-none">{badge.text}</span>
        </motion.div>
      ))}
    </div>
  );
}
