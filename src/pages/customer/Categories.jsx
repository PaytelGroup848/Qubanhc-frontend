import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { ArrowRight, ChevronRight, Heart, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { categoryService } from "../../services/category";

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  "https://qubanhygienecare.com" ||
  "http://localhost:5000";

const fallbackCategories = [
  {
    id: 1,
    name: "Adult Care",
    subtitle: "Comfort & dignity, always.",
    description:
      "Premium adult diapers, underpads, catheters and more designed for comfort and confidence.",
    image: "/images/adult-pullup.jpg",
    slug: "adult-care",
    icon: "🛡️",
    gradient: "from-slate-700 to-slate-950",
    productCount: 0,
  },
  {
    id: 2,
    name: "Baby Care",
    subtitle: "Gentle as a mother's touch.",
    description:
      "Ultra-soft diapers, wipes, lotions and washes that keep your little one happy and safe.",
    image: "/images/baby-diaper.jpg",
    slug: "baby-care",
    icon: "👶",
    gradient: "from-sky-500 to-blue-700",
    productCount: 0,
  },
  {
    id: 3,
    name: "Hygiene Essentials",
    subtitle: "Cleanliness you can trust.",
    description:
      "Hypoallergenic, alcohol-free wipes and hygiene essentials for delicate skin.",
    image: "/images/wipes.jpg",
    slug: "hygiene-essentials",
    icon: "🧼",
    gradient: "from-teal-500 to-emerald-700",
    productCount: 0,
  },
  {
    id: 4,
    name: "Sanitary Pads",
    subtitle: "Freedom to move.",
    description:
      "Comfortable absorbent pads for reliable protection and everyday confidence.",
    image: "/images/pads.png",
    slug: "sanitary-pads",
    icon: "🌸",
    gradient: "from-rose-500 to-pink-700",
    productCount: 0,
  },
];

const iconMap = {
  "Adult Care": "🛡️",
  "Baby Care": "👶",
  "Hygiene Essentials": "🧼",
  "Sanitary Pads": "🌸",
  "Elderly Care": "👴",
  "Skin Care": "🧴",
  Wellness: "💚",
  Mobility: "🛴",
  Nutrition: "🥗",
  "Medical Supplies": "🏥",
};

const gradientMap = {
  "Adult Care": "from-slate-700 to-slate-950",
  "Baby Care": "from-sky-500 to-blue-700",
  "Hygiene Essentials": "from-teal-500 to-emerald-700",
  "Sanitary Pads": "from-rose-500 to-pink-700",
  "Elderly Care": "from-indigo-500 to-violet-700",
  "Skin Care": "from-pink-500 to-rose-700",
  Wellness: "from-emerald-500 to-green-700",
  Mobility: "from-amber-500 to-orange-700",
  Nutrition: "from-lime-500 to-emerald-700",
  "Medical Supplies": "from-blue-500 to-indigo-700",
};

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.48, ease: "easeOut" },
  },
};

const resolveImageUrl = (cat) => {
  if (!cat?.image) return null;

  let rawUrl = null;

  if (typeof cat.image === "object" && cat.image.url) rawUrl = cat.image.url;
  if (typeof cat.image === "string") rawUrl = cat.image;

  if (!rawUrl) return null;
  if (rawUrl.startsWith("http://") || rawUrl.startsWith("https://"))
    return rawUrl;
  if (rawUrl.startsWith("data:")) return rawUrl;
  if (rawUrl.startsWith("/")) return `${BACKEND_URL}${rawUrl}`;

  return `${BACKEND_URL}/uploads/categories/${rawUrl}`;
};

function extractCategories(response) {
  const payload = response?.data || response || {};
  return payload?.categories || payload?.data?.categories || [];
}

export default function Categories({
  title = "Explore Our Care Range",
  subtitle = "Products that care for every generation",
  limit = 4,
  showAllButton = true,
}) {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, threshold: 0.12 });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);

  const visibleCategories = useMemo(
    () => categories.slice(0, limit),
    [categories, limit],
  );

  useEffect(() => {
    let mounted = true;

    const fetchCategories = async () => {
      try {
        setLoading(true);
        let categoriesData = [];

        try {
          const featuredRes =
            await categoryService.getFeaturedCategories(limit);
          categoriesData = extractCategories(featuredRes);
        } catch {
          categoriesData = [];
        }

        if (!categoriesData.length) {
          try {
            const allRes = await categoryService.getAllCategories();
            categoriesData = extractCategories(allRes).slice(0, limit);
          } catch {
            categoriesData = [];
          }
        }

        const source = categoriesData.length
          ? categoriesData
          : fallbackCategories.slice(0, limit);

        const formatted = source.map((cat) => {
          const name = cat.name || "Category";
          const slug = cat.slug || "category";
          const imageUrl = resolveImageUrl(cat);

          return {
            ...cat,
            _id: cat._id || cat.id || slug,
            id: cat._id || cat.id || slug,
            name,
            slug,
            icon: iconMap[name] || cat.icon || "📦",
            gradient:
              gradientMap[name] ||
              cat.gradient ||
              "from-teal-600 to-emerald-700",
            image: imageUrl || cat.image || null,
            link: `/category/${slug}`,
            subtitle:
              cat.subtitle ||
              cat.description?.slice(0, 60) ||
              `${name} products`,
            description:
              cat.description || `Explore our range of ${name} products.`,
            productCount: cat.productCount || 0,
            isFeatured: Boolean(cat.isFeatured),
          };
        });

        if (mounted) setCategories(formatted);
      } catch (err) {
        console.error("Error fetching categories:", err);
        if (mounted) setCategories(fallbackCategories.slice(0, limit));
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchCategories();

    return () => {
      mounted = false;
    };
  }, [limit]);

  const toggleWishlist = useCallback((categoryId, event) => {
    event.stopPropagation();

    setWishlist((prev) => {
      const exists = prev.includes(categoryId);
      toast.success(
        exists ? "Removed from saved categories" : "Saved category",
      );
      return exists
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId];
    });
  }, []);

  if (loading) {
    return (
      <section
        ref={sectionRef}
        className="overflow-hidden bg-gradient-to-b from-white to-gray-50 py-14 sm:py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <div className="mx-auto mb-3 h-8 w-40 animate-pulse rounded-full bg-teal-50" />
            <div className="mx-auto h-10 w-72 animate-pulse rounded-2xl bg-gray-100" />
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
            {Array.from({ length: limit }).map((_, idx) => (
              <div
                key={idx}
                className="overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-lg shadow-teal-100/30"
              >
                <div className="h-56 animate-pulse bg-gray-100 sm:h-64" />
                <div className="space-y-3 p-5">
                  <div className="h-6 w-2/3 animate-pulse rounded-full bg-gray-100" />
                  <div className="h-4 w-full animate-pulse rounded-full bg-gray-100" />
                  <div className="h-4 w-1/2 animate-pulse rounded-full bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!visibleCategories.length) return null;

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-b from-white via-gray-50 to-white py-14 sm:py-20"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-24 h-64 w-64 rounded-full bg-teal-100/70 blur-3xl" />
        <div className="absolute bottom-20 right-0 h-64 w-64 rounded-full bg-emerald-100/80 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -18 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45 }}
          className="mx-auto mb-10 max-w-3xl text-center sm:mb-14"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-wider text-teal-700 shadow-sm ring-1 ring-teal-100">
            <Sparkles className="h-4 w-4" />
            Curated for you
          </span>

          <h2 className="mt-4 text-3xl font-black tracking-tight text-gray-950 sm:text-4xl lg:text-5xl">
            {title.split(" ").map((word, index) =>
              word === "Care" ? (
                <span
                  key={`${word}-${index}`}
                  className="bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent"
                >
                  {word}{" "}
                </span>
              ) : (
                <span key={`${word}-${index}`}>{word} </span>
              ),
            )}
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
            {subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          {visibleCategories.map((category, idx) => (
            <motion.article
              key={category._id || category.id || idx}
              variants={cardVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              transition={{ delay: idx * 0.08 }}
              className="group relative overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-xl shadow-teal-100/30 transition-all duration-300 hover:-translate-y-1 hover:border-teal-200 hover:shadow-2xl hover:shadow-teal-100/60"
            >
              <button
                type="button"
                onClick={() => navigate(category.link)}
                className="block h-full w-full text-left"
              >
                <div
                  className={`relative h-56 overflow-hidden bg-gradient-to-br ${category.gradient} sm:h-64`}
                >
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading={idx < 2 ? "eager" : "lazy"}
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <span className="text-8xl opacity-90">
                        {category.icon}
                      </span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent" />

                  <div className="absolute left-4 top-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/90 text-2xl shadow-lg backdrop-blur">
                    {category.icon}
                  </div>

                  <button
                    type="button"
                    onClick={(event) =>
                      toggleWishlist(category._id || category.id, event)
                    }
                    className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/90 text-gray-600 shadow-lg backdrop-blur transition hover:text-red-500"
                    aria-label="Save category"
                  >
                    <Heart
                      className={`h-5 w-5 ${
                        wishlist.includes(category._id || category.id)
                          ? "fill-red-500 text-red-500"
                          : ""
                      }`}
                    />
                  </button>

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="mb-2 flex flex-wrap gap-2">
                      {category.productCount > 0 ? (
                        <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-black backdrop-blur">
                          {category.productCount} Products
                        </span>
                      ) : null}

                      {category.isFeatured ? (
                        <span className="rounded-full bg-yellow-300 px-3 py-1 text-xs font-black text-yellow-950">
                          Featured
                        </span>
                      ) : null}
                    </div>

                    <h3 className="text-2xl font-black">{category.name}</h3>
                    <p className="mt-1 line-clamp-1 text-sm font-semibold text-white/85">
                      {category.subtitle}
                    </p>
                  </div>
                </div>

                <div className="p-5">
                  <p className="line-clamp-2 text-sm leading-6 text-gray-500">
                    {category.description}
                  </p>

                  <div className="mt-5 flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 text-sm font-black text-teal-700">
                      Shop Now
                      <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>

                    <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-black text-teal-700">
                      Explore
                    </span>
                  </div>
                </div>
              </button>
            </motion.article>
          ))}
        </div>

        {showAllButton && (
          <div className="mt-12 text-center">
            <Link
              to="/categories"
              className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-black text-white shadow-lg shadow-gray-200 transition hover:bg-slate-800"
            >
              Browse All Categories
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
