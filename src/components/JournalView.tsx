import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, ArrowRight, X, BookOpen, Calendar, Share2, Sparkles } from 'lucide-react';
import { JournalEntry } from '../types';

interface JournalViewProps {
  journalEntries: JournalEntry[];
}

export default function JournalView({ journalEntries }: JournalViewProps) {
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [showProcessModal, setShowProcessModal] = useState<boolean>(false);

  // Dynamically extract categories
  const categories = ['All', ...Array.from(new Set(journalEntries.map(entry => entry.category)))];

  // Filter entries based on active tab
  const filteredEntries = activeCategory === 'All'
    ? journalEntries
    : journalEntries.filter(entry => entry.category === activeCategory);

  return (
    <div id="journal-view" className="bg-[#FAF7F2] min-h-screen pt-12 pb-24 transition-colors duration-500">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12">
        
        {/* Header Block */}
        <div className="mb-14 text-center max-w-2xl mx-auto space-y-3.5">
          <p className="text-[10px] font-mono tracking-[0.25em] text-[#8E4D3E] uppercase font-bold">
            THE KORA JOURNAL
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium text-brand-charcoal tracking-tight">
            The Style Journal
          </h1>
          <div className="h-[1px] w-12 bg-[#8E4D3E]/30 mx-auto mt-3" />
          <p className="text-xs sm:text-sm text-brand-muted mt-3 font-normal leading-relaxed max-w-lg mx-auto">
            Practical style advice, fabric care guides, seasonal collection inspiration, and behind-the-scenes stories of authentic Indian craftsmanship.
          </p>
        </div>

        {/* Category Filters (Approachable & Interactive) */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 text-[10px] sm:text-xs font-mono tracking-wider uppercase transition-all duration-300 border rounded-full cursor-pointer ${
                activeCategory === cat
                  ? 'bg-brand-charcoal text-[#FAF7F2] border-brand-charcoal shadow-sm'
                  : 'bg-white text-brand-muted border-neutral-200/60 hover:border-brand-charcoal hover:text-brand-charcoal'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Journal Entries Grid - Modern 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          <AnimatePresence mode="popLayout">
            {filteredEntries.map((entry) => (
              <motion.article
                key={entry.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="bg-white border border-brand-sand/40 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.015)] flex flex-col group cursor-pointer hover:shadow-[0_12px_36px_rgba(142,77,62,0.05)] hover:border-[#8E4D3E]/20 hover:-translate-y-1 transition-all duration-500 ease-out overflow-hidden"
                onClick={() => setSelectedEntry(entry)}
              >
                {/* Image Frame with consistent 16:10 premium aspect ratio */}
                <div className="aspect-[16/10] bg-brand-sand/10 overflow-hidden relative border-b border-brand-sand/20">
                  <img
                    src={entry.image}
                    alt={entry.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-104"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Category Pill with dynamic styling based on category name */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className={`text-[8.5px] font-mono tracking-widest font-semibold uppercase px-3 py-1 rounded-full border ${
                      entry.category === 'Styling Tips'
                        ? 'bg-[#FAF3E0] text-[#B58A3D] border-[#EAD09F]/40'
                        : entry.category === 'Indian Craftsmanship'
                        ? 'bg-[#E6EEF8] text-[#3D6997] border-[#9EBAD9]/40'
                        : entry.category === 'Fabric Care'
                        ? 'bg-[#EEF3EA] text-[#5A7E4F] border-[#B6CDAB]/40'
                        : 'bg-[#FDF3F1] text-[#8E4D3E] border-[#F5D5D0]/40'
                    }`}>
                      {entry.category}
                    </span>
                  </div>
                </div>

                {/* Card Details */}
                <div className="p-6 sm:p-8 flex-grow flex flex-col justify-between space-y-5">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 text-[10px] font-mono text-brand-muted/90">
                      <span className="flex items-center space-x-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#8E4D3E]/80" />
                        <span>{entry.date}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center space-x-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#8E4D3E]/80" />
                        <span>5 MIN READ</span>
                      </span>
                    </div>
                    
                    <h3 className="font-serif text-xl sm:text-2xl font-medium tracking-tight text-brand-charcoal group-hover:text-[#8E4D3E] transition-colors duration-300 leading-snug">
                      {entry.title}
                    </h3>
                    
                    <p className="text-xs sm:text-sm text-brand-muted/85 font-light leading-relaxed line-clamp-2">
                      {entry.subtitle}
                    </p>
                  </div>

                  {/* Read Essay Action */}
                  <div className="pt-4 border-t border-brand-sand/20 flex items-center justify-between">
                    <span className="text-[10px] sm:text-xs font-mono tracking-widest text-brand-charcoal font-semibold group-hover:text-[#8E4D3E] transition-colors flex items-center space-x-1.5">
                      <span>READ ESSAY</span>
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300 text-[#8E4D3E]" />
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        {/* Crafted with Care Banner (Modern, warm neutral design) */}
        <div className="mt-20 bg-[#F5F0E8] border border-brand-sand/80 rounded-2xl p-8 md:p-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative overflow-hidden">
          {/* Subtle Decorative Background Lines */}
          <div className="absolute -right-16 -bottom-16 w-48 h-48 rounded-full border border-[#8E4D3E]/5 pointer-events-none select-none" />
          <div className="absolute -right-24 -bottom-24 w-64 h-64 rounded-full border border-[#8E4D3E]/5 pointer-events-none select-none" />
          
          <div className="md:col-span-8 space-y-3.5 relative z-10">
            <span className="font-mono text-[9px] tracking-[0.25em] text-[#8E4D3E] font-bold flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>HONEST CREATION</span>
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-brand-charcoal tracking-tight">
              Crafted with Care
            </h2>
            <p className="text-xs sm:text-sm text-brand-muted font-normal leading-relaxed max-w-2xl">
              We choose premium, sustainably sourced fibers and partner directly with local Indian weaver cooperatives. Every garment is carefully hand-tailored, celebrating slow design, fair livelihoods, and natural beauty.
            </p>
          </div>
          <div className="md:col-span-4 flex justify-start md:justify-end relative z-10">
            <button
              onClick={() => setShowProcessModal(true)}
              className="bg-brand-charcoal hover:bg-[#8E4D3E] text-[#FAF7F2] text-[10px] sm:text-xs font-mono tracking-widest px-6 py-3.5 uppercase transition-all duration-300 hover:shadow-md border border-brand-charcoal hover:border-[#8E4D3E] inline-flex items-center space-x-2 rounded-full cursor-pointer"
            >
              <span>DISCOVER OUR PROCESS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* DETAILED PROCESS MODAL (Crafted with Care) */}
      <AnimatePresence>
        {showProcessModal && (
          <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-brand-charcoal/45 backdrop-blur-xs"
              onClick={() => setShowProcessModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="relative w-full max-w-2xl bg-[#FAF8F5] shadow-2xl rounded-2xl overflow-hidden z-10 p-6 sm:p-10 border border-brand-sand"
            >
              <button
                onClick={() => setShowProcessModal(false)}
                className="absolute top-4 right-4 p-2 text-brand-muted hover:text-brand-charcoal transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="space-y-5">
                <span className="font-mono text-[9px] tracking-widest text-[#8E4D3E] font-bold">OUR HERITAGE PROCESS</span>
                <h3 className="font-serif text-2xl sm:text-3xl font-medium text-brand-charcoal tracking-tight">
                  Sustainable, Human-Scale Fashion
                </h3>
                <div className="h-[1px] w-12 bg-[#8E4D3E]/30" />
                <div className="space-y-4 text-xs sm:text-sm text-brand-muted/95 leading-relaxed font-normal">
                  <p>
                    <strong>1. Direct Cooperative Sourcing:</strong> We cut out traditional middlemen to buy yarns and woven fabrics directly from weavers in Gujarat, Madhya Pradesh, and West Bengal. This ensures fair wages, transparent prices, and direct mutual respect.
                  </p>
                  <p>
                    <strong>2. Clean Materials Only:</strong> We exclusively build with natural cotton, high-quality linen, Khadi, and peace silks. No petroleum-based synthetics or harmful chemical treatments find a home in our workshops.
                  </p>
                  <p>
                    <strong>3. Small-Batch Tailoring:</strong> Every piece is custom cut and stitched in our local Indian studios, minimizing cutting waste and ensuring that every single hem, pocket, and buttonhole meets strict quality standards.
                  </p>
                </div>
                <div className="pt-4 flex justify-end">
                  <button
                    onClick={() => setShowProcessModal(false)}
                    className="px-5 py-2.5 bg-brand-charcoal hover:bg-[#8E4D3E] text-[#FAF7F2] text-[10px] font-mono tracking-widest uppercase transition-colors rounded-full cursor-pointer"
                  >
                    CLOSE WINDOW
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FULLSCREEN ESSAY READING OVERLAY */}
      <AnimatePresence>
        {selectedEntry && (
          <div className="fixed inset-0 z-50 overflow-hidden flex justify-center">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-brand-charcoal/45 backdrop-blur-xs"
              onClick={() => setSelectedEntry(null)}
            />

            {/* Reading sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 180 }}
              className="relative w-full max-w-4xl h-full bg-[#FAF8F5] shadow-2xl overflow-y-auto z-10 p-6 sm:p-10 md:p-16 flex flex-col"
            >
              {/* Header controls */}
              <div className="flex items-center justify-between pb-6 border-b border-brand-sand">
                <span className="font-mono text-[9px] sm:text-[10px] tracking-wider text-[#8E4D3E] font-semibold flex items-center space-x-1.5">
                  <BookOpen className="w-4 h-4" />
                  <span>STUDIO ESSAY</span>
                </span>
                <button
                  id="close-article-overlay"
                  onClick={() => setSelectedEntry(null)}
                  className="p-1.5 border border-brand-sand/60 hover:border-brand-charcoal bg-white/80 hover:bg-white text-brand-charcoal transition-all flex items-center space-x-1.5 cursor-pointer text-[10px] font-mono tracking-widest rounded-full px-4"
                >
                  <span>CLOSE</span>
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Approachable Editorial Photo */}
              <div className="aspect-[16/9] w-full bg-brand-sand/10 overflow-hidden my-8 border border-brand-sand/40 rounded-2xl shadow-sm">
                <img src={selectedEntry.image} alt={selectedEntry.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>

              {/* Article Content Layout */}
              <div className="max-w-2xl mx-auto space-y-6 flex-1">
                <div className="space-y-3 text-center sm:text-left">
                  <div className="text-[10px] font-mono text-brand-muted flex items-center justify-center sm:justify-start space-x-2">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-[#8E4D3E]/70" />
                      <span>{selectedEntry.date}</span>
                    </span>
                    <span>•</span>
                    <span>BY KORA EDITORS</span>
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-medium text-brand-charcoal tracking-tight leading-tight">
                    {selectedEntry.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-brand-muted/85 font-serif italic leading-relaxed pt-1">
                    &ldquo;{selectedEntry.subtitle}&rdquo;
                  </p>
                </div>

                <div className="h-[1px] w-16 bg-[#8E4D3E]/20 my-4" />

                {/* Paragraphs with high readability spacing */}
                <div className="space-y-6 text-sm sm:text-base text-brand-charcoal/90 font-normal leading-relaxed tracking-wide">
                  {selectedEntry.content.map((para, pIdx) => (
                    <p key={pIdx} className="first-letter:text-3xl first-letter:font-serif first-letter:mr-2 first-letter:float-left first-letter:text-[#8E4D3E]">
                      {para}
                    </p>
                  ))}
                </div>

                {/* Footer sharing and quick navigation */}
                <div className="pt-10 border-t border-brand-sand/50 flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
                  <div className="flex items-center space-x-3 text-[10px] font-mono text-brand-muted">
                    <Share2 className="w-3.5 h-3.5 text-[#8E4D3E]" />
                    <span>SHARE ESSAY</span>
                    <span>/</span>
                    <button className="hover:text-brand-charcoal transition-colors">TWITTER</button>
                    <span>/</span>
                    <button className="hover:text-brand-charcoal transition-colors">PINTEREST</button>
                  </div>
                  <button
                    id="back-to-journal"
                    onClick={() => setSelectedEntry(null)}
                    className="text-xs font-mono tracking-widest text-[#8E4D3E] hover:text-brand-charcoal transition-colors font-semibold uppercase flex items-center space-x-1 cursor-pointer"
                  >
                    <span>Back to Journal</span>
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
