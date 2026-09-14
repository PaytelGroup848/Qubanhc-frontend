export default function InfoBox({ icon: Icon, title, description }) {
  return (
    <div className="flex gap-3 rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-indigo-600 shadow-sm">
        <Icon className="h-5 w-5" />
      </div>

      <div>
        <h3 className="text-sm font-bold text-gray-950">{title}</h3>
        <p className="mt-1 text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
}