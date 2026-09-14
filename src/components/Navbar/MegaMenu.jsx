import { useState, useRef, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from '../Icons/Icons';

const megaMenuCategories = [
  {
    title: 'Adult Care',
    icon: '🧓',
    items: ['Adult Diapers', 'Underpads', 'Catheters', 'Gloves', 'Wipes', 'Skin Care'],
  },
  {
    title: 'Baby Care',
    icon: '👶',
    items: ['Baby Diapers', 'Wipes', 'Baby Wash', 'Lotion', 'Diaper Pants', 'Nursing Pads'],
  },
  {
    title: 'Hygiene Essentials',
    icon: '🧼',
    items: ['Hand Sanitiser', 'Masks', 'Surface Disinfectant', 'Tissues', 'Air Purifiers', 'Soaps'],
  },
  {
    title: 'Kids & Mobility',
    icon: '🛴',
    items: ['Kids Scooter', 'Walkers', 'Wheelchairs', 'Crutches', 'Knee Support', 'Orthopaedic'],
  },
];

export default function MegaMenu() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const openTimeoutRef = useRef(null);
  const closeTimeoutRef = useRef(null);

  const clearTimeouts = useCallback(() => {
    if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current);
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
  }, []);

  const openMenu = useCallback(() => {
    clearTimeouts();
    if (!open) openTimeoutRef.current = setTimeout(() => setOpen(true), 100);
  }, [open, clearTimeouts]);

  const closeMenuWithDelay = useCallback(() => {
    clearTimeouts();
    closeTimeoutRef.current = setTimeout(() => setOpen(false), 150);
  }, [clearTimeouts]);

  const closeMenuImmediately = useCallback(() => {
    clearTimeouts();
    setOpen(false);
  }, [clearTimeouts]);

  const handleMouseEnter = () => openMenu();
  const handleMouseLeave = () => closeMenuWithDelay();
  const handlePanelMouseEnter = () => clearTimeouts();
  const handlePanelMouseLeave = () => closeMenuWithDelay();

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        closeMenuImmediately();
      }
    };
    const handleEscape = (event) => {
      if (event.key === 'Escape') closeMenuImmediately();
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, closeMenuImmediately]);

  useEffect(() => () => clearTimeouts(), [clearTimeouts]);

  const handleToggleClick = (e) => {
    e.stopPropagation();
    open ? closeMenuImmediately() : openMenu();
  };

  return (
    <li
      ref={containerRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-teal-400"
        aria-expanded={open}
        onClick={handleToggleClick}
      >
        Shop <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* Mega menu panel – glassmorphism with enhanced UI */}
      <div
        onMouseEnter={handlePanelMouseEnter}
        onMouseLeave={handlePanelMouseLeave}
        className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[95vw] max-w-6xl bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200/50 transition-all duration-300 z-50 ${
          open ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-3'
        }`}
        role="menu"
      >
        <div className="p-5 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {megaMenuCategories.map((cat, idx) => (
              <div key={idx} className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-teal-100">
                  <span className="text-2xl">{cat.icon}</span>
                  <h3 className="text-sm font-bold text-teal-700 uppercase tracking-wider">
                    {cat.title}
                  </h3>
                </div>
                <ul className="space-y-1.5">
                  {cat.items.map((item, i) => (
                    <li key={i}>
                      <Link
                        to={`/category/${item.toLowerCase().replace(/\s+/g, '-')}`}
                        className="block text-sm text-gray-600 hover:text-teal-600 hover:bg-teal-50 rounded-lg px-3 py-1.5 transition-all duration-150"
                        onClick={closeMenuImmediately}
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Featured Card – Quban Wipes (image + CTA) */}
            <div className="relative bg-gradient-to-br from-teal-600 to-emerald-600 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              {/* Background pattern */}
              <div className="absolute inset-0 bg-[url('/images/wipes-pattern.png')] opacity-10" />
              <div className="relative z-10 p-5 flex flex-col items-center text-center text-white">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-3 backdrop-blur-sm">
                  <span className="text-4xl">🧻</span>
                </div>
                <h4 className="text-xl font-extrabold mb-1">Quban Wipes</h4>
                <p className="text-xs text-white/80 mb-4">Super thick • Alcohol‑free • 99.9% germ kill</p>
                <Link
                  to="/product/quban-wipes"
                  className="inline-block bg-white text-teal-700 px-5 py-2 rounded-full font-bold text-sm hover:shadow-md transition-all"
                  onClick={closeMenuImmediately}
                >
                  Shop Now →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}