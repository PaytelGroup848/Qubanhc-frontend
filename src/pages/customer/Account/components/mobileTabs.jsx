export default function MobileTabs({ tabs, activeTab, setActiveTab }) {
  return (
    <div className="lg:hidden mb-5 rounded-2xl bg-white border border-slate-100 shadow-sm p-2">
      <div className="grid grid-cols-5 gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-[11px] font-bold transition ${
              activeTab === tab.id
                ? 'bg-teal-600 text-white'
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            <span className="truncate">{tab.label.split(' ')[0]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}