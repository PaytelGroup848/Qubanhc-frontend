import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../../context/CartContext";
import toast from "react-hot-toast";
import StarRating from "../../../components/StarRating";
import ImageGallery from "./ImageGallery";
import QuantitySelector from "./QuantitySelector";
import {
  ShoppingCart,
  Truck,
  RotateCcw,
  Shield,
  Star,
  ChevronRight,
  CheckCircle2,
  PackageCheck,
  Zap,
  User,
  Calendar,
  ThumbsUp,
  Send,
  Lock,
  Tag,
  BadgeCheck,
} from "lucide-react";

/* ══════════════════════════════════════════
   HELPERS
══════════════════════════════════════════ */
const formatPrice = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

/* ══════════════════════════════════════════
   REVIEW CARD
══════════════════════════════════════════ */
function ReviewCard({ review }) {
  const initials = review.userName
    ? review.userName
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const starColor = (s) =>
    s <= review.rating
      ? "fill-amber-400 text-amber-400"
      : "fill-gray-100 text-gray-100";

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 p-5 hover:border-teal-200 hover:shadow-[0_4px_24px_rgba(13,148,136,0.08)] transition-all duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white font-bold text-sm shadow flex-shrink-0">
            {initials}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <p className="font-semibold text-gray-800 text-sm">
                {review.userName || "Anonymous"}
              </p>
              {review.verified && (
                <BadgeCheck className="w-3.5 h-3.5 text-teal-500" />
              )}
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Calendar className="w-3 h-3 text-gray-300" />
              <span className="text-xs text-gray-400">
                {formatDate(review.createdAt)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-0.5 bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-100 px-2.5 py-1 rounded-full">
          <Star className="w-3 h-3 fill-teal-500 text-teal-500" />
          <span className="text-xs font-bold text-teal-600 ml-0.5">
            {review.rating}.0
          </span>
        </div>
      </div>

      {/* Stars visual */}
      <div className="flex gap-0.5 mb-2">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star key={s} className={`w-3.5 h-3.5 ${starColor(s)}`} />
        ))}
      </div>

      {review.title && (
        <p className="font-bold text-gray-800 text-sm mb-1">{review.title}</p>
      )}
      <p className="text-gray-500 text-sm leading-relaxed">{review.comment}</p>

      {review.helpful !== undefined && (
        <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-gray-50">
          <ThumbsUp className="w-3.5 h-3.5 text-gray-300 group-hover:text-teal-400 transition-colors" />
          <span className="text-xs text-gray-400">
            {review.helpful} people found this helpful
          </span>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   REVIEW SECTION
══════════════════════════════════════════ */
function ReviewSection({ reviews = [], productId, currentUser }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [title, setTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [localReviews, setLocalReviews] = useState(reviews);

  const avgRating = localReviews.length
    ? (
        localReviews.reduce((s, r) => s + r.rating, 0) / localReviews.length
      ).toFixed(1)
    : null;

  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: localReviews.filter((r) => r.rating === star).length,
  }));

  const handleSubmit = async () => {
    if (!rating || !comment.trim()) return;
    setSubmitting(true);
    // ── Your backend call goes here ──────────────────────────
    const newReview = {
      _id: Date.now(),
      userName: currentUser?.name || "You",
      rating,
      title,
      comment,
      createdAt: new Date().toISOString(),
      helpful: 0,
      verified: true,
    };
    setLocalReviews((prev) => [newReview, ...prev]);
    setRating(0);
    setTitle("");
    setComment("");
    toast.success("Review submitted!");
    setSubmitting(false);
  };

  const ratingLabels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

  return (
    <section id="reviews" className="mt-16 scroll-mt-8">
      {/* Section heading */}
      <div className="flex items-center gap-3 mb-10">
        <div className="h-8 w-1 rounded-full bg-gradient-to-b from-teal-400 to-emerald-500" />
        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
          Customer Reviews
        </h2>
        {localReviews.length > 0 && (
          <span className="ml-1 text-sm text-gray-400 font-medium">
            ({localReviews.length})
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ── Rating summary panel ── */}
        <div className="lg:col-span-4">
          <div className="bg-gradient-to-br from-teal-50 via-white to-emerald-50 rounded-3xl p-6 border border-teal-100 sticky top-6">
            {avgRating ? (
              <>
                <p className="text-xs font-bold text-teal-500 uppercase tracking-widest mb-3">
                  Overall Rating
                </p>
                <div className="flex items-end gap-3 mb-3">
                  <span className="text-7xl font-black text-gray-900 leading-none">
                    {avgRating}
                  </span>
                  <span className="text-2xl font-bold text-gray-300 mb-2">
                    / 5
                  </span>
                </div>
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-5 h-5 ${s <= Math.round(avgRating) ? "fill-amber-400 text-amber-400" : "fill-gray-100 text-gray-100"}`}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-400 mb-6">
                  Based on {localReviews.length} review
                  {localReviews.length !== 1 ? "s" : ""}
                </p>

                <div className="space-y-2.5">
                  {ratingCounts.map(({ star, count }) => {
                    const pct = localReviews.length
                      ? (count / localReviews.length) * 100
                      : 0;
                    return (
                      <div
                        key={star}
                        className="flex items-center gap-2.5 text-sm"
                      >
                        <span className="w-3 text-gray-500 font-semibold text-xs">
                          {star}
                        </span>
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400 flex-shrink-0" />
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full transition-all duration-700"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="w-5 text-right text-gray-400 text-xs font-medium">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="text-center py-6">
                <div className="w-12 h-12 rounded-2xl bg-teal-100 flex items-center justify-center mx-auto mb-3">
                  <Star className="w-6 h-6 text-teal-400" />
                </div>
                <p className="font-semibold text-gray-700 text-sm">
                  No reviews yet
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  Be the first to share your experience
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── Write + List ── */}
        <div className="lg:col-span-8 space-y-5">
          {/* Write a review */}
          {currentUser ? (
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white font-bold text-sm">
                  {currentUser.name?.[0]?.toUpperCase() || "U"}
                </div>
                <div>
                  <p className="font-bold text-gray-800 text-sm">
                    Write a Review
                  </p>
                  <p className="text-xs text-gray-400">as {currentUser.name}</p>
                </div>
              </div>

              {/* Star picker */}
              <div className="flex items-center gap-1.5 mb-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    onMouseEnter={() => setHoverRating(s)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(s)}
                    className="transition-transform active:scale-90 hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 transition-colors duration-150 ${
                        s <= (hoverRating || rating)
                          ? "fill-amber-400 text-amber-400"
                          : "fill-gray-100 text-gray-100"
                      }`}
                    />
                  </button>
                ))}
                {(hoverRating || rating) > 0 && (
                  <span className="ml-2 text-sm font-semibold text-teal-600">
                    {ratingLabels[hoverRating || rating]}
                  </span>
                )}
              </div>

              <input
                type="text"
                placeholder="Give your review a title (optional)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-150 bg-gray-50 rounded-xl px-4 py-3 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:bg-white transition-all placeholder-gray-300"
              />
              <textarea
                placeholder="What did you think about this product? Your honest opinion helps others."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="w-full border border-gray-150 bg-gray-50 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-300 focus:bg-white transition-all placeholder-gray-300"
              />
              <div className="flex items-center justify-between mt-3">
                <p className="text-xs text-gray-300">
                  {comment.length}/500 characters
                </p>
                <button
                  onClick={handleSubmit}
                  disabled={!rating || !comment.trim() || submitting}
                  className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-6 py-2.5 rounded-full text-sm font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-teal-200 transition-all active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  {submitting ? "Submitting…" : "Post Review"}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-gray-50 to-teal-50/30 border border-dashed border-teal-200 rounded-3xl p-6 flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                <Lock className="w-5 h-5 text-gray-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-700 text-sm">
                  Login to leave a review
                </p>
                <p className="text-gray-400 text-xs mt-0.5">
                  Only verified buyers can write reviews.
                </p>
              </div>
              <Link
                to="/login"
                className="flex-shrink-0 bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:shadow-md transition-all active:scale-95"
              >
                Login
              </Link>
            </div>
          )}

          {/* Review list */}
          {localReviews.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {localReviews.map((review) => (
                <ReviewCard key={review._id} review={review} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-14 text-center">
              <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-3">
                <Star className="w-7 h-7 text-gray-200" />
              </div>
              <p className="font-semibold text-gray-500 text-sm">
                No reviews yet
              </p>
              <p className="text-gray-300 text-xs mt-1">
                Your review could be the first one!
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   TRUST BADGE
══════════════════════════════════════════ */
function TrustBadge({ icon: Icon, label, sub }) {
  return (
    <div className="flex items-center gap-3 py-3 px-4 rounded-2xl bg-gray-50 hover:bg-teal-50/60 transition-colors duration-200 group">
      <div className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0 group-hover:shadow-teal-100 transition-shadow">
        <Icon className="w-4.5 h-4.5 text-teal-600" strokeWidth={1.75} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-bold text-gray-700 leading-tight">{label}</p>
        {sub && (
          <p className="text-xs text-gray-400 mt-0.5 leading-tight">{sub}</p>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   SPECIFICATIONS TABLE
══════════════════════════════════════════ */
function SpecTable({ specs }) {
  if (!specs?.length) return null;
  return (
    <section className="mt-16">
      <div className="flex items-center gap-3 mb-8">
        <div className="h-8 w-1 rounded-full bg-gradient-to-b from-teal-400 to-emerald-500" />
        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
          Specifications
        </h2>
      </div>
      <div className="rounded-2xl overflow-hidden border border-gray-100">
        {specs.map((spec, i) => (
          <div
            key={i}
            className={`flex text-sm ${i % 2 === 0 ? "bg-gray-50/80" : "bg-white"} hover:bg-teal-50/30 transition-colors`}
          >
            <div className="w-2/5 px-5 py-4 text-gray-400 font-medium border-r border-gray-100 flex items-center">
              {spec.key || spec.label}
            </div>
            <div className="flex-1 px-5 py-4 text-gray-800 font-semibold flex items-center">
              {spec.value}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
export default function ProductDetailDesktop({
  product,
  variants,
  selectedVariant,
  setSelectedVariant,
  quantity,
  setQuantity,
  onBuyNow,
  currentUser,
}) {
  const { addToCart } = useCart();
  const [showFullDescription, setShowFullDescription] = useState(false);

  const displayPrice = selectedVariant?.price || product.price;
  const displayOriginalPrice =
    selectedVariant?.originalPrice || product.originalPrice;
  const displayStock = selectedVariant?.stock ?? product.stock ?? 999;
  const lowStock = displayStock > 0 && displayStock <= 10;
  const outOfStock = displayStock === 0;

  const hasSizes = variants && variants.length > 0;
  const sizeSelected = !hasSizes || !!selectedVariant;

  const discountPercent =
    displayOriginalPrice && displayOriginalPrice > displayPrice
      ? Math.round(
          ((displayOriginalPrice - displayPrice) / displayOriginalPrice) * 100,
        )
      : 0;

  const descriptionLength = product.description?.length || 0;
  const hasLongDescription = descriptionLength > 150;
  const truncatedDescription = product.description?.slice(0, 150) + "...";

  const handleAddToCart = () => {
    if (hasSizes && !selectedVariant) {
      toast.error("Please select a size before adding to cart");
      return;
    }
    addToCart(
      {
        id: product._id,
        name: product.name,
        price: displayPrice,
        originalPrice: displayOriginalPrice,
        image: product.images?.[0]?.url || "/images/placeholder.jpg",
        variantName: selectedVariant?.name || selectedVariant?.title || null,
      },
      quantity,
      selectedVariant?._id || null,
    );
    toast.success("Added to cart!");
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        {/* ── Breadcrumb ── */}
        <nav className="flex items-center flex-wrap gap-1 text-xs sm:text-sm text-gray-400 mb-6 lg:mb-8">
          <Link
            to="/"
            className="hover:text-teal-600 transition-colors font-medium"
          >
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
          <Link
            to={`/category/${product.category?.slug || "products"}`}
            className="hover:text-teal-600 transition-colors font-medium"
          >
            {product.category?.name || "Products"}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="text-gray-600 font-semibold truncate max-w-[180px] sm:max-w-xs">
            {product.name}
          </span>
        </nav>

        {/* ══════════════════════════════════════
            PRODUCT HERO CARD
        ══════════════════════════════════════ */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* ── Image Gallery ── */}
            <div className="lg:w-[46%]  bg-gradient-to-br from-gray-50 to-slate-50 border-b lg:border-b-0 lg:border-r border-gray-100 p-4 sm:p-6 lg:p-8">
              <ImageGallery images={product.images || []} isMobile={false} />
            </div>

            {/* ── Product Info ── */}
            <div className="flex-1 p-5 sm:p-7 lg:p-8 space-y-5">
              {/* Status badges */}
              <div className="flex flex-wrap gap-2">
                {product.isBestseller && (
                  <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 text-xs font-bold px-3 py-1 rounded-full border border-amber-200 shadow-sm">
                    <Zap className="w-3 h-3" /> Bestseller
                  </span>
                )}
                {product.isNew && (
                  <span className="inline-flex items-center gap-1.5 bg-violet-50 text-violet-700 text-xs font-bold px-3 py-1 rounded-full border border-violet-200 shadow-sm">
                    ✦ New Arrival
                  </span>
                )}
                {lowStock && !outOfStock && (
                  <span className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-600 text-xs font-bold px-3 py-1 rounded-full border border-rose-200 shadow-sm">
                    Only {displayStock} left
                  </span>
                )}
                {outOfStock && (
                  <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-500 text-xs font-bold px-3 py-1 rounded-full border border-gray-200">
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Product name */}
              <h1 className="text-xl sm:text-2xl lg:text-[1.6rem] font-extrabold text-gray-900 leading-snug tracking-tight">
                {product.name}
              </h1>

              {/* Rating row */}
              <div className="flex items-center gap-3 flex-wrap">
                {/* <StarRating rating={product.rating || 0} reviews={product.totalRatings || 0} /> */}
                {/* <span className="w-px h-4 bg-gray-200" /> */}
                <span className="text-sm text-gray-400">
                  {product.viewCount || 0} views
                </span>
                {product.soldCount > 0 && (
                  <>
                    <span className="w-px h-4 bg-gray-200" />
                    <span className="text-sm text-gray-400">
                      {product.soldCount}+ sold
                    </span>
                  </>
                )}
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent" />

              {/* Price block */}
              <div className="space-y-1">
                <div className="flex items-baseline flex-wrap gap-2.5">
                  <span className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
                    {formatPrice(displayPrice)}
                  </span>
                  {displayOriginalPrice > displayPrice && (
                    <span className="text-base sm:text-lg text-gray-300 line-through font-medium">
                      {formatPrice(displayOriginalPrice)}
                    </span>
                  )}
                  {discountPercent > 0 && (
                    <span className="bg-gradient-to-r from-rose-500 to-red-500 text-white text-xs sm:text-sm font-extrabold px-3 py-1 rounded-full shadow-sm">
                      {discountPercent}% OFF
                    </span>
                  )}
                </div>
                {discountPercent > 0 && (
                  <p className="text-sm text-emerald-600 font-semibold flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" />
                    You save {formatPrice(
                      displayOriginalPrice - displayPrice,
                    )}{" "}
                    on this order
                  </p>
                )}
                <p className="text-xs text-gray-400">Inclusive of all taxes</p>
                {product.unitsPerPack && product.unitsPerPack > 1 && (
                  <span className="inline-flex items-center gap-1.5 bg-teal-50 text-teal-700 text-xs font-bold px-3 py-1 rounded-full border border-teal-200 w-fit mt-1">
                    <PackageCheck className="w-3 h-3" />
                    Pack of {product.unitsPerPack} pieces
                  </span>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <div className="text-gray-500 text-sm leading-relaxed">
                  {showFullDescription ? (
                    product.description
                  ) : (
                    <>
                      {truncatedDescription}
                      {hasLongDescription && (
                        <button
                          onClick={() => setShowFullDescription(true)}
                          className="text-teal-600 cursor-pointer font-semibold ml-1 hover:text-teal-700 hover:underline transition-colors"
                        >
                          Read More
                        </button>
                      )}
                    </>
                  )}
                  {showFullDescription && (
                    <button
                      onClick={() => setShowFullDescription(false)}
                      className="text-teal-600 font-semibold mt-1 hover:text-teal-700 hover:underline transition-colors block"
                    >
                      Show Less
                    </button>
                  )}
                </div>
              )}

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent" />

              {/* Variants / Sizes */}
              {hasSizes && (
                <div>
                  <div className="flex items-baseline justify-between mb-1">
                    <p className="text-xs font-extrabold text-gray-400 uppercase tracking-widest">
                      Select Size <span className="text-rose-500">*</span>
                    </p>
                    {!sizeSelected && (
                      <p className="text-xs font-semibold text-rose-500">
                        Please select a size
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                    {variants.map((variant) => {
                      const active = selectedVariant?._id === variant._id;
                      const variantStock = variant.stock ?? 999;
                      const soldOut = variantStock === 0;
                      return (
                        <button
                          key={variant._id}
                          type="button"
                          onClick={() =>
                            !soldOut && setSelectedVariant(variant)
                          }
                          disabled={soldOut}
                          className={`relative p-3.5 rounded-2xl border-2 text-left transition-all duration-200 ${
                            soldOut
                              ? "border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed"
                              : active
                                ? "border-teal-500 bg-gradient-to-br from-teal-50 to-emerald-50 shadow-md shadow-teal-100 active:scale-[0.97]"
                                : "border-gray-100 bg-gray-50 hover:border-teal-200 hover:bg-teal-50/30 active:scale-[0.97]"
                          }`}
                        >
                          {active && (
                            <CheckCircle2 className="absolute top-2.5 right-2.5 w-4 h-4 text-teal-500 fill-white" />
                          )}
                          {soldOut && (
                            <span className="absolute top-2 right-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                              Sold out
                            </span>
                          )}
                          <p
                            className={`text-sm font-bold pr-5 ${active ? "text-teal-700" : soldOut ? "text-gray-400 line-through" : "text-gray-700"}`}
                          >
                            {variant.name}
                          </p>
                          <div className="flex items-end justify-between mt-1 pr-5">
                            {/* <p
                              className={`text-sm font-bold ${active ? "text-teal-600" : "text-gray-500"}`}
                            >
                              {formatPrice(variant.price)}
                            </p> */}
                            {!soldOut && variantStock <= 15 && (
                              <p className="text-[10px] font-bold text-rose-500">
                                Only {variantStock} left
                              </p>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity + Total */}
              <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50/80 px-4 py-3.5 gap-4">
                <div>
                  <p className="text-[10px] font-extrabold text-gray-300 uppercase tracking-widest mb-1">
                    Qty
                  </p>
                  <QuantitySelector
                    quantity={quantity}
                    setQuantity={setQuantity}
                    max={displayStock}
                  />
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-extrabold text-gray-300 uppercase tracking-widest mb-1">
                    Total
                  </p>
                  <p className="text-xl sm:text-2xl font-black text-gray-900">
                    {formatPrice(displayPrice * quantity)}
                  </p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={outOfStock || (hasSizes && !selectedVariant)}
                  className="flex-1 flex items-center justify-center gap-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 text-white py-3.5 rounded-2xl font-bold text-sm sm:text-base hover:from-teal-600 hover:to-emerald-600 hover:shadow-xl hover:shadow-teal-200/60 transition-all duration-300 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {hasSizes && !selectedVariant
                    ? "Select Size First"
                    : outOfStock
                      ? "Out of Stock"
                      : "Add to Cart"}
                </button>
              </div>

              {/* Delivery bar */}
              <div className="flex items-center gap-3 bg-gradient-to-r from-emerald-50 to-teal-50/60 border border-emerald-100 rounded-2xl px-4 py-3">
                <PackageCheck className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <p className="text-sm text-emerald-700 font-medium leading-snug">
                  Order now — estimated delivery in{" "}
                  <strong>3–5 business days</strong>
                </p>
              </div>

              {/* Trust badges */}
              {/* <div className="grid grid-cols-3 gap-2">
                <TrustBadge
                  icon={Truck}
                  label="Free Shipping"
                  sub="Above ₹999"
                />

                <TrustBadge
                  icon={Shield}
                  label="Secure Payment"
                  sub="256-bit SSL"
                />
              </div> */}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════
            SPECS + REVIEWS CARD
        ══════════════════════════════════════ */}
        <div className="mt-8 bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8 lg:p-10">
          <SpecTable specs={product.specifications} />
          <ReviewSection
            reviews={[]}
            productId={product._id}
            currentUser={currentUser}
          />
        </div>
      </div>
    </div>
  );
}
