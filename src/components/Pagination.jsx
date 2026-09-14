import { ChevronLeft, ChevronRight } from "lucide-react";

export function extractPagination(payload, fallback = {}) {
  const meta = payload?.pagination || payload?.data?.pagination || {};

  const page = Number(meta.page || fallback.page || 1);
  const limit = Number(meta.limit || fallback.limit || 10);
  const total = Number(meta.total ?? fallback.total ?? 0);
  const totalPages = Math.max(
    1,
    Number(meta.pages || meta.totalPages || fallback.totalPages || 1),
  );

  return { page, limit, total, totalPages };
}

export function paginateItems(items, page = 1, limit = 10) {
  const list = Array.isArray(items) ? items : [];
  const total = list.length;
  const totalPages = Math.max(1, Math.ceil(total / limit) || 1);
  const safePage = Math.min(Math.max(1, Number(page) || 1), totalPages);
  const start = (safePage - 1) * limit;

  return {
    items: list.slice(start, start + limit),
    page: safePage,
    limit,
    total,
    totalPages,
  };
}

function getPageNumbers(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const pages = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) pages.push("ellipsis-start");
  for (let page = start; page <= end; page += 1) pages.push(page);
  if (end < total - 1) pages.push("ellipsis-end");
  pages.push(total);

  return pages;
}

export default function Pagination({
  page = 1,
  totalPages = 1,
  total = 0,
  limit = 10,
  onPageChange,
  className = "",
  variant = "store",
  showSummary = true,
}) {
  const currentPage = Math.min(
    Math.max(1, Number(page) || 1),
    Math.max(1, totalPages),
  );
  const pages = getPageNumbers(currentPage, Math.max(1, totalPages));
  const start = total === 0 ? 0 : (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, total);
  const isAdmin = variant === "admin";

  if (total === 0 || totalPages <= 1) {
    if (!showSummary || total === 0) return null;

    return (
      <div
        className={`flex items-center justify-center gap-3 px-1 py-3 text-sm text-gray-500 ${className}`}
      >
        <p>
          Showing {total} {total === 1 ? "result" : "results"}
        </p>
      </div>
    );
  }

  const buttonBase = isAdmin
    ? "inline-flex h-8 min-w-8 items-center justify-center rounded-md border px-2 text-sm font-medium transition"
    : "inline-flex h-10 min-w-10 items-center justify-center rounded-xl border px-3 text-sm font-bold transition";

  const idleClass = isAdmin
    ? "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
    : "border-slate-200 bg-white text-slate-600 hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700";

  const activeClass = isAdmin
    ? "border-teal-600 bg-teal-600 text-white"
    : "border-teal-600 bg-teal-600 text-white shadow-sm shadow-teal-200";

  const handleChange = (nextPage) => {
    if (!onPageChange) return;
    if (nextPage < 1 || nextPage > totalPages || nextPage === currentPage)
      return;
    window.scrollTo({
      top: window.scrollY * 0.2,
      behavior: "smooth",
    });

    onPageChange(nextPage);
  };

  return (
    <nav
      className={`flex flex-col items-center justify-center gap-3 ${className}`}
      aria-label="Pagination"
    >
      {/* Pagination buttons */}
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        <button
          type="button"
          onClick={() => handleChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className={`${buttonBase} ${idleClass} disabled:cursor-not-allowed disabled:opacity-40`}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {pages.map((item) =>
          typeof item === "string" ? (
            <span
              key={item}
              className={`px-1 ${isAdmin ? "text-gray-400" : "text-slate-400"}`}
            >
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => handleChange(item)}
              className={`${buttonBase} ${
                item === currentPage ? activeClass : idleClass
              }`}
              aria-current={item === currentPage ? "page" : undefined}
            >
              {item}
            </button>
          ),
        )}

        <button
          type="button"
          onClick={() => handleChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className={`${buttonBase} ${idleClass} disabled:cursor-not-allowed disabled:opacity-40`}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Showing result — below pagination */}
      {showSummary ? (
        <p
          className={`text-sm ${
            isAdmin ? "text-gray-500" : "font-medium text-slate-500"
          }`}
        >
          Showing {start}–{end} of {total}
        </p>
      ) : null}
    </nav>
  );
}
