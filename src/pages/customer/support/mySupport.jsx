import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  FileQuestion,
  Loader2,
  MessageSquare,
  Plus,
  RefreshCw,
  Search,
  Send,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';

import supportService from '../../../services/support';
import Pagination, { extractPagination } from '../../../components/Pagination';

const CATEGORY_OPTIONS = [
  { value: 'order', label: 'Order Issue' },
  { value: 'payment', label: 'Payment Issue' },
  { value: 'refund', label: 'Refund Issue' },
  { value: 'delivery', label: 'Delivery Issue' },
  { value: 'product', label: 'Product Issue' },
  { value: 'account', label: 'Account Issue' },
  { value: 'technical', label: 'Technical Issue' },
  { value: 'other', label: 'Other' },
];

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

const STATUS_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
];

const statusStyle = {
  open: 'bg-blue-50 text-blue-700 ring-blue-200',
  in_progress: 'bg-yellow-50 text-yellow-700 ring-yellow-200',
  resolved: 'bg-green-50 text-green-700 ring-green-200',
  closed: 'bg-gray-50 text-gray-700 ring-gray-200',
};

const priorityStyle = {
  low: 'bg-gray-50 text-gray-700 ring-gray-200',
  medium: 'bg-blue-50 text-blue-700 ring-blue-200',
  high: 'bg-orange-50 text-orange-700 ring-orange-200',
  urgent: 'bg-red-50 text-red-700 ring-red-200',
};

function extractPayload(response) {
  const root = response || {};
  if (root?.data?.data) return root.data.data;
  if (root?.data) return root.data;
  return root;
}

function formatDate(date) {
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
}

export default function MySupport() {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
  });

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  const [filters, setFilters] = useState({
    search: '',
    status: '',
    page: 1,
    limit: 10,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const [form, setForm] = useState({
    subject: '',
    category: 'other',
    priority: 'medium',
    message: '',
  });

  useEffect(() => {
    fetchTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.status, filters.page]);

  const filteredStats = useMemo(() => {
    const total = tickets.length;
    const open = tickets.filter((ticket) => ticket.status === 'open').length;
    const inProgress = tickets.filter(
      (ticket) => ticket.status === 'in_progress'
    ).length;
    const resolved = tickets.filter((ticket) => ticket.status === 'resolved').length;

    return {
      total,
      open,
      inProgress,
      resolved,
    };
  }, [tickets]);

  useEffect(() => {
    setStats(filteredStats);
  }, [filteredStats]);

  const fetchTickets = async () => {
    try {
      setLoading(true);

      const response = await supportService.getMyTickets(filters);
      const payload = extractPayload(response);

      setTickets(Array.isArray(payload?.tickets) ? payload.tickets : []);
      setPagination(
        extractPagination(payload, {
          page: filters.page,
          limit: filters.limit,
          total: Array.isArray(payload?.tickets) ? payload.tickets.length : 0,
        }),
      );
    } catch (error) {
      console.error('My support fetch error:', error);
      toast.error(error?.response?.data?.message || 'Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setFilters((prev) => ({ ...prev, page: 1 }));
  };

  const validateForm = () => {
    if (form.subject.trim().length < 5) {
      return 'Subject must be at least 5 characters.';
    }

    if (form.message.trim().length < 5) {
      return 'Message must be at least 5 characters.';
    }

    if (!CATEGORY_OPTIONS.some((item) => item.value === form.category)) {
      return 'Please select a valid category.';
    }

    if (!PRIORITY_OPTIONS.some((item) => item.value === form.priority)) {
      return 'Please select a valid priority.';
    }

    return '';
  };

  const createTicket = async (event) => {
    event.preventDefault();

    const errorMessage = validateForm();

    if (errorMessage) {
      toast.error(errorMessage);
      return;
    }

    try {
      setCreating(true);

      const response = await supportService.createTicket({
        subject: form.subject.trim(),
        category: form.category,
        priority: form.priority,
        message: form.message.trim(),
      });

      const payload = extractPayload(response);
      const newTicket = payload?.ticket;

      if (newTicket) {
        setTickets((prev) => [newTicket, ...prev]);
      } else {
        await fetchTickets();
      }

      setForm({
        subject: '',
        category: 'other',
        priority: 'medium',
        message: '',
      });

      setShowCreate(false);

      toast.success('Support ticket created successfully');
    } catch (error) {
      console.error('Create ticket error:', error);
      toast.error(error?.response?.data?.message || 'Failed to create ticket');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50/30 to-emerald-50/40 px-4 py-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-wider text-teal-600">
              Help Center
            </p>

            <h1 className="text-3xl font-black text-gray-950">
              My Support Tickets
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Create and track your support requests.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={fetchTickets}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm font-black text-gray-700 hover:bg-gray-50"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>

            <button
              type="button"
              onClick={() => setShowCreate(true)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-teal-600 px-5 py-3 text-sm font-black text-white hover:bg-teal-700"
            >
              <Plus className="h-4 w-4" />
              New Ticket
            </button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={MessageSquare} title="Total" value={stats.total} />
          <StatCard icon={AlertCircle} title="Open" value={stats.open} />
          <StatCard icon={Clock} title="In Progress" value={stats.inProgress} />
          <StatCard icon={CheckCircle2} title="Resolved" value={stats.resolved} />
        </div>

        <div className="rounded-3xl border border-white bg-white p-5 shadow-xl shadow-teal-100/40">
          <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
            <div className="relative">
              <Search className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />

              <input
                value={filters.search}
                onChange={(event) =>
                  setFilters((prev) => ({
                    ...prev,
                    search: event.target.value,
                  }))
                }
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    handleSearch();
                  }
                }}
                placeholder="Search by subject or ticket id..."
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm font-semibold outline-none focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-100"
              />
            </div>

            <select
              value={filters.status}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  status: event.target.value,
                  page: 1,
                }))
              }
              className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-bold outline-none"
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={handleSearch}
              className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white hover:bg-slate-800"
            >
              Search
            </button>
          </div>

          <div className="mt-5 space-y-3">
            {loading ? (
              <div className="flex h-48 items-center justify-center">
                <Loader2 className="h-7 w-7 animate-spin text-gray-400" />
              </div>
            ) : tickets.length === 0 ? (
              <div className="rounded-3xl bg-gray-50 p-10 text-center">
                <FileQuestion className="mx-auto h-12 w-12 text-gray-300" />

                <h2 className="mt-4 text-lg font-black text-gray-900">
                  No support tickets yet
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Create your first ticket and our support team will help you.
                </p>

                <button
                  type="button"
                  onClick={() => setShowCreate(true)}
                  className="mt-5 inline-flex items-center justify-center gap-2 rounded-2xl bg-teal-600 px-5 py-3 text-sm font-black text-white hover:bg-teal-700"
                >
                  <Plus className="h-4 w-4" />
                  Create Ticket
                </button>
              </div>
            ) : (
              tickets.map((ticket) => (
                <Link
                  key={ticket._id}
                  to={`/account/support/${ticket._id}`}
                  className="block rounded-3xl border border-gray-100 bg-white p-5 transition hover:border-teal-300 hover:bg-teal-50/40"
                >
                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                    <div>
                      <p className="text-xs font-black uppercase tracking-wider text-gray-400">
                        #{ticket.ticketId}
                      </p>

                      <h3 className="mt-1 text-lg font-black text-gray-950">
                        {ticket.subject}
                      </h3>

                      <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                        {ticket.messages?.[ticket.messages.length - 1]?.message ||
                          'No message'}
                      </p>

                      <p className="mt-3 text-xs font-semibold text-gray-400">
                        Last update: {formatDate(ticket.lastMessageAt || ticket.updatedAt)}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 md:justify-end">
                      <Badge className={statusStyle[ticket.status]}>
                        {String(ticket.status || '').replace('_', ' ')}
                      </Badge>

                      <Badge className={priorityStyle[ticket.priority]}>
                        {ticket.priority}
                      </Badge>

                      <Badge className="bg-gray-50 text-gray-600 ring-gray-200">
                        {ticket.category}
                      </Badge>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>

          <Pagination
            className="mt-5"
            page={pagination.page}
            totalPages={pagination.totalPages}
            total={pagination.total}
            limit={pagination.limit}
            onPageChange={(nextPage) =>
              setFilters((prev) => ({ ...prev, page: nextPage }))
            }
          />
        </div>
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-gray-950">
                  Create Support Ticket
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Tell us your issue. Admin support team will reply soon.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={createTicket} className="space-y-4">
              <div>
                <label className="text-sm font-black text-gray-700">
                  Subject
                </label>

                <input
                  value={form.subject}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      subject: event.target.value,
                    }))
                  }
                  placeholder="Example: Payment successful but order not confirmed"
                  className="mt-1.5 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold outline-none focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-100"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-black text-gray-700">
                    Category
                  </label>

                  <select
                    value={form.category}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        category: event.target.value,
                      }))
                    }
                    className="mt-1.5 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-bold outline-none focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-100"
                  >
                    {CATEGORY_OPTIONS.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-black text-gray-700">
                    Priority
                  </label>

                  <select
                    value={form.priority}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        priority: event.target.value,
                      }))
                    }
                    className="mt-1.5 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-bold outline-none focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-100"
                  >
                    {PRIORITY_OPTIONS.map((priority) => (
                      <option key={priority.value} value={priority.value}>
                        {priority.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-black text-gray-700">
                  Message
                </label>

                <textarea
                  value={form.message}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      message: event.target.value,
                    }))
                  }
                  rows={5}
                  placeholder="Describe your issue clearly..."
                  className="mt-1.5 w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold outline-none focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-100"
                />
              </div>

              <button
                type="submit"
                disabled={creating}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-teal-600 px-5 py-4 text-sm font-black text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {creating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating Ticket...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Create Ticket
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, title, value }) {
  return (
    <div className="rounded-3xl border border-white bg-white p-5 shadow-xl shadow-teal-100/40">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50">
        <Icon className="h-5 w-5 text-teal-600" />
      </div>

      <p className="mt-4 text-sm font-bold text-gray-500">{title}</p>
      <p className="mt-1 text-2xl font-black text-gray-950">{value}</p>
    </div>
  );
}

function Badge({ children, className }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-[11px] font-black uppercase ring-1 ${className}`}
    >
      {children}
    </span>
  );
}