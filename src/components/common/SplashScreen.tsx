import React, { useEffect, useState } from 'react';
import { useStore } from '../../context/StoreContext';

export const SplashScreen: React.FC = () => {
  const { showSplash, dismissSplash } = useStore();
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (!showSplash) return;
    // Keep the splash loading experience short (1.8 seconds) as requested
    const timer = setTimeout(() => {
      setFading(true);
      setTimeout(() => {
        dismissSplash();
      }, 500);
    }, 1800);

    return () => clearTimeout(timer);
  }, [showSplash, dismissSplash]);

  if (!showSplash) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FAF8F5] transition-opacity duration-500 ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center space-y-3 animate-fade-in text-center px-4">
        <div className="w-12 h-0.5 bg-[#D4AF37] mb-2 scale-x-100 transition-transform" />
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-[0.28em] text-[#1A1A1A] animate-pulse">
          NEXORA
        </h1>
        <p className="text-[11px] sm:text-xs uppercase tracking-[0.4em] text-[#8C8275] font-medium">
          Modern Girls & Women Couture
        </p>
        <div className="pt-6 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1A1A1A] animate-ping" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#1A1A1A]" />
        </div>
      </div>
    </div>
  );
};
