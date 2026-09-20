import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';

export const WishlistView: React.FC = () => {
  const { wishlist, products, toggleWishlist, addToCart, setCurrentView, openProductDetail, showToast } =
    useStore();

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  const handleMoveToBag = (product: any) => {
    const availableVariant = product.variants.find((v: any) => v.stock > 0) || product.variants[0];
    addToCart(
      product,
      availableVariant.size,
      availableVariant.colorName,
      availableVariant.colorHex,
      1
    );
    toggleWishlist(product.id);
  };

  if (wishlistProducts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#FAF6EC] border border-[#E8DCB8] flex items-center justify-center text-[#B38F4D] mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
            Your Wishlist is Empty
          </h2>
          <p className="text-xs sm:text-sm text-[#706A62] leading-relaxed">
            Save designs you admire to your personal wishlist so you can revisit them anytime or share with friends.
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
      <div className="mb-8 pb-4 border-b border-[#EAE6DF] flex items-baseline justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#B38F4D]">
            PERSONAL CURATION
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A] mt-0.5">
            Saved Wishlist ({wishlistProducts.length} Items)
          </h1>
        </div>
        <button
          onClick={() => {
            navigator.clipboard?.writeText(window.location.href);
            showToast('Wishlist link copied', 'Share your curated fashion wishlist with family.');
          }}
          className="text-xs text-[#B38F4D] hover:underline font-semibold"
        >
          Share Wishlist
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {wishlistProducts.map((p) => (
          <div
            key={p.id}
            className="group relative flex flex-col bg-white rounded-2xl border border-[#EAE6DF] overflow-hidden hover:shadow-lg transition-all"
          >
            <div
              onClick={() => openProductDetail(p.id)}
              className="relative aspect-[3/4] w-full overflow-hidden bg-[#F5F2EB] cursor-pointer"
            >
              <img
                src={p.images[0]}
                alt={p.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWishlist(p.id);
                }}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm border border-[#EAE6DF] flex items-center justify-center text-red-500 hover:scale-110 transition-transform shadow-sm"
              >
                <Trash2 className="w-4 h-4 text-[#888] hover:text-red-600" />
              </button>
            </div>

            <div className="p-4 flex flex-col flex-1 justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#A69E94]">{p.brand}</span>
                <h3
                  onClick={() => openProductDetail(p.id)}
                  className="font-serif text-sm font-bold text-[#1A1A1A] cursor-pointer hover:text-[#B38F4D] line-clamp-1 mt-0.5"
                >
                  {p.name}
                </h3>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-sm font-bold text-[#1A1A1A]">
                    ₹{p.price.toLocaleString('en-IN')}
                  </span>
                  {p.mrp > p.price && (
                    <span className="text-xs text-[#999] line-through">
                      ₹{p.mrp.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-[#F5F2EB]">
                <button
                  onClick={() => handleMoveToBag(p)}
                  className="w-full py-2 bg-[#1A1A1A] text-white hover:bg-[#B38F4D] transition-colors rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Move to Bag</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
