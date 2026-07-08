import React from 'react';
import { motion } from 'motion/react';
import { 
  Truck, 
  Package, 
  RotateCcw, 
  ShieldCheck, 
  HelpCircle,
  ArrowRight
} from 'lucide-react';

interface CommitmentItem {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  description: string;
  tag: string;
}

export default function BrandCommitments() {
  const commitments: CommitmentItem[] = [
    {
      id: 'delivery',
      icon: Truck,
      title: 'Fast Delivery',
      subtitle: 'SECURE SHIPPING',
      description: 'Fast delivery across India and worldwide. All orders are carefully shipped with real-time tracking, arriving in 3–5 business days.',
      tag: 'Priority Shipping'
    },
    {
      id: 'packaging',
      icon: Package,
      title: 'Gift Wrapping',
      subtitle: 'BEAUTIFULLY WRAPPED',
      description: 'Each garment is carefully wrapped in hand-pressed recycled paper and placed in a reusable organic cotton bag, perfect for gifting.',
      tag: 'Sustainably Crafted'
    },
    {
      id: 'returns',
      icon: RotateCcw,
      title: 'Easy Returns',
      subtitle: '14-DAY RETURNS',
      description: 'Not the perfect fit? We offer a hassle-free 14-day exchange and return policy with free doorstep pickup across India.',
      tag: 'No-Risk Trial'
    },
    {
      id: 'secure',
      icon: ShieldCheck,
      title: 'Secure Shopping',
      subtitle: 'SAFE CHECKOUT',
      description: 'Your payment is safe with us. We use fully encrypted, secure payment methods to protect your details.',
      tag: 'Certified Safe'
    },
    {
      id: 'support',
      icon: HelpCircle,
      title: 'Kora Support',
      subtitle: 'TALK TO US',
      description: 'Get direct help from our team. Call or text us for help with finding your size, order updates, or custom styling advice.',
      tag: 'Human Assistance'
    }
  ];

  return (
    <section id="brand-commitments-section" className="py-24 bg-brand-cream border-t border-brand-sand/30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Header container */}
        <div className="max-w-3xl mb-16 space-y-4">
          <div className="flex items-center space-x-2">
            <span className="h-[1px] w-8 bg-brand-charcoal/45"></span>
            <span className="text-[10px] font-mono tracking-[0.3em] text-brand-muted uppercase">THE KORA EXPERIENCE</span>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-light text-brand-charcoal tracking-tight leading-tight">
            Our Commitments to Conscious Service
          </h2>
          <p className="text-xs text-brand-muted font-light leading-relaxed max-w-xl">
            We believe that quiet luxury extends far beyond the physical thread. Every step of your journey is guarded by deliberate craft, secure channels, and high-precision hospitality.
          </p>
        </div>

        {/* 5-Column Grid on Desktop / Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {commitments.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="group bg-brand-sand/10 hover:bg-brand-sand/20 border border-brand-sand/40 p-6 md:p-8 flex flex-col justify-between transition-all duration-300 relative h-full min-h-[320px] shadow-xs"
              >
                {/* Top Section */}
                <div className="space-y-6">
                  {/* Icon & Mini Sparkle tag */}
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 bg-brand-charcoal hover:bg-brand-muted text-white flex items-center justify-center transition-colors duration-300">
                      <IconComponent className="w-5.5 h-5.5 stroke-[1.5] transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110" />
                    </div>
                    <span className="text-[8px] font-mono tracking-wider text-brand-muted uppercase bg-brand-sand/30 px-2 py-0.5 border border-brand-sand/50">
                      {item.tag}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <div className="space-y-1.5">
                    <p className="text-[8.5px] font-mono tracking-[0.2em] text-brand-muted uppercase">
                      {item.subtitle}
                    </p>
                    <h3 className="font-serif text-lg font-semibold text-brand-charcoal group-hover:text-brand-muted transition-colors">
                      {item.title}
                    </h3>
                  </div>

                  {/* Body description */}
                  <p className="text-xs text-brand-muted font-light leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Bottom decorative interaction line */}
                <div className="pt-6 mt-6 border-t border-brand-sand/30 flex items-center justify-between text-[9px] font-mono tracking-widest uppercase text-brand-muted group-hover:text-brand-charcoal transition-colors">
                  <span>Explore Details</span>
                  <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" />
                </div>

                {/* Left high-contrast border hover effect */}
                <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-brand-charcoal scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-bottom" />
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
