import React, { useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/common/Header';
import { MobileNav } from './components/common/MobileNav';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/ToastContainer';
import { SplashScreen } from './components/common/SplashScreen';
import { OnboardingModal } from './components/common/OnboardingModal';

// Modals
import { AuthModal } from './components/modals/AuthModal';
import { SearchModal } from './components/modals/SearchModal';
import { SizeGuideModal } from './components/modals/SizeGuideModal';
import { SupportModal } from './components/modals/SupportModal';
import { CheckoutModal } from './components/checkout/CheckoutModal';

// Views
import { HomePage } from './components/home/HomePage';
import { ProductListing } from './components/shop/ProductListing';
import { ProductDetails } from './components/shop/ProductDetails';
import { CartDrawerOrView } from './components/cart/CartDrawerOrView';
import { WishlistView } from './components/account/WishlistView';
import { AccountView } from './components/account/AccountView';
import { AdminDashboard } from './components/admin/AdminDashboard';

const AppContent: React.FC = () => {
  const { currentView } = useStore();

  // Scroll to top on view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1E1E1E] font-sans selection:bg-[#D4AF37]/20 selection:text-[#1A1A1A]">
      {/* Global Header */}
      <Header />

      {/* Main View Area */}
      <main className="flex-1">
        {currentView === 'home' && <HomePage />}
        {currentView === 'shop' && <ProductListing />}
        {currentView === 'product_detail' && <ProductDetails />}
        {currentView === 'cart' && <CartDrawerOrView />}
        {currentView === 'wishlist' && <WishlistView />}
        {currentView === 'account' && <AccountView />}
        {currentView === 'admin' && <AdminDashboard />}
      </main>

      {/* Global Footer (Hidden in Admin for maximum workspace focus) */}
      {currentView !== 'admin' && <Footer />}

      {/* Mobile Floating Bottom Bar */}
      <MobileNav />

      {/* Global Modals & Overlays */}
      <SplashScreen />
      <OnboardingModal />
      <AuthModal />
      <SearchModal />
      <SizeGuideModal />
      <SupportModal />
      <CheckoutModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
