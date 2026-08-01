import { Link } from 'react-router-dom';

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionText,
  actionTo = '/',
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      {Icon && (
        <div className="h-20 w-20 rounded-3xl bg-slate-100 flex items-center justify-center mb-5">
          <Icon className="h-9 w-9 text-slate-400" />
        </div>
      )}

      <h3 className="text-lg font-black text-slate-900">{title}</h3>

      {description && (
        <p className="text-sm text-slate-500 mt-1">{description}</p>
      )}

      {actionText && (
        <Link
          to={actionTo}
          className="mt-5 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-teal-700"
        >
          {actionText}
        </Link>
      )}
    </div>
  );
}