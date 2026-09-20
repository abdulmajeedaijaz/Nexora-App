import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Sparkles, Compass, ShieldCheck, ArrowRight } from 'lucide-react';

export const OnboardingModal: React.FC = () => {
  const { showOnboarding, dismissOnboarding, setCurrentView } = useStore();
  const [currentStep, setCurrentStep] = useState(0);

  if (!showOnboarding) return null;

  const screens = [
    {
      icon: Sparkles,
      title: 'Discover NEXORA',
      description: 'Premium fashion and footwear curated for modern lifestyles.',
      badge: 'ATELIER LAUNCH',
      image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop',
    },
    {
      icon: Compass,
      title: 'Find Your Style',
      description: "Explore girls' and women's fashion collections.",
      badge: 'VERSATILE COUTURE',
      image: 'https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?q=80&w=800&auto=format&fit=crop',
    },
    {
      icon: ShieldCheck,
      title: 'Shop With Confidence',
      description: 'Secure payments • Easy ordering • Easy tracking',
      badge: 'UNCOMPROMISED CARE',
      image: 'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?q=80&w=800&auto=format&fit=crop',
    },
  ];

  const handleNext = () => {
    if (currentStep < screens.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      dismissOnboarding();
      setCurrentView('shop');
    }
  };

  const handleSkip = () => {
    dismissOnboarding();
  };

  const activeScreen = screens[currentStep];
  const IconComponent = activeScreen.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FAF8F5] max-w-md w-full rounded-2xl shadow-2xl border border-[#EAE6DF] overflow-hidden flex flex-col">
        {/* Visual Hero Image */}
        <div className="relative h-60 w-full overflow-hidden bg-[#E8E3D8]">
          <img
            src={activeScreen.image}
            alt={activeScreen.title}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F5] via-transparent to-black/20" />
          <div className="absolute top-4 left-4">
            <span className="bg-[#1A1A1A]/80 text-[#D4AF37] backdrop-blur-md text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full border border-[#D4AF37]/30">
              {activeScreen.badge}
            </span>
          </div>
          <div className="absolute top-4 right-4">
            <button
              onClick={handleSkip}
              className="text-xs uppercase tracking-wider font-semibold text-white/90 hover:text-white bg-black/40 backdrop-blur-md px-3 py-1 rounded-full"
            >
              Skip
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-[#F2EDE2] border border-[#DCD4C7] flex items-center justify-center text-[#B38F4D] mb-4">
            <IconComponent className="w-6 h-6" />
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A] tracking-tight">
            {activeScreen.title}
          </h2>

          <p className="text-xs sm:text-sm text-[#6E675F] mt-2.5 leading-relaxed max-w-xs">
            {activeScreen.description}
          </p>

          {/* Stepper Dots */}
          <div className="flex items-center space-x-2 my-6">
            {screens.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentStep ? 'w-8 bg-[#1A1A1A]' : 'w-2 bg-[#D1C9BD]'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="w-full flex items-center gap-3">
            <button
              onClick={handleSkip}
              className="flex-1 py-3 text-xs font-semibold text-[#666] hover:text-[#1A1A1A] transition-colors rounded-xl border border-[#D8D0C3]"
            >
              Skip
            </button>
            <button
              onClick={handleNext}
              className="flex-1 py-3 bg-[#1A1A1A] text-white hover:bg-[#333] transition-colors rounded-xl text-xs font-semibold tracking-wider flex items-center justify-center gap-1.5 shadow-md"
            >
              <span>{currentStep === screens.length - 1 ? 'Get Started' : 'Next'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
