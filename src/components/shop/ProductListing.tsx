import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from './ProductCard';
import { FilterDrawer } from './FilterDrawer';
import { SlidersHorizontal, ChevronDown, Sparkles, X, ArrowLeft } from 'lucide-react';

export const ProductListing: React.FC = () => {
  const {
    products,
    categories,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    selectedSubcategoryFilter,
    setSelectedSubcategoryFilter,
    setCurrentView,
    setIsSizeGuideModalOpen,
  } = useStore();

  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [sortBy, setSortBy] = useState<string>('recommended');
  const [priceRange, setPriceRange] = useState<[number, number]>([499, 3999]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number>(0);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [selectedSole, setSelectedSole] = useState<string | null>(null);

  // Derive unique sizes and colors across all products
  const availableSizes = useMemo(() => {
    const sizeSet = new Set<string>();
    products.forEach((p) => {
      p.variants.forEach((v) => sizeSet.add(v.size));
    });
    // Order standard sizes naturally
    return Array.from(sizeSet).sort((a, b) => {
      const numA = parseInt(a);
      const numB = parseInt(b);
      if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
      return a.localeCompare(b);
    });
  }, [products]);

  const availableColors = useMemo(() => {
    const colorMap = new Map<string, string>();
    products.forEach((p) => {
      p.variants.forEach((v) => {
        if (!colorMap.has(v.colorName)) {
          colorMap.set(v.colorName, v.colorHex);
        }
      });
    });
    return Array.from(colorMap.entries()).map(([name, hex]) => ({ name, hex }));
  }, [products]);

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const resetAllFilters = () => {
    setPriceRange([499, 3999]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setMinRating(0);
    setInStockOnly(false);
    setSelectedSole(null);
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategoryFilter) {
        const cat = categories.find((c) => c.slug === selectedCategoryFilter);
        if (cat && p.categoryId !== cat.id) return false;
      }

      // Subcategory filter
      if (selectedSubcategoryFilter) {
        const allSubs = categories.flatMap((c) => c.subcategories);
        const sub = allSubs.find(
          (s) => s.slug === selectedSubcategoryFilter || s.id === selectedSubcategoryFilter
        );
        if (sub && p.subcategoryId !== sub.id) return false;
      }

      // Price range
      if (p.price < priceRange[0] || p.price > priceRange[1]) return false;

      // Rating
      if (minRating > 0 && p.rating < minRating) return false;

      // Sizes
      if (selectedSizes.length > 0) {
        const hasMatchingSize = p.variants.some(
          (v) => selectedSizes.includes(v.size) && (inStockOnly ? v.stock > 0 : true)
        );
        if (!hasMatchingSize) return false;
      }

      // Colors
      if (selectedColors.length > 0) {
        const hasMatchingColor = p.variants.some((v) => selectedColors.includes(v.colorName));
        if (!hasMatchingColor) return false;
      }

      // In stock
      if (inStockOnly) {
        const totalStock = p.variants.reduce((sum, v) => sum + v.stock, 0);
        if (totalStock <= 0) return false;
      }

      // Sole / Dynamic attribute
      if (selectedSole) {
        if (p.attributes['Sole Material'] !== selectedSole) return false;
      }

      return true;
    });
  }, [
    products,
    categories,
    selectedCategoryFilter,
    selectedSubcategoryFilter,
    priceRange,
    minRating,
    selectedSizes,
    selectedColors,
    inStockOnly,
    selectedSole,
  ]);

  // Sort logic
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (sortBy === 'price_low') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_high') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'newest') {
      list.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else {
      // Default: recommended / popularity
      list.sort((a, b) => b.reviewCount - a.reviewCount);
    }
    return list;
  }, [filteredProducts, sortBy]);

  const activeCategory = categories.find((c) => c.slug === selectedCategoryFilter);
  const activeSubcategory = activeCategory?.subcategories.find(
    (s) => s.slug === selectedSubcategoryFilter
  );

  const activeFilterCount =
    (priceRange[0] !== 499 || priceRange[1] !== 3999 ? 1 : 0) +
    selectedSizes.length +
    selectedColors.length +
    (minRating > 0 ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (selectedSole ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Category Banner & Breadcrumbs */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 text-xs text-[#8C8275] mb-2">
          <button onClick={() => setCurrentView('home')} className="hover:text-[#1A1A1A]">
            Home
          </button>
          <span>/</span>
          <button
            onClick={() => {
              setSelectedCategoryFilter(null);
              setSelectedSubcategoryFilter(null);
            }}
            className={!selectedCategoryFilter ? 'font-semibold text-[#1A1A1A]' : 'hover:text-[#1A1A1A]'}
          >
            Shop
          </button>
          {activeCategory && (
            <>
              <span>/</span>
              <button
                onClick={() => setSelectedSubcategoryFilter(null)}
                className={!selectedSubcategoryFilter ? 'font-semibold text-[#1A1A1A]' : 'hover:text-[#1A1A1A]'}
              >
                {activeCategory.name}
              </button>
            </>
          )}
          {activeSubcategory && (
            <>
              <span>/</span>
              <span className="font-semibold text-[#1A1A1A]">{activeSubcategory.name}</span>
            </>
          )}
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-gradient-to-r from-[#F4EFE6] to-[#FAF8F5] p-6 sm:p-8 rounded-2xl border border-[#EAE4D8]">
          <div className="max-w-2xl">
            <span className="text-[10px] uppercase tracking-widest font-bold text-[#B38F4D]">
              NEXORA COUTURE ATELIER
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1A1A1A] mt-1">
              {activeSubcategory
                ? activeSubcategory.name
                : activeCategory
                ? activeCategory.name
                : 'All Girls Footwear & Couture'}
            </h1>
            <p className="text-xs sm:text-sm text-[#706A62] mt-2 leading-relaxed">
              {activeCategory?.seoDescription ||
                'Artisanally crafted girls’ celebration block heels, metallic flats, glitter ballerinas, and couture apparel made with orthopedic arch support and slip-resistant soles.'}
            </p>
          </div>

          <button
            onClick={() => setIsSizeGuideModalOpen(true)}
            className="self-start md:self-auto px-4 py-2.5 bg-white border border-[#DCD4C7] rounded-xl text-xs font-semibold text-[#1A1A1A] hover:border-[#B38F4D] transition-colors flex items-center gap-2 shadow-sm shrink-0"
          >
            <Sparkles className="w-4 h-4 text-[#B38F4D]" />
            <span>Interactive Size Guide & Foot Measurement</span>
          </button>
        </div>
      </div>

      {/* Control Bar: Subcategory Chips, Filter Toggle, Sort Dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EAE6DF]">
        {/* Quick subcategory pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          <button
            onClick={() => setSelectedSubcategoryFilter(null)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide shrink-0 transition-all ${
              selectedSubcategoryFilter === null
                ? 'bg-[#1A1A1A] text-white shadow-sm'
                : 'bg-white text-[#555] border border-[#DCD4C7] hover:border-[#999]'
            }`}
          >
            All Footwear
          </button>
          {activeCategory?.subcategories.map((sub) => (
            <button
              key={sub.id}
              onClick={() => setSelectedSubcategoryFilter(sub.slug)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide shrink-0 transition-all ${
                selectedSubcategoryFilter === sub.slug
                  ? 'bg-[#1A1A1A] text-white shadow-sm'
                  : 'bg-white text-[#555] border border-[#DCD4C7] hover:border-[#999]'
              }`}
            >
              {sub.name}
            </button>
          ))}
        </div>

        {/* Right Sort & Mobile Filter Buttons */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          {/* Mobile Filter Trigger */}
          <button
            onClick={() => setIsFilterDrawerOpen(true)}
            className="lg:hidden flex items-center gap-1.5 px-3.5 py-2 bg-white border border-[#DCD4C7] rounded-xl text-xs font-semibold text-[#1A1A1A] shadow-sm"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#B38F4D] text-white text-[10px] flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 bg-white border border-[#DCD4C7] px-3 py-1.5 rounded-xl shadow-sm">
            <span className="text-xs text-[#8C8275] hidden sm:inline">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-xs font-semibold text-[#1A1A1A] focus:outline-none cursor-pointer"
            >
              <option value="recommended">Featured / Recommended</option>
              <option value="newest">New Arrivals</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-4">
          <span className="text-xs text-[#8C8275] font-medium">Active filters:</span>
          {priceRange[1] < 3999 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F2EDE2] text-[#1A1A1A] text-xs rounded-full border border-[#DCD4C7]">
              Under ₹{priceRange[1]}
              <button onClick={() => setPriceRange([499, 3999])}>
                <X className="w-3 h-3 text-[#777]" />
              </button>
            </span>
          )}
          {selectedSizes.map((sz) => (
            <span
              key={sz}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F2EDE2] text-[#1A1A1A] text-xs rounded-full border border-[#DCD4C7]"
            >
              Size: {sz}
              <button onClick={() => toggleSize(sz)}>
                <X className="w-3 h-3 text-[#777]" />
              </button>
            </span>
          ))}
          {selectedColors.map((c) => (
            <span
              key={c}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F2EDE2] text-[#1A1A1A] text-xs rounded-full border border-[#DCD4C7]"
            >
              {c}
              <button onClick={() => toggleColor(c)}>
                <X className="w-3 h-3 text-[#777]" />
              </button>
            </span>
          ))}
          {selectedSole && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F2EDE2] text-[#1A1A1A] text-xs rounded-full border border-[#DCD4C7]">
              {selectedSole}
              <button onClick={() => setSelectedSole(null)}>
                <X className="w-3 h-3 text-[#777]" />
              </button>
            </span>
          )}
          {inStockOnly && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F2EDE2] text-[#1A1A1A] text-xs rounded-full border border-[#DCD4C7]">
              In Stock Only
              <button onClick={() => setInStockOnly(false)}>
                <X className="w-3 h-3 text-[#777]" />
              </button>
            </span>
          )}
          <button
            onClick={resetAllFilters}
            className="text-xs text-[#B38F4D] hover:underline font-semibold ml-2"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Main Content Layout with Desktop Sidebar */}
      <div className="flex gap-8 pt-6 items-start">
        {/* Filter Drawer / Sidebar */}
        <FilterDrawer
          isOpen={isFilterDrawerOpen}
          onClose={() => setIsFilterDrawerOpen(false)}
          availableSizes={availableSizes}
          availableColors={availableColors}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          selectedSizes={selectedSizes}
          toggleSize={toggleSize}
          selectedColors={selectedColors}
          toggleColor={toggleColor}
          minRating={minRating}
          setMinRating={setMinRating}
          inStockOnly={inStockOnly}
          setInStockOnly={setInStockOnly}
          selectedSole={selectedSole}
          setSelectedSole={setSelectedSole}
          resetAllFilters={resetAllFilters}
          activeFilterCount={activeFilterCount}
        />

        {/* Product Grid */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between pb-3 text-xs text-[#7A746E]">
            <span>
              Showing <strong className="text-[#1A1A1A]">{sortedProducts.length}</strong> styles
            </span>
          </div>

          {sortedProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#EAE6DF] p-12 text-center space-y-3 my-4">
              <p className="font-serif text-xl font-bold text-[#1A1A1A]">No Matching Styles Found</p>
              <p className="text-xs text-[#706A62] max-w-sm mx-auto">
                No designs match your currently selected filters. Try clearing some criteria like size, color, or price range.
              </p>
              <div className="pt-2">
                <button
                  onClick={resetAllFilters}
                  className="px-5 py-2.5 bg-[#1A1A1A] text-white text-xs font-semibold rounded-xl hover:bg-[#333] transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
