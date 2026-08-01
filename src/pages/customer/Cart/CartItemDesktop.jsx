import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Heart, ImageOff, Star, Tag, Trash2, Zap } from "lucide-react";
import { useCart } from "../../../context/CartContext";
import QuantitySelector from "../FeaturedProucts/QuantitySelector";

const PLACEHOLDER_IMAGE = "/images/placeholder.jpg";

function fmt(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function getDiscountPercent(originalPrice, price) {
  const original = Number(originalPrice || 0);
  const current = Number(price || 0);
  if (!original || !current || original <= current) return 0;
  return Math.round(((original - current) / original) * 100);
}

function getProductPath(item) {
  return `/products/${item.slug || item.productSlug || item.id || item.productId}`;
}

export default function CartItemDesktop({ item }) {
  const { updateQuantity, removeFromCart } = useCart();
  const [wishlisted, setWishlisted] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [imageError, setImageError] = useState(false);

  const price = Number(item.price || 0);
  const originalPrice = Number(item.originalPrice || 0);
  const quantity = Number(item.quantity || 1);
  const stock = Number.isFinite(Number(item.stock)) ? Number(item.stock) : 99;
  const total = price * quantity;
  const discountPercent = getDiscountPercent(originalPrice, price);
  const savings =
    originalPrice > price ? (originalPrice - price) * quantity : 0;

  const productPath = useMemo(() => getProductPath(item), [item]);

  const handleRemove = () => {
    setRemoving(true);
    window.setTimeout(() => {
      removeFromCart(item.id, item.packId || item.variantId);
      window.dispatchEvent(new Event("cart-changed"));
    }, 220);
  };

  const handleQuantityChange = (nextQuantity) => {
    updateQuantity(item.id, item.packId || item.variantId, nextQuantity);
    window.dispatchEvent(new Event("cart-changed"));
    // window.location.reload();
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: removing ? 0 : 1, x: removing ? -32 : 0 }}
      exit={{ opacity: 0, x: -32, height: 0 }}
      transition={{ duration: 0.22 }}
      className="group grid grid-cols-[2.2fr_0.9fr_1fr_1fr_auto] items-center gap-5 border-b border-slate-100 px-6 py-5 last:border-0 hover:bg-gradient-to-r hover:from-teal-50/60 hover:to-white"
    >
      <div className="flex min-w-0 items-center gap-4">
        <Link
          to={productPath}
          className="relative h-[82px] w-[82px] flex-shrink-0 overflow-hidden rounded-2xl bg-slate-100 shadow-sm ring-1 ring-slate-200 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-teal-100 group-hover:ring-teal-200"
        >
          {imageError ? (
            <div className="flex h-full w-full items-center justify-center text-slate-300">
              <ImageOff className="h-6 w-6" />
            </div>
          ) : (
            <img
              src={item.image || PLACEHOLDER_IMAGE}
              alt={item.name || "Product"}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              onError={() => setImageError(true)}
            />
          )}

          {discountPercent > 0 ? (
            <span className="absolute left-1.5 top-1.5 rounded-lg bg-rose-500 px-1.5 py-0.5 text-[9px] font-black leading-none text-white shadow-sm">
              -{discountPercent}%
            </span>
          ) : null}

          {stock <= 3 ? (
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-amber-500/95 to-transparent px-1.5 pb-1.5 pt-4">
              <span className="text-[8px] font-black uppercase tracking-wide text-white">
                Only {stock} left
              </span>
            </div>
          ) : null}
        </Link>

        <div className="min-w-0 flex-1">
          <Link
            to={productPath}
            className="line-clamp-2 text-sm font-black leading-snug text-slate-900 transition-colors hover:text-teal-700"
          >
            {item.name || "Product"}
          </Link>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            {item.packName || item.variantName ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500">
                <Tag className="h-2.5 w-2.5" />
                {item.packName || item.variantName}
              </span>
            ) : null}

            {item.rating ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-700">
                <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                {item.rating}
                {item.reviews ? (
                  <span className="font-semibold text-amber-500/70">
                    ({Number(item.reviews).toLocaleString("en-IN")})
                  </span>
                ) : null}
              </span>
            ) : null}
          </div>

          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setWishlisted((prev) => !prev)}
              className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold transition-colors ${
                wishlisted
                  ? "bg-rose-50 text-rose-600"
                  : "text-slate-400 hover:bg-rose-50 hover:text-rose-500"
              }`}
            >
              <Heart
                className={`h-3 w-3 ${wishlisted ? "fill-rose-500" : ""}`}
              />
              {wishlisted ? "Saved" : "Save later"}
            </button>

            <button
              type="button"
              onClick={handleRemove}
              className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-500"
            >
              <Trash2 className="h-3 w-3" />
              Remove
            </button>
          </div>
        </div>
      </div>

      <div>
        <p className="text-sm font-black text-slate-900">{fmt(price)}</p>
        {originalPrice > price ? (
          <p className="mt-0.5 text-xs font-semibold text-slate-400 line-through">
            {fmt(originalPrice)}
          </p>
        ) : null}
      </div>

      <div>
        <QuantitySelector
          quantity={quantity}
          setQuantity={handleQuantityChange}
          max={stock}
        />
      </div>

      <div>
        <motion.p
          // key={total}
          initial={{ scale: 1.07 }}
          animate={{ scale: 1 }}
          className="text-base font-black tabular-nums text-slate-950"
        >
          {fmt(total)}
        </motion.p>
        {savings > 0 ? (
          <motion.span
            // key={savings}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-1 inline-flex items-center gap-1 rounded-full border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-[10px] font-black text-emerald-700"
          >
            <Zap className="h-2.5 w-2.5" />
            Save {fmt(savings)}
          </motion.span>
        ) : null}
      </div>

      <motion.button
        type="button"
        whileHover={{ scale: 1.08, rotate: 4 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleRemove}
        className="rounded-xl p-2.5 text-slate-300 opacity-0 transition-all hover:bg-rose-50 hover:text-rose-500 group-hover:opacity-100"
        aria-label="Remove item"
      >
        <Trash2 className="h-4 w-4" />
      </motion.button>
    </motion.div>
  );
}
