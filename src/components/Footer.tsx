import { useState, FormEvent } from 'react';
import { Ruler, ArrowRight, Check, Instagram, Twitter, Youtube, ArrowUp, Phone, MapPin, Mail } from 'lucide-react';
import BrandLogo from './BrandLogo';

interface FooterProps {
  setView: (view: 'home' | 'shop' | 'journal' | 'story' | 'wishlist' | 'contact' | '404') => void;
  onOpenSizeAdvisor: () => void;
}

export default function Footer({ setView, onOpenSizeAdvisor }: FooterProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('submitting');
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 1200);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="main-footer" className="bg-brand-charcoal text-brand-cream border-t border-brand-sand/10 pt-24 pb-12 mt-24 relative overflow-hidden">
      {/* Decorative architectural background lines */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none select-none z-0">
        <div className="absolute top-0 left-10 w-[1px] h-full bg-brand-cream" />
        <div className="absolute top-0 left-1/3 w-[1px] h-full bg-brand-cream" />
        <div className="absolute top-0 right-1/4 w-[1px] h-full bg-brand-cream" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16 mb-20">
          
          {/* Column 1: Brand Manifesto & Studio Locations */}
          <div className="lg:col-span-4 space-y-8">
            <div className="space-y-4">
              <BrandLogo variant="horizontal" theme="dark" showSubtitle={true} textClassName="text-2xl" iconClassName="w-8 h-8" />
              <div className="space-y-1">
                <p className="text-xs font-mono tracking-widest text-brand-sand font-semibold">DEMO WEBSITE BY FUVISH</p>
                <p className="text-[11px] text-brand-cream/60 font-light leading-relaxed max-w-sm">
                  A bespoke curation of premium apparel, meticulously engineered with contemporary architectural tailoring.
                </p>
              </div>
            </div>

            {/* Physical Studios / Locations */}
            <div className="space-y-3">
              <span className="text-[10px] font-mono tracking-[0.3em] text-brand-sand/40 uppercase block">PHYSICAL STUDIOS</span>
              <div className="grid grid-cols-3 gap-2 text-[10px] font-mono text-brand-cream/80">
                <div className="space-y-1">
                  <p className="font-semibold text-brand-sand">NEW DELHI</p>
                  <p className="text-brand-cream/55 leading-normal">Chanakyapuri, Ground Floor</p>
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-brand-sand">MUMBAI</p>
                  <p className="text-brand-cream/55 leading-normal">Colaba, Hampton Court</p>
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-brand-sand">BANGALORE</p>
                  <p className="text-brand-cream/55 leading-normal">Lavelle Road, Suite 10</p>
                </div>
              </div>
            </div>

            {/* Social Icons */}
            <div className="space-y-3 pt-2">
              <span className="text-[10px] font-mono tracking-[0.3em] text-brand-sand/40 uppercase block font-semibold">PATRON CORNER</span>
              <div className="flex items-center space-x-4">
                <a 
                  id="footer-social-instagram"
                  href="https://instagram.com" 
                  target="_blank" 
                  referrerPolicy="no-referrer"
                  rel="noreferrer"
                  className="p-2.5 bg-brand-cream/5 border border-brand-cream/10 hover:border-brand-sand/40 hover:bg-brand-cream/10 text-brand-cream/75 hover:text-brand-cream transition-all duration-300"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a 
                  id="footer-social-twitter"
                  href="https://twitter.com" 
                  target="_blank" 
                  referrerPolicy="no-referrer"
                  rel="noreferrer"
                  className="p-2.5 bg-brand-cream/5 border border-brand-cream/10 hover:border-brand-sand/40 hover:bg-brand-cream/10 text-brand-cream/75 hover:text-brand-cream transition-all duration-300"
                  aria-label="Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a 
                  id="footer-social-youtube"
                  href="https://youtube.com" 
                  target="_blank" 
                  referrerPolicy="no-referrer"
                  rel="noreferrer"
                  className="p-2.5 bg-brand-cream/5 border border-brand-cream/10 hover:border-brand-sand/40 hover:bg-brand-cream/10 text-brand-cream/75 hover:text-brand-cream transition-all duration-300"
                  aria-label="Youtube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Navigation / Curation */}
          <div className="lg:col-span-2 space-y-6">
            <h4 className="text-[10px] font-mono tracking-[0.25em] text-brand-sand/40 uppercase font-semibold">NAVIGATION</h4>
            <ul className="space-y-4 text-xs font-light tracking-widest text-brand-cream/80">
              <li>
                <button onClick={() => setView('shop')} className="hover:text-brand-sand hover:translate-x-1 transition-all duration-300 cursor-pointer block">
                  THE SHOP
                </button>
              </li>
              <li>
                <button onClick={() => setView('journal')} className="hover:text-brand-sand hover:translate-x-1 transition-all duration-300 cursor-pointer block">
                  JOURNAL
                </button>
              </li>
              <li>
                <button onClick={() => setView('story')} className="hover:text-brand-sand hover:translate-x-1 transition-all duration-300 cursor-pointer block">
                  OUR STUDIO
                </button>
              </li>
              <li>
                <button onClick={() => setView('contact')} className="hover:text-brand-sand hover:translate-x-1 transition-all duration-300 cursor-pointer block font-semibold text-brand-sand">
                  CONTACT US
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Advisory & Support Details */}
          <div className="lg:col-span-3 space-y-6">
            <h4 className="text-[10px] font-mono tracking-[0.25em] text-brand-sand/40 uppercase font-semibold">SUPPORT & CLIENT SERVICES</h4>
            
            <ul className="space-y-4 text-xs font-light tracking-widest text-brand-cream/80">
              <li>
                <button 
                  id="footer-size-advisor"
                  onClick={onOpenSizeAdvisor} 
                  className="hover:text-brand-sand hover:translate-x-1 transition-all duration-300 cursor-pointer flex items-center space-x-2 text-brand-sand"
                >
                  <Ruler className="w-3.5 h-3.5 text-brand-sand" />
                  <span>KORA SIZE ADVISOR</span>
                </button>
              </li>
              <li>
                <button onClick={() => setView('404')} className="hover:text-brand-sand transition-all hover:translate-x-1 duration-300 block text-left cursor-pointer">SHIPPING & DELIVERY</button>
              </li>
              <li>
                <button onClick={() => setView('404')} className="hover:text-brand-sand transition-all hover:translate-x-1 duration-300 block text-left cursor-pointer">FABRICS & MATERIALS</button>
              </li>
              <li>
                <button onClick={() => setView('404')} className="hover:text-brand-sand transition-all hover:translate-x-1 duration-300 block text-left cursor-pointer">RETURNS & EXCHANGES</button>
              </li>
            </ul>
          </div>

          {/* Column 4: Direct Contact */}
          <div className="lg:col-span-3 space-y-6">
            <h4 className="text-[10px] font-mono tracking-[0.25em] text-brand-sand/40 uppercase font-semibold">DIRECT CONTACT</h4>
            <div className="space-y-4">
              <p className="text-xs text-brand-cream/70 leading-relaxed font-light">
                For inquiries, custom design solutions, or full-stack integrations, connect directly.
              </p>
              <div className="space-y-3.5 text-xs font-mono">
                <a
                  id="footer-whatsapp-link"
                  href="https://wa.me/917470558303"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-2.5 text-brand-cream/80 hover:text-brand-sand transition-colors py-1 cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5 text-brand-sand" />
                  <span>WhatsApp: +91 7470558303</span>
                </a>
                <a
                  id="footer-email-link"
                  href="mailto:fuvish.web@gmail.com"
                  className="flex items-center space-x-2.5 text-brand-cream/80 hover:text-brand-sand transition-colors py-1 cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5 text-brand-sand" />
                  <span>Email: fuvish.web@gmail.com</span>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright, Legal, Back-to-Top */}
        <div className="border-t border-brand-cream/10 pt-8 flex flex-col md:flex-row items-center justify-between text-[10px] font-mono text-brand-cream/45 space-y-6 md:space-y-0">
          
          {/* Legal Links */}
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-5">
            <button onClick={() => setView('404')} className="hover:text-brand-cream transition-colors cursor-pointer">PRIVACY POLICY</button>
            <span className="text-brand-cream/15">/</span>
            <button onClick={() => setView('404')} className="hover:text-brand-cream transition-colors cursor-pointer">TERMS OF SALE</button>
            <span className="text-brand-cream/15">/</span>
            <button onClick={() => setView('404')} className="hover:text-brand-cream transition-colors cursor-pointer">ETHICAL CHARTER</button>
            <span className="text-brand-cream/15">/</span>
            <button onClick={() => setView('404')} className="hover:text-brand-cream transition-colors cursor-pointer">ACCESSIBILITY</button>
          </div>

          {/* Copyright */}
          <div className="text-center md:text-right space-y-1">
            <p>© 2026 KORA ATELIER. SPUN & CRAFTED WITH CARE.</p>
          </div>

          {/* Interactive Back to Top */}
          <div>
            <button 
              id="footer-back-to-top"
              onClick={scrollToTop}
              className="flex items-center space-x-1.5 hover:text-brand-cream transition-all group cursor-pointer border border-brand-cream/10 hover:border-brand-cream/30 px-3 py-1.5 uppercase tracking-widest text-[9px]"
            >
              <span>BACK TO TOP</span>
              <ArrowUp className="w-3 h-3 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>

        </div>

      </div>
    </footer>
  );
}

