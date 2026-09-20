import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Ruler, CheckCircle, Info, Sparkles } from 'lucide-react';

export const SizeGuideModal: React.FC = () => {
  const { isSizeGuideModalOpen, setIsSizeGuideModalOpen, sizeCharts } = useStore();
  const [activeTab, setActiveTab] = useState<'chart' | 'calculator' | 'how_to'>('calculator');
  const [chartId, setChartId] = useState<string>('sc-girls-footwear');
  
  // Calculator state
  const [footCm, setFootCm] = useState<string>('18.2');
  const [growthBuffer, setGrowthBuffer] = useState<number>(0.5); // 0.5 cm comfort buffer

  if (!isSizeGuideModalOpen) return null;

  const currentChart = sizeCharts.find((c) => c.id === chartId) || sizeCharts[0];

  // Calculate recommended footwear size based on cm input + buffer
  const parsedCm = parseFloat(footCm) || 0;
  const targetLength = parsedCm + growthBuffer;

  let recommendedSizeEntry = null;
  if (currentChart && currentChart.categoryType === 'footwear' && parsedCm > 10 && parsedCm < 28) {
    // Find the smallest entry where measurementCm >= targetLength
    recommendedSizeEntry = currentChart.entries.find((e) => e.measurementCm >= targetLength);
    if (!recommendedSizeEntry) {
      recommendedSizeEntry = currentChart.entries[currentChart.entries.length - 1];
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FAF8F5] max-w-2xl w-full rounded-2xl shadow-2xl border border-[#EAE6DF] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-[#EAE6DF] flex items-center justify-between bg-white">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#B38F4D] block">
              NEXORA ATELIER FIT STUDIO
            </span>
            <h3 className="font-serif text-2xl font-bold text-[#1A1A1A]">
              Interactive Size Guide & Foot Measurement
            </h3>
          </div>
          <button
            onClick={() => setIsSizeGuideModalOpen(false)}
            className="p-1.5 rounded-full text-[#7A746E] hover:text-[#1A1A1A] hover:bg-[#F2EDE2] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-[#EAE6DF] bg-[#F7F4EE] px-6 pt-2">
          <button
            onClick={() => setActiveTab('calculator')}
            className={`py-3 px-4 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'calculator'
                ? 'border-[#1A1A1A] text-[#1A1A1A]'
                : 'border-transparent text-[#7A746E] hover:text-[#1A1A1A]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#B38F4D]" />
            <span>Find My Size (Calculator)</span>
          </button>

          <button
            onClick={() => setActiveTab('chart')}
            className={`py-3 px-4 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 ${
              activeTab === 'chart'
                ? 'border-[#1A1A1A] text-[#1A1A1A]'
                : 'border-transparent text-[#7A746E] hover:text-[#1A1A1A]'
            }`}
          >
            Size Chart Table
          </button>

          <button
            onClick={() => setActiveTab('how_to')}
            className={`py-3 px-4 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 ${
              activeTab === 'how_to'
                ? 'border-[#1A1A1A] text-[#1A1A1A]'
                : 'border-transparent text-[#7A746E] hover:text-[#1A1A1A]'
            }`}
          >
            How to Measure
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Chart selector */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#4A453F]">Active Measurement System:</span>
            <select
              value={chartId}
              onChange={(e) => setChartId(e.target.value)}
              className="bg-white border border-[#DCD4C7] text-xs px-3 py-1.5 rounded-lg font-medium text-[#1A1A1A] focus:outline-none focus:border-[#B38F4D]"
            >
              {sizeCharts.map((sc) => (
                <option key={sc.id} value={sc.id}>
                  {sc.name}
                </option>
              ))}
            </select>
          </div>

          {activeTab === 'calculator' && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-xl border border-[#EAE6DF] space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#F4EFE6] text-[#B38F4D] flex items-center justify-center shrink-0">
                    <Ruler className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#1A1A1A]">Measure Foot in Centimeters (CM)</h4>
                    <p className="text-xs text-[#7A746E] mt-0.5">
                      Enter the exact distance from the back of the heel to the tip of the longest toe.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-[#4A453F] mb-1">
                      Foot Length in CM:
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        min="10"
                        max="26"
                        value={footCm}
                        onChange={(e) => setFootCm(e.target.value)}
                        className="w-full bg-[#FAF8F5] border border-[#DCD4C7] px-3.5 py-2.5 text-sm font-semibold text-[#1A1A1A] rounded-xl focus:outline-none focus:border-[#B38F4D]"
                      />
                      <span className="absolute right-3 top-2.5 text-xs text-[#888] font-medium">cm</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4A453F] mb-1">
                      Recommended Growth Buffer:
                    </label>
                    <select
                      value={growthBuffer}
                      onChange={(e) => setGrowthBuffer(parseFloat(e.target.value))}
                      className="w-full bg-[#FAF8F5] border border-[#DCD4C7] px-3 py-2.5 text-xs font-medium text-[#1A1A1A] rounded-xl focus:outline-none focus:border-[#B38F4D]"
                    >
                      <option value={0.3}>+0.3 cm (Snug / Slim Fit)</option>
                      <option value={0.5}>+0.5 cm (Recommended Ideal Fit)</option>
                      <option value={0.8}>+0.8 cm (Room to Grow / Thick Socks)</option>
                    </select>
                  </div>
                </div>

                {/* Quick click presets */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-[11px] text-[#8C8275]">Quick lengths:</span>
                  {[17.0, 17.8, 18.2, 19.8, 20.4, 21.0].map((v) => (
                    <button
                      key={v}
                      onClick={() => setFootCm(v.toString())}
                      className={`text-[11px] px-2 py-0.5 rounded-full border transition-colors ${
                        parseFloat(footCm) === v
                          ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                          : 'bg-[#FAF8F5] text-[#555] border-[#DDD] hover:border-[#999]'
                      }`}
                    >
                      {v} cm
                    </button>
                  ))}
                </div>
              </div>

              {/* Recommendation Banner */}
              {recommendedSizeEntry ? (
                <div className="bg-[#FAF6EC] border border-[#E8DCB8] p-5 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#1E7E34]" />
                      <span className="text-xs uppercase tracking-wider font-bold text-[#8C6B24]">
                        Optimal Size Match
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="font-serif text-3xl font-bold text-[#1A1A1A]">
                        Size {recommendedSizeEntry.size}
                      </span>
                      <span className="text-xs text-[#7A746E]">
                        (Insole length: {recommendedSizeEntry.measurementCm} cm)
                      </span>
                    </div>
                    <p className="text-xs text-[#666] mt-1">
                      Suitable for foot length {parsedCm} cm + {growthBuffer} cm buffer.
                      {recommendedSizeEntry.ageGuideline && ` Typical age: ${recommendedSizeEntry.ageGuideline}.`}
                    </p>
                  </div>

                  <div className="text-right">
                    <button
                      onClick={() => setIsSizeGuideModalOpen(false)}
                      className="px-4 py-2 bg-[#1A1A1A] text-white text-xs font-semibold rounded-xl hover:bg-[#333] transition-colors"
                    >
                      Select Size {recommendedSizeEntry.size}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-white rounded-xl border border-[#EAE6DF] text-xs text-[#7A746E] text-center">
                  Please enter a foot measurement between 15 cm and 23 cm to calculate child's size.
                </div>
              )}
            </div>
          )}

          {activeTab === 'chart' && (
            <div className="bg-white rounded-xl border border-[#EAE6DF] overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#FAF8F5] border-b border-[#EAE6DF] text-[#7A746E] uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4 font-bold">NEXORA Size</th>
                    <th className="py-3 px-4 font-bold">Insole (cm)</th>
                    {currentChart.categoryType === 'footwear' && (
                      <>
                        <th className="py-3 px-4 font-bold">Inches</th>
                        <th className="py-3 px-4 font-bold">Euro Size</th>
                        <th className="py-3 px-4 font-bold">Age Guideline</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F5F2EB] text-[#1A1A1A]">
                  {currentChart.entries.map((entry) => (
                    <tr key={entry.size} className="hover:bg-[#FAF8F5] transition-colors">
                      <td className="py-3 px-4 font-bold text-sm text-[#B38F4D]">
                        Size {entry.size}
                      </td>
                      <td className="py-3 px-4 font-semibold">{entry.measurementCm} cm</td>
                      {currentChart.categoryType === 'footwear' && (
                        <>
                          <td className="py-3 px-4 text-[#666]">{entry.measurementInches || '-'} in</td>
                          <td className="py-3 px-4 text-[#666]">EU {entry.euroSize || '-'}</td>
                          <td className="py-3 px-4 text-[#666]">{entry.ageGuideline || '-'}</td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'how_to' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl border border-[#EAE6DF] text-center space-y-2">
                  <div className="w-8 h-8 rounded-full bg-[#FAF6EC] text-[#B38F4D] font-bold text-xs flex items-center justify-center mx-auto">
                    1
                  </div>
                  <h5 className="text-xs font-bold text-[#1A1A1A]">Step on White Paper</h5>
                  <p className="text-[11px] text-[#706A62] leading-relaxed">
                    Place a blank sheet of paper flat on a hard floor. Have your child stand straight with their heel firmly against a wall.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-[#EAE6DF] text-center space-y-2">
                  <div className="w-8 h-8 rounded-full bg-[#FAF6EC] text-[#B38F4D] font-bold text-xs flex items-center justify-center mx-auto">
                    2
                  </div>
                  <h5 className="text-xs font-bold text-[#1A1A1A]">Trace the Longest Toe</h5>
                  <p className="text-[11px] text-[#706A62] leading-relaxed">
                    Using a sharp pencil held vertically, draw a mark at the longest point of the toes and the back of the heel.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-[#EAE6DF] text-center space-y-2">
                  <div className="w-8 h-8 rounded-full bg-[#FAF6EC] text-[#B38F4D] font-bold text-xs flex items-center justify-center mx-auto">
                    3
                  </div>
                  <h5 className="text-xs font-bold text-[#1A1A1A]">Measure Distance</h5>
                  <p className="text-[11px] text-[#706A62] leading-relaxed">
                    Measure the distance in centimeters between the two marks. Add 0.5 cm to find the ideal NEXORA shoe size.
                  </p>
                </div>
              </div>

              <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#EAE6DF] flex items-center gap-3">
                <Info className="w-5 h-5 text-[#B38F4D] shrink-0" />
                <p className="text-xs text-[#666] leading-relaxed">
                  <strong>Atelier Tip:</strong> Children’s feet grow rapidly. If your measurement falls right on the border between two sizes, we always advise opting for the larger size for footwear with closed toes or block heels.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
