import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronRight, Loader2, Sparkles } from "lucide-react";
import { categoryService } from "../../../services/category";

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  // "http://localhost:5000" ||
  "https://qubanhygienecare.com";

const fallbackCategories = [
  {
    _id: "adult-care",
    name: "Adult Care",
    slug: "adult-care",
    icon: "🛡️",
    productCount: 0,
  },
  {
    _id: "baby-care",
    name: "Baby Care",
    slug: "baby-care",
    icon: "👶",
    productCount: 0,
  },
  {
    _id: "hygiene-essentials",
    name: "Hygiene Essentials",
    slug: "hygiene-essentials",
    icon: "🧼",
    productCount: 0,
  },
  {
    _id: "sanitary-pads",
    name: "Sanitary Pads",
    slug: "sanitary-pads",
    icon: "🌸",
    productCount: 0,
  },
  {
    _id: "wellness",
    name: "Wellness",
    slug: "wellness",
    icon: "💚",
    productCount: 0,
  },
  {
    _id: "medical-supplies",
    name: "Medical Supplies",
    slug: "medical-supplies",
    icon: "🏥",
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
    productCount: Number(
      category?.productCount || category?.productsCount || 0,
    ),
    image: resolveImageUrl(category),
  };
}

export default function CategoryDesktop({
  title = "Shop by Category",
  subtitle = "Find what you're looking for faster",
  limit = 6,
}) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    const fetchCategories = async () => {
      try {
        setLoading(true);

        const response = await categoryService.getFeaturedCategories(limit);
        const payload = extractPayload(response);
        const list = payload?.categories || payload?.items || [];

        const formatted = Array.isArray(list)
          ? list.map(normalizeCategory)
          : [];

        if (alive) {
          setCategories(
            formatted.length > 0
              ? formatted.slice(0, limit)
              : fallbackCategories.slice(0, limit).map(normalizeCategory),
          );
        }
      } catch (err) {
        console.error("Error fetching featured categories:", err);
        if (alive) {
          setCategories(
            fallbackCategories.slice(0, limit).map(normalizeCategory),
          );
        }
      } finally {
        if (alive) setLoading(false);
      }
    };

    fetchCategories();

    return () => {
      alive = false;
    };
  }, [limit]);

  const visibleCategories = useMemo(
    () => categories.slice(0, limit),
    [categories, limit],
  );

  if (loading) {
    return (
      <section className="bg-gradient-to-b from-white to-teal-50/40 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <div className="h-5 w-28 animate-pulse rounded-full bg-slate-200" />
              <div className="mt-3 h-8 w-56 animate-pulse rounded-2xl bg-slate-200" />
            </div>
            <Loader2 className="h-5 w-5 animate-spin text-teal-600" />
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {Array.from({ length: limit }).map((_, index) => (
              <div key={index} className="rounded-3xl bg-white p-5 shadow-sm">
                <div className="mx-auto h-16 w-16 animate-pulse rounded-2xl bg-slate-200" />
                <div className="mx-auto mt-4 h-4 w-24 animate-pulse rounded-full bg-slate-200" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (visibleCategories.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-teal-50/40 py-14 sm:py-20">
      <div className="absolute -left-24 top-20 h-64 w-64 rounded-full bg-teal-100 blur-3xl" />
      <div className="absolute -right-24 bottom-10 h-64 w-64 rounded-full bg-emerald-100 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:mb-10 sm:flex-row sm:items-end">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white px-4 py-2 text-xs font-black uppercase tracking-wider text-teal-700 shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Curated sections
            </span>

            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              {title}
            </h2>

            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              {subtitle}
            </p>
          </div>

          <Link
            to="/categories"
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-lg shadow-slate-200 transition hover:bg-teal-600"
          >
            View All
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {visibleCategories.map((category) => (
            <Link
              key={category._id}
              to={`/category/${category.slug}`}
              className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-5 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:border-teal-200 hover:shadow-2xl hover:shadow-teal-100/60"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal-500 to-emerald-500 opacity-0 transition group-hover:opacity-100" />

              <div className="mx-auto flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-50 text-3xl ring-1 ring-teal-100 transition group-hover:scale-110">
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

              <h3 className="mt-4 line-clamp-1 text-sm font-black text-slate-900 group-hover:text-teal-700">
                {category.name}
              </h3>

              <p className="mt-1 text-xs font-semibold text-slate-400">
                {category.productCount} products
              </p>

              <div className="mx-auto mt-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition group-hover:bg-teal-600 group-hover:text-white">
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
