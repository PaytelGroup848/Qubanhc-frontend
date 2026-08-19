import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, PackageSearch, Search } from "lucide-react";
import toast from "react-hot-toast";
import { productService } from "../../../services/product";
import { useCart } from "../../../context/CartContext";
import { useAuth } from "../../../context/AuthContext";
import { wishlistService } from "../../../services/wishlist";

const FeaturedProducts = lazy(
  () => import("../FeaturedProucts/FeaturedProducts"),
);

function extractPayload(response) {
  const root = response || {};
  if (root?.data?.data) return root.data.data;
  if (root?.data) return root.data;
  return root;
}

const SectionSkeleton = () => (
  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {Array.from({ length: 8 }).map((_, index) => (
      <div
        key={index}
        className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm"
      >
        <div className="aspect-square animate-pulse bg-slate-100" />
        <div className="space-y-3 p-4">
          <div className="h-3 w-1/3 rounded-full bg-slate-100" />
          <div className="h-4 w-3/4 rounded-full bg-slate-100" />
          <div className="h-9 w-full rounded-xl bg-slate-100" />
        </div>
      </div>
    ))}
  </div>
);

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q")?.trim() || "";
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!query) {
      setProducts([]);
      setTotal(0);
      setError(null);
      return;
    }

    let mounted = true;

    const fetchResults = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await productService.searchProducts(query);
        const payload = extractPayload(response);
        const list = payload?.products || [];
        const pagination = payload?.pagination || {};

        if (mounted) {
          setProducts(Array.isArray(list) ? list : []);
          setTotal(pagination.total ?? list.length);
        }
      } catch (err) {
        console.error("Search error:", err);
        if (mounted) {
          setError(err?.response?.data?.message || "Search failed");
          setProducts([]);
          setTotal(0);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchResults();

    return () => {
      mounted = false;
    };
  }, [query]);

  const requireLogin = useCallback(
    (from = "/") => {
      if (isLoggedIn) return true;

      navigate("/login", { state: { from } });
      toast.error("Please login first");
      return false;
    },
    [isLoggedIn, navigate],
  );

  const handleAddToCart = useCallback(
    async (productId) => {
      if (!requireLogin(`/search?q=${encodeURIComponent(query)}`)) return;

      try {
        await addToCart({ id: productId }, 1);
        window.dispatchEvent(new Event("cart-changed"));
        toast.success("Added to cart!");
      } catch (cartError) {
        const message =
          cartError?.response?.data?.message || "Failed to add to cart";
        toast.error(message);
      }
    },
    [addToCart, query, requireLogin],
  );

  const handleBuyNow = useCallback(
    async (productId) => {
      if (!requireLogin("/checkout")) return;

      try {
        await addToCart({ id: productId }, 1);
        window.dispatchEvent(new Event("cart-changed"));
        navigate("/checkout");
      } catch (cartError) {
        const message =
          cartError?.response?.data?.message || "Unable to start checkout";
        toast.error(message);
      }
    },
    [addToCart, navigate, requireLogin],
  );

  const handleWishlistToggle = useCallback(
    async (productId, isCurrentlyWishlisted = false) => {
      if (!requireLogin(`/search?q=${encodeURIComponent(query)}`)) {
        return { success: false };
      }

      try {
        if (isCurrentlyWishlisted) {
          await wishlistService.removeFromWishlist(productId);
          window.dispatchEvent(new Event("wishlist-changed"));
          toast.success("Removed from wishlist");
          return { success: true, isWishlisted: false };
        }

        await wishlistService.addToWishlist(productId);
        window.dispatchEvent(new Event("wishlist-changed"));
        toast.success("Added to wishlist");
        return { success: true, isWishlisted: true };
      } catch (wishlistError) {
        const message =
          wishlistError?.response?.data?.message || "Wishlist update failed";
        toast.error(message);
        return { success: false };
      }
    },
    [query, requireLogin],
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#fffaf2] to-white py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-teal-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-lg shadow-teal-200">
              <Search className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                {query ? `Results for "${query}"` : "Search products"}
              </h1>
              {query && !loading ? (
                <p className="mt-1 text-sm font-medium text-slate-500">
                  {total} {total === 1 ? "product" : "products"} found
                </p>
              ) : null}
            </div>
          </div>
        </div>

        {!query ? (
          <div className="rounded-3xl border border-slate-100 bg-white p-12 text-center shadow-sm">
            <PackageSearch className="mx-auto h-14 w-14 text-slate-300" />
            <h2 className="mt-4 text-xl font-black text-slate-950">
              Enter a search term
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Use the search bar above to find products.
            </p>
          </div>
        ) : error && products.length === 0 ? (
          <div className="rounded-3xl border border-red-100 bg-red-50 p-10 text-center">
            <p className="font-black text-red-600">{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 rounded-full bg-[#7f1d1d] px-5 py-3 text-sm font-black text-white transition hover:bg-[#641515]"
            >
              Try Again
            </button>
          </div>
        ) : !loading && products.length === 0 ? (
          <div className="rounded-3xl border border-slate-100 bg-white p-12 text-center shadow-sm">
            <PackageSearch className="mx-auto h-14 w-14 text-slate-300" />
            <h2 className="mt-4 text-2xl font-black text-slate-950">
              No products found
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Try a different keyword or browse our categories.
            </p>
            <Link
              to="/categories"
              className="mt-6 inline-flex rounded-2xl bg-teal-600 px-6 py-3 text-sm font-black text-white hover:bg-teal-700"
            >
              Browse categories
            </Link>
          </div>
        ) : (
          <Suspense fallback={<SectionSkeleton />}>
            <FeaturedProducts
              products={products}
              loading={loading}
              error={error}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
              onWishlistToggle={handleWishlistToggle}
            />
          </Suspense>
        )}
      </div>
    </main>
  );
}
