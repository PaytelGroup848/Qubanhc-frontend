import { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Loader2,
  MessageSquare,
  RefreshCw,
  Search,
  Trash2,
  User,
} from 'lucide-react';
import toast from 'react-hot-toast';

import { adminService } from '../../../services/admin';

const STATUS_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
];

const PRIORITY_OPTIONS = [
  { value: '', label: 'All Priority' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

const statusClass = {
  open: 'bg-blue-50 text-blue-700 ring-blue-200',
  in_progress: 'bg-yellow-50 text-yellow-700 ring-yellow-200',
  resolved: 'bg-green-50 text-green-700 ring-green-200',
  closed: 'bg-gray-50 text-gray-700 ring-gray-200',
};

const priorityClass = {
  low: 'bg-gray-50 text-gray-700 ring-gray-200',
  medium: 'bg-blue-50 text-blue-700 ring-blue-200',
  high: 'bg-orange-50 text-orange-700 ring-orange-200',
  urgent: 'bg-red-50 text-red-700 ring-red-200',
};

function extractApiPayload(response) {
  const root = response || {};

  // Case 1: axios full response
  if (root?.data?.data) return root.data.data;

  // Case 2: adminService already returns response.data
  if (root?.data) return root.data;

  // Case 3: direct payload
  return root;
}

export default function Support() {
  const [stats, setStats] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const [loading, setLoading] = useState(true);
  const [ticketLoading, setTicketLoading] = useState(false);
  const [replyLoading, setReplyLoading] = useState(false);

  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: '',
    page: 1,
    limit: 10,
  });

  const [reply, setReply] = useState('');
  const [internalNote, setInternalNote] = useState(false);

 const fetchAll = async () => {
  try {
    setLoading(true);

    const [statsRes, ticketRes] = await Promise.all([
      adminService.getSupportStats(),
      adminService.getSupportTickets(filters),
    ]);
    const statsPayload = extractApiPayload(statsRes);
    const ticketPayload = extractApiPayload(ticketRes);

    setStats(statsPayload?.stats || null);
    setTickets(Array.isArray(ticketPayload?.tickets) ? ticketPayload.tickets : []);
  } catch (error) {
    console.error('Support fetch error:', error);
    toast.error(error?.response?.data?.message || 'Failed to fetch support tickets');
  } finally {
    setLoading(false);
  }
};

  const visibleMessages = useMemo(() => {
    return selectedTicket?.messages || [];
  }, [selectedTicket]);



  const handleSearch = async () => {
  try {
    setLoading(true);

    const ticketRes = await adminService.getSupportTickets({
      ...filters,
      page: 1,
    });
    const ticketPayload = extractApiPayload(ticketRes);

    setTickets(Array.isArray(ticketPayload?.tickets) ? ticketPayload.tickets : []);
  } catch (error) {
    console.error('Support search error:', error);
    toast.error(error?.response?.data?.message || 'Search failed');
  } finally {
    setLoading(false);
  }
};

 const openTicket = async (ticket) => {
  try {
    setTicketLoading(true);

    const response = await adminService.getSupportTicketById(ticket._id);

    const payload = extractApiPayload(response);

    setSelectedTicket(payload?.ticket || null);
  } catch (error) {
    console.error('Open ticket error:', error);
    toast.error(error?.response?.data?.message || 'Failed to open ticket');
  } finally {
    setTicketLoading(false);
  }
};

  const updateTicket = async (id, data) => {
  try {
    const response = await adminService.updateSupportTicket(id, data);

    const payload = extractApiPayload(response);
    const updatedTicket = payload?.ticket;

    if (updatedTicket) {
      setSelectedTicket(updatedTicket);

      setTickets((prev) =>
        prev.map((ticket) =>
          ticket._id === updatedTicket._id ? updatedTicket : ticket
        )
      );
    }

    toast.success('Ticket updated');
  } catch (error) {
    console.error('Update ticket error:', error);
    toast.error(error?.response?.data?.message || 'Update failed');
  }
};

const sendReply = async () => {
  try {
    if (!reply.trim()) {
      toast.error('Reply message is required');
      return;
    }

    setReplyLoading(true);

    const response = await adminService.replySupportTicket(selectedTicket._id, {
      message: reply.trim(),
      isInternalNote: internalNote,
    });

    const payload = extractApiPayload(response);
    const updatedTicket = payload?.ticket;

    if (!updatedTicket) {
      toast.error('Reply sent but updated ticket not found');
      return;
    }

    setSelectedTicket(updatedTicket);
    setReply('');
    setInternalNote(false);

    setTickets((prev) =>
      prev.map((ticket) =>
        ticket._id === updatedTicket._id ? updatedTicket : ticket
      )
    );

    toast.success('Reply sent');
  } catch (error) {
    console.error('Reply error:', error);
    toast.error(error?.response?.data?.message || 'Reply failed');
  } finally {
    setReplyLoading(false);
  }
};

  const deleteTicket = async (id) => {
    const ok = window.confirm('Are you sure you want to delete this ticket?');
    if (!ok) return;

    try {
      await adminService.deleteSupportTicket(id);

      setTickets((prev) => prev.filter((ticket) => ticket._id !== id));

      if (selectedTicket?._id === id) {
        setSelectedTicket(null);
      }

      toast.success('Ticket deleted');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <p className="text-sm font-black uppercase tracking-wider text-teal-600">
            Admin Support
          </p>
          <h1 className="text-3xl font-black text-gray-950">
            Support Tickets
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage customer complaints, payment issues, refunds and order queries.
          </p>
        </div>

        <button
          onClick={fetchAll}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white hover:bg-slate-800"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <StatCard icon={MessageSquare} title="Total" value={stats?.total || 0} />
        <StatCard icon={AlertCircle} title="Open" value={stats?.open || 0} />
        <StatCard icon={Clock} title="In Progress" value={stats?.inProgress || 0} />
        <StatCard icon={CheckCircle2} title="Resolved" value={stats?.resolved || 0} />
        <StatCard icon={AlertCircle} title="Urgent" value={stats?.urgent || 0} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1.1fr]">
        <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto_auto]">
            <div className="relative">
              <Search className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
              <input
                value={filters.search}
                onChange={(event) =>
                  setFilters((prev) => ({ ...prev, search: event.target.value }))
                }
                onKeyDown={(event) => {
                  if (event.key === 'Enter') handleSearch();
                }}
                placeholder="Search ticket id or subject..."
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
              {STATUS_OPTIONS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>

            <select
              value={filters.priority}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  priority: event.target.value,
                  page: 1,
                }))
              }
              className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-bold outline-none"
            >
              {PRIORITY_OPTIONS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>

            <button
              onClick={handleSearch}
              className="rounded-2xl bg-teal-600 px-5 py-3 text-sm font-black text-white hover:bg-teal-700"
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
              <div className="rounded-2xl bg-gray-50 p-8 text-center">
                <p className="font-black text-gray-800">No tickets found</p>
                <p className="mt-1 text-sm text-gray-500">
                  Support tickets will appear here.
                </p>
              </div>
            ) : (
              tickets.map((ticket) => (
                <button
                  key={ticket._id}
                  onClick={() => openTicket(ticket)}
                  className={`w-full rounded-2xl border p-4 text-left transition hover:border-teal-300 hover:bg-teal-50/40 ${
                    selectedTicket?._id === ticket._id
                      ? 'border-teal-400 bg-teal-50'
                      : 'border-gray-100 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-black uppercase text-gray-400">
                        #{ticket.ticketId}
                      </p>
                      <h3 className="mt-1 font-black text-gray-950">
                        {ticket.subject}
                      </h3>
                      <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                        <User className="h-3 w-3" />
                        {ticket.user?.name || ticket.user?.email || 'Customer'}
                      </p>
                    </div>

                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        deleteTicket(ticket._id);
                      }}
                      className="rounded-xl p-2 text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge className={statusClass[ticket.status]}>
                      {ticket.status}
                    </Badge>
                    <Badge className={priorityClass[ticket.priority]}>
                      {ticket.priority}
                    </Badge>
                    <Badge className="bg-gray-50 text-gray-600 ring-gray-200">
                      {ticket.category}
                    </Badge>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
          {!selectedTicket ? (
            <div className="flex h-full min-h-[520px] items-center justify-center rounded-2xl bg-gray-50 text-center">
              <div>
                <MessageSquare className="mx-auto h-10 w-10 text-gray-300" />
                <h3 className="mt-4 font-black text-gray-800">
                  Select a ticket
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Open any support ticket to reply or update status.
                </p>
              </div>
            </div>
          ) : ticketLoading ? (
            <div className="flex h-[520px] items-center justify-center">
              <Loader2 className="h-7 w-7 animate-spin text-gray-400" />
            </div>
          ) : (
            <div className="space-y-5">
              <div className="border-b border-gray-100 pb-4">
                <p className="text-xs font-black uppercase text-gray-400">
                  #{selectedTicket.ticketId}
                </p>

                <h2 className="mt-1 text-xl font-black text-gray-950">
                  {selectedTicket.subject}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Customer: {selectedTicket.user?.name || '-'} ·{' '}
                  {selectedTicket.user?.email || '-'}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <select
                  value={selectedTicket.status}
                  onChange={(event) =>
                    updateTicket(selectedTicket._id, {
                      status: event.target.value,
                    })
                  }
                  className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-bold outline-none"
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>

                <select
                  value={selectedTicket.priority}
                  onChange={(event) =>
                    updateTicket(selectedTicket._id, {
                      priority: event.target.value,
                    })
                  }
                  className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-bold outline-none"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div className="max-h-[360px] space-y-3 overflow-y-auto rounded-2xl bg-gray-50 p-4">
                {visibleMessages.map((message) => {
                  const isAdmin = ['super_admin', 'sub_admin', 'admin'].includes(
                    message.senderRole
                  );

                  return (
                    <div
                      key={message._id}
                      className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl p-4 ${
                          message.isInternalNote
                            ? 'bg-yellow-100 text-yellow-900'
                            : isAdmin
                              ? 'bg-slate-950 text-white'
                              : 'bg-white text-gray-800 shadow-sm'
                        }`}
                      >
                        <p className="text-xs font-black opacity-70">
                          {message.isInternalNote
                            ? 'Internal Note'
                            : isAdmin
                              ? 'Support Team'
                              : selectedTicket.user?.name || 'Customer'}
                        </p>

                        <p className="mt-1 whitespace-pre-wrap text-sm leading-6">
                          {message.message}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-3">
                <textarea
                  value={reply}
                  onChange={(event) => setReply(event.target.value)}
                  rows={4}
                  placeholder="Type your reply..."
                  className="w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm font-semibold outline-none focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-100"
                />

                <label className="flex items-center gap-2 text-sm font-bold text-gray-600">
                  <input
                    type="checkbox"
                    checked={internalNote}
                    onChange={(event) => setInternalNote(event.target.checked)}
                    className="accent-teal-600"
                  />
                  Internal note only
                </label>

                <button
                  onClick={sendReply}
                  disabled={replyLoading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-teal-600 px-5 py-3 text-sm font-black text-white hover:bg-teal-700 disabled:opacity-60"
                >
                  {replyLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send Reply'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, title, value }) {
  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
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