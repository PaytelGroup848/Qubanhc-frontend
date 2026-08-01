// ===================== SHARED HELPER COMPONENTS =====================

export function StatusBadge({ status }) {
  const colorMap = {
    Active: 'bg-green-100 text-green-700',
    Pending: 'bg-yellow-100 text-yellow-700',
    Suspended: 'bg-red-100 text-red-700',
    Inactive: 'bg-gray-100 text-gray-600',
    'Out of Stock': 'bg-red-100 text-red-700',
    Delivered: 'bg-green-100 text-green-700',
    Processing: 'bg-blue-100 text-blue-700',
    Shipped: 'bg-yellow-100 text-yellow-700',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colorMap[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
}

export function SkeletonTable() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-8 bg-gray-200 rounded w-1/4" />
      <div className="h-10 bg-gray-200 rounded" />
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-100 rounded" />
        ))}
      </div>
    </div>
  );
}

export function ErrorState({ message }) {
  return (
    <div className="text-center py-12">
      <p className="text-red-500">{message}</p>
      <button onClick={() => window.location.reload()} className="mt-4 text-orange-500 hover:underline">
        Try again
      </button>
    </div>
  );
}

export function PaginationFooter({ total, shown }) {
  return (
    <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between text-sm">
      <span className="text-gray-500">Showing {shown} of {total} results</span>
      <div className="flex gap-2">
        <button className="px-3 py-1 border rounded text-gray-500 hover:bg-gray-50" disabled>Previous</button>
        <button className="px-3 py-1 border rounded text-gray-500 hover:bg-gray-50">Next</button>
      </div>
    </div>
  );
}