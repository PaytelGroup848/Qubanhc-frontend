import { useNavigate } from 'react-router-dom';
import { LogOut, MessageSquare } from 'lucide-react';

export default function AccountSidebar({
  tabs = [],
  activeTab,
  setActiveTab,
  user,
  onLogout,
}) {
  const navigate = useNavigate();

  const initials =
    user?.name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';

  // ✅ Support tab sidebar ke andar hi add kar diya
  const finalTabs = [
    ...tabs,
    {
      id: 'support',
      label: 'Support',
      icon: MessageSquare,
      path: '/account/support',
    },
  ];

  const handleTabClick = (tab) => {
    if (tab.path) {
      navigate(tab.path);
      return;
    }

    if (typeof setActiveTab === 'function') {
      setActiveTab(tab.id);
    }
  };

  const isTabActive = (tab) => {
    if (tab.path) {
      return window.location.pathname === tab.path;
    }

    return activeTab === tab.id;
  };

  return (
    <aside className="rounded-3xl bg-white border border-slate-100 shadow-sm p-4 h-fit lg:sticky lg:top-24">
      <div className="flex items-center gap-3 p-3 rounded-2xl bg-teal-50 mb-4">
        <div className="h-12 w-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-black">
          {initials}
        </div>

        <div className="min-w-0">
          <p className="font-bold text-slate-900 truncate">
            {user?.name || 'Customer'}
          </p>

          <p className="text-xs text-slate-500 truncate">
            {user?.email || 'Verified account'}
          </p>
        </div>
      </div>

      <nav className="space-y-1">
        {finalTabs.map((tab) => {
          const Icon = tab.icon;
          const active = isTabActive(tab);

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabClick(tab)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition ${
                active
                  ? 'bg-teal-600 text-white shadow-lg shadow-teal-100'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}

              {tab.badge ? (
                <span
                  className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-black ${
                    active
                      ? 'bg-white/20 text-white'
                      : 'bg-teal-50 text-teal-700'
                  }`}
                >
                  {tab.badge}
                </span>
              ) : null}
            </button>
          );
        })}

        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-red-500 hover:bg-red-50 transition"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </nav>
    </aside>
  );
}