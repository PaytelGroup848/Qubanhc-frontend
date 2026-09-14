import { useState, useMemo } from 'react';
import useApi from '../../../hooks/admin/useApi';
import { couponsList } from '../../Data';
import { StatusBadge, SkeletonTable, ErrorState, PaginationFooter } from '../../../components/shared';
import { Link } from 'react-router-dom';

export default function Coupons() {
  const { data, loading, error } = useApi('/admin/coupons', couponsList);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'Enable' | 'Disable'
  const [freeShippingFilter, setFreeShippingFilter] = useState('all'); // 'all' | 'Yes' | 'No'
  const [selectedIds, setSelectedIds] = useState([]);

  // Derived filtered data
  const filtered = useMemo(() => {
    if (!data) return [];
    return data.filter(coupon => {
      const matchesSearch =
        coupon.code.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' || coupon.status === statusFilter;
      const matchesFreeShipping =
        freeShippingFilter === 'all' || coupon.freeShipping === freeShippingFilter;
      return matchesSearch && matchesStatus && matchesFreeShipping;
    });
  }, [data, search, statusFilter, freeShippingFilter]);

  // Clear all filters
  const clearFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setFreeShippingFilter('all');
  };

  // Select / deselect all
  const toggleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map(c => c.id));
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  if (loading) return <SkeletonTable />;
  if (error && !data) return <ErrorState message="Failed to load coupons" />;

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Coupons</h1>
          <p className="text-sm text-gray-500 mt-1">Manage discount and free‑shipping coupons</p>
        </div>
        <Link
          to="/admin/coupons/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 text-sm"
        >
          + Add Coupon
        </Link>
      </div>

      {/* Filters Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <input
            type="text"
            placeholder="Search coupon code..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full sm:w-64 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
          >
            <option value="all">All Status</option>
            <option value="Enable">Enable</option>
            <option value="Disable">Disable</option>
          </select>

          {/* Free Shipping Filter */}
          <select
            value={freeShippingFilter}
            onChange={e => setFreeShippingFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
          >
            <option value="all">Free Shipping: All</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        <button
          onClick={clearFilters}
          className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors text-sm"
        >
          Clear Filters
        </button>
      </div>

      {/* Bulk actions (appear when something selected) */}
      {selectedIds.length > 0 && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-4 text-sm">
          <span className="text-green-800">{selectedIds.length} selected</span>
          <button className="text-red-600 hover:underline">Delete Selected</button>
          <button className="text-green-700 hover:underline">Enable</button>
          <button className="text-yellow-700 hover:underline">Disable</button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 text-left w-10">
                  <input
                    type="checkbox"
                    onChange={toggleSelectAll}
                    checked={selectedIds.length === filtered.length && filtered.length > 0}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                </th>
                <th className="px-6 py-3 text-left">Coupon Code</th>
                <th className="px-6 py-3 text-left">Start Date</th>
                <th className="px-6 py-3 text-left">End Date</th>
                <th className="px-6 py-3 text-center">Status</th>
                <th className="px-6 py-3 text-center">Free Shipping</th>
                <th className="px-6 py-3 text-center">Used Time</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    No coupons found.
                  </td>
                </tr>
              ) : (
                filtered.map(coupon => (
                  <tr key={coupon.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(coupon.id)}
                        onChange={() => toggleSelect(coupon.id)}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{coupon.code}</td>
                    <td className="px-6 py-4">{coupon.startDate}</td>
                    <td className="px-6 py-4">{coupon.endDate}</td>
                    <td className="px-6 py-4 text-center">
                      <StatusBadge status={coupon.status} />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        coupon.freeShipping === 'Yes'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {coupon.freeShipping}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">{coupon.usedTime}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button className="text-green-600 hover:text-green-800 text-xs font-medium">Edit</button>
                      <button className="text-red-500 hover:text-red-700 text-xs font-medium">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <PaginationFooter total={data.length} shown={filtered.length} />
      </div>
    </div>
  );
}