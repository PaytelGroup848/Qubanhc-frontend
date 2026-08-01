import { useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Link } from "react-router-dom";
import { Trash2, Tag, Star, Heart, Zap, X, Plus, Minus } from "lucide-react";
import { useCart } from "../../../context/CartContext";

function fmt(n) {
  return "₹" + Number(n || 0).toLocaleString("en-IN");
}

function pct(orig, price) {
  if (!orig || !price) return 0;
  return Math.round(((orig - price) / orig) * 100);
}

function InlineQty({ qty, setQty, max }) {
  const [bump, setBump] = useState(false);
  const safeMax = max || 99;

  const change = (delta) => {
    const next = Number(qty || 1) + delta;
    if (next < 1 || next > safeMax) {
      setBump(true);
      setTimeout(() => setBump(false), 300);
      return;
    }
    setQty(next);
  };

  return (
    <motion.div
      animate={bump ? { x: [0, -4, 4, -2, 2, 0] } : {}}
      transition={{ duration: 0.28 }}
      className="inline-flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden"
    >
      <button
        type="button"
        onClick={() => change(-1)}
        disabled={qty <= 1}
        className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-100 active:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <Minus className="w-3 h-3" />
      </button>
      <motion.span
        key={qty}
        initial={{ scale: 1.35, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 22 }}
        className="w-9 text-center text-sm font-black text-slate-900 tabular-nums select-none"
      >
        {qty}
      </motion.span>
      <button
        type="button"
        onClick={() => change(1)}
        disabled={qty >= safeMax}
        className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-100 active:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <Plus className="w-3 h-3" />
      </button>
    </motion.div>
  );
}

export default function CartItemMobile({ item }) {
  const { updateQuantity, removeFromCart } = useCart();
  const [wishlisted, setWishlisted] = useState(false);
  const [removing, setRemoving] = useState(false);

  const price = Number(item.price || 0);
  const originalPrice = Number(item.originalPrice || 0);
  const total = price * item.quantity;
  const savings = originalPrice ? (originalPrice - price) * item.quantity : 0;

  const x = useMotionValue(0);
  const deleteOpacity = useTransform(x, [-100, -20], [1, 0]);
  const cardRotate = useTransform(x, [-100, 0], [-2, 0]);

  const handleDragEnd = (_, info) => {
    if (info.offset.x < -70) {
      animate(x, -100, { type: "spring", stiffness: 300, damping: 25 });
    } else {
      animate(x, 0, { type: "spring", stiffness: 400, damping: 30 });
    }
  };

  const handleRemove = () => {
    setRemoving(true);
    animate(x, -400, { duration: 0.28 });
    setTimeout(() => removeFromCart(item.id, item.packId), 280);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: removing ? 0 : 1 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.25 }}
      className="relative"
    >
      <motion.div
        style={{ opacity: deleteOpacity }}
        className="absolute inset-0 bg-gradient-to-r from-rose-500 to-rose-600 rounded-2xl flex items-center justify-end pr-6"
        aria-hidden
      >
        <div className="text-white flex flex-col items-center gap-1">
          <Trash2 className="w-6 h-6" />
          <span className="text-[9px] font-black uppercase tracking-widest">Remove</span>
        </div>
      </motion.div>

      <motion.div
        drag="x"
        dragConstraints={{ left: -100, right: 0 }}
        dragElastic={0.05}
        onDragEnd={handleDragEnd}
        style={{ x, rotate: cardRotate }}
        className="relative bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden cursor-grab active:cursor-grabbing"
      >
        {item.stock && item.stock <= 3 && (
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold text-center py-1.5 flex items-center justify-center gap-1.5">
            <Zap className="w-3 h-3" />
            Only {item.stock} left
          </div>
        )}

        <div className="p-4">
          <div className="flex gap-3">
            <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 ring-1 ring-slate-200 shadow-sm">
              <img
                src={item.image || "/images/placeholder.jpg"}
                alt={item.name}
                className="w-full h-full object-cover"
              />
              {originalPrice > price && (
                <div className="absolute top-1 left-1 bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md leading-none">
                  -{pct(originalPrice, price)}%
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <Link
                to={`/products/${item.id}`}
                className="text-sm font-semibold text-slate-800 leading-snug line-clamp-2 hover:text-violet-700 transition-colors"
              >
                {item.name}
              </Link>
              {(item.packName || item.variantName) && (
                <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full font-medium">
                  <Tag className="w-2.5 h-2.5" />
                  {item.packName || item.variantName}
                </span>
              )}
              {item.rating && (
                <div className="flex items-center gap-0.5 mt-1.5">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span className="text-[10px] text-amber-600 font-semibold">{item.rating}</span>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleRemove}
              className="self-start p-1.5 text-slate-300 hover:text-rose-500 rounded-xl hover:bg-rose-50 transition-all flex-shrink-0"
              aria-label="Remove"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between mt-3.5 pt-3.5 border-t border-slate-100">
            <InlineQty
              qty={item.quantity}
              setQty={(q) => updateQuantity(item.id, item.packId, q)}
              max={item.stock ?? 99}
            />
            <div className="flex flex-col items-end">
              <motion.span
                key={total}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                className="font-black text-slate-900 text-base tabular-nums"
              >
                {fmt(total)}
              </motion.span>
              {originalPrice > price && (
                <span className="text-xs text-slate-400 line-through tabular-nums">
                  {fmt(originalPrice * item.quantity)}
                </span>
              )}
              {savings > 0 && (
                <motion.span
                  key={savings}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded-full mt-0.5 tabular-nums"
                >
                  Save {fmt(savings)}
                </motion.span>
              )}
            </div>
          </div>

          <div className="mt-2.5">
            <button
              type="button"
              onClick={() => setWishlisted(!wishlisted)}
              className={`flex items-center gap-1.5 text-[11px] font-semibold transition-colors ${
                wishlisted ? "text-rose-500" : "text-slate-400 hover:text-rose-400"
              }`}
            >
              <Heart className={`w-3 h-3 ${wishlisted ? "fill-rose-500" : ""}`} />
              {wishlisted ? "Saved for later" : "Save for later"}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}