export default function AccountHeader({ title = 'My Account', subtitle }) {
  return (
    <div className="mb-6 rounded-3xl bg-white border border-slate-100 shadow-sm p-6">
      <h1 className="text-2xl font-black text-slate-900">{title}</h1>
      <p className="text-sm text-slate-500 mt-1">
        {subtitle || 'Manage your orders, addresses, profile, security, and wishlist.'}
      </p>
    </div>
  );
}