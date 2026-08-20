import { useCallback, useEffect, useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { orderService } from '../../../../services/order';
import Pagination from '../../../../components/Pagination';
import OrderCard from './orderCard';

export default function OrdersTab() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 8,
    total: 0,
    totalPages: 1,
  });

  const fetchOrders = useCallback(async (p = 1) => {
    try {
      setLoading(true);

      const res = await orderService.getMyOrders(p, 8);

      setOrders(res.data?.orders || []);
      const meta = res.data?.pagination || {};
      setPagination({
        page: meta.page || p,
        limit: meta.limit || 8,
        total: meta.total || (res.data?.orders || []).length,
        totalPages: meta.pages || 1,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders(page);
  }, [page, fetchOrders]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-teal-600 border-t-transparent" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="h-20 w-20 rounded-3xl bg-slate-100 flex items-center justify-center mb-5">
          <ShoppingBag className="h-9 w-9 text-slate-400" />
        </div>

        <h3 className="text-lg font-black text-slate-900">No orders yet</h3>

        <p className="text-sm text-slate-500 mt-1">
          Your orders will appear here once you shop.
        </p>

        <Link
          to="/categories"
          className="mt-5 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-teal-700"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-xl font-black text-slate-900">My Orders</h2>
        <p className="text-sm text-slate-500 mt-1">
          Track orders, view details, and download invoices.
        </p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <OrderCard key={order._id} order={order} />
        ))}
      </div>

      <Pagination
        className="mt-6"
        page={pagination.page}
        totalPages={pagination.totalPages}
        total={pagination.total}
        limit={pagination.limit}
        onPageChange={setPage}
      />
    </div>
  );
}