import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import StarRating from '../../../components/StarRating';
import { useCart } from '../../../context/CartContext';
import toast from 'react-hot-toast';
import { wishlistService } from '../../../services/wishlist';
import { useAuth } from '../../../context/AuthContext';

const formatPrice = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount);
};

export default function ProductCard({ product, onWishlistToggle, variant = 'desktop' }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();

  const [isAdding, setIsAdding] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showCheck, setShowCheck] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(product.isWishlisted || false);
  const [ripple, setRipple] = useState(false);

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const isMobile = variant === 'mobile';

  // Add to cart with animation – uses context (unchanged)
  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (isAdding) return;
    setIsAdding(true);
    setRipple(true);
    setTimeout(() => setRipple(false), 400);

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      pack: null,
    });

    setShowCheck(true);
    setTimeout(() => setShowCheck(false), 800);

    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
    setIsAdding(false);
  };

  // Wishlist toggle (unchanged)
  const handleWishlistToggle = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      navigate('/login', { state: { from: window.location.pathname } });
      toast.error('Please login to use wishlist');
      return;
    }

    try {
      if (isWishlisted) {
        await wishlistService.removeFromWishlist(product.id);
        setIsWishlisted(false);
        toast.success('Removed from wishlist');
      } else {
        await wishlistService.addToWishlist(product.id);
        setIsWishlisted(true);
        toast.success('Added to wishlist');
      }

      if (onWishlistToggle) onWishlistToggle(product.id, isWishlisted);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Wishlist update failed');
    }
  };

  // Buy now redirect (unchanged)
  const handleBuyNow = (e) => {
    e.preventDefault();
    navigate('/checkout', { state: { product, quantity: 1 } });
  };

  return (
    <>
      <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-300 transform hover:-translate-y-2 flex flex-col overflow-hidden border border-slate-100 hover:border-emerald-200">
        {/* Image + badges */}
        <Link to={`/products/${product.id}`} className="relative overflow-hidden aspect-square bg-slate-50">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          {!isMobile && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/0 to-black/0 group-hover:from-black/15 transition-all flex items-end justify-center pb-4">
              <span className="bg-white text-slate-800 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wide opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all shadow-lg">
                Quick View
              </span>
            </div>
          )}

          <button
            onClick={handleWishlistToggle}
            className={`absolute top-2.5 left-2.5 z-10 h-8 w-8 rounded-full text-sm font-bold shadow-md transition-all duration-200 hover:scale-110 active:scale-95 ${
              isWishlisted ? 'bg-rose-500 text-white' : 'bg-white/85 backdrop-blur-sm text-slate-500'
            }`}
            aria-label="Add to wishlist"
          >
            {isWishlisted ? '♥' : '♡'}
          </button>

          <span className="absolute top-2.5 right-2.5 bg-white/85 backdrop-blur-md text-emerald-700 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm border border-white/40">
            {product.category}
          </span>

          {discountPercent && (
            <span className="absolute bottom-2.5 left-2.5 bg-rose-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-md">
              -{discountPercent}%
            </span>
          )}
        </Link>

        {/* Details */}
        <div className="p-3 sm:p-4 flex flex-col flex-grow">
          <Link to={`/products/${product.id}`} className="text-sm sm:text-[15px] font-semibold text-slate-800 hover:text-emerald-600 line-clamp-2 transition-colors">
            {product.name}
          </Link>
          <div className="mt-1">
            <StarRating rating={product.rating} reviews={product.reviews} />
          </div>
          <div className="mt-auto pt-2 sm:pt-3 flex items-baseline gap-2">
            <span className="text-[15px] sm:text-lg font-bold text-slate-900">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-xs text-slate-400 line-through">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
          <div className="mt-2 sm:mt-3 flex gap-2">
            {/* Add to Cart button (same animations, unchanged logic) */}
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className={`relative flex-1 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-200 flex items-center justify-center overflow-hidden ${
                isAdding
                  ? 'bg-slate-200 text-slate-400 cursor-wait'
                  : 'border border-emerald-500 text-emerald-600 hover:bg-emerald-50 hover:scale-105 active:scale-95'
              }`}
            >
              {isAdding ? (
                'Adding…'
              ) : showCheck ? (
                <span className="text-emerald-600 font-bold">Added ✓</span>
              ) : (
                'Add to Cart'
              )}
              {ripple && (
                <span className="absolute inset-0 animate-ripple bg-emerald-500/25 rounded-xl"></span>
              )}
            </button>

            {/* Buy Now (unchanged) */}
          </div>
        </div>
      </div>

      {/* Toast (unchanged) */}
      {showToast && (
        <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 backdrop-blur-sm">
            <span className="font-bold">✓</span>
            <span className="font-medium">Added to cart!</span>
            <Link to="/cart" className="text-white underline text-sm ml-2 hover:no-underline">
              View Cart
            </Link>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes ripple {
          0% { transform: scale(0, 0); opacity: 0.5; }
          100% { transform: scale(20, 20); opacity: 0; }
        }
        .animate-slide-up {
          animation: slideUp 0.3s ease-out;
        }
        .animate-ripple {
          animation: ripple 0.4s ease-out;
        }
      `}</style>
    </>
  );
}