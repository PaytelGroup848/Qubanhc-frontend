export default function PackSelector({ packs, selectedPack, onSelect }) {
  return (
    <div>
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">Select Pack</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {packs.map((pack) => {
          const active = selectedPack?.id === pack.id;
          return (
            <button
              key={pack.id}
              onClick={() => onSelect(pack)}
              className={`relative p-3.5 rounded-xl border-2 text-left transition-all duration-200 ${
                active
                  ? 'border-emerald-500 bg-emerald-50 shadow-sm'
                  : 'border-slate-100 bg-slate-50 hover:border-emerald-200 hover:bg-white'
              }`}
            >
              <div className={`font-semibold text-sm ${active ? 'text-emerald-700' : 'text-slate-700'}`}>
                {pack.name}
              </div>
              <div className={`font-extrabold mt-1 ${active ? 'text-emerald-700' : 'text-slate-900'}`}>
                ₹{pack.price}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">{pack.qty} pcs</div>

              {pack.discount && (
                <span className="absolute -top-2 -right-2 bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                  -{pack.discount}%
                </span>
              )}

              {active && (
                <span className="absolute -bottom-2 -right-2 bg-emerald-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[11px] font-bold shadow">
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}