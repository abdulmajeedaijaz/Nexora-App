import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../shop/ProductCard';
import {
  ArrowRight,
  Sparkles,
  Ruler,
  ShieldCheck,
  Award,
  Truck,
  Heart,
  ChevronRight,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const {
    products,
    banners,
    collections,
    categories,
    setCurrentView,
    setSelectedCategoryFilter,
    setSelectedSubcategoryFilter,
    setIsSizeGuideModalOpen,
  } = useStore();

  const heroBanner = banners[0];
  const secondaryBanner = banners[1] || banners[0];

  // Curated lists
  const bestsellerProducts = products.filter((p) => p.badges.includes('BESTSELLER')).slice(0, 4);
  const newArrivals = products.filter((p) => p.badges.includes('NEW')).slice(0, 4);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden bg-[#F4EFE6] border-b border-[#EAE4D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Copy */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left z-10">
              <div className="inline-flex items-center gap-2 bg-[#FAF8F5] border border-[#DCD4C7] px-3.5 py-1 rounded-full text-xs font-semibold text-[#8C6B24] shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#B38F4D]" />
                <span className="tracking-wider uppercase">{heroBanner.subtitle}</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-[#1A1A1A] leading-[1.15] tracking-tight">
                {heroBanner.title}
              </h1>

              <p className="text-sm sm:text-base text-[#6B655D] max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Step into elegance with handcrafted girls' block heels, shimmer ballerinas, and couture footwear
                engineered with cushioned arch memory foam and non-slip soles.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <button
                  onClick={() => {
                    setSelectedCategoryFilter('girls-footwear');
                    setSelectedSubcategoryFilter(null);
                    setCurrentView('shop');
                  }}
                  className="w-full sm:w-auto px-8 py-4 bg-[#1A1A1A] text-white hover:bg-[#333] transition-all rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <span>{heroBanner.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsSizeGuideModalOpen(true)}
                  className="w-full sm:w-auto px-6 py-4 bg-white/80 hover:bg-white text-[#1A1A1A] border border-[#DCD4C7] transition-colors rounded-xl text-xs font-semibold tracking-wider flex items-center justify-center gap-2 shadow-sm"
                >
                  <Ruler className="w-4 h-4 text-[#B38F4D]" />
                  <span>Measure Child's Foot</span>
                </button>
              </div>

              {/* Privilege Guarantee */}
              <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-[11px] text-[#7A746E]">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#B38F4D]" />
                  Handcrafted Precision
                </span>
                <span className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-[#B38F4D]" />
                  Express Delivery
                </span>
                <span className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[#B38F4D]" />
                  Arch Support TPR Soles
                </span>
              </div>
            </div>

            {/* Hero Image Showcase */}
            <div className="lg:col-span-6 relative">
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-[#DCD4C7] bg-[#FAF8F5]">
                <img
                  src={heroBanner.imageUrl}
                  alt={heroBanner.title}
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37] block">
                    FEATURED ATELIER PIECE
                  </span>
                  <p className="font-serif text-xl font-bold mt-0.5">
                    Aurelia Champagne Pearl Block Heels
                  </p>
                  <p className="text-xs text-white/80 mt-1">
                    Lightweight 1.5-inch stable block heel with anti-skid TPR sole.
                  </p>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-5 -left-5 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-[#EAE6DF] hidden sm:flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FAF6EC] text-[#B38F4D] flex items-center justify-center font-bold">
                  ★
                </div>
                <div>
                  <span className="text-xs font-bold text-[#1A1A1A] block">4.9 / 5.0 Rating</span>
                  <span className="text-[10px] text-[#7A746E]">Trusted by over 12,000+ happy parents</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Navigation Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#B38F4D]">
            CURATED EDITS
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A] mt-1">
            Shop by Footwear Style
          </h2>
          <p className="text-xs sm:text-sm text-[#706A62] mt-2">
            Every silhouette is engineered for safety, gentle arches, and head-turning celebration glamour.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {/* Sandals Card */}
          <div
            onClick={() => {
              setSelectedCategoryFilter('girls-footwear');
              setSelectedSubcategoryFilter('sandals');
              setCurrentView('shop');
            }}
            className="group relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer bg-[#F5F2EB] border border-[#EAE6DF] shadow-sm hover:shadow-lg transition-all"
          >
            <img
              src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=600&auto=format&fit=crop"
              alt="Sandals"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <span className="text-[9px] uppercase font-bold tracking-wider text-[#D4AF37]">
                Best For Festive
              </span>
              <h3 className="font-serif text-lg font-bold">Girls Sandals</h3>
              <span className="text-[11px] text-white/80 group-hover:underline flex items-center gap-1 mt-1">
                <span>Explore Sandal Edit</span>
                <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          </div>

          {/* Block Heels Card */}
          <div
            onClick={() => {
              setSelectedCategoryFilter('girls-footwear');
              setSelectedSubcategoryFilter('heels');
              setCurrentView('shop');
            }}
            className="group relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer bg-[#F5F2EB] border border-[#EAE6DF] shadow-sm hover:shadow-lg transition-all"
          >
            <img
              src="https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?q=80&w=600&auto=format&fit=crop"
              alt="Block Heels"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <span className="text-[9px] uppercase font-bold tracking-wider text-[#D4AF37]">
                Celebration Heights
              </span>
              <h3 className="font-serif text-lg font-bold">Block Heels</h3>
              <span className="text-[11px] text-white/80 group-hover:underline flex items-center gap-1 mt-1">
                <span>Explore Heels</span>
                <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          </div>

          {/* Ballerina Flats Card */}
          <div
            onClick={() => {
              setSelectedCategoryFilter('girls-footwear');
              setSelectedSubcategoryFilter('flats');
              setCurrentView('shop');
            }}
            className="group relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer bg-[#F5F2EB] border border-[#EAE6DF] shadow-sm hover:shadow-lg transition-all"
          >
            <img
              src="https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?q=80&w=600&auto=format&fit=crop"
              alt="Ballerina Flats"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <span className="text-[9px] uppercase font-bold tracking-wider text-[#D4AF37]">
                Everyday Grace
              </span>
              <h3 className="font-serif text-lg font-bold">Ballerinas & Bows</h3>
              <span className="text-[11px] text-white/80 group-hover:underline flex items-center gap-1 mt-1">
                <span>Explore Ballerinas</span>
                <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          </div>

          {/* Couture Apparel Card (Dynamic Expansion) */}
          <div
            onClick={() => {
              setSelectedCategoryFilter('girls-apparel');
              setSelectedSubcategoryFilter(null);
              setCurrentView('shop');
            }}
            className="group relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer bg-[#F5F2EB] border border-[#EAE6DF] shadow-sm hover:shadow-lg transition-all"
          >
            <img
              src="https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=600&auto=format&fit=crop"
              alt="Apparel Couture"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <span className="text-[9px] uppercase font-bold tracking-wider text-[#D4AF37]">
                New Couture Expansion
              </span>
              <h3 className="font-serif text-lg font-bold">Girls Dresses & Couture</h3>
              <span className="text-[11px] text-white/80 group-hover:underline flex items-center gap-1 mt-1">
                <span>Explore Dresses</span>
                <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Bestsellers Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#B38F4D]">
              BELOVED BY FAMILIES
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A] mt-1">
              Atelier Bestsellers
            </h2>
          </div>
          <button
            onClick={() => {
              setSelectedCategoryFilter('girls-footwear');
              setCurrentView('shop');
            }}
            className="text-xs font-semibold text-[#1A1A1A] hover:text-[#B38F4D] transition-colors flex items-center gap-1"
          >
            <span>View All Bestsellers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {bestsellerProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Interactive Size Studio Highlight Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1C1B19] rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden">
          <div className="max-w-xl space-y-4 z-10 relative">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37]">
              PATENTED SIZING CONFIDENCE
            </span>
            <h3 className="font-serif text-2xl sm:text-4xl font-bold leading-tight">
              Interactive NEXORA Size Studio & Foot Measurement
            </h3>
            <p className="text-xs sm:text-sm text-[#B8B2A7] leading-relaxed">
              Never guess shoe sizes online again. Enter your child's exact foot measurement in centimeters
              and our calculator instantly recommends the ideal size with safe, ergonomic growth cushioning.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => setIsSizeGuideModalOpen(true)}
                className="px-6 py-3 bg-[#D4AF37] text-[#1A1A1A] hover:bg-[#C5A030] transition-colors rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg"
              >
                <Ruler className="w-4 h-4" />
                <span>Launch Size Studio</span>
              </button>
              <button
                onClick={() => {
                  setSelectedCategoryFilter('girls-footwear');
                  setCurrentView('shop');
                }}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors rounded-xl text-xs font-semibold tracking-wider"
              >
                Browse Collection
              </button>
            </div>
          </div>

          <div className="hidden lg:block absolute right-12 top-1/2 -translate-y-1/2 max-w-sm text-right opacity-90">
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md space-y-3">
              <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2">
                <span className="text-[#AAA]">Foot Measurement</span>
                <span className="font-bold text-[#D4AF37]">18.2 cm</span>
              </div>
              <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2">
                <span className="text-[#AAA]">Growth Cushion</span>
                <span className="font-bold text-white">+0.5 cm</span>
              </div>
              <div className="flex items-center justify-between text-sm pt-1">
                <span className="text-white font-serif">Recommended Size</span>
                <span className="font-bold text-[#D4AF37] text-lg">Size 12</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#B38F4D]">
              FRESH OFF THE RUNWAY
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A] mt-1">
              New Season Arrivals
            </h2>
          </div>
          <button
            onClick={() => {
              setSelectedCategoryFilter(null);
              setCurrentView('shop');
            }}
            className="text-xs font-semibold text-[#1A1A1A] hover:text-[#B38F4D] transition-colors flex items-center gap-1"
          >
            <span>Explore All Designs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {newArrivals.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Craftsmanship & Ergonomics Pillars */}
      <section className="bg-[#F8F5EE] border-y border-[#EAE4D8] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#B38F4D]">
              UNCOMPROMISED STANDARDS
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A] mt-1">
              Why Parents Choose NEXORA
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#EAE6DF] space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#FAF6EC] text-[#B38F4D] flex items-center justify-center font-bold">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">
                Ergonomic Arch Support
              </h3>
              <p className="text-xs text-[#6B655D] leading-relaxed">
                Young feet need natural developmental balance. Every heel and ballerina features double memory
                foam footbeds engineered for all-day comfort.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#EAE6DF] space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#FAF6EC] text-[#B38F4D] flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">
                Anti-Skid TPR Soles
              </h3>
              <p className="text-xs text-[#6B655D] leading-relaxed">
                Polished marble floors and dance stages are completely safe with our specially grooved thermo-plastic
                rubber outsoles that offer strong grip without marking.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#EAE6DF] space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#FAF6EC] text-[#B38F4D] flex items-center justify-center font-bold">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">
                Non-Scratch Embellishments
              </h3>
              <p className="text-xs text-[#6B655D] leading-relaxed">
                Our crystals and metallic embroideries are set flush into soft velvet or smooth synthetic backing,
                preventing snagging on party dresses or irritating young skin.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
