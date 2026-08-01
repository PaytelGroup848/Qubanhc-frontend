import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  ChevronRight,
  FolderTree,
  Loader2,
  RefreshCw,
  Search,
  Sparkles,
} from "lucide-react";
import { categoryService } from "../../../services/category";

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  "http://localhost:5000" ||
  "https://qubanhygienecare.com";

const fallbackCategories = [
  {
    _id: "adult-care",
    name: "Adult Care",
    slug: "adult-care",
    icon: "🛡️",
    description: "Comfort, dignity and protection for daily care.",
    productCount: 0,
  },
  {
    _id: "baby-care",
    name: "Baby Care",
    slug: "baby-care",
    icon: "👶",
    description: "Soft and safe essentials for little ones.",
    productCount: 0,
  },
  {
    _id: "hygiene-essentials",
    name: "Hygiene Essentials",
    slug: "hygiene-essentials",
    icon: "🧼",
    description: "Cleanliness products for everyday confidence.",
    productCount: 0,
  },
  {
    _id: "sanitary-pads",
    name: "Sanitary Pads",
    slug: "sanitary-pads",
    icon: "🌸",
    description: "Comfortable period care products.",
    productCount: 0,
  },
];

function extractPayload(response) {
  const root = response || {};
  if (root?.data?.data) return root.data.data;
  if (root?.data) return root.data;
  return root;
}

function resolveImageUrl(category) {
  const raw =
    category?.image?.url ||
    category?.image ||
    category?.thumbnail?.url ||
    category?.thumbnail ||
    "";

  if (!raw || typeof raw !== "string") return "";

  if (
    raw.startsWith("http://") ||
    raw.startsWith("https://") ||
    raw.startsWith("data:")
  ) {
    return raw;
  }

  if (raw.startsWith("/")) return `${BACKEND_URL}${raw}`;

  return `${BACKEND_URL}/uploads/categories/${raw}`;
}

function normalizeCategory(category, index = 0) {
  return {
    ...category,
    _id: category?._id || category?.id || `category-${index}`,
    name: category?.name || "Category",
    slug:
      category?.slug || category?._id || category?.id || `category-${index}`,
    icon: category?.icon || "📦",
    description:
      category?.description || "Explore products selected for your needs.",
    productCount: Number(
      category?.productCount || category?.productsCount || 0,
    ),
    children: Array.isArray(category?.children) ? category.children : [],
    image: resolveImageUrl(category),
  };
}

export default function AllCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await categoryService.getAllCategories();
      const payload = extractPayload(response);

      const list =
        payload?.categories ||
        payload?.data?.categories ||
        payload?.items ||
        [];

      const formatted = Array.isArray(list) ? list.map(normalizeCategory) : [];

      setCategories(
        formatted.length > 0
          ? formatted
          : fallbackCategories.map(normalizeCategory),
      );
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to load categories");
      setCategories(fallbackCategories.map(normalizeCategory));
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();

    if (!q) return categories;

    return categories.filter((category) => {
      return (
        category.name?.toLowerCase().includes(q) ||
        category.description?.toLowerCase().includes(q) ||
        category.slug?.toLowerCase().includes(q)
      );
    });
  }, [categories, searchTerm]);

  if (loading) {
    return <AllCategoriesSkeleton />;
  }

  return (
    <main className="min-h-screen overflow-hidden bg-gradient-to-b from-teal-50/60 via-white to-slate-50">
      <section className="relative border-b border-teal-100/70">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-teal-200/40 blur-3xl" />
          <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <div className="mb-6 flex items-center gap-2 text-sm font-semibold text-slate-500">
            <Link to="/" className="transition hover:text-teal-700">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-900">All Categories</span>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/80 px-4 py-2 text-xs font-black uppercase tracking-wider text-teal-700 shadow-sm">
                <Sparkles className="h-3.5 w-3.5" />
                Smart shopping categories
              </span>

              <h1 className="mt-4 max-w-3xl text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">
                Browse care products by category
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                Find baby care, adult care, hygiene essentials, wellness and
                medical products faster with organized categories.
              </p>
            </div>

            <div className="rounded-3xl border border-white bg-white/80 p-4 shadow-xl shadow-teal-100/50 backdrop-blur">
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-100"
                />
              </div>

              <div className="mt-3 flex items-center justify-between text-xs font-bold text-slate-500">
                <span>{filteredCategories.length} categories found</span>
                <button
                  type="button"
                  onClick={fetchCategories}
                  className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-teal-700 hover:bg-teal-50"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Refresh
                </button>
              </div>
            </div>
          </div>

          {error ? (
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <p>
                {error}. Showing fallback categories, please check your backend
                category API.
              </p>
            </div>
          ) : null}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {filteredCategories.length === 0 ? (
          <div className="rounded-3xl border border-slate-100 bg-white p-12 text-center shadow-sm">
            <FolderTree className="mx-auto h-12 w-12 text-slate-300" />
            <h2 className="mt-4 text-xl font-black text-slate-950">
              No categories found
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Try another keyword or clear your search.
            </p>
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="mt-5 rounded-2xl bg-teal-600 px-5 py-3 text-sm font-black text-white hover:bg-teal-700"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredCategories.map((category) => (
              <CategoryCard key={category._id} category={category} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function CategoryCard({ category }) {
  const hasChildren = category.children?.length > 0;

  return (
    <Link
      to={`/category/${category.slug}`}
      className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-teal-200 hover:shadow-2xl hover:shadow-teal-100/60"
    >
      <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-teal-100/70 transition group-hover:scale-125" />

      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-50 text-3xl ring-1 ring-teal-100">
            {category.image ? (
              <img
                src={category.image}
                alt={category.name}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              <span>{category.icon}</span>
            )}
          </div>

          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-black text-slate-500">
            {category.productCount} items
          </span>
        </div>

        <h3 className="mt-5 line-clamp-1 text-lg font-black text-slate-950 group-hover:text-teal-700">
          {category.name}
        </h3>

        <p className="mt-2 line-clamp-2 min-h-[40px] text-sm leading-5 text-slate-500">
          {category.description}
        </p>

        {hasChildren ? (
          <p className="mt-3 inline-flex rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700">
            +{category.children.length} subcategories
          </p>
        ) : null}

        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
          <span className="text-sm font-black text-teal-700">Explore</span>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950 text-white transition group-hover:translate-x-1 group-hover:bg-teal-600">
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function AllCategoriesSkeleton() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 space-y-3">
          <div className="h-5 w-40 animate-pulse rounded-full bg-slate-200" />
          <div className="h-10 w-72 animate-pulse rounded-2xl bg-slate-200" />
          <div className="h-5 w-96 max-w-full animate-pulse rounded-full bg-slate-200" />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm"
            >
              <div className="h-16 w-16 animate-pulse rounded-2xl bg-slate-200" />
              <div className="mt-5 h-5 w-32 animate-pulse rounded-full bg-slate-200" />
              <div className="mt-3 h-4 w-full animate-pulse rounded-full bg-slate-100" />
              <div className="mt-2 h-4 w-2/3 animate-pulse rounded-full bg-slate-100" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
