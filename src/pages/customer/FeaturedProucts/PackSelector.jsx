export default function PackSelector({ packs, selectedPack, onSelect }) {
  return (
    <div>
      <h3 className="font-semibold text-gray-800 mb-2">Select Pack</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {packs.map((pack) => (
          <button
            key={pack.id}
            onClick={() => onSelect(pack)}
            className={`relative p-3 rounded-lg border text-sm transition-all duration-200 ${
              selectedPack?.id === pack.id
                ? 'border-teal-600 bg-teal-50 text-teal-700 shadow-sm'
                : 'border-gray-200 hover:border-teal-300 hover:bg-gray-50'
            }`}
          >
            <div className="font-medium">{pack.name}</div>
            <div className="font-bold mt-1">₹{pack.price}</div>
            <div className="text-xs text-gray-500">{pack.qty} pcs</div>
            {pack.discount && (
              <span className="absolute -top-2 -right-2 bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                -{pack.discount}%
              </span>
            )}
            {selectedPack?.id === pack.id && (
              <span className="absolute -bottom-2 -right-2 bg-teal-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                ✓
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}