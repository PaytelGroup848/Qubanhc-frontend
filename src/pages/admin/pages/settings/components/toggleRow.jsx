export default function ToggleRow({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-5 rounded-2xl border border-gray-100 bg-gray-50 p-4">
      <div>
        <p className="text-sm font-bold text-gray-900">{label}</p>
        <p className="mt-1 text-xs text-gray-500">{description}</p>
      </div>

      <button
        type="button"
        onClick={onChange}
        className={`relative h-7 w-12 rounded-full transition ${
          checked ? 'bg-indigo-600' : 'bg-gray-300'
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
            checked ? 'left-6' : 'left-1'
          }`}
        />
      </button>
    </div>
  );
}