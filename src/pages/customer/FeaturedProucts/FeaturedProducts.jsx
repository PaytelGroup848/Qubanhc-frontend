import { lazy, Suspense, memo } from 'react';
import { useDevice } from '../../../hooks/Customer/useDevice';

const DesktopView = lazy(() => import('./FeaturedProductsDesktop'));
const MobileView = lazy(() => import('./FeaturedProductsMobile'));

const SkeletonGrid = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {Array.from({ length: 8 }).map((_, i) => (
      <div
        key={i}
        className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
      >
        <div className="aspect-square bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 bg-[length:200%_100%] animate-[shimmer_1.6s_infinite]" />
        <div className="p-4 space-y-3">
          <div className="h-3 bg-slate-100 rounded-full w-1/3" />
          <div className="h-4 bg-slate-100 rounded-full w-3/4" />
          <div className="h-3 bg-slate-100 rounded-full w-1/2" />
          <div className="h-9 bg-slate-100 rounded-xl w-full mt-2" />
        </div>
      </div>
    ))}

    <style>{`
      @keyframes shimmer {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
    `}</style>
  </div>
);

const FeaturedProducts = memo(({
  products = [],
  loading = false,
  error = null,
  onAddToCart,
  onBuyNow,
  onWishlistToggle
}) => {
  const { isMobile } = useDevice();

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="inline-flex flex-col items-center gap-2">
          <p className="text-rose-500 font-semibold text-sm">
            Failed to load products. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<SkeletonGrid />}>
      {isMobile ? (
        <MobileView
          products={products}
          loading={loading}
          onAddToCart={onAddToCart}
          onBuyNow={onBuyNow}
          onWishlistToggle={onWishlistToggle}
        />
      ) : (
        <DesktopView
          products={products}
          loading={loading}
          onAddToCart={onAddToCart}
          onBuyNow={onBuyNow}
          onWishlistToggle={onWishlistToggle}
        />
      )}
    </Suspense>
  );
});

FeaturedProducts.displayName = 'FeaturedProducts';

export default FeaturedProducts;