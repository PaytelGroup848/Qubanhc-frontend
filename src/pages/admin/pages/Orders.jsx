import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, Eye, Loader2, Search } from 'lucide-react';
import toast from 'react-hot-toast';

import { adminService } from '../../../services/admin';
import { invoiceService } from '../../../services/invoice';

import {
  StatusBadge,
  SkeletonTable,
  ErrorState,
  PaginationFooter,
} from '../../../components/shared';

import InvoiceTemplate from '../../../components/invoice/invoiceTemplate';
import { downloadInvoicePdf } from '../../../utils/downloadInvoicePdf';

export default function Orders() {
  const invoiceRef = useRef(null);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingInvoiceId, setDownloadingInvoiceId] = useState(null);
  const [invoiceData, setInvoiceData] = useState(null);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const response = await adminService.getAllOrders();

      const payload = response?.data || response;
      const fetchedOrders =
        payload?.orders ||
        payload?.data?.orders ||
        [];

      setOrders(Array.isArray(fetchedOrders) ? fetchedOrders : []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = async (order) => {
    try {
      setDownloadingInvoiceId(order._id);

      // 1. Backend me invoice record generate/save hoga.
      await invoiceService.generateInvoice(order._id);

      // 2. Invoice + populated order + settings JSON fetch hoga.
      const response = await invoiceService.getInvoiceByOrder(order._id);

      const payload = response?.data || response;
      const invoice = payload?.invoice || payload?.data?.invoice;
      const settings = payload?.settings || payload?.data?.settings || {};
      const populatedOrder = invoice?.order || order;

      if (!invoice) {
        throw new Error('Invoice data not found');
      }

      setInvoiceData({
        invoice,
        order: populatedOrder,
        settings,
      });

      // React ko hidden invoice render karne ka time dete hain.
      setTimeout(async () => {
        try {
          await downloadInvoicePdf(
            invoiceRef.current,
            `${invoice.invoiceNumber || order.orderId || 'invoice'}.pdf`
          );

          toast.success('Invoice downloaded successfully');
        } catch (downloadError) {
          console.error('PDF download error:', downloadError);
          toast.error('Failed to download invoice');
        } finally {
          setInvoiceData(null);
        }
      }, 300);
    } catch (err) {
      console.error('Invoice error:', err);
      toast.error(err?.response?.data?.message || err.message || 'Failed to generate invoice');
    } finally {
      setDownloadingInvoiceId(null);
    }
  };

  const filtered = orders.filter((order) => {
    const query = search.trim().toLowerCase();

    if (!query) return true;

    const orderId = String(order.orderId || '').toLowerCase();
    const customerName = String(
      order.customerName || order.user?.name || ''
    ).toLowerCase();
    const customerEmail = String(
      order.customerEmail || order.user?.email || ''
    ).toLowerCase();

    return (
      orderId.includes(query) ||
      customerName.includes(query) ||
      customerEmail.includes(query)
    );
  });

  if (loading) return <SkeletonTable />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="space-y-6">
      {/* Hidden invoice render for PDF */}
      {invoiceData && (
        <div className="fixed left-[-9999px] top-0 z-[-1]">
          <div ref={invoiceRef}>
            <InvoiceTemplate
              invoice={invoiceData.invoice}
              order={invoiceData.order}
              settings={invoiceData.settings}
            />
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:flex-row sm:items-end">
        <div>
          <div className="mb-2 inline-flex rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700">
            Admin Orders
          </div>

          <h1 className="text-2xl font-black text-gray-950 sm:text-3xl">
            Orders
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            View, manage and download frontend-generated invoices.
          </p>
        </div>

        <div className="rounded-2xl bg-gray-50 px-4 py-3 text-sm">
          <span className="font-semibold text-gray-500">Total Orders:</span>{' '}
          <span className="font-black text-gray-950">{orders.length}</span>
        </div>
      </div>

      {/* Search */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search by order ID, customer or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm font-medium outline-none transition focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-100"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-6 py-4 text-left">Order ID</th>
                <th className="px-6 py-4 text-left">Customer</th>
                <th className="px-6 py-4 text-center">Amount</th>
                <th className="px-6 py-4 text-center">Order Status</th>
                <th className="px-6 py-4 text-center">Payment</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-14 text-center text-gray-500"
                  >
                    No orders found.
                  </td>
                </tr>
              ) : (
                filtered.map((order) => {
                  const isPaid = order.payment?.status === 'paid';
                  const isDownloading = downloadingInvoiceId === order._id;

                  return (
                    <tr key={order._id} className="transition hover:bg-gray-50">
                      <td className="px-6 py-5">
                        <div className="font-black text-gray-950">
                          #{order.orderId}
                        </div>
                        <div className="mt-1 text-xs text-gray-400">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString('en-IN')
                            : '-'}
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div className="font-semibold text-gray-900">
                          {order.customerName || order.user?.name || '-'}
                        </div>

                        <div className="mt-1 text-xs text-gray-400">
                          {order.customerEmail || order.user?.email || '-'}
                        </div>
                      </td>

                      <td className="px-6 py-5 text-center">
                        <span className="font-black text-gray-950">
                          ₹{Number(order.total || 0).toLocaleString('en-IN')}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-center">
                        <StatusBadge status={order.status} />
                      </td>

                      <td className="px-6 py-5 text-center">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${isPaid
                            ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                            : 'bg-amber-50 text-amber-700 ring-1 ring-amber-200'
                            }`}
                        >
                          {order.payment?.status || 'pending'}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-right">
                        <div className="flex justify-end gap-2">
                          <Link
                            to={`/admin/orders/${order._id}`}
                            className="text-teal-600 hover:text-teal-800 text-xs font-medium"
                          >
                            View
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleDownloadInvoice(order)}
                            disabled={!isPaid || isDownloading}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-950 px-3 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-gray-300"
                          >
                            {isDownloading ? (
                              <>
                                <Loader2 size={14} className="animate-spin" />
                                Preparing...
                              </>
                            ) : (
                              <>
                                <Link
                                  to={`/admin/orders/${order._id}/invoice`}
                                  className="rounded-xl bg-slate-950 px-3 py-2 text-xs font-bold text-white"
                                >
                                  Invoice
                                </Link>
                              </>
                            )}
                          </button>
                        </div>

                        {!isPaid && (
                          <p className="mt-1 text-xs text-gray-400">
                            Invoice available after payment
                          </p>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <PaginationFooter total={orders.length} shown={filtered.length} />
      </div>
    </div>
  );
}