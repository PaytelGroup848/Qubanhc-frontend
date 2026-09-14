import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import toast from 'react-hot-toast';
import StarRating from '../../../components/StarRating';
import { getProductImage } from '../../../utils/imageUrl';

const formatPrice = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function FeaturedProductsDesktop({ products, loading, onWishlistToggle }) {
  const { addToCart } = useCart();
  const [wishlist, setWishlist] = useState([]);

  const handleAddToCart = async (product, e) => {
    e.preventDefault();
    const productId = product._id || product.id;
    await addToCart({
      id: productId,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images?.[0]?.url || '/images/placeholder.jpg',
      stock: product.stock,
    });
    toast.success(`${product.name} added to cart`);
  };

  const toggleWishlist = async (productId, e) => {
    e.preventDefault();
    e.stopPropagation();

    const isCurrentlyWishlisted = wishlist.includes(productId);

    if (onWishlistToggle) {
      const result = await onWishlistToggle(productId, isCurrentlyWishlisted);
      if (!result?.success) return;
    }

    setWishlist((prev) =>
      isCurrentlyWishlisted
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-100 animate-pulse overflow-hidden">
            <div className="aspect-square bg-slate-100" />
            <div className="p-4 space-y-3">
              <div className="h-3 bg-slate-100 rounded-full w-1/3" />
              <div className="h-4 bg-slate-100 rounded-full w-3/4" />
              <div className="h-3 bg-slate-100 rounded-full w-1/2" />
              <div className="h-9 bg-slate-100 rounded-xl w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-400 font-medium text-sm">No products found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => {
        const productId = product._id || product.id;
        const discountPercent = product.originalPrice
          ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
          : null;
        const getImageUrl = (url) => {
          if (!url) return '/images/placeholder.jpg';
          if (url.startsWith('http')) return url;
          return `https://qubanhygienecare.com${url}`;
        };

        const imageUrl = getImageUrl(product.images?.[0]?.url) || '/images/placeholder.jpg';
        const isWishlisted = wishlist.includes(productId);

        return (
          <div
            key={productId}
            className="group relative bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 transform hover:-translate-y-1 flex flex-col overflow-hidden"
          >
            <Link to={`/products/${product.slug || productId}`} className="relative overflow-hidden aspect-square bg-slate-50">
              <img
                src={imageUrl}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/0 via-black/0 to-black/0 group-hover:from-black/10 transition-all duration-300 flex items-end justify-center pb-4">
                <span className="bg-white text-slate-800 px-4 py-2 rounded-full font-semibold text-xs uppercase tracking-wide opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
                  Quick View
                </span>
              </div>

              <button
                onClick={(e) => toggleWishlist(productId, e)}
                aria-label="Toggle wishlist"
                className={`absolute top-3 left-3 z-10 h-8 w-8 rounded-full text-xs font-bold shadow transition-all duration-200 hover:scale-110 active:scale-95 ${
                  isWishlisted
                    ? 'bg-rose-500 text-white'
                    : 'bg-white/90 backdrop-blur-sm text-slate-500'
                }`}
              >
                {isWishlisted ? '♥' : '♡'}
              </button>

              <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-emerald-700 text-[11px] font-bold px-2.5 py-1 rounded-full shadow">
                {product.category?.name || 'Uncategorized'}
              </span>

              {discountPercent && discountPercent > 0 && (
                <span className="absolute bottom-3 left-3 bg-rose-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow">
                  -{discountPercent}%
                </span>
              )}
            </Link>

            <div className="p-4 flex flex-col flex-grow">
              <Link
                to={`/products/${product.slug || productId}`}
                className="text-[15px] font-semibold text-slate-800 hover:text-emerald-600 transition-colors line-clamp-2"
              >
                {product.name}
              </Link>

              <div className="mt-2">
                <StarRating rating={product.rating || 0} reviews={product.totalRatings || 0} />
              </div>

              <div className="mt-auto pt-4 flex items-baseline gap-2">
                <span className="text-lg font-bold text-slate-900">{formatPrice(product.price)}</span>
                {product.originalPrice && (
                  <span className="text-sm text-slate-400 line-through">{formatPrice(product.originalPrice)}</span>
                )}
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={(e) => handleAddToCart(product, e)}
                  className="flex-1 bg-slate-900 text-white py-2.5 rounded-xl font-semibold hover:bg-slate-800 transition-colors text-sm"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}