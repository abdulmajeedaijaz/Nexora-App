import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ShieldCheck, RefreshCw, Truck, Award, Send, Check } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView, setSelectedCategoryFilter, setIsSizeGuideModalOpen, setIsSupportModalOpen, showToast } =
    useStore();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    showToast('Subscribed to Privileged Circle', 'Check your inbox for exclusive early access and style notes.');
    setEmail('');
  };

  return (
    <footer className="bg-[#181716] text-[#E0DDD5] pt-16 pb-24 lg:pb-12 border-t border-[#2B2926]">
      {/* Value Pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-[#2C2926]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#242220] flex items-center justify-center text-[#D4AF37] shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider font-semibold text-white">Handcrafted Precision</h4>
              <p className="text-[11px] text-[#9E988F] mt-1 leading-relaxed">
                Artisanal footwear with ergonomic arch support and anti-skid TPR soles.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#242220] flex items-center justify-center text-[#D4AF37] shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider font-semibold text-white">Express Delivery</h4>
              <p className="text-[11px] text-[#9E988F] mt-1 leading-relaxed">
                Complimentary luxury gift boxing and fast transit across India.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#242220] flex items-center justify-center text-[#D4AF37] shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider font-semibold text-white">7-Day Easy Exchange</h4>
              <p className="text-[11px] text-[#9E988F] mt-1 leading-relaxed">
                Doorstep pickup for hassle-free size exchanges and returns.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#242220] flex items-center justify-center text-[#D4AF37] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider font-semibold text-white">100% Secure Checkout</h4>
              <p className="text-[11px] text-[#9E988F] mt-1 leading-relaxed">
                Encrypted UPI, Cards, Net Banking, and Verified COD payments.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand Philosophy */}
          <div className="md:col-span-2 space-y-4">
            <span className="font-serif text-2xl font-bold tracking-[0.25em] text-white">NEXORA</span>
            <p className="text-xs text-[#A8A298] leading-relaxed max-w-sm">
              NEXORA is a modern luxury atelier curating exceptional footwear and fashion for young girls and women.
              Architected with timeless design, superior foot ergonomics, and pure celebration aesthetics.
            </p>
            <div className="pt-2">
              <span className="text-[11px] uppercase tracking-wider text-[#D4AF37] block font-semibold mb-2">
                Join the Privileged Circle
              </span>
              <form onSubmit={handleSubscribe} className="flex max-w-sm">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="bg-[#242220] border border-[#3D3934] text-xs px-3.5 py-2.5 rounded-l-md text-white placeholder-[#706B62] focus:outline-none focus:border-[#D4AF37] flex-1"
                />
                <button
                  type="submit"
                  className="bg-[#D4AF37] text-[#1A1A1A] px-4 rounded-r-md text-xs font-semibold hover:bg-[#C5A030] transition-colors flex items-center justify-center"
                >
                  {subscribed ? <Check className="w-4 h-4" /> : <Send className="w-3.5 h-3.5" />}
                </button>
              </form>
            </div>
          </div>

          {/* Shop Categories */}
          <div>
            <h5 className="text-xs uppercase tracking-widest text-white font-semibold mb-4">Collections</h5>
            <ul className="space-y-2.5 text-xs text-[#A8A298]">
              <li>
                <button
                  onClick={() => {
                    setSelectedCategoryFilter('girls-footwear');
                    setCurrentView('shop');
                  }}
                  className="hover:text-white transition-colors"
                >
                  Girls Footwear
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategoryFilter('girls-footwear');
                    setCurrentView('shop');
                  }}
                  className="hover:text-white transition-colors"
                >
                  Celebration Block Heels
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategoryFilter('girls-footwear');
                    setCurrentView('shop');
                  }}
                  className="hover:text-white transition-colors"
                >
                  Grosgrain Ballerinas
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategoryFilter('girls-footwear');
                    setCurrentView('shop');
                  }}
                  className="hover:text-white transition-colors"
                >
                  Champagne Glitter Sandals
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategoryFilter('girls-apparel');
                    setCurrentView('shop');
                  }}
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span>Girls Couture Dresses</span>
                  <span className="text-[9px] bg-[#D4AF37]/20 text-[#D4AF37] px-1.5 py-0.2 rounded">New</span>
                </button>
              </li>
              <li>
                <span className="text-[#696359] cursor-not-allowed">Women Atelier (Expansion Ready)</span>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h5 className="text-xs uppercase tracking-widest text-white font-semibold mb-4">Customer Care</h5>
            <ul className="space-y-2.5 text-xs text-[#A8A298]">
              <li>
                <button
                  onClick={() => setIsSizeGuideModalOpen(true)}
                  className="hover:text-[#D4AF37] transition-colors text-left flex items-center gap-1"
                >
                  <span>Interactive Size Guide & Foot Measurement</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsSupportModalOpen(true)}
                  className="hover:text-white transition-colors text-left"
                >
                  Help Center & FAQs
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('account')}
                  className="hover:text-white transition-colors text-left"
                >
                  Track Your Order
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('account')}
                  className="hover:text-white transition-colors text-left"
                >
                  Returns & Doorstep Pickup
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsSupportModalOpen(true)}
                  className="hover:text-white transition-colors text-left"
                >
                  WhatsApp Concierge
                </button>
              </li>
            </ul>
          </div>

          {/* Brand & Legal */}
          <div>
            <h5 className="text-xs uppercase tracking-widest text-white font-semibold mb-4">Atelier & Legal</h5>
            <ul className="space-y-2.5 text-xs text-[#A8A298]">
              <li>
                <button
                  onClick={() => setCurrentView('account')}
                  className="hover:text-white transition-colors"
                >
                  About NEXORA
                </button>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer transition-colors">Authenticity Guarantee</span>
              </li>
              <li className="pt-2">
                <span className="text-[10px] text-[#787267] block">Customer Helpline:</span>
                <span className="text-xs text-white font-medium">+91 (080) 4920-NEXORA</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Payments & Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-[#262422] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-[11px] text-[#7A746B]">
          © {new Date().getFullYear()} NEXORA Luxury Fashion & Footwear Ltd. All rights reserved.
        </div>

        {/* Indian Payment Badges */}
        <div className="flex items-center space-x-2 text-[10px] text-[#A8A298]">
          <span className="bg-[#242220] px-2 py-1 rounded border border-[#38342E]">UPI / GPay / PhonePe</span>
          <span className="bg-[#242220] px-2 py-1 rounded border border-[#38342E]">Visa / Mastercard</span>
          <span className="bg-[#242220] px-2 py-1 rounded border border-[#38342E]">RuPay</span>
          <span className="bg-[#242220] px-2 py-1 rounded border border-[#38342E]">Net Banking</span>
          <span className="bg-[#242220] px-2 py-1 rounded border border-[#38342E]">Cash on Delivery</span>
        </div>
      </div>
    </footer>
  );
};
