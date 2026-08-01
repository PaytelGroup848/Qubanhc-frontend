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

export default function FeaturedProductsMobile({ products, loading, onWishlistToggle }) {
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
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex gap-4 bg-white rounded-2xl border border-slate-100 shadow-sm animate-pulse p-3">
            <div className="w-28 h-28 bg-slate-100 rounded-xl flex-shrink-0" />
            <div className="flex-1 space-y-3 py-1">
              <div className="h-3 bg-slate-100 rounded-full w-1/2" />
              <div className="h-4 bg-slate-100 rounded-full w-3/4" />
              <div className="h-3 bg-slate-100 rounded-full w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400 font-medium text-sm">No products found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
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
          <Link
            key={productId}
            to={`/products/${product.slug || productId}`}
            className="flex gap-4 bg-white rounded-2xl border border-slate-100 shadow-sm p-3 active:scale-[0.98] transition-transform"
          >
            <div className="relative w-28 h-28 flex-shrink-0 rounded-xl overflow-hidden bg-slate-50">
              <img
                src={imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {discountPercent && discountPercent > 0 && (
                <span className="absolute top-1.5 left-1.5 bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  -{discountPercent}%
                </span>
              )}
              <button
                onClick={(e) => { e.preventDefault(); toggleWishlist(productId, e); }}
                aria-label="Toggle wishlist"
                className={`absolute top-1.5 right-1.5 z-10 h-6 w-6 rounded-full text-[11px] font-bold shadow ${
                  isWishlisted ? 'bg-rose-500 text-white' : 'bg-white/90 text-slate-500'
                }`}
              >
                {isWishlisted ? '♥' : '♡'}
              </button>
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-slate-800 line-clamp-2">{product.name}</h3>
              <div className="mt-1">
                <StarRating rating={product.rating || 0} reviews={product.totalRatings || 0} />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-base font-bold text-emerald-600">{formatPrice(product.price)}</span>
                {product.originalPrice && (
                  <span className="text-xs text-slate-400 line-through">{formatPrice(product.originalPrice)}</span>
                )}
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={(e) => { e.preventDefault(); handleAddToCart(product, e); }}
                  className="flex-1 bg-slate-900 text-white py-2 rounded-lg text-xs font-semibold"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}