import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { adminService } from "../../../services/admin";
import { StatusBadge } from "../../../components/shared";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { IndianRupee, ShoppingCart } from "lucide-react";

const COLORS = ["#4f46e5", "#0ea5e9", "#64748b", "#94a3b8"];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topVendors, setTopVendors] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [orderStatusData, setOrderStatusData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await adminService.getDashboardStats();
      setStats(response.data.stats);
      setRecentOrders(response.data.recentOrders || []);
      setTopVendors(response.data.topVendors || []);
      setRevenueData(response.data.revenueChart || []);
      setOrderStatusData(response.data.orderStatus || []);
    } catch (err) {
      console.error("Error fetching dashboard:", err);
      setError("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <DashboardSkeleton />;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!stats) return null;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back, Super Admin</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard
          title="Total Revenue"
          value={`₹${stats.totalRevenue?.toLocaleString() || 0}`}
          change="+12%"
          icon={<IndianRupee className="text-yellow-600" />}
        />
        <KpiCard
          title="Total Orders"
          value={stats.totalOrders || 0}
          change="+8%"
          icon={<ShoppingCart />}
        />
        <KpiCard
          title="Active Vendors"
          value={stats.activeVendors || 0}
          change="+5%"
          icon="🏪"
        />
        <KpiCard
          title="Customers"
          value={stats.totalCustomers || 0}
          change="+15%"
          icon="👥"
        />
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        <Link
          to="/admin/products/create"
          className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50"
        >
          + New Product
        </Link>
        <Link
          to="/admin/coupons/new"
          className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50"
        >
          + New Coupon
        </Link>
        <Link
          to="/admin/categories/new"
          className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50"
        >
          + New Category
        </Link>
        <Link
          to="/admin/sub-admins/create"
          className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50"
        >
          + Add Sub‑Admin
        </Link>
        <Link
          to="/admin/vendors/create"
          className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50"
        >
          + Add Vendor
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Revenue Trend
            </h2>
            <Link
              to="/admin/reports"
              className="text-sm text-indigo-600 hover:underline"
            >
              View Reports
            </Link>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip formatter={(value) => `₹${value?.toLocaleString()}`} />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#4f46e5"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Order Status
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={orderStatusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {orderStatusData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OrdersTable orders={recentOrders} />
        <TopVendorsList vendors={topVendors} />
      </div>
    </div>
  );
}

function KpiCard({ title, value, change, icon }) {
  const isPositive = change?.startsWith("+");
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full ${isPositive ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-600"}`}
        >
          {change}
        </span>
      </div>
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  );
}

function OrdersTable({ orders }) {
  if (!orders?.length)
    return (
      <div className="bg-white rounded-xl p-6 text-center text-gray-500">
        No recent orders
      </div>
    );
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
        <Link
          to="/admin/orders"
          className="text-sm text-indigo-600 hover:underline"
        >
          View all
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="pb-2">Order ID</th>
              <th className="pb-2">Customer</th>
              <th className="pb-2">Amount</th>
              <th className="pb-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => (
              <tr key={idx} className="border-b last:border-0 hover:bg-gray-50">
                <td className="py-2 font-medium">#{order.orderId}</td>
                <td className="py-2">
                  <div>{order.customerName}</div>
                  <div className="text-xs text-gray-400">
                    {order.customerEmail}
                  </div>
                </td>
                <td className="py-2">₹{order.amount?.toLocaleString()}</td>
                <td className="py-2">
                  <StatusBadge status={order.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TopVendorsList({ vendors }) {
  if (!vendors?.length)
    return (
      <div className="bg-white rounded-xl p-6 text-center text-gray-500">
        No vendors yet
      </div>
    );
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Top Vendors</h2>
        <Link
          to="/admin/vendors"
          className="text-sm text-indigo-600 hover:underline"
        >
          View all
        </Link>
      </div>
      <ul className="space-y-4">
        {vendors.map((vendor, idx) => (
          <li key={idx} className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">{vendor.name}</p>
              <p className="text-xs text-gray-500">
                {vendor.products} products
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold">
                ₹{vendor.revenue?.toLocaleString()}
              </p>
              <span className="text-xs text-emerald-600">{vendor.growth}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="h-8 bg-gray-200 rounded w-1/3" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-xl border border-gray-100"
          >
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
            <div className="h-8 bg-gray-200 rounded w-1/2" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-80 bg-gray-200 rounded-xl" />
        <div className="h-80 bg-gray-200 rounded-xl" />
      </div>
    </div>
  );
}
