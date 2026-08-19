import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Loader2,
  Mail,
  MessageSquare,
  Phone,
  RefreshCw,
  Search,
  Trash2,
  User,
} from "lucide-react";
import toast from "react-hot-toast";

import { adminService } from "../../../services/admin";

const STATUS_OPTIONS = [
  { value: "", label: "All Status" },
  { value: "new", label: "New" },
  { value: "read", label: "Read" },
  { value: "replied", label: "Replied" },
  { value: "closed", label: "Closed" },
];

const SUBJECT_OPTIONS = [
  { value: "", label: "All Subjects" },
  { value: "general", label: "General Inquiry" },
  { value: "order", label: "Order Issue" },
  { value: "product", label: "Product Question" },
  { value: "vendor", label: "Vendor Inquiry" },
  { value: "other", label: "Other" },
];

const SUBJECT_LABELS = {
  general: "General Inquiry",
  order: "Order Issue",
  product: "Product Question",
  vendor: "Vendor Inquiry",
  other: "Other",
};

const statusClass = {
  new: "bg-blue-50 text-blue-700 ring-blue-200",
  read: "bg-yellow-50 text-yellow-700 ring-yellow-200",
  replied: "bg-green-50 text-green-700 ring-green-200",
  closed: "bg-gray-50 text-gray-700 ring-gray-200",
};

function extractApiPayload(response) {
  const root = response || {};
  if (root?.data?.data) return root.data.data;
  if (root?.data) return root.data;
  return root;
}

function formatDate(date) {
  if (!date) return "-";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "-";
  }

  return parsed.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function GetInTouch() {
  const [stats, setStats] = useState(null);
  const [queries, setQueries] = useState([]);
  const [selectedQuery, setSelectedQuery] = useState(null);

  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
    status: "",
    subject: "",
    page: 1,
    limit: 10,
  });

  const [adminNotes, setAdminNotes] = useState("");

  const fetchAll = async () => {
    try {
      setLoading(true);

      const [statsRes, queriesRes] = await Promise.all([
        adminService.getContactStats(),
        adminService.getContactQueries(filters),
      ]);

      const statsPayload = extractApiPayload(statsRes);
      const queriesPayload = extractApiPayload(queriesRes);

      setStats(statsPayload?.stats || null);
      setQueries(
        Array.isArray(queriesPayload?.queries) ? queriesPayload.queries : [],
      );
    } catch (error) {
      console.error("Get in touch fetch error:", error);
      toast.error(
        error?.response?.data?.message || "Failed to fetch contact queries",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.status, filters.subject, filters.page]);

  const handleSearch = async () => {
    try {
      setLoading(true);

      const queriesRes = await adminService.getContactQueries({
        ...filters,
        page: 1,
      });

      const queriesPayload = extractApiPayload(queriesRes);
      setQueries(
        Array.isArray(queriesPayload?.queries) ? queriesPayload.queries : [],
      );
    } catch (error) {
      console.error("Get in touch search error:", error);
      toast.error(error?.response?.data?.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  const openQuery = async (queryItem) => {
    try {
      setDetailLoading(true);

      const response = await adminService.getContactQueryById(queryItem._id);
      const payload = extractApiPayload(response);
      const query = payload?.query || null;

      setSelectedQuery(query);
      setAdminNotes(query?.adminNotes || "");

      if (query?.status === "new") {
        await updateQuery(query._id, { status: "read" }, { silent: true });
      }
    } catch (error) {
      console.error("Open query error:", error);
      toast.error(error?.response?.data?.message || "Failed to open query");
    } finally {
      setDetailLoading(false);
    }
  };

  const updateQuery = async (id, data, options = {}) => {
    try {
      if (!options.silent) {
        setSaving(true);
      }

      const response = await adminService.updateContactQuery(id, data);
      const payload = extractApiPayload(response);
      const updatedQuery = payload?.query;

      if (updatedQuery) {
        setSelectedQuery(updatedQuery);
        setAdminNotes(updatedQuery.adminNotes || "");

        setQueries((prev) =>
          prev.map((item) =>
            item._id === updatedQuery._id ? updatedQuery : item,
          ),
        );
      }

      if (!options.silent) {
        toast.success("Query updated");
      }
    } catch (error) {
      console.error("Update query error:", error);
      if (!options.silent) {
        toast.error(error?.response?.data?.message || "Update failed");
      }
    } finally {
      if (!options.silent) {
        setSaving(false);
      }
    }
  };

  const saveNotes = async () => {
    if (!selectedQuery) return;

    await updateQuery(selectedQuery._id, {
      adminNotes: adminNotes.trim(),
    });
  };

  const deleteQuery = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this query?");
    if (!ok) return;

    try {
      await adminService.deleteContactQuery(id);

      setQueries((prev) => prev.filter((item) => item._id !== id));

      if (selectedQuery?._id === id) {
        setSelectedQuery(null);
        setAdminNotes("");
      }

      toast.success("Query deleted");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Delete failed");
    }
  };

  const selectedSubjectLabel = useMemo(() => {
    if (!selectedQuery) return "";
    return SUBJECT_LABELS[selectedQuery.subject] || selectedQuery.subject;
  }, [selectedQuery]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Contact Queries
          </h1>
          <p className="mt-0.5 text-sm text-gray-500">
            View and manage messages submitted from the Contact Us page.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchAll}
          className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-5">
        <StatCard
          icon={MessageSquare}
          title="Total"
          value={stats?.total || 0}
        />
        <StatCard icon={AlertCircle} title="New" value={stats?.new || 0} />
        <StatCard icon={Clock} title="Read" value={stats?.read || 0} />
        <StatCard
          icon={CheckCircle2}
          title="Replied"
          value={stats?.replied || 0}
        />
        <StatCard
          icon={CheckCircle2}
          title="Closed"
          value={stats?.closed || 0}
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_1.1fr]">
        <div className="rounded-md border border-gray-200 bg-white p-4">
          <div className="grid gap-2 lg:grid-cols-[1fr_auto_auto_auto]">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                value={filters.search}
                onChange={(event) =>
                  setFilters((prev) => ({
                    ...prev,
                    search: event.target.value,
                  }))
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") handleSearch();
                }}
                placeholder="Search name, email or message..."
                className="w-full rounded-md border border-gray-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
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
              className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            >
              {STATUS_OPTIONS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>

            <select
              value={filters.subject}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  subject: event.target.value,
                  page: 1,
                }))
              }
              className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            >
              {SUBJECT_OPTIONS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={handleSearch}
              className="rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
            >
              Search
            </button>
          </div>

          <div className="mt-4 space-y-2">
            {loading ? (
              <div className="flex h-48 items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : queries.length === 0 ? (
              <div className="rounded-md border border-gray-200 bg-gray-50 p-6 text-center">
                <p className="text-sm font-medium text-gray-700">
                  No queries found
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Contact form submissions will appear here.
                </p>
              </div>
            ) : (
              queries.map((queryItem) => (
                <button
                  key={queryItem._id}
                  type="button"
                  onClick={() => openQuery(queryItem)}
                  className={`w-full rounded-md border p-3 text-left transition hover:border-teal-300 hover:bg-teal-50/40 ${
                    selectedQuery?._id === queryItem._id
                      ? "border-teal-400 bg-teal-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium uppercase text-gray-400">
                        #{queryItem.queryId}
                      </p>
                      <h3 className="mt-0.5 text-sm font-semibold text-gray-900">
                        {queryItem.name}
                      </h3>
                      <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                        <Mail className="h-3 w-3" />
                        {queryItem.email}
                      </p>
                      <p className="mt-1.5 line-clamp-2 text-sm text-gray-500">
                        {queryItem.message}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        deleteQuery(queryItem._id);
                      }}
                      className="rounded p-1.5 text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <Badge className={statusClass[queryItem.status]}>
                      {queryItem.status}
                    </Badge>
                    <Badge className="bg-gray-50 text-gray-600 ring-gray-200">
                      {SUBJECT_LABELS[queryItem.subject] || queryItem.subject}
                    </Badge>
                    <Badge className="bg-gray-50 text-gray-600 ring-gray-200">
                      {formatDate(queryItem.createdAt)}
                    </Badge>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-4">
          {!selectedQuery ? (
            <div className="flex h-full min-h-[480px] items-center justify-center rounded-md border border-gray-200 bg-gray-50 text-center">
              <div>
                <MessageSquare className="mx-auto h-9 w-9 text-gray-300" />
                <h3 className="mt-3 text-sm font-semibold text-gray-700">
                  Select a query
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  Open any contact query to view details and update status.
                </p>
              </div>
            </div>
          ) : detailLoading ? (
            <div className="flex h-[480px] items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-3">
                <p className="text-xs font-medium uppercase text-gray-400">
                  #{selectedQuery.queryId}
                </p>
                <h2 className="mt-0.5 text-base font-semibold text-gray-900">
                  {selectedSubjectLabel}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Received: {formatDate(selectedQuery.createdAt)}
                </p>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <InfoRow icon={User} label="Name" value={selectedQuery.name} />
                <InfoRow
                  icon={Mail}
                  label="Email"
                  value={selectedQuery.email}
                />
                <InfoRow
                  icon={Phone}
                  label="Phone"
                  value={selectedQuery.phone || "-"}
                />
                <InfoRow
                  icon={MessageSquare}
                  label="Subject"
                  value={selectedSubjectLabel}
                />
              </div>

              <div className="rounded-md border border-gray-200 bg-gray-50 p-3">
                <p className="text-xs font-medium uppercase text-gray-400">
                  Message
                </p>
                <p className="mt-1.5 whitespace-pre-wrap text-sm leading-6 text-gray-800">
                  {selectedQuery.message}
                </p>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600">
                  Status
                </label>
                <select
                  value={selectedQuery.status}
                  onChange={(event) =>
                    updateQuery(selectedQuery._id, {
                      status: event.target.value,
                    })
                  }
                  disabled={saving}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                >
                  <option value="new">New</option>
                  <option value="read">Read</option>
                  <option value="replied">Replied</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600">
                  Admin Notes
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(event) => setAdminNotes(event.target.value)}
                  rows={4}
                  placeholder="Internal notes about this query..."
                  className="mt-1 w-full resize-none rounded-md border border-gray-300 p-3 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                />
                <button
                  type="button"
                  onClick={saveNotes}
                  disabled={saving}
                  className="mt-2 inline-flex w-full items-center justify-center rounded-md bg-teal-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Notes"}
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
    <div className="rounded-md border border-gray-200 bg-white p-4">
      <div className="flex h-9 w-9 items-center justify-center rounded-md bg-teal-50">
        <Icon className="h-4 w-4 text-teal-600" />
      </div>
      <p className="mt-3 text-xs font-medium text-gray-500">{title}</p>
      <p className="mt-0.5 text-xl font-semibold text-gray-900">{value}</p>
    </div>
  );
}

function Badge({ children, className }) {
  return (
    <span
      className={`inline-flex rounded px-2 py-0.5 text-[10px] font-medium uppercase ring-1 ${className}`}
    >
      {children}
    </span>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="rounded-md border border-gray-200 bg-gray-50 p-3">
      <div className="flex items-center gap-1.5 text-xs font-medium uppercase text-gray-400">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <p className="mt-1 text-sm font-medium text-gray-800">{value}</p>
    </div>
  );
}
