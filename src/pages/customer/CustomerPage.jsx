import { lazy, Suspense, useCallback, memo, useEffect, useState } from "react";
import Hero from "./Hero";
import NewsLetter from "./NewsLetter";
import Features from "./Features";
import { useCart } from "../../context/CartContext";
import toast from "react-hot-toast";
import { productService } from "../../services/product";
import { useNavigate } from "react-router-dom";
import { wishlistService } from "../../services/wishlist";
import { useAuth } from "../../context/AuthContext";
import Pagination, { extractPagination } from "../../components/Pagination";

const FeaturedProducts = lazy(
  () => import("./FeaturedProucts/FeaturedProducts"),
);

const SectionSkeleton = ({ height = "h-[360px]" }) => (
  <div
    className={`w-full ${height} animate-pulse rounded-[2rem] bg-gradient-to-br from-gray-100 via-teal-50 to-gray-100`}
  />
);

const CustomerPage = memo(() => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
  });

  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await productService.getAllProducts({
          page,
          limit: 20,
        });
        const payload = response?.data || response || {};
        const nextProducts = payload?.products || payload?.data?.products || [];

        if (mounted) {
          setProducts(Array.isArray(nextProducts) ? nextProducts : []);
          setPagination(
            extractPagination(payload, {
              page,
              limit: 20,
              total: Array.isArray(nextProducts) ? nextProducts.length : 0,
            }),
          );
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        if (mounted) setError("Failed to load products");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      mounted = false;
    };
  }, [page]);

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
      if (!requireLogin("/")) return;

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
    [addToCart, requireLogin],
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
      if (!requireLogin("/")) {
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
    [requireLogin],
  );

  const hasError = error && products.length === 0;

  return (
    <main className="min-h-screen overflow-hidden bg-white">
      <Hero />

      <section className="relative bg-gradient-to-b from-white to-gray-50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="inline-flex rounded-full bg-teal-50 px-4 py-2 text-xs font-black uppercase tracking-wider text-teal-700 ring-1 ring-teal-100">
                Best picks
              </span>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-gray-950 sm:text-4xl">
                Featured Products
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
                Explore reliable healthcare products selected for comfort,
                quality and everyday care.
              </p>
            </div>
          </div>

          {hasError ? (
            <div className="rounded-[2rem] border border-red-100 bg-red-50 p-10 text-center">
              <p className="font-black text-red-600">{error}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-5 rounded-full bg-teal-600 px-5 py-3 text-sm font-black text-white hover:bg-teal-700"
              >
                Try Again
              </button>
            </div>
          ) : (
            <Suspense fallback={<SectionSkeleton height="h-[420px]" />}>
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

          {!hasError && pagination.totalPages > 1 ? (
            <Pagination
              className="mt-8"
              page={pagination.page}
              totalPages={pagination.totalPages}
              total={pagination.total}
              limit={pagination.limit}
              onPageChange={setPage}
            />
          ) : null}
        </div>
      </section>

      <Features />
      <NewsLetter />
    </main>
  );
});

CustomerPage.displayName = "CustomerPage";

export default CustomerPage;
