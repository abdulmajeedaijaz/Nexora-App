import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Search,
  Heart,
  ShoppingBag,
  User as UserIcon,
  Bell,
  ShieldCheck,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  HelpCircle,
  Package,
  LogOut,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentUser,
    activeRole,
    switchUserRole,
    currentView,
    setCurrentView,
    cart,
    wishlist,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setIsAuthModalOpen,
    setIsSearchModalOpen,
    setIsSupportModalOpen,
    categories,
    setSelectedCategoryFilter,
    setSelectedSubcategoryFilter,
    logout,
  } = useStore();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const unreadNotifs = notifications.filter((n) => !n.read).length;
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const activeCategories = categories.filter((c) => c.isActive);

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#EAE6DF] transition-all">
      {/* Top Privilege Bar */}
      <div className="bg-[#1E1E1E] text-[#F7F5F0] text-xs px-4 py-1.5 font-normal tracking-wide">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2 truncate">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            <span className="truncate">
              Complimentary Express Delivery on orders above ₹1,499 • Handcrafted Luxury for Girls & Women
            </span>
          </div>
          <div className="flex items-center space-x-4 shrink-0 text-xs">
            <button
              onClick={() => setIsSupportModalOpen(true)}
              className="hover:text-[#D4AF37] transition-colors hidden sm:flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Concierge Help</span>
            </button>

            {/* Quick Role Switcher Banner */}
            <div className="flex items-center bg-[#2A2A2A] rounded-full px-2.5 py-0.5 border border-[#3E3E3E]">
              <span className="text-[10px] text-[#A3A3A3] mr-1.5 uppercase font-medium">Mode:</span>
              <button
                onClick={() => {
                  if (activeRole === 'super_admin' || activeRole === 'manager') {
                    switchUserRole('customer');
                  } else {
                    switchUserRole('super_admin');
                    setCurrentView('admin');
                  }
                }}
                className={`text-[11px] px-2 py-0.5 rounded-full font-medium transition-all ${
                  activeRole === 'super_admin' || activeRole === 'manager'
                    ? 'bg-[#D4AF37] text-[#1E1E1E] font-semibold'
                    : 'text-[#EAE6DF] hover:text-[#D4AF37]'
                }`}
              >
                {activeRole === 'super_admin' || activeRole === 'manager'
                  ? '⚡ Admin Panel (Active)'
                  : 'Switch to Admin View'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile hamburger */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 -ml-2 text-[#1E1E1E] hover:text-[#B38F4D] transition-colors"
              aria-label="Toggle Navigation"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <button
              onClick={() => setIsSearchModalOpen(true)}
              className="p-2 ml-1 text-[#1E1E1E] hover:text-[#B38F4D]"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Brand Identity / Logo */}
          <div className="flex-1 lg:flex-none flex justify-center lg:justify-start">
            <button
              onClick={() => {
                setSelectedCategoryFilter(null);
                setSelectedSubcategoryFilter(null);
                setCurrentView('home');
              }}
              className="group text-left"
            >
              <div className="flex flex-col items-center lg:items-start">
                <span className="font-serif text-2xl sm:text-3xl font-bold tracking-[0.22em] text-[#1A1A1A] group-hover:text-[#B38F4D] transition-colors">
                  NEXORA
                </span>
                <span className="text-[9px] tracking-[0.35em] uppercase text-[#7A746E] -mt-1 font-medium">
                  Couture & Footwear
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8 text-sm font-medium tracking-wide">
            <button
              onClick={() => {
                setSelectedCategoryFilter(null);
                setSelectedSubcategoryFilter(null);
                setCurrentView('home');
              }}
              className={`transition-colors uppercase text-xs tracking-wider pb-1 ${
                currentView === 'home'
                  ? 'text-[#1A1A1A] font-semibold border-b-2 border-[#1A1A1A]'
                  : 'text-[#5C5752] hover:text-[#1A1A1A]'
              }`}
            >
              Home
            </button>

            {/* Shop with Category Dropdown */}
            <div className="relative group">
              <button
                onClick={() => {
                  setSelectedCategoryFilter(null);
                  setSelectedSubcategoryFilter(null);
                  setCurrentView('shop');
                }}
                className={`flex items-center gap-1 uppercase text-xs tracking-wider pb-1 transition-colors ${
                  currentView === 'shop'
                    ? 'text-[#1A1A1A] font-semibold border-b-2 border-[#1A1A1A]'
                    : 'text-[#5C5752] hover:text-[#1A1A1A]'
                }`}
              >
                <span>Shop</span>
                <ChevronDown className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-200" />
              </button>

              <div className="absolute top-full -left-4 w-64 bg-white rounded-lg shadow-xl border border-[#EAE6DF] py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="px-4 pb-2 border-b border-[#F0EBE1] text-[11px] font-semibold text-[#8C8275] uppercase tracking-wider">
                  Active Collections
                </div>
                {activeCategories.map((cat) => (
                  <div key={cat.id} className="py-1">
                    <button
                      onClick={() => {
                        setSelectedCategoryFilter(cat.slug);
                        setSelectedSubcategoryFilter(null);
                        setCurrentView('shop');
                      }}
                      className="w-full text-left px-4 py-1.5 text-xs font-medium text-[#1A1A1A] hover:bg-[#F9F7F2] hover:text-[#B38F4D] transition-colors flex items-center justify-between"
                    >
                      <span>{cat.name}</span>
                      <span className="text-[10px] text-[#A69E94]">{cat.subcategories.length} edits</span>
                    </button>
                    {cat.subcategories.slice(0, 4).map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => {
                          setSelectedCategoryFilter(cat.slug);
                          setSelectedSubcategoryFilter(sub.slug);
                          setCurrentView('shop');
                        }}
                        className="w-full text-left pl-7 pr-4 py-1 text-[11px] text-[#706A62] hover:text-[#1A1A1A] hover:bg-[#F9F7F2]"
                      >
                        • {sub.name}
                      </button>
                    ))}
                  </div>
                ))}
                <div className="pt-2 mt-2 border-t border-[#F0EBE1] px-4">
                  <button
                    onClick={() => {
                      setSelectedCategoryFilter(null);
                      setSelectedSubcategoryFilter(null);
                      setCurrentView('shop');
                    }}
                    className="text-xs text-[#B38F4D] font-semibold hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>View All Collections</span>
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => setCurrentView('wishlist')}
              className={`transition-colors uppercase text-xs tracking-wider pb-1 ${
                currentView === 'wishlist'
                  ? 'text-[#1A1A1A] font-semibold border-b-2 border-[#1A1A1A]'
                  : 'text-[#5C5752] hover:text-[#1A1A1A]'
              }`}
            >
              Wishlist
            </button>

            {/* Admin navigation link if admin mode is active */}
            {(activeRole === 'super_admin' || activeRole === 'manager') && (
              <button
                onClick={() => setCurrentView('admin')}
                className={`transition-colors uppercase text-xs tracking-wider pb-1 flex items-center gap-1.5 ${
                  currentView === 'admin'
                    ? 'text-[#B38F4D] font-semibold border-b-2 border-[#B38F4D]'
                    : 'text-[#B38F4D] hover:text-[#967336]'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Dashboard</span>
              </button>
            )}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Desktop Search trigger */}
            <button
              onClick={() => setIsSearchModalOpen(true)}
              className="hidden lg:flex items-center space-x-2 bg-[#F2EFE9] hover:bg-[#EAE4D9] text-[#7A746E] hover:text-[#1A1A1A] px-3.5 py-1.5 rounded-full text-xs transition-colors border border-[#E3DDD1]"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search girls footwear, sandals, flats...</span>
              <kbd className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-[#D5CEC2] text-[#8C8275]">
                /
              </kbd>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="p-2 text-[#1E1E1E] hover:text-[#B38F4D] transition-colors relative"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifs > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#D4AF37] text-[#1E1E1E] text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadNotifs}
                  </span>
                )}
              </button>

              {/* Notification Popover */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-[#EAE6DF] py-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 pb-2 border-b border-[#F0EBE1] flex items-center justify-between">
                    <span className="font-semibold text-xs text-[#1A1A1A] uppercase tracking-wider">
                      Notifications ({notifications.length})
                    </span>
                    {unreadNotifs > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-[11px] text-[#B38F4D] hover:underline font-medium"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-[#F5F2EB]">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-xs text-[#8C8275]">
                        No notifications right now.
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markNotificationRead(n.id);
                            if (n.link === '/account/orders') {
                              setCurrentView('account');
                              setIsNotifOpen(false);
                            }
                          }}
                          className={`p-3 text-left hover:bg-[#FAF8F5] transition-colors cursor-pointer ${
                            !n.read ? 'bg-[#FDFCFA]' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-xs font-semibold text-[#1A1A1A]">{n.title}</span>
                            {!n.read && (
                              <span className="w-2 h-2 rounded-full bg-[#D4AF37] shrink-0 mt-1" />
                            )}
                          </div>
                          <p className="text-[11px] text-[#635D56] mt-0.5 leading-relaxed">
                            {n.message}
                          </p>
                          <span className="text-[10px] text-[#A69E94] mt-1 block">
                            {new Date(n.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Wishlist Icon */}
            <button
              onClick={() => setCurrentView('wishlist')}
              className="p-2 text-[#1E1E1E] hover:text-[#B38F4D] transition-colors relative"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#1E1E1E] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Bag Icon */}
            <button
              onClick={() => setCurrentView('cart')}
              className="p-2 text-[#1E1E1E] hover:text-[#B38F4D] transition-colors relative"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4.5 h-4.5 bg-[#B38F4D] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Account / User Menu */}
            <div className="relative">
              <button
                onClick={() => {
                  if (!currentUser) {
                    setIsAuthModalOpen(true);
                  } else {
                    setIsUserMenuOpen(!isUserMenuOpen);
                  }
                }}
                className="flex items-center space-x-2 p-1.5 rounded-full hover:bg-[#F2EFE9] transition-colors text-left"
                aria-label="Account Menu"
              >
                {currentUser?.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-full object-cover border border-[#D5CEC2]"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-[#E8E3D8] text-[#1E1E1E] flex items-center justify-center text-xs font-semibold">
                    {currentUser ? currentUser.name.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4" />}
                  </div>
                )}
                <span className="hidden xl:block text-xs font-medium text-[#1A1A1A] max-w-[100px] truncate">
                  {currentUser ? currentUser.name.split(' ')[0] : 'Sign In'}
                </span>
              </button>

              {/* User Dropdown */}
              {isUserMenuOpen && currentUser && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-[#EAE6DF] py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-3 border-b border-[#F0EBE1]">
                    <p className="text-xs font-bold text-[#1A1A1A]">{currentUser.name}</p>
                    <p className="text-[11px] text-[#7A746E] truncate">{currentUser.email}</p>
                    <span className="inline-block mt-1 text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-[#FAF8F5] text-[#8C8275] border border-[#E8E3D8]">
                      {currentUser.role.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setCurrentView('account');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-[#1A1A1A] hover:bg-[#F9F7F2] flex items-center gap-2"
                    >
                      <UserIcon className="w-4 h-4 text-[#8C8275]" />
                      <span>My Profile & Addresses</span>
                    </button>
                    <button
                      onClick={() => {
                        setCurrentView('account');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-[#1A1A1A] hover:bg-[#F9F7F2] flex items-center gap-2"
                    >
                      <Package className="w-4 h-4 text-[#8C8275]" />
                      <span>My Orders & Returns</span>
                    </button>
                    {(activeRole === 'super_admin' || activeRole === 'manager') && (
                      <button
                        onClick={() => {
                          setCurrentView('admin');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-[#B38F4D] font-semibold hover:bg-[#F9F7F2] flex items-center gap-2"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Admin Control Panel</span>
                      </button>
                    )}
                  </div>

                  <div className="border-t border-[#F0EBE1] pt-1">
                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#EAE6DF] px-4 pt-2 pb-6 space-y-3">
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => {
                setSelectedCategoryFilter(null);
                setSelectedSubcategoryFilter(null);
                setCurrentView('home');
                setIsMobileMenuOpen(false);
              }}
              className="text-left py-2 font-medium text-sm text-[#1A1A1A] border-b border-[#F0EBE1]"
            >
              Home
            </button>
            <button
              onClick={() => {
                setSelectedCategoryFilter(null);
                setSelectedSubcategoryFilter(null);
                setCurrentView('shop');
                setIsMobileMenuOpen(false);
              }}
              className="text-left py-2 font-medium text-sm text-[#1A1A1A] border-b border-[#F0EBE1]"
            >
              Shop All Products
            </button>
            {activeCategories.map((cat) => (
              <div key={cat.id} className="pl-3 py-1 border-b border-[#F5F2EB]">
                <button
                  onClick={() => {
                    setSelectedCategoryFilter(cat.slug);
                    setSelectedSubcategoryFilter(null);
                    setCurrentView('shop');
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left text-xs font-semibold text-[#8C8275] block py-1"
                >
                  {cat.name}
                </button>
                <div className="grid grid-cols-2 gap-1 py-1">
                  {cat.subcategories.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => {
                        setSelectedCategoryFilter(cat.slug);
                        setSelectedSubcategoryFilter(sub.slug);
                        setCurrentView('shop');
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-left text-[11px] text-[#555] py-0.5"
                    >
                      • {sub.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <button
              onClick={() => {
                setCurrentView('wishlist');
                setIsMobileMenuOpen(false);
              }}
              className="text-left py-2 font-medium text-sm text-[#1A1A1A] border-b border-[#F0EBE1]"
            >
              Wishlist ({wishlist.length})
            </button>
            <button
              onClick={() => {
                setCurrentView('account');
                setIsMobileMenuOpen(false);
              }}
              className="text-left py-2 font-medium text-sm text-[#1A1A1A] border-b border-[#F0EBE1]"
            >
              My Account & Orders
            </button>
            <button
              onClick={() => {
                setCurrentView('admin');
                setIsMobileMenuOpen(false);
              }}
              className="text-left py-2 font-semibold text-sm text-[#B38F4D]"
            >
              Admin Dashboard
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
