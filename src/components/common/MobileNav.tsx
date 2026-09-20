import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Home, Compass, Heart, ShoppingBag, User } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { currentView, setCurrentView, cart, wishlist, currentUser, setIsAuthModalOpen } = useStore();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-lg border-t border-[#EAE6DF] lg:hidden px-2 py-2 shadow-lg">
      <div className="flex items-center justify-around max-w-md mx-auto">
        <button
          onClick={() => setCurrentView('home')}
          className={`flex flex-col items-center justify-center p-1.5 min-w-[56px] transition-colors ${
            currentView === 'home' ? 'text-[#1A1A1A]' : 'text-[#7A746E]'
          }`}
        >
          <Home className={`w-5 h-5 ${currentView === 'home' ? 'stroke-[2.5px]' : 'stroke-1.5'}`} />
          <span className={`text-[10px] mt-1 font-medium ${currentView === 'home' ? 'font-semibold' : ''}`}>
            Home
          </span>
        </button>

        <button
          onClick={() => setCurrentView('shop')}
          className={`flex flex-col items-center justify-center p-1.5 min-w-[56px] transition-colors ${
            currentView === 'shop' || currentView === 'product_detail' ? 'text-[#1A1A1A]' : 'text-[#7A746E]'
          }`}
        >
          <Compass className={`w-5 h-5 ${currentView === 'shop' ? 'stroke-[2.5px]' : 'stroke-1.5'}`} />
          <span className={`text-[10px] mt-1 font-medium ${currentView === 'shop' ? 'font-semibold' : ''}`}>
            Shop
          </span>
        </button>

        <button
          onClick={() => setCurrentView('wishlist')}
          className={`relative flex flex-col items-center justify-center p-1.5 min-w-[56px] transition-colors ${
            currentView === 'wishlist' ? 'text-[#1A1A1A]' : 'text-[#7A746E]'
          }`}
        >
          <Heart className={`w-5 h-5 ${currentView === 'wishlist' ? 'stroke-[2.5px]' : 'stroke-1.5'}`} />
          {wishlist.length > 0 && (
            <span className="absolute top-1 right-3 w-4 h-4 bg-[#1E1E1E] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {wishlist.length}
            </span>
          )}
          <span className={`text-[10px] mt-1 font-medium ${currentView === 'wishlist' ? 'font-semibold' : ''}`}>
            Wishlist
          </span>
        </button>

        <button
          onClick={() => setCurrentView('cart')}
          className={`relative flex flex-col items-center justify-center p-1.5 min-w-[56px] transition-colors ${
            currentView === 'cart' ? 'text-[#1A1A1A]' : 'text-[#7A746E]'
          }`}
        >
          <ShoppingBag className={`w-5 h-5 ${currentView === 'cart' ? 'stroke-[2.5px]' : 'stroke-1.5'}`} />
          {cartCount > 0 && (
            <span className="absolute top-1 right-2.5 w-4.5 h-4.5 bg-[#B38F4D] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
          <span className={`text-[10px] mt-1 font-medium ${currentView === 'cart' ? 'font-semibold' : ''}`}>
            Bag
          </span>
        </button>

        <button
          onClick={() => {
            if (!currentUser) {
              setIsAuthModalOpen(true);
            } else {
              setCurrentView('account');
            }
          }}
          className={`flex flex-col items-center justify-center p-1.5 min-w-[56px] transition-colors ${
            currentView === 'account' ? 'text-[#1A1A1A]' : 'text-[#7A746E]'
          }`}
        >
          <User className={`w-5 h-5 ${currentView === 'account' ? 'stroke-[2.5px]' : 'stroke-1.5'}`} />
          <span className={`text-[10px] mt-1 font-medium ${currentView === 'account' ? 'font-semibold' : ''}`}>
            {currentUser ? 'Account' : 'Sign In'}
          </span>
        </button>
      </div>
    </nav>
  );
};
