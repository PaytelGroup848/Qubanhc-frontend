import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  ChevronRight,
  Grid,
  Heart,
  LayoutGrid,
  List,
  Loader2,
  PackageSearch,
  RefreshCw,
  Search,
  ShoppingCart,
  SlidersHorizontal,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { categoryService } from "../../../services/category";
import { productService } from "../../../services/product";
import { useCart } from "../../../context/CartContext";

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  // "http://localhost:5000" ||
  "https://qubanhygienecare.com";

function formatPrice(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(amount || 0));
}

function extractPayload(response) {
  const root = response || {};
  if (root?.data?.data) return root.data.data;
  if (root?.data) return root.data;
  return root;
}

function resolveImageUrl(raw) {
  if (!raw) return "";

  const value =
    typeof raw === "string"
      ? raw
      : raw?.url || raw?.secureUrl || raw?.path || raw?.src || "";

  if (!value || typeof value !== "string") return "";

  if (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("data:")
  ) {
    return value;
  }

  if (value.startsWith("/")) return `${BACKEND_URL}${value}`;

  return `${BACKEND_URL}/uploads/products/${value}`;
}

function getProductId(product) {
  return product?._id || product?.id;
}

function getProductUrl(product) {
  return `/products/${product?.slug || getProductId(product)}`;
}

function getProductImage(product) {
  return (
    resolveImageUrl(product?.images?.[0]) ||
    resolveImageUrl(product?.image) ||
    "/images/placeholder.jpg"
  );
}

function normalizeProduct(product, index = 0) {
  const price = Number(product?.price || product?.salePrice || 0);
  const originalPrice = Number(product?.originalPrice || product?.mrp || price);

  return {
    ...product,
    _id: product?._id || product?.id || `product-${index}`,
    id: product?._id || product?.id || `product-${index}`,
    name: product?.name || "Product",
    slug: product?.slug || product?._id || product?.id || `product-${index}`,
    price,
    originalPrice: originalPrice > price ? originalPrice : null,
    rating: Number(product?.rating || product?.averageRating || 0),
    totalRatings: Number(
      product?.totalRatings || product?.reviewsCount || product?.reviews || 0,
    ),
    totalSold: Number(product?.totalSold || product?.sold || 0),
    stock: Number(product?.stock ?? product?.inventory ?? 99),
    createdAt: product?.createdAt || new Date().toISOString(),
    type:
      product?.type || product?.categoryType || product?.category?.name || "",
    bestSeller: Boolean(product?.bestSeller || product?.isBestSeller),
  };
}

function normalizeCategory(category) {
  return {
    ...category,
    _id: category?._id || category?.id || "category",
    name: category?.name || "Category",
    slug: category?.slug || category?._id || category?.id || "category",
    icon: category?.icon || "📦",
    description: category?.description || "",
    children: Array.isArray(category?.children) ? category.children : [],
  };
}

function sortProducts(list, sortBy) {
  const sorted = [...list];

  switch (sortBy) {
    case "price_low":
      return sorted.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    case "price_high":
      return sorted.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    case "rating":
      return sorted.sort(
        (a, b) => Number(b.rating || 0) - Number(a.rating || 0),
      );
    case "popular":
      return sorted.sort(
        (a, b) => Number(b.totalSold || 0) - Number(a.totalSold || 0),
      );
    case "newest":
      return sorted.sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
      );
    case "featured":
    default:
      return sorted.sort((a, b) => Number(b.bestSeller) - Number(a.bestSeller));
  }
}

function filterProducts(list, filters) {
  let filtered = [...list];

  const search = filters.search.trim().toLowerCase();
  if (search) {
    filtered = filtered.filter((product) => {
      return (
        product.name?.toLowerCase().includes(search) ||
        product.description?.toLowerCase().includes(search)
      );
    });
  }

  if (filters.minPrice) {
    filtered = filtered.filter(
      (product) => Number(product.price || 0) >= Number(filters.minPrice),
    );
  }

  if (filters.maxPrice) {
    filtered = filtered.filter(
      (product) => Number(product.price || 0) <= Number(filters.maxPrice),
    );
  }

  if (filters.rating > 0) {
    filtered = filtered.filter(
      (product) => Number(product.rating || 0) >= filters.rating,
    );
  }

  if (filters.bestSellerOnly) {
    filtered = filtered.filter((product) => product.bestSeller === true);
  }

  return filtered;
}

export default function CategoryPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState("");
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [wishlist, setWishlist] = useState([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
    minPrice: "",
    maxPrice: "",
    rating: 0,
    bestSellerOnly: false,
    sortBy: "featured",
  });

  useEffect(() => {
    if (slug) {
      fetchCategoryData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const fetchCategoryData = async () => {
    try {
      setLoading(true);
      setError("");

      const categoryResponse = await categoryService.getCategoryBySlug(slug);
      const categoryPayload = extractPayload(categoryResponse);
      const categoryData = normalizeCategory(
        categoryPayload?.category || categoryPayload,
      );

      setCategory(categoryData);
      setSubCategories(categoryData.children || []);

      const productsResponse = await productService.getProductsByCategory(
        categoryData._id,
      );

      const productsPayload = extractPayload(productsResponse);
      const productList =
        productsPayload?.products ||
        productsPayload?.items ||
        productsPayload?.data?.products ||
        [];

      setProducts(
        Array.isArray(productList) ? productList.map(normalizeProduct) : [],
      );
    } catch (err) {
      console.error("Error fetching category:", err);
      setError(
        err?.response?.data?.message ||
          "Category not found or products failed to load",
      );
      setProducts([]);
      setCategory(null);
    } finally {
      setLoading(false);
    }
  };

  const visibleProducts = useMemo(() => {
    return sortProducts(filterProducts(products, filters), filters.sortBy);
  }, [products, filters]);

  const maxPrice = useMemo(() => {
    return Math.max(
      0,
      ...products.map((product) => Number(product.price || 0)),
    );
  }, [products]);

  const handleAddToCart = async (product, event) => {
    event?.preventDefault();
    event?.stopPropagation();

    const productId = getProductId(product);
    if (!productId) return;

    try {
      setActionLoadingId(productId);
      await addToCart({ id: productId }, 1);
      window.dispatchEvent(new Event("cart-changed"));
      toast.success(`${product.name} added to cart`);
    } catch (err) {
      console.error("Add to cart error:", err);
      toast.error(err?.response?.data?.message || "Failed to add to cart");
    } finally {
      setActionLoadingId("");
    }
  };

  const handleBuyNow = async (product, event) => {
    event?.preventDefault();
    event?.stopPropagation();

    const productId = getProductId(product);
    if (!productId) return;

    try {
      setActionLoadingId(productId);
      await addToCart({ id: productId }, 1);
      window.dispatchEvent(new Event("cart-changed"));
      navigate("/checkout");
    } catch (err) {
      console.error("Buy now error:", err);
      toast.error(err?.response?.data?.message || "Unable to start checkout");
    } finally {
      setActionLoadingId("");
    }
  };

  const toggleWishlist = (productId, event) => {
    event?.preventDefault();
    event?.stopPropagation();

    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );

    toast.success(
      wishlist.includes(productId)
        ? "Removed from wishlist"
        : "Added to wishlist",
    );
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      minPrice: "",
      maxPrice: "",
      rating: 0,
      bestSellerOnly: false,
      sortBy: "featured",
    });
  };

  if (loading) {
    return <CategoryPageSkeleton />;
  }

  if (error || !category) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-teal-50 via-white to-slate-50 px-4">
        <div className="max-w-md rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-xl shadow-teal-100/40">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-rose-50">
            <AlertCircle className="h-8 w-8 text-rose-500" />
          </div>

          <h1 className="mt-5 text-2xl font-black text-slate-950">
            Category not found
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {error || "The category you're looking for doesn't exist."}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 text-sm font-black text-slate-700 hover:bg-slate-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Home
            </Link>

            <button
              type="button"
              onClick={fetchCategoryData}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-teal-600 px-5 py-3 text-sm font-black text-white hover:bg-teal-700"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-gradient-to-b from-teal-50/70 via-white to-slate-50">
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-700 via-teal-600 to-emerald-600">
        <div className="absolute -left-24 top-8 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-9 sm:px-6 sm:py-14 lg:px-8">
          <div className="mb-6 flex items-center gap-2 text-sm font-semibold text-emerald-50/80">
            <Link to="/" className="hover:text-white">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link to="/categories" className="hover:text-white">
              Categories
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-white">{category.name}</span>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-4 py-2 text-xs font-black uppercase tracking-wider text-white backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" />
                {category.icon || "📦"} Category collection
              </span>

              <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight text-white sm:text-5xl">
                {category.name}
              </h1>

              {category.description ? (
                <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-50 sm:text-base">
                  {category.description}
                </p>
              ) : (
                <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-50 sm:text-base">
                  Explore quality products selected for your health and care
                  needs.
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 sm:flex">
              <Metric label="Products" value={products.length} />
              <Metric label="Showing" value={visibleProducts.length} />
              <Metric label="Subcategories" value={subCategories.length} />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {subCategories.length > 0 ? (
          <div className="mb-8">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-950">
                  Subcategories
                </h2>
                <p className="text-sm text-slate-500">
                  Browse this collection by smaller groups
                </p>
              </div>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {subCategories.map((sub) => (
                <Link
                  key={sub._id || sub.id || sub.slug}
                  to={`/category/${sub.slug || sub._id || sub.id}`}
                  className="min-w-[150px] rounded-3xl border border-slate-100 bg-white p-4 text-center shadow-sm transition hover:-translate-y-1 hover:border-teal-200 hover:shadow-xl hover:shadow-teal-100/60"
                >
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-2xl">
                    {sub.icon || "📂"}
                  </div>
                  <h3 className="mt-3 line-clamp-1 text-sm font-black text-slate-900">
                    {sub.name}
                  </h3>
                  <p className="mt-1 text-xs font-semibold text-slate-400">
                    {sub.productCount || 0} products
                  </p>
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mb-6 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  placeholder="Search products..."
                  value={filters.search}
                  onChange={(event) =>
                    setFilters((prev) => ({
                      ...prev,
                      search: event.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm font-semibold outline-none transition focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-100"
                />
              </div>

              <div className="hidden items-center gap-2 sm:flex">
                <input
                  type="number"
                  min="0"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(event) =>
                    setFilters((prev) => ({
                      ...prev,
                      minPrice: event.target.value,
                    }))
                  }
                  className="w-24 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-bold outline-none focus:border-teal-400 focus:ring-4 focus:ring-teal-100"
                />
                <span className="text-slate-300">-</span>
                <input
                  type="number"
                  min="0"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(event) =>
                    setFilters((prev) => ({
                      ...prev,
                      maxPrice: event.target.value,
                    }))
                  }
                  className="w-24 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-bold outline-none focus:border-teal-400 focus:ring-4 focus:ring-teal-100"
                />
              </div>

              <button
                type="button"
                onClick={() => setShowMobileFilters(true)}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-700 sm:hidden"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </button>
            </div>

            <div className="flex items-center justify-between gap-3">
              <select
                value={filters.sortBy}
                onChange={(event) =>
                  setFilters((prev) => ({
                    ...prev,
                    sortBy: event.target.value,
                  }))
                }
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 outline-none focus:border-teal-400 focus:ring-4 focus:ring-teal-100"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="popular">Most Popular</option>
              </select>

              <div className="hidden overflow-hidden rounded-2xl border border-slate-200 sm:flex">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`p-3 transition ${
                    viewMode === "grid"
                      ? "bg-teal-600 text-white"
                      : "bg-white text-slate-400 hover:bg-teal-50"
                  }`}
                  aria-label="Grid view"
                >
                  <Grid className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`p-3 transition ${
                    viewMode === "list"
                      ? "bg-teal-600 text-white"
                      : "bg-white text-slate-400 hover:bg-teal-50"
                  }`}
                  aria-label="List view"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={resetFilters}
                className="hidden rounded-2xl px-4 py-3 text-sm font-black text-slate-500 hover:bg-slate-50 md:inline-flex"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {visibleProducts.length === 0 ? (
          <div className="rounded-3xl border border-slate-100 bg-white p-12 text-center shadow-sm">
            <PackageSearch className="mx-auto h-14 w-14 text-slate-300" />
            <h2 className="mt-4 text-2xl font-black text-slate-950">
              No products found
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Try adjusting your filters or search terms.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-6 rounded-2xl bg-teal-600 px-6 py-3 text-sm font-black text-white hover:bg-teal-700"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "space-y-4"
            }
          >
            {visibleProducts.map((product) =>
              viewMode === "grid" ? (
                <ProductGridCard
                  key={getProductId(product)}
                  product={product}
                  isWishlisted={wishlist.includes(getProductId(product))}
                  loading={actionLoadingId === getProductId(product)}
                  onAddToCart={handleAddToCart}
                  onBuyNow={handleBuyNow}
                  onWishlistToggle={toggleWishlist}
                />
              ) : (
                <ProductListCard
                  key={getProductId(product)}
                  product={product}
                  isWishlisted={wishlist.includes(getProductId(product))}
                  loading={actionLoadingId === getProductId(product)}
                  onAddToCart={handleAddToCart}
                  onBuyNow={handleBuyNow}
                  onWishlistToggle={toggleWishlist}
                />
              ),
            )}
          </div>
        )}
      </section>

      {showMobileFilters ? (
        <MobileFilterSheet
          filters={filters}
          setFilters={setFilters}
          maxPrice={maxPrice}
          onClose={() => setShowMobileFilters(false)}
          onReset={resetFilters}
          visibleCount={visibleProducts.length}
        />
      ) : null}
    </main>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-3xl border border-white/20 bg-white/15 px-5 py-4 text-white shadow-lg backdrop-blur">
      <p className="text-2xl font-black">{value}</p>
      <p className="text-xs font-bold uppercase tracking-wider text-emerald-50/80">
        {label}
      </p>
    </div>
  );
}

function ProductGridCard({
  product,
  onAddToCart,
  onBuyNow,
  onWishlistToggle,
  isWishlisted,
  loading,
}) {
  const productId = getProductId(product);
  const discountPercent = product.originalPrice
    ? Math.round(
        ((Number(product.originalPrice) - Number(product.price)) /
          Number(product.originalPrice)) *
          100,
      )
    : 0;

  return (
    <article className="group overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-teal-200 hover:shadow-2xl hover:shadow-teal-100/60">
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        <Link to={getProductUrl(product)} className="block h-full w-full">
          <img
            src={getProductImage(product)}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
            loading="lazy"
          />
        </Link>

        {discountPercent > 0 ? (
          <span className="absolute left-3 top-3 rounded-full bg-rose-500 px-2.5 py-1 text-xs font-black text-white shadow">
            -{discountPercent}%
          </span>
        ) : null}

        {product.totalSold > 0 ? (
          <span className="absolute bottom-3 left-3 rounded-full bg-slate-950/75 px-2.5 py-1 text-xs font-bold text-white backdrop-blur">
            🔥 {product.totalSold} sold
          </span>
        ) : null}

        <button
          type="button"
          onClick={(event) => onWishlistToggle(productId, event)}
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-lg transition hover:bg-rose-50"
          aria-label="Toggle wishlist"
        >
          <Heart
            className={`h-4 w-4 ${
              isWishlisted ? "fill-rose-500 text-rose-500" : "text-slate-400"
            }`}
          />
        </button>
      </div>

      <div className="p-4">
        <Link to={getProductUrl(product)}>
          <h3 className="line-clamp-2 min-h-[44px] text-sm font-black leading-5 text-slate-950 transition hover:text-teal-700">
            {product.name}
          </h3>
        </Link>

        <div className="mt-2 flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span className="text-xs font-bold text-slate-600">
            {Number(product.rating || 0).toFixed(1)}
          </span>
          <span className="text-xs text-slate-400">
            ({product.totalRatings || 0})
          </span>
        </div>

        <div className="mt-3 flex flex-wrap items-baseline gap-2">
          <span className="text-lg font-black text-teal-700">
            {formatPrice(product.price)}
          </span>

          {product.originalPrice ? (
            <span className="text-sm font-semibold text-slate-400 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          ) : null}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={loading}
            onClick={(event) => onAddToCart(product, event)}
            className="inline-flex items-center justify-center gap-1 rounded-2xl bg-teal-600 px-3 py-3 text-xs font-black text-white transition hover:bg-teal-700 disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <ShoppingCart className="h-3.5 w-3.5" />
            )}
            Add
          </button>
        </div>
      </div>
    </article>
  );
}

function ProductListCard({
  product,
  onAddToCart,
  onBuyNow,
  onWishlistToggle,
  isWishlisted,
  loading,
}) {
  const productId = getProductId(product);
  const discountPercent = product.originalPrice
    ? Math.round(
        ((Number(product.originalPrice) - Number(product.price)) /
          Number(product.originalPrice)) *
          100,
      )
    : 0;

  return (
    <article className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition hover:border-teal-200 hover:shadow-xl hover:shadow-teal-100/50">
      <div className="flex flex-col sm:flex-row">
        <Link
          to={getProductUrl(product)}
          className="relative block h-56 overflow-hidden bg-slate-100 sm:h-auto sm:w-56"
        >
          <img
            src={getProductImage(product)}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 hover:scale-105"
            loading="lazy"
          />
          {discountPercent > 0 ? (
            <span className="absolute left-3 top-3 rounded-full bg-rose-500 px-2.5 py-1 text-xs font-black text-white">
              -{discountPercent}%
            </span>
          ) : null}
        </Link>

        <div className="flex flex-1 flex-col justify-between gap-5 p-5 sm:flex-row sm:items-center">
          <div className="flex-1">
            <Link to={getProductUrl(product)}>
              <h3 className="text-lg font-black text-slate-950 transition hover:text-teal-700">
                {product.name}
              </h3>
            </Link>

            <div className="mt-2 flex items-center gap-1">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-bold text-slate-600">
                {Number(product.rating || 0).toFixed(1)}
              </span>
              <span className="text-xs text-slate-400">
                ({product.totalRatings || 0})
              </span>
            </div>

            {product.description ? (
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                {product.description}
              </p>
            ) : null}

            <div className="mt-3 flex flex-wrap items-baseline gap-3">
              <span className="text-2xl font-black text-teal-700">
                {formatPrice(product.price)}
              </span>

              {product.originalPrice ? (
                <span className="text-sm font-semibold text-slate-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              ) : null}
            </div>
          </div>

          <div className="grid min-w-[170px] gap-2">
            <button
              type="button"
              onClick={(event) => onWishlistToggle(productId, event)}
              className={`inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-black transition ${
                isWishlisted
                  ? "border-rose-200 bg-rose-50 text-rose-600"
                  : "border-slate-200 text-slate-600 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
              }`}
            >
              <Heart
                className={`h-4 w-4 ${isWishlisted ? "fill-rose-500" : ""}`}
              />
              {isWishlisted ? "Wishlisted" : "Wishlist"}
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={(event) => onAddToCart(product, event)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-teal-600 px-4 py-3 text-sm font-black text-white transition hover:bg-teal-700 disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ShoppingCart className="h-4 w-4" />
              )}
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function MobileFilterSheet({
  filters,
  setFilters,
  maxPrice,
  onClose,
  onReset,
  visibleCount,
}) {
  return (
    <div className="fixed inset-0 z-[999] bg-slate-950/40 backdrop-blur-sm sm:hidden">
      <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-[2rem] bg-white p-5 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-950">Filters</h2>
            <p className="text-xs font-semibold text-slate-500">
              Refine products quickly
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="text-sm font-black text-slate-800">
              Price range
            </label>
            <div className="mt-2 grid grid-cols-2 gap-3">
              <input
                type="number"
                min="0"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(event) =>
                  setFilters((prev) => ({
                    ...prev,
                    minPrice: event.target.value,
                  }))
                }
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-teal-400 focus:ring-4 focus:ring-teal-100"
              />
              <input
                type="number"
                min="0"
                max={maxPrice}
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(event) =>
                  setFilters((prev) => ({
                    ...prev,
                    maxPrice: event.target.value,
                  }))
                }
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-teal-400 focus:ring-4 focus:ring-teal-100"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-black text-slate-800">
              Minimum rating
            </label>
            <div className="mt-2 flex gap-2">
              {[0, 3, 4, 4.5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      rating,
                    }))
                  }
                  className={`rounded-full px-4 py-2 text-xs font-black ${
                    filters.rating === rating
                      ? "bg-amber-500 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {rating === 0 ? "All" : `${rating}+ ★`}
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <span className="text-sm font-black text-slate-800">
              Best seller only
            </span>
            <input
              type="checkbox"
              checked={filters.bestSellerOnly}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  bestSellerOnly: event.target.checked,
                }))
              }
              className="h-5 w-5 accent-teal-600"
            />
          </label>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onReset}
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-700"
          >
            Reset
          </button>

          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl bg-teal-600 px-4 py-3 text-sm font-black text-white"
          >
            Show {visibleCount} products
          </button>
        </div>
      </div>
    </div>
  );
}

function CategoryPageSkeleton() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="h-64 animate-pulse bg-gradient-to-br from-teal-200 to-emerald-200" />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 h-20 animate-pulse rounded-3xl bg-white" />

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm"
            >
              <div className="aspect-square animate-pulse bg-slate-200" />
              <div className="space-y-3 p-4">
                <div className="h-4 w-full animate-pulse rounded-full bg-slate-200" />
                <div className="h-4 w-2/3 animate-pulse rounded-full bg-slate-200" />
                <div className="h-8 w-28 animate-pulse rounded-2xl bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
