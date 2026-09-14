import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth';
import { getAdminMenus, getFirstAllowedAdminPath } from '../../utils/adminAccess';

function isRouteActive(currentPath, targetPath) {
  if (currentPath === targetPath) return true;

  if (targetPath !== '/admin/dashboard' && currentPath.startsWith(`${targetPath}/`)) {
    return true;
  }

  return false;
}

export default function AdminSidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(() => authService.getUser());

  useEffect(() => {
    const loadUser = () => {
      setUser(authService.getUser());
    };

    loadUser();

    window.addEventListener('storage', loadUser);
    window.addEventListener('auth-changed', loadUser);

    return () => {
      window.removeEventListener('storage', loadUser);
      window.removeEventListener('auth-changed', loadUser);
    };
  }, []);

  const menus = getAdminMenus(user);

  const handleNavigate = (path) => {
    navigate(path);

    if (typeof onClose === 'function') {
      onClose();
    }
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0`}
    >
      <div className="flex h-full flex-col border-r border-gray-200 bg-white shadow-2xl shadow-gray-300/40">
        <div className="relative border-b border-gray-100 bg-white px-4 py-5">
          <div className="flex items-center gap-3">
            <img
              src="/images/QubanHC.svg"
              alt="Admin Logo"
              className="h-12 w-12 object-contain"
            />

            <div>
              <p className="text-sm font-bold text-gray-900">Admin Panel</p>
              <p className="text-xs text-gray-400">
                {user?.role === 'super_admin' ? 'Super Admin' : 'Sub Admin'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 lg:hidden"
          >
            ✕
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {menus.length === 0 && user?.role === 'sub_admin' ? (
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-center">
              <p className="font-semibold text-gray-700">No Permissions Assigned</p>
              <p className="mt-1 text-xs text-gray-400">
                Contact super admin to assign permissions.
              </p>
            </div>
          ) : null}

          {menus.map((item) => {
            const active = isRouteActive(location.pathname, item.path);

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavigate(item.path)}
                className={`w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'border-l-4 border-teal-600 bg-teal-50 text-teal-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-gray-100 bg-gray-50 p-4 text-center text-xs text-gray-400">
          <p>© {new Date().getFullYear()} QubanHC</p>
          <button
            type="button"
            onClick={() => handleNavigate(getFirstAllowedAdminPath(user))}
            className="mt-1 text-[10px] text-teal-600 hover:underline"
          >
            Go to assigned module
          </button>
        </div>
      </div>
    </aside>
  );
}