export default function FormInput({
  label,
  value,
  onChange,
  type = 'text',
  placeholder = '',
  prefix = '',
  suffix = '',
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-gray-700">
        {label}
      </span>

      <div className="flex overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100">
        {prefix && (
          <span className="grid place-items-center border-r border-gray-100 bg-gray-50 px-3 text-sm font-semibold text-gray-500">
            {prefix}
          </span>
        )}

        <input
          type={type}
          value={value ?? ''}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="min-w-0 flex-1 border-0 px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400"
        />

        {suffix && (
          <span className="grid place-items-center border-l border-gray-100 bg-gray-50 px-3 text-sm font-semibold text-gray-500">
            {suffix}
          </span>
        )}
      </div>
    </label>
  );
}