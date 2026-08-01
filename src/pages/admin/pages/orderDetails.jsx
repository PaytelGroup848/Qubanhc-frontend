import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Box,
  CheckCircle2,
  CreditCard,
  FileText,
  Loader2,
  Mail,
  MapPin,
  Package,
  PackageCheck,
  Phone,
  RefreshCw,
  Trash2,
  Truck,
  User,
} from 'lucide-react';
import toast from 'react-hot-toast';

import { adminService } from '../../../services/admin';

const STATUS_OPTIONS = [
  {
    value: 'pending',
    label: 'Pending',
    description: 'Order placed, waiting for confirmation',
  },
  {
    value: 'confirmed',
    label: 'Confirmed',
    description: 'Order confirmed by admin',
  },
  {
    value: 'packed',
    label: 'Packed',
    description: 'Order packed and ready',
  },
  {
    value: 'picking_dispatch',
    label: 'Picking & Dispatch',
    description: 'Order is picked and dispatched',
  },
  {
    value: 'delivered',
    label: 'Delivery Successful',
    description: 'Order delivered successfully',
  },
  {
    value: 'cancelled',
    label: 'Cancelled',
    description: 'Order cancelled',
  },
  {
    value: 'returned',
    label: 'Returned',
    description: 'Order returned',
  },
];

const statusLabel = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  packed: 'Packed',
  picking_dispatch: 'Picking & Dispatch',
  delivered: 'Delivery Successful',
  cancelled: 'Cancelled',
  returned: 'Returned',
};

const statusClass = {
  pending: 'bg-yellow-50 text-yellow-700 ring-yellow-200',
  confirmed: 'bg-blue-50 text-blue-700 ring-blue-200',
  packed: 'bg-indigo-50 text-indigo-700 ring-indigo-200',
  picking_dispatch: 'bg-purple-50 text-purple-700 ring-purple-200',
  delivered: 'bg-green-50 text-green-700 ring-green-200',
  cancelled: 'bg-red-50 text-red-700 ring-red-200',
  returned: 'bg-gray-50 text-gray-700 ring-gray-200',
};

const formatCurrency = (amount = 0) => {
  return `₹${Number(amount || 0).toLocaleString('en-IN')}`;
};

const formatDate = (date) => {
  if (!date) return '-';

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return '-';
  }

  return parsed.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const formatDateTime = (date) => {
  if (!date) return '-';

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return '-';
  }

  return parsed.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

function extractOrder(response) {
  const root = response?.data || response || {};
  const inner = root?.data || root;
  return inner?.order || root?.order || null;
}

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [reason, setReason] = useState('');

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const selectedStatusData = useMemo(() => {
    return STATUS_OPTIONS.find((item) => item.value === selectedStatus);
  }, [selectedStatus]);

  const customer = {
    name:
      order?.customerName ||
      order?.user?.name ||
      order?.shippingAddress?.fullName ||
      '-',
    email: order?.customerEmail || order?.user?.email || '-',
    phone:
      order?.customerPhone ||
      order?.user?.phone ||
      order?.shippingAddress?.phone ||
      '-',
  };

  const address = [
    order?.shippingAddress?.addressLine1,
    order?.shippingAddress?.addressLine2,
    order?.shippingAddress?.city,
    order?.shippingAddress?.state,
    order?.shippingAddress?.pincode,
    order?.shippingAddress?.country,
  ]
    .filter(Boolean)
    .join(', ');

  const fetchOrder = async () => {
    try {
      setLoading(true);

      const response = await adminService.getOrderById(id);
      const fetchedOrder = extractOrder(response);

      if (!fetchedOrder) {
        throw new Error('Order not found');
      }

      setOrder(fetchedOrder);
      setSelectedStatus(fetchedOrder.status || 'pending');
    } catch (error) {
      console.error('Order fetch error:', error);
      toast.error(error?.response?.data?.message || error.message || 'Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    try {
      if (!selectedStatus) {
        toast.error('Please select status');
        return;
      }

      if (selectedStatus === order?.status) {
        toast.error('This status is already selected');
        return;
      }

      setStatusUpdating(true);

      const response = await adminService.updateOrderStatus(
        order._id,
        selectedStatus,
        reason
      );

      const updatedOrder = extractOrder(response);

      if (updatedOrder) {
        setOrder(updatedOrder);
        setSelectedStatus(updatedOrder.status);
        setReason('');
      } else {
        await fetchOrder();
      }

      toast.success('Order status updated successfully');
    } catch (error) {
      console.error('Status update error:', error);
      toast.error(error?.response?.data?.message || 'Failed to update status');
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleDeleteOrder = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete order #${order?.orderId}? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setDeleting(true);

      await adminService.deleteOrder(order._id);

      toast.success('Order deleted successfully');
      navigate('/admin/orders');
    } catch (error) {
      console.error('Delete order error:', error);
      toast.error(error?.response?.data?.message || 'Failed to delete order');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="rounded-3xl border border-gray-100 bg-white p-10 text-center shadow-sm">
        <h2 className="text-xl font-black text-gray-950">Order not found</h2>

        <Link
          to="/admin/orders"
          className="mt-5 inline-flex rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white"
        >
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link
        to="/admin/orders"
        className="inline-flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-gray-950"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Orders
      </Link>

      {/* Header */}
      <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-gray-400">
              Order Details
            </p>

            <h1 className="mt-1 text-3xl font-black text-gray-950">
              #{order.orderId}
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Placed on {formatDateTime(order.createdAt || order.orderedAt)}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span
              className={`inline-flex rounded-full px-4 py-2 text-xs font-black ring-1 ${
                statusClass[order.status] || statusClass.pending
              }`}
            >
              {statusLabel[order.status] || order.status}
            </span>

            {order.payment?.status && (
              <span className="inline-flex rounded-full bg-emerald-50 px-4 py-2 text-xs font-black text-emerald-700 ring-1 ring-emerald-200">
                Payment: {order.payment.status}
              </span>
            )}

            <Link
              to={`/admin/orders/${order._id}/invoice`}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2 text-xs font-black text-white hover:bg-slate-800"
            >
              <FileText className="h-4 w-4" />
              Invoice
            </Link>

            <button
              type="button"
              onClick={handleDeleteOrder}
              disabled={deleting}
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-xs font-black text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
            >
              {deleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Manual Status */}
      <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50">
            <RefreshCw className="h-5 w-5 text-indigo-600" />
          </div>

          <div>
            <h2 className="text-lg font-black text-gray-950">
              Manual Order Status
            </h2>
            <p className="text-sm text-gray-500">
              Admin manually order status update karega.
            </p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_1fr_auto]">
          <div>
            <label className="mb-2 block text-xs font-black uppercase tracking-wider text-gray-400">
              Select Status
            </label>

            <select
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value)}
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-bold text-gray-800 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>

            <p className="mt-2 text-sm text-gray-500">
              {selectedStatusData?.description || 'Select order status'}
            </p>
          </div>

          <div>
            <label className="mb-2 block text-xs font-black uppercase tracking-wider text-gray-400">
              Note / Reason
            </label>

            <input
              type="text"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Optional note for this status update"
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-bold text-gray-800 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            />
          </div>

          <div className="flex items-start lg:items-end">
            <button
              type="button"
              onClick={handleStatusUpdate}
              disabled={statusUpdating || selectedStatus === order.status}
              className="inline-flex min-w-44 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {statusUpdating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Status'
              )}
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-3 md:grid-cols-4">
          <StatusStep
            active={['confirmed', 'packed', 'picking_dispatch', 'delivered'].includes(order.status)}
            icon={PackageCheck}
            title="Confirmed"
          />

          <StatusStep
            active={['packed', 'picking_dispatch', 'delivered'].includes(order.status)}
            icon={Box}
            title="Packed"
          />

          <StatusStep
            active={['picking_dispatch', 'delivered'].includes(order.status)}
            icon={Truck}
            title="Picking & Dispatch"
          />

          <StatusStep
            active={order.status === 'delivered'}
            icon={CheckCircle2}
            title="Delivery Successful"
          />
        </div>
      </div>

      {/* Customer + Payment */}
      <div className="grid gap-6 xl:grid-cols-3">
        <InfoCard icon={User} title="Customer Details">
          <DetailRow icon={User} label="Name" value={customer.name} />
          <DetailRow icon={Mail} label="Email" value={customer.email} />
          <DetailRow icon={Phone} label="Phone" value={customer.phone} />
        </InfoCard>

        <InfoCard icon={MapPin} title="Shipping Address">
          <p className="text-sm font-semibold leading-6 text-gray-700">
            {address || '-'}
          </p>
        </InfoCard>

        <InfoCard icon={CreditCard} title="Payment Details">
          <DetailText label="Method" value={order.payment?.method || '-'} />
          <DetailText label="Status" value={order.payment?.status || '-'} />
          <DetailText label="Transaction" value={order.payment?.transactionId || order.payment?.paymentId || '-'} />
        </InfoCard>
      </div>

      {/* Items */}
      <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50">
            <Package className="h-5 w-5 text-teal-600" />
          </div>

          <div>
            <h2 className="text-lg font-black text-gray-950">
              Purchased Items
            </h2>
            <p className="text-sm text-gray-500">
              Products purchased in this order.
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-100">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-5 py-4 text-left">Product</th>
                <th className="px-5 py-4 text-center">Quantity</th>
                <th className="px-5 py-4 text-right">Price</th>
                <th className="px-5 py-4 text-right">Total</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {(order.items || []).map((item, index) => {
                const name = item.name || item.product?.name || 'Product';
                const image =
                  item.image ||
                  item.product?.images?.[0]?.url ||
                  item.product?.images?.[0] ||
                  null;
                const price = item.price || item.product?.price || 0;
                const qty = item.quantity || 1;
                const total = item.total || qty * price;

                return (
                  <tr key={item._id || index}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {image ? (
                          <img
                            src={image}
                            alt={name}
                            className="h-12 w-12 rounded-xl bg-gray-100 object-cover"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-xl bg-gray-100" />
                        )}

                        <div>
                          <p className="font-black text-gray-950">{name}</p>
                          {item.variantName && (
                            <p className="text-xs text-gray-500">
                              Variant: {item.variantName}
                            </p>
                          )}
                          {item.sku && (
                            <p className="text-xs text-gray-400">
                              SKU: {item.sku}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-center font-bold text-gray-700">
                      {qty}
                    </td>

                    <td className="px-5 py-4 text-right font-bold text-gray-700">
                      {formatCurrency(price)}
                    </td>

                    <td className="px-5 py-4 text-right font-black text-gray-950">
                      {formatCurrency(total)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Price Summary + Timeline */}
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-black text-gray-950">Price Summary</h2>

          <div className="mt-5 space-y-3">
            <PriceRow label="Subtotal" value={order.subtotal} />
            <PriceRow label="Discount" value={-(order.discountAmount || 0)} />
            <PriceRow label="Shipping" value={order.shippingCharge} />
            <PriceRow label={`GST (${order.taxRate || 0}%)`} value={order.taxAmount} />

            <div className="border-t border-gray-100 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-black text-gray-950">
                  Grand Total
                </span>
                <span className="text-2xl font-black text-emerald-600">
                  {formatCurrency(order.total)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-black text-gray-950">Status Timeline</h2>

          <div className="mt-5 space-y-4">
            {(order.orderStatusHistory || []).length === 0 ? (
              <p className="text-sm text-gray-500">No status history found.</p>
            ) : (
              order.orderStatusHistory.map((history, index) => (
                <div key={history._id || index} className="flex gap-3">
                  <div className="mt-1 h-3 w-3 rounded-full bg-slate-950" />
                  <div>
                    <p className="text-sm font-black text-gray-950">
                      {statusLabel[history.status] || history.status}
                    </p>
                    <p className="text-sm text-gray-500">
                      {history.message || '-'}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      {formatDateTime(history.createdAt)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusStep({ active, icon: Icon, title }) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        active
          ? 'border-green-200 bg-green-50'
          : 'border-gray-100 bg-gray-50'
      }`}
    >
      <div
        className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${
          active ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'
        }`}
      >
        <Icon className="h-5 w-5" />
      </div>

      <p
        className={`text-sm font-black ${
          active ? 'text-green-700' : 'text-gray-500'
        }`}
      >
        {title}
      </p>
    </div>
  );
}

function InfoCard({ icon: Icon, title, children }) {
  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gray-50">
          <Icon className="h-5 w-5 text-gray-600" />
        </div>

        <h2 className="text-lg font-black text-gray-950">{title}</h2>
      </div>

      <div className="space-y-3">{children}</div>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <Icon className="h-4 w-4 text-gray-400" />
      <span className="font-bold text-gray-500">{label}:</span>
      <span className="font-semibold text-gray-800">{value}</span>
    </div>
  );
}

function DetailText({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="font-bold text-gray-500">{label}</span>
      <span className="text-right font-semibold text-gray-800">{value}</span>
    </div>
  );
}

function PriceRow({ label, value }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="font-semibold text-gray-500">{label}</span>
      <span className="font-black text-gray-950">{formatCurrency(value)}</span>
    </div>
  );
}