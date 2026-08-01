import { MapPin, CreditCard } from 'lucide-react';

const fmt = (amount) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount || 0);

export default function OrderDetails({ order }) {
  return (
    <div className="p-5 space-y-5">
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase mb-3">
          Items
        </p>

        <div className="space-y-3">
          {order.items?.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3 rounded-xl border border-slate-100 p-3"
            >
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-12 w-12 rounded-xl object-cover bg-slate-100"
                />
              ) : (
                <div className="h-12 w-12 rounded-xl bg-slate-100" />
              )}

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">
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

      <div className="grid sm:grid-cols-2 gap-4 border-t border-slate-100 pt-4">
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Payment
          </p>
          <p className="text-sm text-slate-700 capitalize">
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

        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Deliver To
          </p>
          <p className="text-sm font-semibold text-slate-700">
            {order.shippingAddress?.fullName}
          </p>
          <p className="text-xs text-slate-500">
            {order.shippingAddress?.addressLine1}, {order.shippingAddress?.city}{' '}
            {order.shippingAddress?.pincode}
          </p>
        </div>
      </div>
    </div>
  );
}