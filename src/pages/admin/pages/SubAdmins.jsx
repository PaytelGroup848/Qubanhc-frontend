import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminService } from '../../../services/admin';
import { StatusBadge, SkeletonTable, ErrorState, PaginationFooter } from '../../../components/shared';
import toast from 'react-hot-toast';
import { Search, Plus, Trash2, Eye } from 'lucide-react';

export default function SubAdmins() {
  const navigate = useNavigate();
  const [subAdmins, setSubAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    fetchSubAdmins();
  }, []);

  const fetchSubAdmins = async () => {
    try {
      setLoading(true);
      const response = await adminService.getUsers();
      const allUsers = response.data.users || [];
      const adminUsers = allUsers.filter(u => u.role === 'sub_admin');
      setSubAdmins(adminUsers);
    } catch (err) {
      console.error('Error fetching sub-admins:', err);
      setError('Failed to load sub-admins');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this sub-admin?')) return;
    try {
      await adminService.deleteUser(id);
      toast.success('Sub-admin deleted successfully');
      await fetchSubAdmins();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete sub-admin');
    }
  };


  const handleAddNew = () => {
    navigate('/admin/sub-admins/create');
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map(s => s._id));
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const filtered = subAdmins.filter(s =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <SkeletonTable />;
  if (error) return <ErrorState message={error} />;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sub‑Admins</h1>
          <p className="text-sm text-gray-500 mt-1">Manage all admin accounts</p>
        </div>
        <button
          onClick={handleAddNew}
          className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors text-sm"
        >
          <Plus className="w-4 h-4" /> Add Sub‑Admin
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search sub‑admins..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
          />
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <div className="mb-4 p-3 bg-teal-50 border border-teal-200 rounded-lg flex items-center gap-4 text-sm">
          <span className="text-teal-800 font-medium">{selectedIds.length} selected</span>
          <button className="text-red-600 hover:underline">Delete Selected</button>
          <button className="text-green-700 hover:underline">Activate</button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 w-10">
                  <input
                    type="checkbox"
                    onChange={toggleSelectAll}
                    checked={selectedIds.length === filtered.length && filtered.length > 0}
                    className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                  />
                </th>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Phone</th>
                <th className="px-6 py-3 text-center">Status</th>
                <th className="px-6 py-3 text-center">Permissions</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No sub-admins found.
                  </td>
                </tr>
              ) : (
                filtered.map(sub => (
                  <tr key={sub._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(sub._id)}
                        onChange={() => toggleSelect(sub._id)}
                        className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                      />
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{sub.name}</td>
                    <td className="px-6 py-4 text-gray-600">{sub.email}</td>
                    <td className="px-6 py-4 text-gray-600">{sub.phone || '-'}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        sub.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-wrap justify-center gap-1">
                        {sub.permissions?.slice(0, 3).map((perm, idx) => (
                          <span key={idx} className="px-1.5 py-0.5 bg-blue-50 text-blue-600 text-[10px] rounded">
                            {perm}
                          </span>
                        ))}
                        {sub.permissions?.length > 3 && (
                          <span className="text-xs text-gray-400">+{sub.permissions.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleDelete(sub._id)}
                        className="text-red-500 hover:text-red-700 text-xs font-medium transition-colors inline-flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <PaginationFooter total={subAdmins.length} shown={filtered.length} />
      </div>
    </div>
  );
}