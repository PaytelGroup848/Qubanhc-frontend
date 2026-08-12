import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import toast from 'react-hot-toast';
import StarRating from '../../../components/StarRating';
import MobileImageSlider from './MobileImageSlider';
import QuantitySelector from './QuantitySelector';
import Specifications from './Specifications';
import ReviewSection from './ReviewSection';
import { ShoppingCart, Truck, RotateCcw } from 'lucide-react';

const formatPrice = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function MobileProductDetail({ 
  product, 
  variants, 
  selectedVariant, 
  setSelectedVariant,
  quantity,
  setQuantity,
  onAddToCart,
  onBuyNow
}) {
  const { addToCart } = useCart();
  const displayPrice = selectedVariant?.price || product.price;
const displayOriginalPrice = selectedVariant?.originalPrice || product.originalPrice;
const displayStock = selectedVariant?.stock ?? product.stock ?? 999;

  const handleAddToCart = () => {
    const productId = product._id;
    const variantId = selectedVariant?._id || null;
   addToCart(
  {
    id: productId,
    name: product.name,
    price: selectedVariant?.price || product.price,
    originalPrice: selectedVariant?.originalPrice || product.originalPrice,
    image: product.images?.[0]?.url || '/images/placeholder.jpg',
    variantName: selectedVariant?.name || selectedVariant?.title || null,
  },
  quantity,
  variantId
);
    toast.success('Added to cart!');
  };

  const discountPercent = displayOriginalPrice
  ? Math.round(((displayOriginalPrice - displayPrice) / displayOriginalPrice) * 100)
  : 0;

  return (
    <div className="px-4 py-6">
      <div className="text-xs text-gray-500 mb-4">
        <Link to="/" className="hover:text-teal-600">Home</Link>
        {' / '}
        <Link to={`/category/${product.category?.slug || 'products'}`} className="hover:text-teal-600">
          {product.category?.name || 'Products'}
        </Link>
        {' / '}
        <span className="text-gray-800">{product.name}</span>
      </div>

      <MobileImageSlider images={product.images || []} />

      <div className="mt-4 space-y-3">
        <h1 className="text-xl font-bold text-gray-900">{product.name}</h1>
        
        <div className="flex items-center gap-2">
          <StarRating rating={product.rating || 0} reviews={product.totalRatings || 0} />
          <span className="text-xs text-gray-400">{product.viewCount || 0} views</span>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-teal-600">
            {formatPrice(displayPrice)}
          </span>
          {displayOriginalPrice > displayPrice && (
  <span className="line-through text-gray-400">
    {formatPrice(displayOriginalPrice)}
  </span>
)}
          {discountPercent > 0 && (
            <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">
              -{discountPercent}%
            </span>
          )}
        </div>

        <p className="text-sm text-gray-600">{product.description}</p>
        {(product.unitsPerPack && product.unitsPerPack > 1) && (
          <span className="inline-flex items-center gap-1.5 bg-teal-50 text-teal-700 text-xs font-bold px-3 py-1 rounded-full border border-teal-200 w-fit">
            Pack of {product.unitsPerPack} pieces
          </span>
        )}
      </div>

      {/* Variants */}
      {variants && variants.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold text-gray-800 mb-2">Select Variant</h3>
          <div className="grid grid-cols-2 gap-2">
            {variants.map((variant) => (
              <button
                key={variant._id}
                onClick={() => setSelectedVariant(variant)}
                className={`p-3 rounded-lg border text-sm transition-all ${
                  selectedVariant?._id === variant._id
                    ? 'border-teal-600 bg-teal-50 text-teal-700 shadow-sm'
                    : 'border-gray-200 hover:border-teal-300'
                }`}
              >
                <div className="font-medium text-xs">{variant.name}</div>
                <div className="text-xs text-gray-500">{formatPrice(variant.price)}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div className="mt-4 flex items-center gap-4">
        <QuantitySelector
          quantity={quantity}
          setQuantity={setQuantity}
          max={displayStock}
        />
        <span className="text-gray-600">
          Total: <strong className="text-teal-600">
        {formatPrice(displayPrice * quantity)}
          </strong>
        </span>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          onClick={handleAddToCart}
          className="flex items-center justify-center gap-2 bg-teal-600 text-white py-3 rounded-full font-semibold"
        >
          <ShoppingCart className="w-5 h-5" /> Add to Cart
        </button>
      </div>

      {/* Trust Badges */}
      <div className="mt-4 text-xs text-gray-500 flex flex-wrap gap-x-4 gap-y-1">
        <span className="flex items-center gap-1"><Truck className="w-4 h-4" /> Free Shipping over ₹999</span>
        <span className="flex items-center gap-1"><RotateCcw className="w-4 h-4" /> 30-day returns</span>
      </div>

      {/* Specifications & Reviews */}
      <div className="mt-8">
        <Specifications specs={product.specifications || []} images={[]} />
        <ReviewSection reviews={[]} productId={product._id} />
      </div>
    </div>
  );
}