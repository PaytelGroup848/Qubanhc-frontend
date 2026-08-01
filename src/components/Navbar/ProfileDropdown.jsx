import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserIcon } from '../Icons/Icons';
import { LogOut, User, LogIn, UserPlus } from 'lucide-react';

export default function ProfileDropdown({ isLoggedIn = false, user = null }) {
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const isHovering = useRef(false);

  const closeDropdown = useCallback(() => {
    setOpen(false);
    isHovering.current = false;
  }, []);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) closeDropdown();
    };
    const handleEscape = (event) => {
      if (event.key === 'Escape') closeDropdown();
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, closeDropdown]);

  const userInitials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <div
      className="relative"
      ref={dropdownRef}
      onMouseEnter={() => {
        isHovering.current = true;
        setOpen(true);
      }}
      onMouseLeave={() => {
        isHovering.current = false;
        setTimeout(() => {
          if (!isHovering.current) setOpen(false);
        }, 150);
      }}
    >
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={`p-2 rounded-full transition-colors focus:outline-none focus:ring-2 ${
          isLoggedIn
            ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 focus:ring-emerald-300'
            : 'bg-red-50 text-red-500 hover:bg-red-100 focus:ring-red-300'
        }`}
        aria-label="Account"
        aria-expanded={open}
      >
        <UserIcon className="w-5 h-5" />
      </button>

      <div
        className={`absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-200 z-50 origin-top-right ${
          open ? 'opacity-100 visible scale-100 translate-y-0' : 'opacity-0 invisible scale-95 -translate-y-1'
        }`}
      >
        {isLoggedIn && user ? (
          <>
            <div className="p-4 flex items-center gap-3 bg-emerald-50">
              <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold">
                {userInitials}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm text-gray-800 truncate">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
            <Link
              to="/account"
              className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
              onClick={closeDropdown}
            >
              <User className="w-4 h-4" />
              My Account
            </Link>
            <button
              onClick={() => {
                closeDropdown();
                logout();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 text-left"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-teal-600 hover:bg-teal-50"
              onClick={closeDropdown}
            >
              <LogIn className="w-4 h-4" />
              Login
            </Link>
            <Link
              to="/register"
              className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-600"
              onClick={closeDropdown}
            >
              <UserPlus className="w-4 h-4" />
              Register
            </Link>
          </>
        )}
      </div>
    </div>
  );
}