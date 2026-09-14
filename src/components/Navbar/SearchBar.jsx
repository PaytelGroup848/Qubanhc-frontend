import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchIcon } from '../Icons/Icons';

export default function SearchBar({
  query, setQuery, suggestions, focused, setFocused, onSelect, isMobile = false, className = ''
}) {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (isMobile && focused && inputRef.current) inputRef.current.focus();
  }, [isMobile, focused]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setFocused(false);
      if (inputRef.current) inputRef.current.blur();
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <form
        onSubmit={handleSubmit}
        className={`flex items-center bg-white rounded-full shadow-sm ring-1 ring-gray-200 focus-within:ring-2 focus-within:ring-teal-400 transition-all duration-200 ${
          isMobile ? 'w-full' : 'w-96 xl:w-[28rem]'
        } ${className}`}
      >
        {/* Search icon inside input (decorative) */}
        <div className="pl-3 text-gray-400">
          <SearchIcon className="w-4 h-4" />
        </div>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search products..."
          className="w-full bg-transparent border-none outline-none text-sm py-1.5 px-2 text-gray-700 placeholder-gray-400"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          aria-autocomplete="list"
          aria-expanded={focused && suggestions.length > 0}
        />
        <button
          type="submit"
          className="mr-1.5 p-1 bg-teal-600 hover:bg-teal-700 text-white rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-400"
          aria-label="Search"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </form>

      {/* Suggestions dropdown – enhanced */}
      {focused && suggestions.length > 0 && (
        <ul className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 max-h-60 overflow-y-auto">
          {suggestions.map((s, idx) => (
            <li
              key={idx}
              className="px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-600 cursor-pointer transition-colors flex items-center gap-2"
              onMouseDown={() => onSelect(s)}
            >
              <SearchIcon className="w-3.5 h-3.5 text-gray-400" />
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}