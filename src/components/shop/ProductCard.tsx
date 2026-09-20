import React, { useState } from 'react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { Heart, Star, ShoppingBag } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { openProductDetail, toggleWishlist, isInWishlist, addToCart, setIsSizeGuideModalOpen } = useStore();
  const [hovered, setHovered] = useState(false);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);

  const isFavorited = isInWishlist(product.id);

  // Group unique colors from variants
  const colorMap = new Map<string, string>();
  product.variants.forEach((v) => {
    if (!colorMap.has(v.colorName)) {
      colorMap.set(v.colorName, v.colorHex);
    }
  });
  const uniqueColors = Array.from(colorMap.entries());

  // Check display image
  const displayImage =
    hovered && product.images.length > 1
      ? product.images[1]
      : product.images[selectedColorIndex] || product.images[0];

  // Primary badge
  const primaryBadge = product.badges[0];

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Default to first available variant
    const availableVariant = product.variants.find((v) => v.stock > 0) || product.variants[0];
    if (availableVariant) {
      addToCart(product, availableVariant.size, availableVariant.colorName, availableVariant.colorHex, 1);
    }
  };

  return (
    <div
      onClick={() => openProductDetail(product.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative flex flex-col bg-white rounded-xl border border-[#EAE6DF] overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-[#D5CEC2] cursor-pointer"
    >
      {/* Media Aspect Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F5F2EB]">
        <img
          src={displayImage}
          alt={product.name}
          className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />

        {/* Badge */}
        {primaryBadge && (
          <div className="absolute top-2.5 left-2.5 z-10">
            <span
              className={`text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full shadow-sm ${
                primaryBadge === 'SALE'
                  ? 'bg-red-600 text-white'
                  : primaryBadge === 'PREMIUM'
                  ? 'bg-[#D4AF37] text-[#1E1E1E]'
                  : primaryBadge === 'TRENDING'
                  ? 'bg-[#1E1E1E] text-white'
                  : 'bg-white/90 backdrop-blur-md text-[#1E1E1E] border border-[#DDD]'
              }`}
            >
              {primaryBadge}
            </span>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          aria-label="Wishlist item"
          className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm border border-[#EAE6DF] flex items-center justify-center text-[#1E1E1E] hover:text-[#B38F4D] transition-transform active:scale-90 shadow-sm"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorited ? 'fill-red-500 text-red-500' : 'text-[#555]'
            }`}
          />
        </button>

        {/* Quick Add Overlay on desktop hover */}
        <div className="absolute inset-x-2 bottom-2 hidden lg:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <button
            onClick={handleQuickAdd}
            className="w-full py-2 bg-[#1A1A1A]/95 backdrop-blur-md text-white hover:bg-[#B38F4D] transition-colors rounded-lg text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-1.5 shadow-md"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Quick Bag (Size {product.variants[0]?.size || '12'})</span>
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between bg-white">
        <div>
          {/* Brand & Rating */}
          <div className="flex items-center justify-between text-[11px] text-[#8C8275] mb-1">
            <span className="uppercase tracking-wider font-semibold text-[10px] text-[#A69E94] truncate">
              {product.brand}
            </span>
            <div className="flex items-center gap-1 shrink-0">
              <Star className="w-3 h-3 fill-[#D4AF37] text-[#D4AF37]" />
              <span className="font-bold text-[#1A1A1A]">{product.rating}</span>
              <span className="text-[#A69E94]">({product.reviewCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-serif text-sm sm:text-base font-semibold text-[#1A1A1A] line-clamp-1 group-hover:text-[#B38F4D] transition-colors">
            {product.name}
          </h3>

          {/* Dynamic Category Attribute highlight (Sole / Material) */}
          <p className="text-[11px] text-[#7A746E] mt-0.5 line-clamp-1">
            {product.attributes['Sole Material'] ? `${product.attributes['Sole Material']} • ` : ''}
            {product.attributes['Fit Type'] || 'Comfort Fit'}
          </p>
        </div>

        <div className="pt-3 mt-2 border-t border-[#F5F2EB] flex items-center justify-between">
          {/* Price breakdown */}
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-sm sm:text-base font-bold text-[#1A1A1A]">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.mrp > product.price && (
              <>
                <span className="text-xs text-[#9E988F] line-through">
                  ₹{product.mrp.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] font-bold text-[#1E7E34]">
                  {product.discountPercent}% OFF
                </span>
              </>
            )}
          </div>

          {/* Color Swatch Dots */}
          {uniqueColors.length > 1 && (
            <div className="flex items-center space-x-1 shrink-0">
              {uniqueColors.slice(0, 3).map(([cName, cHex], idx) => (
                <span
                  key={cName}
                  style={{ backgroundColor: cHex }}
                  title={cName}
                  className="w-2.5 h-2.5 rounded-full border border-[#D5CEC2]"
                />
              ))}
              {uniqueColors.length > 3 && (
                <span className="text-[9px] text-[#8C8275] font-semibold">
                  +{uniqueColors.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
