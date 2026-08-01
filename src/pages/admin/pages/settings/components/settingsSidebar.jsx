export default function SettingsSidebar({
  sections,
  activeSection,
  setActiveSection,
}) {
  return (
    <aside className="h-fit rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
      <div className="space-y-1">
        {sections.map((section) => {
          const Icon = section.icon;
          const active = activeSection === section.id;

          return (
            <button
              key={section.id}
              type="button"
              onClick={() => setActiveSection(section.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${
                active
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-950'
              }`}
            >
              <span
                className={`grid h-9 w-9 place-items-center rounded-lg ${
                  active ? 'bg-white/15' : 'bg-gray-100'
                }`}
              >
                <Icon className="h-4 w-4" />
              </span>

              <span>
                <span className="block text-sm font-semibold">
                  {section.label}
                </span>
                <span
                  className={`block text-xs ${
                    active ? 'text-indigo-100' : 'text-gray-400'
                  }`}
                >
                  {section.description}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}