import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, FileText, Package } from 'lucide-react';

const fmt = (amount) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount || 0);

const fmtDate = (date) =>
  new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

const statusStyle = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-indigo-100 text-indigo-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  returned: 'bg-gray-100 text-gray-600',
};

export default function OrderCard({ order }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full flex-col justify-between gap-4 bg-slate-50 p-5 text-left transition hover:bg-slate-100 sm:flex-row sm:items-center"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50">
            <Package className="h-5 w-5 text-teal-600" />
          </div>

          <div>
            <p className="font-bold text-slate-900">#{order.orderId}</p>
            <p className="text-xs text-slate-500">{fmtDate(order.createdAt)}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${
              statusStyle[order.status] || 'bg-slate-100 text-slate-600'
            }`}
          >
            {order.status}
          </span>

          <span className="font-black text-slate-900">{fmt(order.total)}</span>

          <ChevronDown
            className={`h-4 w-4 text-slate-400 transition ${
              open ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>

      {open && (
        <div className="space-y-5 p-5">
          <div>
            <p className="mb-3 text-xs font-bold uppercase text-slate-400">
              Items
            </p>

            <div className="space-y-3">
              {order.items?.map((item, index) => (
                <div
                  key={item._id || index}
                  className="flex items-center gap-3 rounded-xl border border-slate-100 p-3"
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-12 w-12 rounded-xl bg-slate-100 object-cover"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-xl bg-slate-100" />
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {item.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      Qty {item.quantity} × {fmt(item.price)}
                    </p>
                  </div>

                  <p className="text-sm font-bold text-slate-900">
                    {fmt(item.total)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 border-t border-slate-100 pt-4 sm:grid-cols-2">
            <div>
              <p className="mb-1 text-xs font-bold uppercase text-slate-400">
                Payment
              </p>
              <p className="text-sm capitalize text-slate-700">
                {order.payment?.method || '-'}
              </p>
              <p
                className={`text-xs font-bold capitalize ${
                  order.payment?.status === 'paid'
                    ? 'text-green-600'
                    : 'text-orange-500'
                }`}
              >
                {order.payment?.status || 'pending'}
              </p>
            </div>

            <div>
              <p className="mb-1 text-xs font-bold uppercase text-slate-400">
                Deliver To
              </p>
              <p className="text-sm font-semibold text-slate-700">
                {order.shippingAddress?.fullName}
              </p>
              <p className="text-xs text-slate-500">
                {order.shippingAddress?.addressLine1},{' '}
                {order.shippingAddress?.city} {order.shippingAddress?.pincode}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-4">
            {order.payment?.status === 'paid' ? (
              <Link
                to={`/account/orders/${order._id}/invoice`}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800"
              >
                <FileText className="h-4 w-4" />
                View Invoice
              </Link>
            ) : (
              <span className="rounded-xl bg-orange-50 px-4 py-2 text-sm font-bold text-orange-600">
                Invoice available after payment
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}