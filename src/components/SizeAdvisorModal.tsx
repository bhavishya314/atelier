import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Ruler, Check, Info } from 'lucide-react';

interface SizeAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SizeAdvisorModal({ isOpen, onClose }: SizeAdvisorModalProps) {
  const [height, setHeight] = useState('175'); // in cm
  const [weight, setWeight] = useState('68'); // in kg
  const [fitPreference, setFitPreference] = useState<'fitted' | 'relaxed' | 'oversized'>('relaxed');
  const [result, setResult] = useState<{ size: string; comment: string } | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateSize = (e: FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);
    
    setTimeout(() => {
      const h = parseInt(height);
      const w = parseInt(weight);
      let calculatedSize = 'M';

      // Simple elegant sizing formula
      if (h < 165) {
        calculatedSize = w < 55 ? 'XS' : w < 65 ? 'S' : 'M';
      } else if (h < 178) {
        calculatedSize = w < 62 ? 'S' : w < 75 ? 'M' : 'L';
      } else {
        calculatedSize = w < 70 ? 'M' : w < 85 ? 'L' : 'XL';
      }

      // Fit preference adjustments
      let finalSize = calculatedSize;
      if (fitPreference === 'fitted') {
        if (calculatedSize === 'XL') finalSize = 'L';
        else if (calculatedSize === 'L') finalSize = 'M';
        else if (calculatedSize === 'M') finalSize = 'S';
        else if (calculatedSize === 'S') finalSize = 'XS';
      } else if (fitPreference === 'oversized') {
        if (calculatedSize === 'XS') finalSize = 'S';
        else if (calculatedSize === 'S') finalSize = 'M';
        else if (calculatedSize === 'M') finalSize = 'L';
        else if (calculatedSize === 'L') finalSize = 'XL';
      }

      const comments: Record<string, string> = {
        fitted: `Based on your metrics, we recommend size ${finalSize} for a sharp, closer architectural drape that contours perfectly with natural shoulder lines.`,
        relaxed: `We recommend size ${finalSize} for a modern relaxed fit. This mimics the exact runway draft, allowing clean under-layering with fine cashmere sweaters.`,
        oversized: `We suggest size ${finalSize} for a sculptural, dropped-shoulder slouchy envelope. This accentuates the heavy Virgin Wool double-face fall and structural lines.`
      };

      setResult({
        size: finalSize,
        comment: comments[fitPreference]
      });
      setIsCalculating(false);
    }, 1200);
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
            className="absolute inset-0 bg-brand-charcoal/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Dialog Body */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-lg bg-brand-cream border border-brand-sand shadow-2xl p-6 md:p-8 z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-brand-sand/60">
              <div className="flex items-center space-x-1.5">
                <Ruler className="w-4 h-4 text-brand-muted" />
                <h3 className="font-serif text-xl font-light text-brand-charcoal">Kora Size Advisor</h3>
              </div>
              <button
                id="close-size-advisor"
                onClick={onClose}
                className="p-1.5 hover:text-brand-muted transition-colors flex items-center justify-center cursor-pointer"
              >
                <X className="w-[18px] h-[18px]" />
              </button>
            </div>

            {/* Calculations Form */}
            {!result ? (
              <form onSubmit={calculateSize} className="space-y-6 mt-6">
                <p className="text-xs text-brand-muted font-light leading-relaxed">
                  Enter your details below to find your perfect size. We will recommend the best fit for you based on your height, weight, and fit preferences.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono tracking-wider text-brand-muted uppercase mb-1">Height (cm)</label>
                    <input
                      id="advisor-height"
                      type="number"
                      min={140}
                      max={220}
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="w-full bg-brand-sand/15 border border-brand-sand p-2.5 text-xs focus:outline-none focus:border-brand-charcoal rounded-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono tracking-wider text-brand-muted uppercase mb-1">Weight (kg)</label>
                    <input
                      id="advisor-weight"
                      type="number"
                      min={35}
                      max={150}
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="w-full bg-brand-sand/15 border border-brand-sand p-2.5 text-xs focus:outline-none focus:border-brand-charcoal rounded-none font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-mono tracking-wider text-brand-muted uppercase">Preferred Silhouette Fit</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['fitted', 'relaxed', 'oversized'] as const).map((fit) => (
                      <button
                        id={`advisor-fit-select-${fit}`}
                        key={fit}
                        type="button"
                        onClick={() => setFitPreference(fit)}
                        className={`py-2 text-xs font-medium border uppercase tracking-wider transition-all rounded-none ${
                          fitPreference === fit
                            ? 'bg-brand-charcoal text-white border-brand-charcoal'
                            : 'border-brand-sand hover:border-brand-muted text-brand-charcoal'
                        }`}
                      >
                        {fit}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-brand-sand/50">
                  <button
                    id="submit-advisor"
                    type="submit"
                    disabled={isCalculating}
                    className="w-full py-3.5 bg-brand-charcoal hover:bg-brand-charcoal/90 text-white text-xs font-semibold tracking-widest uppercase transition-colors flex items-center justify-center space-x-2"
                  >
                    {isCalculating ? (
                      <>
                        <span className="w-4 h-4 border-t border-r border-white rounded-full animate-spin" />
                        <span>Calculating Dimensions...</span>
                      </>
                    ) : (
                      <>
                        <Ruler className="w-4 h-4" />
                        <span>CALCULATE MY SIZE</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              // Results Display
              <div className="space-y-6 mt-6">
                <div className="bg-brand-sand/15 border border-brand-sand/60 p-6 text-center space-y-3">
                  <span className="text-[10px] font-mono tracking-[0.25em] text-brand-muted uppercase">RECOMMENDED CUT</span>
                  <div className="font-serif text-5xl font-light text-brand-charcoal tracking-wider">
                    SIZE {result.size}
                  </div>
                  <div className="h-[1px] w-8 bg-brand-charcoal/20 mx-auto" />
                  <p className="text-xs text-brand-charcoal/80 leading-relaxed font-light px-2">
                    {result.comment}
                  </p>
                </div>

                <div className="p-4 bg-brand-cream border border-brand-sand flex items-start space-x-2.5">
                  <Info className="w-4 h-4 text-brand-muted mt-0.5 flex-shrink-0" />
                  <p className="text-[11px] text-brand-muted font-light leading-relaxed">
                    Most Kora shirts and clothing items have a relaxed fit. If you are in between sizes and prefer a tighter fit, we recommend selecting one size down.
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    id="recalculate-advisor"
                    onClick={() => setResult(null)}
                    className="flex-grow py-3 border border-brand-sand hover:bg-brand-sand/30 text-brand-charcoal text-xs font-semibold tracking-widest uppercase transition-colors"
                  >
                    RECALCULATE
                  </button>
                  <button
                    id="apply-advisor-close"
                    onClick={onClose}
                    className="flex-grow py-3 bg-brand-charcoal hover:bg-brand-charcoal/90 text-white text-xs font-semibold tracking-widest uppercase transition-all shadow-md flex items-center justify-center space-x-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>APPLY ADVISORY</span>
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
