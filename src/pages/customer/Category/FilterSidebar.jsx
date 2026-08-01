export default function FilterSidebar({ filters, setFilters, availableTypes, maxPrice, onClose, isMobile }) {
  const handleTypeChange = (type) => {
    const newTypes = filters.types.includes(type)
      ? filters.types.filter(t => t !== type)
      : [...filters.types, type];
    setFilters(prev => ({ ...prev, types: newTypes }));
  };

  return (
    <div className="p-4 space-y-6">
      {isMobile && (
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-xl font-bold">Filters</h2>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-800">✕</button>
        </div>
      )}

      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-3">Price Range (₹)</h3>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            value={filters.priceRange[0]}
            onChange={(e) => setFilters(prev => ({ ...prev, priceRange: [Number(e.target.value), prev.priceRange[1]] }))}
            className="border rounded-lg px-3 py-2 w-full text-sm"
            placeholder="Min"
          />
          <span className="text-gray-400">—</span>
          <input
            type="number"
            value={filters.priceRange[1]}
            onChange={(e) => setFilters(prev => ({ ...prev, priceRange: [prev.priceRange[0], Number(e.target.value)] }))}
            className="border rounded-lg px-3 py-2 w-full text-sm"
            placeholder="Max"
          />
        </div>
        <input
          type="range"
          min={0}
          max={maxPrice}
          value={filters.priceRange[1]}
          onChange={(e) => setFilters(prev => ({ ...prev, priceRange: [prev.priceRange[0], Number(e.target.value)] }))}
          className="w-full mt-3 accent-teal-600"
        />
      </div>

      {/* Rating */}
      <div>
        <h3 className="font-semibold mb-2">Rating</h3>
        <div className="flex gap-2">
          {[0, 4, 4.5, 5].map(r => (
            <button
              key={r}
              onClick={() => setFilters(prev => ({ ...prev, rating: r }))}
              className={`px-3 py-1 rounded-full text-sm ${filters.rating === r ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              {r === 0 ? 'All' : r + '★'}
            </button>
          ))}
        </div>
      </div>

      {/* Type filter */}
      {availableTypes.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">Type</h3>
          <div className="space-y-2">
            {availableTypes.map(type => (
              <label key={type} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.types.includes(type)}
                  onChange={() => handleTypeChange(type)}
                  className="w-4 h-4 text-teal-600 rounded"
                />
                <span className="capitalize text-sm">{type}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Best Seller */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.bestSellerOnly}
            onChange={(e) => setFilters(prev => ({ ...prev, bestSellerOnly: e.target.checked }))}
            className="w-4 h-4 text-teal-600 rounded"
          />
          <span className="font-semibold">Best Seller Only</span>
        </label>
      </div>

      {/* Reset */}
      <button
        onClick={() => setFilters({ priceRange: [0, maxPrice], types: [], rating: 0, bestSellerOnly: false, sortBy: 'featured' })}
        className="text-sm text-teal-600 underline hover:text-teal-800"
      >
        Reset all filters
      </button>
    </div>
  );
}