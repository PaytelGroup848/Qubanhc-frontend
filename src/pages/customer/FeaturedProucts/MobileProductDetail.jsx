import { Link } from "react-router-dom";
import { useCart } from "../../../context/CartContext";
import toast from "react-hot-toast";
import StarRating from "../../../components/StarRating";
import MobileImageSlider from "./MobileImageSlider";
import QuantitySelector from "./QuantitySelector";
import Specifications from "./Specifications";
import ReviewSection from "./ReviewSection";
import { ShoppingCart, Truck, RotateCcw, Zap } from "lucide-react";
import { getImageUrl, getProductImage } from "../../../utils/imageUrl";
import { useState } from "react";

const formatPrice = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
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
  onBuyNow,
}) {
  const { addToCart } = useCart();
  const [showFullDescription, setShowFullDescription] = useState(false);

  const displayPrice = selectedVariant?.price || product.price;
  const displayOriginalPrice =
    selectedVariant?.originalPrice || product.originalPrice;
  const displayStock = selectedVariant?.stock ?? product.stock ?? 999;
  const outOfStock = displayStock === 0;
  const hasSizes = variants && variants.length > 0;
  const sizeSelected = !hasSizes || !!selectedVariant;

  // Check if description has more than ~3-4 lines (rough estimate based on character count)
  const descriptionLength = product.description?.length || 0;
  const hasLongDescription = descriptionLength > 150; // Adjust threshold as needed
  const truncatedDescription = product.description?.slice(0, 150) + "...";

  const handleAddToCart = () => {
    if (hasSizes && !selectedVariant) {
      toast.error("Please select a size first");
      return;
    }
    const productId = product._id;
    const variantId = selectedVariant?._id || null;
    addToCart(
      {
        id: productId,
        name: product.name,
        price: selectedVariant?.price || product.price,
        originalPrice: selectedVariant?.originalPrice || product.originalPrice,
        image: getProductImage(product),
        variantName: selectedVariant?.name || selectedVariant?.title || null,
      },
      quantity,
      variantId,
    );
    toast.success("Added to cart!");
  };

  const discountPercent = displayOriginalPrice
    ? Math.round(
        ((displayOriginalPrice - displayPrice) / displayOriginalPrice) * 100,
      )
    : 0;

  return (
    <div className="px-4 py-6">
      <div className="text-xs text-gray-500 mb-4">
        <Link to="/" className="hover:text-teal-600">
          Home
        </Link>
        {" / "}
        <Link
          to={`/category/${product.category?.slug || "products"}`}
          className="hover:text-teal-600"
        >
          {product.category?.name || "Products"}
        </Link>
        {" / "}
        <span className="text-gray-800">{product.name}</span>
      </div>

      <MobileImageSlider images={product.images || []} />

      <div className="mt-4 space-y-3">
        {product.brand && (
          <p className="text-xs font-semibold uppercase tracking-wider text-teal-600">
            {product.brand}
          </p>
        )}
        <h1 className="text-xl font-bold text-gray-900 leading-snug">
          {product.name}
        </h1>

        <div className="flex items-center gap-2">
          {/* <StarRating
            rating={product.rating || 0}
            reviews={product.totalRatings || 0}
          /> */}
          <span className="text-xs text-gray-400">
            {product.viewCount || 0} views
          </span>
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

        {product.shortDescription && (
          <p className="text-sm text-gray-700 font-medium leading-relaxed">
            {product.shortDescription}
          </p>
        )}

        {/* Description with Read More functionality */}
        {product.description && (
          <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
            {showFullDescription ? (
              product.description
            ) : (
              <>
                {truncatedDescription}
                {hasLongDescription && (
                  <button
                    onClick={() => setShowFullDescription(true)}
                    className="text-teal-600 font-semibold ml-1 hover:text-teal-700"
                  >
                    Read More
                  </button>
                )}
              </>
            )}
            {showFullDescription && (
              <button
                onClick={() => setShowFullDescription(false)}
                className="text-teal-600 font-semibold ml-1 hover:text-teal-700 block mt-1"
              >
                Show Less
              </button>
            )}
          </div>
        )}

        {product.unitsPerPack && product.unitsPerPack > 1 && (
          <span className="inline-flex items-center gap-1.5 bg-teal-50 text-teal-700 text-xs font-bold px-3 py-1 rounded-full border border-teal-200 w-fit">
            Pack of {product.unitsPerPack} pieces
          </span>
        )}
      </div>

      {/* Variants / Sizes */}
      {hasSizes && (
        <div className="mt-4">
          <div className="flex items-baseline justify-between mb-2">
            <h3 className="font-bold text-gray-800 text-sm">
              Select Size <span className="text-rose-500">*</span>
            </h3>
            {!sizeSelected && (
              <p className="text-xs font-semibold text-rose-500">
                Select a size
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {variants.map((variant) => {
              const active = selectedVariant?._id === variant._id;
              const variantStock = variant.stock ?? 999;
              const soldOut = variantStock === 0;
              return (
                <button
                  key={variant._id}
                  onClick={() => !soldOut && setSelectedVariant(variant)}
                  disabled={soldOut}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    soldOut
                      ? "border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed"
                      : active
                        ? "border-teal-500 bg-teal-50 shadow-sm border-2"
                        : "border-gray-200 hover:border-teal-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={`font-semibold text-xs ${active ? "text-teal-700" : soldOut ? "text-gray-400 line-through" : "text-gray-700"}`}
                    >
                      {variant.name}
                    </div>
                    {soldOut && (
                      <span className="text-[10px] text-gray-400 font-bold">
                        Sold
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <div className="text-xs text-gray-500 font-medium">
                      {formatPrice(variant.price)}
                    </div>
                    {!soldOut && variantStock <= 15 && (
                      <div className="text-[10px] font-bold text-rose-500">
                        {variantStock} left
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
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
          Total:{" "}
          <strong className="text-teal-600">
            {formatPrice(displayPrice * quantity)}
          </strong>
        </span>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={outOfStock || (hasSizes && !selectedVariant)}
          className="flex items-center justify-center gap-2 bg-teal-600 text-white py-3 rounded-full font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ShoppingCart className="w-5 h-5" />
          {hasSizes && !selectedVariant
            ? "Select Size"
            : outOfStock
              ? "Sold Out"
              : "Add to Cart"}
        </button>
        <button
          type="button"
          onClick={onBuyNow}
          disabled={outOfStock || (hasSizes && !selectedVariant)}
          className="flex items-center justify-center gap-2 bg-gray-900 text-white py-3 rounded-full font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Zap className="w-5 h-5" />
          Buy Now
        </button>
      </div>

      {/* Trust badges */}
      {/* <div className="mt-4 text-xs text-gray-500 flex flex-wrap gap-x-4 gap-y-1">
        <span className="flex items-center gap-1">
          <Truck className="w-4 h-4" /> Free Shipping over ₹999
        </span>
      </div> */}

      {/* Specifications & Reviews */}
      <div className="mt-8">
        <Specifications
          specs={product.specifications || []}
          images={(product.images || []).map((img) => ({
            url: getImageUrl(img?.url || img),
          }))}
        />
        <ReviewSection reviews={[]} productId={product._id} />
      </div>
    </div>
  );
}
