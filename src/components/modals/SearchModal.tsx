import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { Search, X, Clock, Sparkles, ArrowRight, ArrowUpRight } from 'lucide-react';

export const SearchModal: React.FC = () => {
  const {
    isSearchModalOpen,
    setIsSearchModalOpen,
    products,
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
    openProductDetail,
    setCurrentView,
    setSelectedCategoryFilter,
    setSelectedSubcategoryFilter,
  } = useStore();

  const [query, setQuery] = useState('');

  const popularSearches = [
    'Champagne Sandal',
    'Block Heel',
    'Glitter Shoes',
    'Bow Ballerina',
    'Pearl Ankle-Strap',
    'Casual Sneaker',
    'Summer Slides',
    'Size 12 Footwear',
  ];

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();

    return products.filter((prod) => {
      const nameMatch = prod.name.toLowerCase().includes(q);
      const descMatch = prod.description.toLowerCase().includes(q);
      const brandMatch = prod.brand.toLowerCase().includes(q);
      const tagMatch = prod.tags.some((t) => t.toLowerCase().includes(q));
      const attrMatch = Object.values(prod.attributes).some((v) => v.toLowerCase().includes(q));
      const variantMatch = prod.variants.some(
        (v) =>
          v.colorName.toLowerCase().includes(q) ||
          v.size.toLowerCase() === q ||
          `size ${v.size}`.toLowerCase() === q
      );
      return nameMatch || descMatch || brandMatch || tagMatch || attrMatch || variantMatch;
    });
  }, [query, products]);

  if (!isSearchModalOpen) return null;

  const handleSelectSearch = (term: string) => {
    setQuery(term);
    addRecentSearch(term);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 sm:pt-20 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FAF8F5] max-w-2xl w-full rounded-2xl shadow-2xl border border-[#EAE6DF] overflow-hidden flex flex-col max-h-[85vh]">
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-[#EAE6DF] flex items-center gap-3 bg-white">
          <Search className="w-5 h-5 text-[#8C8275] shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && query.trim()) {
                addRecentSearch(query);
              }
            }}
            placeholder="Search footwear, sandals, ballerinas, block heels, colors, sizes..."
            className="w-full bg-transparent text-sm sm:text-base text-[#1A1A1A] placeholder-[#8C8275] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-[#999] hover:text-[#1A1A1A] p-1 text-xs"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setIsSearchModalOpen(false)}
            className="p-1.5 rounded-full text-[#7A746E] hover:text-[#1A1A1A] hover:bg-[#F2EDE2] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="overflow-y-auto p-5 space-y-6 flex-1">
          {query.trim() === '' ? (
            <>
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs uppercase tracking-wider font-semibold text-[#8C8275] flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Recent Searches</span>
                    </span>
                    <button
                      onClick={clearRecentSearches}
                      className="text-[11px] text-[#A69E94] hover:text-[#1A1A1A] transition-colors"
                    >
                      Clear History
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term, i) => (
                      <button
                        key={i}
                        onClick={() => handleSelectSearch(term)}
                        className="px-3 py-1.5 bg-[#F2EDE2] hover:bg-[#E8E0D0] text-[#333] text-xs rounded-full border border-[#DCD4C7] transition-colors flex items-center gap-1.5"
                      >
                        <span>{term}</span>
                        <ArrowUpRight className="w-3 h-3 text-[#999]" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Searches */}
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-[#8C8275] flex items-center gap-1.5 mb-2.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#B38F4D]" />
                  <span>Trending & Popular Searches</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((term, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelectSearch(term)}
                      className="px-3 py-1.5 bg-white hover:bg-[#F9F7F2] text-[#4A453F] text-xs rounded-full border border-[#E0D9CC] transition-colors hover:border-[#B38F4D]"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Category Discovery */}
              <div className="pt-2 border-t border-[#EAE6DF]">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-[#8C8275] block mb-2">
                  Explore Curated Edits
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                  <button
                    onClick={() => {
                      setSelectedCategoryFilter('girls-footwear');
                      setSelectedSubcategoryFilter('sandals');
                      setCurrentView('shop');
                      setIsSearchModalOpen(false);
                    }}
                    className="p-2.5 rounded-xl bg-white border border-[#EAE6DF] hover:border-[#B38F4D] transition-colors font-medium text-[#1A1A1A]"
                  >
                    Girls Sandals
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCategoryFilter('girls-footwear');
                      setSelectedSubcategoryFilter('heels');
                      setCurrentView('shop');
                      setIsSearchModalOpen(false);
                    }}
                    className="p-2.5 rounded-xl bg-white border border-[#EAE6DF] hover:border-[#B38F4D] transition-colors font-medium text-[#1A1A1A]"
                  >
                    Block Heels
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCategoryFilter('girls-footwear');
                      setSelectedSubcategoryFilter('flats');
                      setCurrentView('shop');
                      setIsSearchModalOpen(false);
                    }}
                    className="p-2.5 rounded-xl bg-white border border-[#EAE6DF] hover:border-[#B38F4D] transition-colors font-medium text-[#1A1A1A]"
                  >
                    Ballerinas & Bows
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCategoryFilter('girls-footwear');
                      setSelectedSubcategoryFilter('slippers');
                      setCurrentView('shop');
                      setIsSearchModalOpen(false);
                    }}
                    className="p-2.5 rounded-xl bg-white border border-[#EAE6DF] hover:border-[#B38F4D] transition-colors font-medium text-[#1A1A1A]"
                  >
                    Comfort Slides
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Results State */
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#EAE6DF] mb-4">
                <span className="text-xs font-semibold text-[#1A1A1A]">
                  {searchResults.length} {searchResults.length === 1 ? 'Design Found' : 'Designs Found'}
                </span>
                <span className="text-xs text-[#8C8275]">Showing matches for "{query}"</span>
              </div>

              {searchResults.length === 0 ? (
                /* No Results State with Alternatives */
                <div className="py-12 text-center space-y-3">
                  <p className="font-serif text-lg font-semibold text-[#1A1A1A]">
                    No immediate match found for "{query}"
                  </p>
                  <p className="text-xs text-[#706A62] max-w-sm mx-auto">
                    Try searching by footwear style (e.g. sandal, flat, heel), color (champagne, blush, ivory), or size (11, 12, 13, 1, 2, 3).
                  </p>
                  <div className="pt-3">
                    <button
                      onClick={() => {
                        setQuery('');
                        setCurrentView('shop');
                        setIsSearchModalOpen(false);
                      }}
                      className="px-5 py-2.5 bg-[#1A1A1A] text-white text-xs font-semibold rounded-xl hover:bg-[#333] transition-colors"
                    >
                      Browse All Footwear Collections
                    </button>
                  </div>
                </div>
              ) : (
                /* List of Result Cards */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {searchResults.map((prod) => (
                    <div
                      key={prod.id}
                      onClick={() => {
                        addRecentSearch(query);
                        openProductDetail(prod.id);
                        setIsSearchModalOpen(false);
                      }}
                      className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-[#EAE6DF] hover:border-[#B38F4D] cursor-pointer transition-all hover:shadow-sm group"
                    >
                      <img
                        src={prod.images[0]}
                        alt={prod.name}
                        className="w-16 h-16 rounded-lg object-cover bg-[#F5F2EB] shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] uppercase font-semibold text-[#B38F4D] block truncate">
                          {prod.brand}
                        </span>
                        <h4 className="text-xs font-bold text-[#1A1A1A] truncate group-hover:text-[#B38F4D] transition-colors">
                          {prod.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-bold text-[#1A1A1A]">
                            ₹{prod.price.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] text-[#999] line-through">
                            ₹{prod.mrp.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] text-[#1E7E34] font-semibold">
                            {prod.discountPercent}% OFF
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#CCC] group-hover:text-[#1A1A1A] group-hover:translate-x-0.5 transition-all shrink-0 mr-1" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
