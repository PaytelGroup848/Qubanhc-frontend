import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  MessageSquare,
  Send,
  User,
} from 'lucide-react';
import toast from 'react-hot-toast';

import supportService from '../../../services/support';

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

export default function SupportTicketDetail() {
  const { id } = useParams();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyLoading, setReplyLoading] = useState(false);
  const [reply, setReply] = useState('');

  useEffect(() => {
    fetchTicket();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const visibleMessages = useMemo(() => {
    return (ticket?.messages || []).filter((message) => !message.isInternalNote);
  }, [ticket]);

  const fetchTicket = async () => {
    try {
      setLoading(true);

      const response = await supportService.getTicketById(id);
      const payload = extractPayload(response);

      setTicket(payload?.ticket || null);
    } catch (error) {
      console.error('Ticket fetch error:', error);
      toast.error(error?.response?.data?.message || 'Failed to load ticket');
    } finally {
      setLoading(false);
    }
  };

  const sendReply = async () => {
    try {
      if (reply.trim().length < 2) {
        toast.error('Reply message is required');
        return;
      }

      if (ticket?.status === 'closed') {
        toast.error('This ticket is closed');
        return;
      }

      setReplyLoading(true);

      const response = await supportService.replyTicket(ticket._id, {
        message: reply.trim(),
      });

      const payload = extractPayload(response);
      const updatedTicket = payload?.ticket;

      setTicket(updatedTicket);
      setReply('');

      toast.success('Reply sent successfully');
    } catch (error) {
      console.error('Reply error:', error);
      toast.error(error?.response?.data?.message || 'Failed to send reply');
    } finally {
      setReplyLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-10 text-center shadow-sm">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-300" />

          <h1 className="mt-4 text-2xl font-black text-gray-950">
            Ticket not found
          </h1>

          <Link
            to="/account/support"
            className="mt-5 inline-flex rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white"
          >
            Back to Support
          </Link>
        </div>
      </div>
    );
  }

  const isClosed = ticket.status === 'closed';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50/30 to-emerald-50/40 px-4 py-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <Link
          to="/account/support"
          className="inline-flex items-center gap-2 text-sm font-black text-gray-600 hover:text-gray-950"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Support
        </Link>

        <div className="rounded-3xl border border-white bg-white p-6 shadow-xl shadow-teal-100/40">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-gray-400">
                #{ticket.ticketId}
              </p>

              <h1 className="mt-1 text-2xl font-black text-gray-950">
                {ticket.subject}
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Created: {formatDate(ticket.createdAt)}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
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
        </div>

        <div className="rounded-3xl border border-white bg-white p-5 shadow-xl shadow-teal-100/40">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50">
              <MessageSquare className="h-5 w-5 text-teal-600" />
            </div>

            <div>
              <h2 className="font-black text-gray-950">Conversation</h2>
              <p className="text-xs text-gray-400">
                Messages between you and support team
              </p>
            </div>
          </div>

          <div className="max-h-[560px] space-y-4 overflow-y-auto rounded-3xl bg-gray-50 p-4">
            {visibleMessages.length === 0 ? (
              <div className="p-10 text-center text-sm text-gray-500">
                No messages found.
              </div>
            ) : (
              visibleMessages.map((message) => {
                const isAdmin = ['super_admin', 'sub_admin', 'admin'].includes(
                  message.senderRole
                );

                return (
                  <div
                    key={message._id}
                    className={`flex ${isAdmin ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-3xl p-4 shadow-sm ${
                        isAdmin
                          ? 'bg-white text-gray-800'
                          : 'bg-slate-950 text-white'
                      }`}
                    >
                      <div className="mb-1 flex items-center gap-2">
                        {isAdmin ? (
                          <CheckCircle2 className="h-4 w-4 text-teal-500" />
                        ) : (
                          <User className="h-4 w-4 opacity-70" />
                        )}

                        <p className="text-xs font-black opacity-70">
                          {isAdmin ? 'Support Team' : 'You'}
                        </p>
                      </div>

                      <p className="whitespace-pre-wrap text-sm leading-6">
                        {message.message}
                      </p>

                      <p className="mt-2 text-[11px] opacity-60">
                        {formatDate(message.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {isClosed ? (
            <div className="mt-5 rounded-2xl bg-gray-50 p-4 text-center text-sm font-bold text-gray-500">
              This ticket is closed. You cannot reply now.
            </div>
          ) : (
            <div className="mt-5 space-y-3">
              <textarea
                value={reply}
                onChange={(event) => setReply(event.target.value)}
                rows={4}
                placeholder="Type your reply..."
                className="w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm font-semibold outline-none focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-100"
              />

              <button
                type="button"
                onClick={sendReply}
                disabled={replyLoading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-teal-600 px-5 py-4 text-sm font-black text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {replyLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Reply
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
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