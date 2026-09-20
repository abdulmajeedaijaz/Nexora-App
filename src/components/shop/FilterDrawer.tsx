import React from 'react';
import { useStore } from '../../context/StoreContext';
import { X, SlidersHorizontal, RotateCcw, Check } from 'lucide-react';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  availableSizes: string[];
  availableColors: { name: string; hex: string }[];
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  selectedSizes: string[];
  toggleSize: (size: string) => void;
  selectedColors: string[];
  toggleColor: (color: string) => void;
  minRating: number;
  setMinRating: (r: number) => void;
  inStockOnly: boolean;
  setInStockOnly: (v: boolean) => void;
  selectedSole: string | null;
  setSelectedSole: (sole: string | null) => void;
  resetAllFilters: () => void;
  activeFilterCount: number;
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
  availableSizes,
  availableColors,
  priceRange,
  setPriceRange,
  selectedSizes,
  toggleSize,
  selectedColors,
  toggleColor,
  minRating,
  setMinRating,
  inStockOnly,
  setInStockOnly,
  selectedSole,
  setSelectedSole,
  resetAllFilters,
  activeFilterCount,
}) => {
  const { categories, selectedCategoryFilter, setSelectedCategoryFilter, selectedSubcategoryFilter, setSelectedSubcategoryFilter } =
    useStore();

  const activeCategory = categories.find((c) => c.slug === selectedCategoryFilter);

  const soleOptions = ['TPR Sole', 'Anti-Skid Resin Rubber', 'Sheet Sole', 'Non-Slip Lightweight EVA'];

  const content = (
    <div className="flex flex-col h-full bg-[#FAF8F5]">
      {/* Drawer Header */}
      <div className="p-4 sm:p-5 border-b border-[#EAE6DF] flex items-center justify-between bg-white">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#1A1A1A]" />
          <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">Filters & Refine</h3>
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-[#B38F4D] text-white text-[10px] font-bold flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeFilterCount > 0 && (
            <button
              onClick={resetAllFilters}
              className="text-xs text-[#8C8275] hover:text-[#1A1A1A] flex items-center gap-1 font-medium transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#7A746E] hover:text-[#1A1A1A] hover:bg-[#F2EDE2] lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Filter Sections Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Categories & Subcategories */}
        <div>
          <h4 className="text-xs uppercase tracking-wider font-bold text-[#1A1A1A] mb-2.5">
            Category & Edits
          </h4>
          <div className="space-y-1">
            <button
              onClick={() => {
                setSelectedCategoryFilter(null);
                setSelectedSubcategoryFilter(null);
              }}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedCategoryFilter === null
                  ? 'bg-[#1A1A1A] text-white font-semibold'
                  : 'text-[#5C5752] hover:bg-[#F0EBE1]'
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <div key={cat.id} className="pt-1">
                <button
                  onClick={() => {
                    setSelectedCategoryFilter(cat.slug);
                    setSelectedSubcategoryFilter(null);
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                    selectedCategoryFilter === cat.slug && !selectedSubcategoryFilter
                      ? 'bg-[#1A1A1A] text-white font-semibold'
                      : 'text-[#4A453F] hover:bg-[#F0EBE1]'
                  }`}
                >
                  <span>{cat.name}</span>
                </button>

                {/* Subcategories */}
                {selectedCategoryFilter === cat.slug && (
                  <div className="pl-3 pr-1 py-1 space-y-0.5">
                    {cat.subcategories.map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => setSelectedSubcategoryFilter(sub.slug)}
                        className={`w-full text-left px-2.5 py-1 text-[11px] rounded-md transition-colors flex items-center justify-between ${
                          selectedSubcategoryFilter === sub.slug
                            ? 'bg-[#EAE4D8] text-[#1A1A1A] font-bold'
                            : 'text-[#6B655D] hover:text-[#1A1A1A] hover:bg-[#F5F2EB]'
                        }`}
                      >
                        <span>• {sub.name}</span>
                        {selectedSubcategoryFilter === sub.slug && (
                          <Check className="w-3 h-3 text-[#B38F4D]" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Price Range Slider */}
        <div className="pt-4 border-t border-[#EAE6DF]">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs uppercase tracking-wider font-bold text-[#1A1A1A]">Price Range</h4>
            <span className="text-xs font-semibold text-[#B38F4D]">
              ₹{priceRange[0]} - ₹{priceRange[1]}
            </span>
          </div>
          <input
            type="range"
            min={499}
            max={3999}
            step={100}
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
            className="w-full accent-[#1A1A1A] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-[#8C8275] mt-1">
            <span>₹499</span>
            <span>Up to ₹3,999</span>
          </div>
        </div>

        {/* Sizes (Footwear Sizes: 11, 12, 13, 1, 2, 3 or Apparel Sizes) */}
        <div className="pt-4 border-t border-[#EAE6DF]">
          <h4 className="text-xs uppercase tracking-wider font-bold text-[#1A1A1A] mb-2.5">
            Size Selection
          </h4>
          <div className="grid grid-cols-4 gap-2">
            {availableSizes.map((sz) => {
              const isSelected = selectedSizes.includes(sz);
              return (
                <button
                  key={sz}
                  onClick={() => toggleSize(sz)}
                  className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                    isSelected
                      ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-sm'
                      : 'bg-white text-[#4A453F] border-[#DCD4C7] hover:border-[#1A1A1A]'
                  }`}
                >
                  {sz}
                </button>
              );
            })}
          </div>
        </div>

        {/* Color Swatches */}
        <div className="pt-4 border-t border-[#EAE6DF]">
          <h4 className="text-xs uppercase tracking-wider font-bold text-[#1A1A1A] mb-2.5">
            Color Palette
          </h4>
          <div className="flex flex-wrap gap-2">
            {availableColors.map((col) => {
              const isSelected = selectedColors.includes(col.name);
              return (
                <button
                  key={col.name}
                  onClick={() => toggleColor(col.name)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border transition-all ${
                    isSelected
                      ? 'bg-white text-[#1A1A1A] font-bold border-[#1A1A1A] shadow-sm ring-1 ring-[#1A1A1A]'
                      : 'bg-white text-[#555] border-[#DCD4C7] hover:border-[#999]'
                  }`}
                >
                  <span
                    style={{ backgroundColor: col.hex }}
                    className="w-3 h-3 rounded-full border border-[#D5CEC2]"
                  />
                  <span>{col.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sole Material (Dynamic category attribute) */}
        <div className="pt-4 border-t border-[#EAE6DF]">
          <h4 className="text-xs uppercase tracking-wider font-bold text-[#1A1A1A] mb-2">
            Sole & Ergonomics
          </h4>
          <div className="space-y-1">
            {soleOptions.map((sole) => (
              <button
                key={sole}
                onClick={() => setSelectedSole(selectedSole === sole ? null : sole)}
                className={`w-full text-left px-3 py-1.5 text-xs rounded-lg transition-colors flex items-center justify-between ${
                  selectedSole === sole
                    ? 'bg-[#EAE4D8] text-[#1A1A1A] font-bold'
                    : 'text-[#5C5752] hover:bg-[#F2EDE2]'
                }`}
              >
                <span>{sole}</span>
                {selectedSole === sole && <Check className="w-3.5 h-3.5 text-[#B38F4D]" />}
              </button>
            ))}
          </div>
        </div>

        {/* Minimum Rating */}
        <div className="pt-4 border-t border-[#EAE6DF]">
          <h4 className="text-xs uppercase tracking-wider font-bold text-[#1A1A1A] mb-2">
            Customer Rating
          </h4>
          <div className="flex gap-2">
            {[0, 4.0, 4.5].map((r) => (
              <button
                key={r}
                onClick={() => setMinRating(r)}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                  minRating === r
                    ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                    : 'bg-white text-[#555] border-[#DCD4C7] hover:border-[#999]'
                }`}
              >
                {r === 0 ? 'All' : `${r}★ & up`}
              </button>
            ))}
          </div>
        </div>

        {/* Stock Toggle */}
        <div className="pt-4 border-t border-[#EAE6DF]">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-xs font-semibold text-[#1A1A1A]">In Stock Only</span>
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="w-4 h-4 accent-[#1A1A1A] rounded"
            />
          </label>
        </div>
      </div>

      {/* Mobile Apply Button */}
      <div className="p-4 border-t border-[#EAE6DF] bg-white lg:hidden">
        <button
          onClick={onClose}
          className="w-full py-3 bg-[#1A1A1A] text-white text-xs font-semibold uppercase tracking-wider rounded-xl shadow-md"
        >
          Show Filtered Results
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-72 shrink-0 bg-[#FAF8F5] rounded-2xl border border-[#EAE6DF] overflow-hidden sticky top-28 self-start max-h-[calc(100vh-8rem)]">
        {content}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-xs sm:max-w-sm h-full shadow-2xl bg-[#FAF8F5] animate-in slide-in-from-right duration-300">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
