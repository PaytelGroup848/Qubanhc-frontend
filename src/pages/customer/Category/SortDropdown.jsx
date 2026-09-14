import { ChevronDown, ArrowDownUp } from 'lucide-react';

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'popular', label: 'Most Popular' },
];

export default function SortDropdown({
  sortBy = 'featured',
  setSortBy,
  options = SORT_OPTIONS,
  className = '',
}) {
  return (
    <label
      className={`relative inline-flex min-w-[150px] items-center rounded-2xl border border-slate-200 bg-white shadow-sm transition focus-within:border-teal-400 focus-within:ring-4 focus-within:ring-teal-100 ${className}`}
    >
      <ArrowDownUp className="pointer-events-none absolute left-3 h-4 w-4 text-slate-400" />

      <select
        value={sortBy}
        onChange={(event) => setSortBy?.(event.target.value)}
        className="w-full appearance-none rounded-2xl bg-transparent py-3 pl-9 pr-9 text-sm font-bold text-slate-700 outline-none"
        aria-label="Sort products"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-slate-400" />
    </label>
  );
}
