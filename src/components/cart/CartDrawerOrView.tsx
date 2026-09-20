import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  ShoppingBag,
  Trash2,
  Heart,
  Tag,
  ArrowRight,
  ShieldCheck,
  Check,
  Sparkles,
} from 'lucide-react';

export const CartDrawerOrView: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    updateCartVariant,
    toggleWishlist,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    coupons,
    cartTotals,
    setCurrentView,
    setIsCheckoutOpen,
    openProductDetail,
    setIsAuthModalOpen,
    currentUser,
    products,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [editingItemKey, setEditingItemKey] = useState<string | null>(null);
  const [editSize, setEditSize] = useState('');
  const [editColor, setEditColor] = useState('');

  const freeShippingThreshold = 1499;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - cartTotals.subtotal);
  const shippingProgress = Math.min(100, (cartTotals.subtotal / freeShippingThreshold) * 100);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput) return;
    const res = applyCoupon(couponInput);
    if (res.success) {
      setCouponInput('');
    }
  };

  const handleStartEdit = (cartItemId: string, currentSz: string, currentCol: string) => {
    setEditingItemKey(cartItemId);
    setEditSize(currentSz);
    setEditColor(currentCol);
  };

  const handleSaveEdit = (cartItemId: string) => {
    updateCartVariant(cartItemId, editSize, editColor);
    setEditingItemKey(null);
  };

  const handleProceedToCheckout = () => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    setIsCheckoutOpen(true);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#FAF6EC] border border-[#E8DCB8] flex items-center justify-center text-[#B38F4D] mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
            Your Shopping Bag is Empty
          </h2>
          <p className="text-xs sm:text-sm text-[#706A62] leading-relaxed">
            Discover our handcrafted girls' block heels, jewel ballerinas, and festive party edits to begin
            filling your luxury bag.
          </p>
          <div className="pt-4">
            <button
              onClick={() => setCurrentView('shop')}
              className="px-8 py-3.5 bg-[#1A1A1A] text-white hover:bg-[#333] transition-colors rounded-xl text-xs font-bold uppercase tracking-wider shadow-md"
            >
              Explore Collection
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Title */}
      <div className="mb-6 pb-4 border-b border-[#EAE6DF] flex items-baseline justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#B38F4D]">
            YOUR CURATED SELECTION
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A] mt-0.5">
            Shopping Bag ({cart.reduce((sum, item) => sum + item.quantity, 0)} Items)
          </h1>
        </div>
        <button
          onClick={() => setCurrentView('shop')}
          className="text-xs text-[#8C8275] hover:text-[#1A1A1A] font-semibold underline"
        >
          Continue Shopping
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Cart Items (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Free Shipping Progress Indicator */}
          <div className="p-4 bg-[#FAF8F5] border border-[#EAE6DF] rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-xs">
              {amountToFreeShipping > 0 ? (
                <span className="text-[#666]">
                  Add <strong className="text-[#1A1A1A]">₹{amountToFreeShipping.toLocaleString('en-IN')}</strong>{' '}
                  more to unlock <strong className="text-[#B38F4D]">Free Express Delivery</strong>!
                </span>
              ) : (
                <span className="text-[#1E7E34] font-bold flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  <span>Complimentary Express Delivery Unlocked!</span>
                </span>
              )}
              <span className="text-[11px] text-[#888]">{Math.round(shippingProgress)}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#EAE4D8] rounded-full overflow-hidden">
              <div
                style={{ width: `${shippingProgress}%` }}
                className="h-full bg-[#B38F4D] rounded-full transition-all duration-500"
              />
            </div>
          </div>

          {/* Cart Item Cards */}
          <div className="space-y-3">
            {cart.map((item) => {
              const isEditing = editingItemKey === item.cartItemId;
              const product = products.find((p) => p.id === item.productId);
              const productSizes = product
                ? Array.from(new Set(product.variants.map((v) => v.size)))
                : [item.size];
              const productColors = product
                ? Array.from(new Set(product.variants.map((v) => v.colorName)))
                : [item.colorName];

              return (
                <div
                  key={item.cartItemId}
                  className="p-4 sm:p-5 rounded-2xl bg-white border border-[#EAE6DF] shadow-sm flex flex-col sm:flex-row gap-4 sm:gap-6 items-start"
                >
                  {/* Thumbnail */}
                  <img
                    src={item.image}
                    alt={item.name}
                    onClick={() => openProductDetail(item.productId)}
                    className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl object-cover bg-[#F5F2EB] shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
                  />

                  {/* Details */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#B38F4D]">
                          {item.brand}
                        </span>
                        <h3
                          onClick={() => openProductDetail(item.productId)}
                          className="font-serif text-sm sm:text-base font-bold text-[#1A1A1A] cursor-pointer hover:text-[#B38F4D] transition-colors line-clamp-1"
                        >
                          {item.name}
                        </h3>
                      </div>

                      {/* Pricing */}
                      <div className="text-right shrink-0">
                        <span className="text-sm sm:text-base font-bold text-[#1A1A1A]">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                        {item.mrp > item.price && (
                          <span className="block text-[11px] text-[#999] line-through">
                            ₹{(item.mrp * item.quantity).toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Variant specs or Editor */}
                    {!isEditing ? (
                      <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-[#666]">
                        <span className="bg-[#FAF8F5] px-2.5 py-1 rounded-md border border-[#EAE6DF]">
                          Size: <strong className="text-[#1A1A1A]">{item.size}</strong>
                        </span>
                        <span className="bg-[#FAF8F5] px-2.5 py-1 rounded-md border border-[#EAE6DF] flex items-center gap-1.5">
                          <span
                            style={{ backgroundColor: item.colorHex }}
                            className="w-2.5 h-2.5 rounded-full border border-[#DDD]"
                          />
                          <span>{item.colorName}</span>
                        </span>
                        <button
                          onClick={() =>
                            handleStartEdit(item.cartItemId, item.size, item.colorName)
                          }
                          className="text-[11px] text-[#B38F4D] hover:underline font-medium ml-1"
                        >
                          Change
                        </button>
                      </div>
                    ) : (
                      /* In-Cart Variant Changer */
                      <div className="pt-2 p-3 bg-[#FAF8F5] rounded-xl border border-[#DCD4C7] space-y-2">
                        <div className="flex items-center gap-3">
                          <div>
                            <span className="text-[10px] text-[#888] uppercase block">Size</span>
                            <select
                              value={editSize}
                              onChange={(e) => setEditSize(e.target.value)}
                              className="bg-white border border-[#DCD4C7] text-xs px-2 py-1 rounded-md font-semibold"
                            >
                              {productSizes.map((sz) => (
                                <option key={sz} value={sz}>
                                  Size {sz}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <span className="text-[10px] text-[#888] uppercase block">Color</span>
                            <select
                              value={editColor}
                              onChange={(e) => setEditColor(e.target.value)}
                              className="bg-white border border-[#DCD4C7] text-xs px-2 py-1 rounded-md font-semibold"
                            >
                              {productColors.map((col) => (
                                <option key={col} value={col}>
                                  {col}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="pt-3 flex gap-2">
                            <button
                              onClick={() => handleSaveEdit(item.cartItemId)}
                              className="px-2.5 py-1 bg-[#1A1A1A] text-white text-[11px] font-semibold rounded-md"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingItemKey(null)}
                              className="px-2.5 py-1 text-[#666] text-[11px] hover:underline"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Quantity and Actions Bar */}
                    <div className="flex items-center justify-between pt-3 mt-2 border-t border-[#F5F2EB]">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-[#DCD4C7] rounded-lg bg-white">
                        <button
                          onClick={() => updateCartQuantity(item.cartItemId, item.quantity - 1)}
                          className="px-2 py-0.5 text-xs text-[#666] hover:text-[#1A1A1A]"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-bold text-[#1A1A1A]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.cartItemId, item.quantity + 1)}
                          className="px-2 py-0.5 text-xs text-[#666] hover:text-[#1A1A1A]"
                        >
                          +
                        </button>
                      </div>

                      {/* Move to Wishlist / Remove */}
                      <div className="flex items-center space-x-3 text-xs">
                        <button
                          onClick={() => {
                            toggleWishlist(item.productId);
                            removeFromCart(item.cartItemId);
                          }}
                          className="text-[#6B655D] hover:text-[#B38F4D] flex items-center gap-1 font-medium transition-colors"
                        >
                          <Heart className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Save to Wishlist</span>
                        </button>
                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="text-[#999] hover:text-red-600 flex items-center gap-1 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Order Summary & Coupons (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Coupon Code Card */}
          <div className="bg-white p-5 rounded-2xl border border-[#EAE6DF] space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">
              <Tag className="w-4 h-4 text-[#B38F4D]" />
              <span>Privileged Atelier Coupons</span>
            </div>

            {appliedCoupon ? (
              <div className="bg-[#FAF6EC] border border-[#E8DCB8] p-3 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#1A1A1A] block">{appliedCoupon.code}</span>
                  <span className="text-[10px] text-[#1E7E34] font-semibold">
                    Saved ₹{cartTotals.discount.toLocaleString('en-IN')}!
                  </span>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-xs text-red-600 hover:underline font-medium"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  placeholder="Enter coupon code"
                  className="flex-1 bg-[#FAF8F5] border border-[#DCD4C7] px-3 py-2 text-xs rounded-xl uppercase font-mono tracking-wider focus:outline-none focus:border-[#B38F4D]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1A1A1A] text-white text-xs font-semibold rounded-xl hover:bg-[#333] transition-colors"
                >
                  Apply
                </button>
              </form>
            )}

            {/* Available 1-click coupons */}
            <div className="pt-2 border-t border-[#F5F2EB] space-y-1.5">
              <span className="text-[10px] text-[#8C8275] uppercase tracking-wider font-semibold block">
                Available Offers:
              </span>
              {coupons
                .filter((c) => c.isActive)
                .map((cp) => (
                  <div
                    key={cp.code}
                    onClick={() => applyCoupon(cp.code)}
                    className="p-2 rounded-xl bg-[#FAF8F5] hover:bg-[#F2EDE2] border border-[#EAE6DF] cursor-pointer transition-colors flex items-center justify-between"
                  >
                    <div>
                      <span className="text-xs font-mono font-bold text-[#1A1A1A]">{cp.code}</span>
                      <p className="text-[10px] text-[#706A62]">{cp.description}</p>
                    </div>
                    <span className="text-[11px] font-semibold text-[#B38F4D]">Tap to Apply</span>
                  </div>
                ))}
            </div>
          </div>

          {/* Price Breakdown Card */}
          <div className="bg-white p-5 rounded-2xl border border-[#EAE6DF] space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">
              Order Summary
            </h3>

            <div className="space-y-2 text-xs divide-y divide-[#F5F2EB]">
              <div className="flex justify-between pt-2">
                <span className="text-[#6B655D]">Bag Total</span>
                <span className="font-semibold text-[#1A1A1A]">
                  ₹{cartTotals.subtotal.toLocaleString('en-IN')}
                </span>
              </div>

              {cartTotals.discount > 0 && (
                <div className="flex justify-between pt-2 text-[#1E7E34]">
                  <span>Coupon Discount ({appliedCoupon?.code})</span>
                  <span className="font-bold">
                    -₹{cartTotals.discount.toLocaleString('en-IN')}
                  </span>
                </div>
              )}

              <div className="flex justify-between pt-2">
                <span className="text-[#6B655D]">Estimated Delivery</span>
                {cartTotals.deliveryFee === 0 ? (
                  <span className="font-bold text-[#1E7E34]">FREE</span>
                ) : (
                  <span className="font-semibold text-[#1A1A1A]">₹{cartTotals.deliveryFee}</span>
                )}
              </div>

              <div className="flex justify-between pt-2 text-[#7A746E]">
                <span>Estimated GST (Included)</span>
                <span>₹{cartTotals.tax.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between pt-3 text-base font-bold text-[#1A1A1A]">
                <span>Total Payable</span>
                <span>₹{cartTotals.total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <div className="pt-3">
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-4 bg-[#1A1A1A] text-white hover:bg-[#333] transition-colors rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Security Assurance */}
            <div className="pt-2 flex items-center justify-center gap-1.5 text-[10px] text-[#7A746E]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#B38F4D]" />
              <span>Safe & Secure 256-bit Encrypted Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
