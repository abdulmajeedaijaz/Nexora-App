import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from './ProductCard';
import {
  Heart,
  Star,
  ShoppingBag,
  Zap,
  Share2,
  Ruler,
  Truck,
  ShieldCheck,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Check,
  Sparkles,
  MapPin,
  Play,
} from 'lucide-react';

export const ProductDetails: React.FC = () => {
  const {
    products,
    categories,
    activeProductId,
    reviews,
    setCurrentView,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setIsSizeGuideModalOpen,
    addReview,
    showToast,
  } = useStore();

  const product = products.find((p) => p.id === activeProductId) || products[0];
  const categoryName = categories.find((c) => c.id === product.categoryId)?.name || 'Footwear';
  const productReviews = reviews.filter((r) => r.productId === product.id);

  // Gallery state
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showVideoModal, setShowVideoModal] = useState(false);

  // Variant selection
  const [selectedColor, setSelectedColor] = useState<string>(
    product?.variants[0]?.colorName || 'Champagne Gold'
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    product?.variants[0]?.size || '12'
  );
  const [quantity, setQuantity] = useState(1);

  // Accordions
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    description: true,
    specifications: true,
    material_care: false,
    shipping_returns: false,
    faqs: false,
  });

  // Pin code delivery checker
  const [pinCode, setPinCode] = useState('');
  const [deliveryResult, setDeliveryResult] = useState<string | null>(null);

  // Review form
  const [reviewerName, setReviewerName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Find matching variant
  const currentVariant = useMemo(() => {
    return (
      product.variants.find(
        (v) => v.colorName === selectedColor && v.size === selectedSize
      ) || product.variants[0]
    );
  }, [product, selectedColor, selectedSize]);

  // Unique colors
  const uniqueColors = useMemo(() => {
    const map = new Map<string, string>();
    product.variants.forEach((v) => {
      if (!map.has(v.colorName)) {
        map.set(v.colorName, v.colorHex);
      }
    });
    return Array.from(map.entries()).map(([name, hex]) => ({ name, hex }));
  }, [product]);

  // Unique sizes
  const uniqueSizes = useMemo(() => {
    const set = new Set<string>();
    product.variants.forEach((v) => set.add(v.size));
    return Array.from(set);
  }, [product]);

  // Stock for current size across current color
  const currentStock = currentVariant ? currentVariant.stock : 0;
  const isFavorited = isInWishlist(product.id);

  // Related products in the same category
  const relatedProducts = useMemo(() => {
    return products
      .filter((p) => p.id !== product.id && p.categoryId === product.categoryId)
      .slice(0, 4);
  }, [products, product]);

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAddToCart = () => {
    if (currentStock <= 0) {
      showToast('Out of Stock', 'This variant is temporarily unavailable.', 'error');
      return;
    }
    addToCart(
      product,
      selectedSize,
      selectedColor,
      currentVariant.colorHex,
      quantity
    );
  };

  const handleBuyNow = () => {
    if (currentStock <= 0) return;
    addToCart(
      product,
      selectedSize,
      selectedColor,
      currentVariant.colorHex,
      quantity
    );
    setCurrentView('cart');
  };

  const handleCheckPinCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinCode || pinCode.length !== 6) {
      setDeliveryResult('Please enter a valid 6-digit Indian PIN code.');
      return;
    }
    const days = pinCode.startsWith('11') || pinCode.startsWith('40') || pinCode.startsWith('56') ? '2 Business Days (Express Available)' : '3-4 Business Days';
    setDeliveryResult(`Delivery available to ${pinCode}: Expected by ${days}. Cash on Delivery supported.`);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} on NEXORA`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      showToast('Link Copied', 'Product link copied to clipboard.');
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName || !reviewComment) {
      showToast('Incomplete review', 'Please write your name and feedback.', 'error');
      return;
    }

    addReview({
      productId: product.id,
      userId: 'user_review',
      userName: reviewerName,
      rating: reviewRating,
      title: reviewTitle || 'Exceptional Quality and Fit',
      comment: reviewComment,
      verifiedPurchase: true,
    });

    setReviewerName('');
    setReviewTitle('');
    setReviewComment('');
    setShowReviewForm(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Back to Catalog Breadcrumb */}
      <div className="flex items-center space-x-2 text-xs text-[#8C8275] mb-6">
        <button
          onClick={() => setCurrentView('shop')}
          className="flex items-center gap-1 hover:text-[#1A1A1A] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Collection</span>
        </button>
        <span>/</span>
        <span className="text-[#1A1A1A] font-medium truncate max-w-xs">{product.name}</span>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Image Gallery (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Showcase Image */}
          <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-[#F5F2EB] border border-[#EAE6DF] shadow-sm">
            <img
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
              {product.badges.map((b) => (
                <span
                  key={b}
                  className="bg-[#1A1A1A]/90 backdrop-blur-md text-[#D4AF37] text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full border border-[#D4AF37]/30 shadow-sm"
                >
                  {b}
                </span>
              ))}
            </div>

            {/* Video preview trigger if video available */}
            {product.videoUrl && (
              <button
                onClick={() => setShowVideoModal(true)}
                className="absolute bottom-4 left-4 z-10 bg-white/90 backdrop-blur-md text-[#1A1A1A] hover:text-[#B38F4D] text-xs font-semibold px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-2 border border-[#EAE6DF] transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>360° Runway Video</span>
              </button>
            )}

            {/* Wishlist Button */}
            <button
              onClick={() => toggleWishlist(product.id)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md border border-[#EAE6DF] flex items-center justify-center text-[#1A1A1A] hover:text-red-500 transition-transform active:scale-95 shadow-md"
            >
              <Heart
                className={`w-5 h-5 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-[#555]'}`}
              />
            </button>
          </div>

          {/* Thumbnails Row */}
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImageIndex(idx)}
                className={`w-20 h-24 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                  selectedImageIndex === idx
                    ? 'border-[#1A1A1A] ring-2 ring-[#1A1A1A]/20 scale-105'
                    : 'border-[#EAE6DF] opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Product Purchasing & Specifications (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Header & Title */}
          <div>
            <div className="flex items-center justify-between text-xs text-[#8C8275] mb-1">
              <span className="uppercase tracking-widest font-bold text-[#B38F4D]">
                {product.brand} • {categoryName}
              </span>
              <button
                onClick={handleShare}
                className="flex items-center gap-1 text-[#666] hover:text-[#1A1A1A]"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A] leading-snug">
              {product.name}
            </h1>

            {/* Ratings Bar */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center bg-[#FAF6EC] px-2 py-0.5 rounded border border-[#E8DCB8]">
                <Star className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                <span className="text-xs font-bold text-[#1A1A1A] ml-1">{product.rating}</span>
              </div>
              <span className="text-xs text-[#7A746E]">
                Based on {product.reviewCount} customer reviews
              </span>
            </div>
          </div>

          {/* Pricing Block */}
          <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EAE6DF]">
            <div className="flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.mrp > product.price && (
                <>
                  <span className="text-sm text-[#8C8275] line-through">
                    ₹{product.mrp.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs font-bold text-[#1E7E34] bg-[#EBF7EE] px-2 py-0.5 rounded border border-[#BDE8C6]">
                    {product.discountPercent}% OFF
                  </span>
                </>
              )}
            </div>
            <p className="text-[11px] text-[#7A746E] mt-1">Inclusive of all taxes & complimentary luxury box packing.</p>
          </div>

          {/* Color Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">
                Color: <span className="font-normal text-[#666]">{selectedColor}</span>
              </span>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {uniqueColors.map((col) => {
                const isSelected = selectedColor === col.name;
                return (
                  <button
                    key={col.name}
                    onClick={() => {
                      setSelectedColor(col.name);
                    }}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs transition-all ${
                      isSelected
                        ? 'border-[#1A1A1A] bg-white font-bold shadow-sm ring-1 ring-[#1A1A1A]'
                        : 'border-[#DCD4C7] bg-white text-[#555] hover:border-[#999]'
                    }`}
                  >
                    <span
                      style={{ backgroundColor: col.hex }}
                      className="w-3.5 h-3.5 rounded-full border border-[#D5CEC2]"
                    />
                    <span>{col.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Size Selector + Size Guide Link */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">
                Select Size: <span className="font-normal text-[#666]">Size {selectedSize}</span>
              </span>
              <button
                onClick={() => setIsSizeGuideModalOpen(true)}
                className="text-xs text-[#B38F4D] hover:underline font-semibold flex items-center gap-1"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Size Guide & Foot Calculator</span>
              </button>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {uniqueSizes.map((sz) => {
                const isSelected = selectedSize === sz;
                // Stock check for this size in current color
                const variantForSize = product.variants.find(
                  (v) => v.colorName === selectedColor && v.size === sz
                );
                const stock = variantForSize ? variantForSize.stock : 0;
                const isOutOfStock = stock <= 0;

                return (
                  <button
                    key={sz}
                    disabled={isOutOfStock}
                    onClick={() => setSelectedSize(sz)}
                    className={`py-2.5 text-xs font-semibold rounded-xl border transition-all flex flex-col items-center justify-center relative ${
                      isOutOfStock
                        ? 'bg-[#F2EFE9] text-[#AAA] border-[#DDD] cursor-not-allowed'
                        : isSelected
                        ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-md'
                        : 'bg-white text-[#1A1A1A] border-[#DCD4C7] hover:border-[#1A1A1A]'
                    }`}
                  >
                    <span>{sz}</span>
                    {stock > 0 && stock <= 3 && (
                      <span className="text-[8px] text-[#D4AF37] font-bold">
                        {stock} left
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Live Size Stock Indicator */}
            <div className="mt-2 text-xs">
              {currentStock > 5 ? (
                <span className="text-[#1E7E34] font-medium flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>In Stock • Ready for Same-Day Dispatch</span>
                </span>
              ) : currentStock > 0 ? (
                <span className="text-[#B38F4D] font-bold">
                  ⚡ Only {currentStock} pairs remaining in Size {selectedSize}!
                </span>
              ) : (
                <div className="flex items-center justify-between bg-red-50 p-2.5 rounded-xl border border-red-200">
                  <span className="text-red-700 font-semibold">
                    Size {selectedSize} is currently sold out.
                  </span>
                  <button
                    onClick={() =>
                      showToast(
                        'Restock Alert Activated',
                        `We will notify you the moment Size ${selectedSize} returns.`
                      )
                    }
                    className="text-xs bg-red-700 text-white px-2.5 py-1 rounded-lg font-medium"
                  >
                    Notify Me
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Quantity and Actions */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-[#DCD4C7] rounded-xl bg-white px-3 py-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="text-[#666] hover:text-[#1A1A1A] font-bold px-1"
                >
                  -
                </button>
                <span className="px-3 text-xs font-bold text-[#1A1A1A]">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                  className="text-[#666] hover:text-[#1A1A1A] font-bold px-1"
                >
                  +
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                disabled={currentStock <= 0}
                onClick={handleAddToCart}
                className="flex-1 py-3.5 bg-white border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#FAF8F5] transition-colors rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Shopping Bag</span>
              </button>
            </div>

            {/* Buy Now Button */}
            <button
              disabled={currentStock <= 0}
              onClick={handleBuyNow}
              className="w-full py-3.5 bg-[#1A1A1A] text-white hover:bg-[#333] transition-colors rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md"
            >
              <Zap className="w-4 h-4 text-[#D4AF37]" />
              <span>Instant Buy Now</span>
            </button>
          </div>

          {/* PIN Code Delivery Estimator */}
          <div className="p-4 rounded-xl bg-white border border-[#EAE6DF] space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#1A1A1A]">
              <MapPin className="w-4 h-4 text-[#B38F4D]" />
              <span>Estimated Delivery & COD Check</span>
            </div>
            <form onSubmit={handleCheckPinCode} className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 6-digit PIN code (e.g. 560001)"
                className="flex-1 bg-[#FAF8F5] border border-[#DCD4C7] px-3 py-2 text-xs rounded-xl focus:outline-none focus:border-[#B38F4D] text-[#1A1A1A]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#1A1A1A] text-white text-xs font-semibold rounded-xl hover:bg-[#333] transition-colors"
              >
                Check
              </button>
            </form>
            {deliveryResult && (
              <p className="text-[11px] text-[#2E7D32] font-medium leading-relaxed mt-1">
                {deliveryResult}
              </p>
            )}
          </div>

          {/* Value Assurance Badges */}
          <div className="grid grid-cols-3 gap-2 text-center text-[10px] text-[#7A746E] pt-2">
            <div className="p-2 bg-[#FAF8F5] rounded-xl border border-[#EAE6DF]">
              <Truck className="w-4 h-4 text-[#B38F4D] mx-auto mb-1" />
              <span>Free Delivery Above ₹1,499</span>
            </div>
            <div className="p-2 bg-[#FAF8F5] rounded-xl border border-[#EAE6DF]">
              <RefreshCw className="w-4 h-4 text-[#B38F4D] mx-auto mb-1" />
              <span>7-Day Easy Doorstep Exchange</span>
            </div>
            <div className="p-2 bg-[#FAF8F5] rounded-xl border border-[#EAE6DF]">
              <ShieldCheck className="w-4 h-4 text-[#B38F4D] mx-auto mb-1" />
              <span>Handcrafted 100% Authentic</span>
            </div>
          </div>

          {/* Expandable Accordions */}
          <div className="divide-y divide-[#EAE6DF] border-t border-b border-[#EAE6DF] pt-1">
            {/* Description */}
            <div className="py-3">
              <button
                onClick={() => toggleAccordion('description')}
                className="w-full text-left flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#1A1A1A]"
              >
                <span>Product Description</span>
                {openAccordions.description ? (
                  <ChevronUp className="w-4 h-4 text-[#888]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#888]" />
                )}
              </button>
              {openAccordions.description && (
                <div className="pt-3 text-xs text-[#635D56] leading-relaxed space-y-2">
                  <p>{product.description}</p>
                  <div className="pt-2">
                    <span className="font-semibold text-[#1A1A1A] block mb-1">Key Highlights:</span>
                    <ul className="list-disc pl-5 space-y-1">
                      {Object.entries(product.attributes).map(([key, val]) => (
                        <li key={key}>
                          <strong>{key}:</strong> {val}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Specifications (Dynamic Category Attributes) */}
            <div className="py-3">
              <button
                onClick={() => toggleAccordion('specifications')}
                className="w-full text-left flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#1A1A1A]"
              >
                <span>Atelier Specifications</span>
                {openAccordions.specifications ? (
                  <ChevronUp className="w-4 h-4 text-[#888]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#888]" />
                )}
              </button>
              {openAccordions.specifications && (
                <div className="pt-3">
                  <div className="bg-[#FAF8F5] rounded-xl border border-[#EAE6DF] overflow-hidden text-xs">
                    {Object.entries(product.attributes).map(([key, val], idx) => (
                      <div
                        key={key}
                        className={`flex py-2 px-3 justify-between ${
                          idx % 2 === 0 ? 'bg-white' : 'bg-[#FAF8F5]'
                        }`}
                      >
                        <span className="text-[#8C8275] font-medium">{key}</span>
                        <span className="text-[#1A1A1A] font-semibold">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Material & Care */}
            <div className="py-3">
              <button
                onClick={() => toggleAccordion('material_care')}
                className="w-full text-left flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#1A1A1A]"
              >
                <span>Material & Care Instructions</span>
                {openAccordions.material_care ? (
                  <ChevronUp className="w-4 h-4 text-[#888]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#888]" />
                )}
              </button>
              {openAccordions.material_care && (
                <div className="pt-3 text-xs text-[#635D56] leading-relaxed space-y-2">
                  <p>
                    <strong>Upper:</strong> {product.attributes['Upper Material'] || 'Premium Polyurethane'}
                  </p>
                  <p>
                    <strong>Insole:</strong> Ergonomic memory foam cushioned footbed.
                  </p>
                  <p>
                    <strong>Sole:</strong> {product.attributes['Sole Material'] || 'Anti-Skid TPR Sole'}.
                  </p>
                  <p className="text-[11px] text-[#8C8275]">
                    Wipe gently with a clean dry microfiber cloth. Avoid immersion in water or exposure to direct harsh heat.
                  </p>
                </div>
              )}
            </div>

            {/* Shipping & Returns */}
            <div className="py-3">
              <button
                onClick={() => toggleAccordion('shipping_returns')}
                className="w-full text-left flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#1A1A1A]"
              >
                <span>Shipping & 7-Day Doorstep Returns</span>
                {openAccordions.shipping_returns ? (
                  <ChevronUp className="w-4 h-4 text-[#888]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#888]" />
                )}
              </button>
              {openAccordions.shipping_returns && (
                <div className="pt-3 text-xs text-[#635D56] leading-relaxed space-y-1.5">
                  <p>• Dispatch within 24 hours from our Mumbai or Bengaluru distribution ateliers.</p>
                  <p>• Complimentary express transit on orders above ₹1,499.</p>
                  <p>• We offer a 7-day hassle-free exchange for size adjustments with doorstep pickup.</p>
                  <p>• Returned items must be unworn and in original luxury box packaging.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="mt-16 pt-12 border-t border-[#EAE6DF]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#1A1A1A]">Customer Ratings & Reviews</h2>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex text-[#D4AF37]">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating) ? 'fill-[#D4AF37]' : 'text-[#DCD4C7]'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-[#1A1A1A]">{product.rating} out of 5</span>
              <span className="text-xs text-[#7A746E]">({productReviews.length} reviews)</span>
            </div>
          </div>

          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="px-4 py-2.5 bg-[#1A1A1A] text-white text-xs font-semibold rounded-xl hover:bg-[#333] transition-colors self-start sm:self-auto"
          >
            {showReviewForm ? 'Cancel Review' : 'Write a Verified Review'}
          </button>
        </div>

        {/* Review Form */}
        {showReviewForm && (
          <form
            onSubmit={handleSubmitReview}
            className="bg-[#FAF8F5] p-6 rounded-2xl border border-[#EAE6DF] mb-8 space-y-4 max-w-xl animate-in fade-in"
          >
            <h3 className="font-serif text-base font-bold text-[#1A1A1A]">Share Your Experience</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#4A453F] mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  placeholder="e.g. Shreya M."
                  className="w-full bg-white border border-[#DCD4C7] px-3 py-2 text-xs rounded-xl focus:outline-none focus:border-[#B38F4D]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#4A453F] mb-1">Rating</label>
                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(Number(e.target.value))}
                  className="w-full bg-white border border-[#DCD4C7] px-3 py-2 text-xs rounded-xl focus:outline-none focus:border-[#B38F4D]"
                >
                  <option value={5}>5 Stars (Exceptional)</option>
                  <option value={4}>4 Stars (Very Good)</option>
                  <option value={3}>3 Stars (Average)</option>
                  <option value={2}>2 Stars (Poor)</option>
                  <option value={1}>1 Star (Unsatisfactory)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4A453F] mb-1">Review Headline</label>
              <input
                type="text"
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                placeholder="e.g. Beautiful finish and very comfortable heel height"
                className="w-full bg-white border border-[#DCD4C7] px-3 py-2 text-xs rounded-xl focus:outline-none focus:border-[#B38F4D]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4A453F] mb-1">Your Comments</label>
              <textarea
                required
                rows={3}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Describe fit, sole cushioning, child's comfort, and packaging..."
                className="w-full bg-white border border-[#DCD4C7] px-3 py-2 text-xs rounded-xl focus:outline-none focus:border-[#B38F4D]"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-[#1A1A1A] text-white text-xs font-semibold rounded-xl hover:bg-[#333] transition-colors"
            >
              Submit Review
            </button>
          </form>
        )}

        {/* Reviews List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {productReviews.map((rev) => (
            <div
              key={rev.id}
              className="p-5 rounded-2xl bg-white border border-[#EAE6DF] space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#EAE4D9] text-[#1A1A1A] flex items-center justify-center text-xs font-bold">
                    {rev.userName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1A1A1A]">{rev.userName}</h4>
                    {rev.verifiedPurchase && (
                      <span className="text-[10px] text-[#1E7E34] font-semibold flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        <span>Verified Buyer</span>
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex text-[#D4AF37]">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < rev.rating ? 'fill-[#D4AF37]' : 'text-[#DCD4C7]'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <h5 className="text-xs font-bold text-[#1A1A1A]">{rev.title}</h5>
              <p className="text-xs text-[#666] leading-relaxed">{rev.comment}</p>

              {rev.fitFeedback && (
                <div className="text-[10px] text-[#8C8275] bg-[#FAF8F5] px-2.5 py-1 rounded-md inline-block border border-[#EAE6DF]">
                  Fit feedback: <strong className="text-[#1A1A1A]">{rev.fitFeedback}</strong>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Related Products / Frequently Paired */}
      {relatedProducts.length > 0 && (
        <div className="mt-16 pt-12 border-t border-[#EAE6DF]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#B38F4D]">
                COMPLETE THE LOOK
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#1A1A1A]">Related Footwear Edits</h2>
            </div>
            <button
              onClick={() => setCurrentView('shop')}
              className="text-xs font-semibold text-[#B38F4D] hover:underline"
            >
              View Full Collection
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Video Modal Simulation */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#1A1A1A] max-w-xl w-full rounded-2xl overflow-hidden shadow-2xl border border-[#333]">
            <div className="p-4 border-b border-[#333] flex items-center justify-between text-white">
              <span className="text-xs font-bold tracking-wider uppercase text-[#D4AF37]">
                360° Runway Motion View
              </span>
              <button
                onClick={() => setShowVideoModal(false)}
                className="text-[#999] hover:text-white"
              >
                Close
              </button>
            </div>
            <div className="relative aspect-video bg-black flex items-center justify-center">
              <img
                src={product.images[0]}
                alt="video preview"
                className="w-full h-full object-cover opacity-60 animate-pulse"
              />
              <div className="absolute text-center p-4">
                <Play className="w-12 h-12 text-[#D4AF37] mx-auto mb-2" />
                <p className="text-white text-xs font-semibold">
                  360° Footwear Fit Simulation & Arch Flexibility
                </p>
                <p className="text-[#AAA] text-[11px] mt-1">High-definition runway model recording</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
