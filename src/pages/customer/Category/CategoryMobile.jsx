import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Filter,
  Heart,
  Search,
  ShoppingCart,
  SlidersHorizontal,
  Star,
  X,
} from 'lucide-react';
import SortDropdown from './SortDropdown';

function formatPrice(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(amount || 0));
}

function getProductId(product) {
  return product?._id || product?.id;
}

function getProductUrl(product) {
  return `/products/${product?.slug || getProductId(product)}`;
}

function getProductImage(product) {
  return (
    product?.images?.[0]?.url ||
    product?.images?.[0] ||
    product?.image?.url ||
    product?.image ||
    '/images/placeholder.jpg'
  );
}

function safeFilters(filters = {}, maxPrice = 100000) {
  return {
    search: filters.search || '',
    priceRange: filters.priceRange || [0, maxPrice],
    types: Array.isArray(filters.types) ? filters.types : [],
    rating: Number(filters.rating || 0),
    bestSellerOnly: Boolean(filters.bestSellerOnly),
    sortBy: filters.sortBy || 'featured',
  };
}

export default function CategoryMobile({
  products = [],
  category = {},
  filters = {},
  setFilters,
  availableTypes = [],
  maxPrice = 100000,
  onAddToCart,
  onBuyNow,
  onWishlistToggle,
  wishlist = [],
}) {
  const navigate = useNavigate();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const activeFilters = safeFilters(filters, maxPrice);

  const filtered = useMemo(() => {
    let result = [...products];

    const q = activeFilters.search.trim().toLowerCase();
    if (q) {
      result = result.filter((product) => {
        return (
          product?.name?.toLowerCase().includes(q) ||
          product?.description?.toLowerCase().includes(q)
        );
      });
    }

    result = result.filter((product) => {
      const price = Number(product?.price || 0);
      return price >= activeFilters.priceRange[0] && price <= activeFilters.priceRange[1];
    });

    if (activeFilters.types.length > 0) {
      result = result.filter((product) => {
        const productType = product?.type || product?.categoryType || product?.category?.name;
        return activeFilters.types.includes(productType);
      });
    }

    if (activeFilters.rating > 0) {
      result = result.filter((product) => Number(product?.rating || 0) >= activeFilters.rating);
    }

    if (activeFilters.bestSellerOnly) {
      result = result.filter((product) => product?.bestSeller === true || product?.isBestSeller === true);
    }

    switch (activeFilters.sortBy) {
      case 'price_low':
        result.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
        break;
      case 'price_high':
        result.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
        break;
      case 'rating':
        result.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
        break;
      case 'popular':
        result.sort((a, b) => Number(b.totalSold || 0) - Number(a.totalSold || 0));
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      default:
        break;
    }

    return result;
  }, [products, activeFilters.search, activeFilters.priceRange, activeFilters.types, activeFilters.rating, activeFilters.bestSellerOnly, activeFilters.sortBy]);

  const updateFilter = (patch) => {
    setFilters?.((prev) => ({
      ...safeFilters(prev, maxPrice),
      ...patch,
    }));
  };

  const resetFilters = () => {
    setFilters?.({
      search: '',
      priceRange: [0, maxPrice],
      types: [],
      rating: 0,
      bestSellerOnly: false,
      sortBy: 'featured',
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-teal-50/70 via-white to-slate-50 pb-24">
      <section className="sticky top-0 z-30 border-b border-teal-100 bg-white/95 px-4 py-3 backdrop-blur-xl">
        <div className="mb-3 flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700"
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          <div className="min-w-0 flex-1">
            <h1 className="truncate text-xl font-black text-slate-950">
              <span className="mr-1">{category?.icon || '📦'}</span>
              {category?.name || 'Category'}
            </h1>
            <p className="text-xs font-semibold text-slate-500">
              {filtered.length} of {products.length} products
            </p>
          </div>
        </div>

        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={activeFilters.search}
            onChange={(event) => updateFilter({ search: event.target.value })}
            placeholder="Search products..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm font-semibold outline-none focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-100"
          />
        </div>
      </section>

      <section className="px-4 py-4">
        <div className="mb-4 flex gap-3">
          <button
            type="button"
            onClick={() => setIsFilterOpen(true)}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white shadow-lg shadow-slate-200"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filter
          </button>

          <SortDropdown
            sortBy={activeFilters.sortBy}
            setSortBy={(value) => updateFilter({ sortBy: value })}
            className="flex-1"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-slate-100 bg-white p-10 text-center shadow-sm">
            <Filter className="mx-auto h-12 w-12 text-slate-300" />
            <h2 className="mt-4 text-lg font-black text-slate-950">
              No products match
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Try resetting filters or changing your search.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-5 rounded-2xl bg-teal-600 px-5 py-3 text-sm font-black text-white"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((product) => (
              <MobileProductCard
                key={getProductId(product)}
                product={product}
                isWishlisted={wishlist.includes(getProductId(product))}
                onAddToCart={onAddToCart}
                onBuyNow={onBuyNow}
                onWishlistToggle={onWishlistToggle}
              />
            ))}
          </div>
        )}
      </section>

      {isFilterOpen ? (
        <div className="fixed inset-0 z-[999] bg-slate-950/40 backdrop-blur-sm">
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
                onClick={() => setIsFilterOpen(false)}
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
                    value={activeFilters.priceRange[0]}
                    onChange={(event) =>
                      updateFilter({
                        priceRange: [
                          Math.max(0, Number(event.target.value || 0)),
                          activeFilters.priceRange[1],
                        ],
                      })
                    }
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-teal-400 focus:ring-4 focus:ring-teal-100"
                    placeholder="Min"
                  />

                  <input
                    type="number"
                    min="0"
                    value={activeFilters.priceRange[1]}
                    onChange={(event) =>
                      updateFilter({
                        priceRange: [
                          activeFilters.priceRange[0],
                          Math.min(maxPrice, Number(event.target.value || maxPrice)),
                        ],
                      })
                    }
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-teal-400 focus:ring-4 focus:ring-teal-100"
                    placeholder="Max"
                  />
                </div>
              </div>

              {availableTypes.length > 0 ? (
                <div>
                  <label className="text-sm font-black text-slate-800">
                    Product type
                  </label>

                  <div className="mt-2 flex flex-wrap gap-2">
                    {availableTypes.map((type) => {
                      const active = activeFilters.types.includes(type);

                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() =>
                            updateFilter({
                              types: active
                                ? activeFilters.types.filter((item) => item !== type)
                                : [...activeFilters.types, type],
                            })
                          }
                          className={`rounded-full px-4 py-2 text-xs font-black transition ${
                            active
                              ? 'bg-teal-600 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-teal-50 hover:text-teal-700'
                          }`}
                        >
                          {type}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              <div>
                <label className="text-sm font-black text-slate-800">
                  Minimum rating
                </label>

                <div className="mt-2 flex gap-2">
                  {[0, 3, 4, 4.5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => updateFilter({ rating })}
                      className={`rounded-full px-4 py-2 text-xs font-black ${
                        activeFilters.rating === rating
                          ? 'bg-amber-500 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {rating === 0 ? 'All' : `${rating}+ ★`}
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
                  checked={activeFilters.bestSellerOnly}
                  onChange={(event) =>
                    updateFilter({ bestSellerOnly: event.target.checked })
                  }
                  className="h-5 w-5 accent-teal-600"
                />
              </label>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={resetFilters}
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-700"
              >
                Reset
              </button>

              <button
                type="button"
                onClick={() => setIsFilterOpen(false)}
                className="rounded-2xl bg-teal-600 px-4 py-3 text-sm font-black text-white"
              >
                Show {filtered.length} products
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}

function MobileProductCard({
  product,
  isWishlisted,
  onAddToCart,
  onBuyNow,
  onWishlistToggle,
}) {
  const productId = getProductId(product);
  const discountPercent = product?.originalPrice
    ? Math.round(
        ((Number(product.originalPrice) - Number(product.price)) /
          Number(product.originalPrice)) *
          100
      )
    : 0;

  return (
    <article className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        <Link to={getProductUrl(product)} className="block h-full w-full">
          <img
            src={getProductImage(product)}
            alt={product?.name || 'Product'}
            className="h-full w-full object-cover transition duration-500 hover:scale-105"
            loading="lazy"
          />
        </Link>

        {discountPercent > 0 ? (
          <span className="absolute left-2 top-2 rounded-full bg-rose-500 px-2 py-1 text-[10px] font-black text-white">
            -{discountPercent}%
          </span>
        ) : null}

        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onWishlistToggle?.(productId, event);
          }}
          className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow-md"
          aria-label="Toggle wishlist"
        >
          <Heart
            className={`h-4 w-4 ${
              isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-slate-400'
            }`}
          />
        </button>
      </div>

      <div className="p-3">
        <Link to={getProductUrl(product)}>
          <h3 className="line-clamp-2 min-h-[40px] text-sm font-black leading-5 text-slate-900 hover:text-teal-700">
            {product?.name || 'Product'}
          </h3>
        </Link>

        <div className="mt-2 flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span className="text-xs font-bold text-slate-600">
            {Number(product?.rating || 0).toFixed(1)}
          </span>
          <span className="text-[11px] text-slate-400">
            ({product?.totalRatings || product?.reviews || 0})
          </span>
        </div>

        <div className="mt-2 flex flex-wrap items-baseline gap-1.5">
          <span className="text-base font-black text-teal-700">
            {formatPrice(product?.price)}
          </span>
          {product?.originalPrice ? (
            <span className="text-xs font-semibold text-slate-400 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          ) : null}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onAddToCart?.(product, event);
            }}
            className="flex items-center justify-center rounded-2xl bg-teal-600 px-2 py-2.5 text-xs font-black text-white"
          >
            <ShoppingCart className="mr-1 h-3.5 w-3.5" />
            Add
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onBuyNow?.(product, event);
            }}
            className="rounded-2xl border border-teal-600 px-2 py-2.5 text-xs font-black text-teal-700"
          >
            Buy
          </button>
        </div>
      </div>
    </article>
  );
}
