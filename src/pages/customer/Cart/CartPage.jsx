import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import cartService from "../../../services/cart";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Gift,
  Info,
  Lock,
  Package,
  RefreshCw,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Trash2,
  Truck,
  X,
  Zap,
} from "lucide-react";
import { useCart } from "../../../context/CartContext";
import { useAuth } from "../../../context/AuthContext";
import { useDevice } from "../../../hooks/Customer/useDevice";
import CartItemDesktop from "./CartItemDesktop";
import CartItemMobile from "./CartItemMobile";

const DEFAULT_PRICING_SETTINGS = {
  freeDeliveryThreshold: 999,
  deliveryCharge: 79,
  gstPercent: 18,
};

const DEFAULT_COUPONS = {
  SAVE10: { type: "percent", value: 10, label: "10% off" },
  FLAT500: { type: "flat", value: 500, label: "₹500 off" },
  WELCOME20: { type: "percent", value: 20, label: "20% off" },
};

function fmt(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function safeNumber(value) {
  return Number(value || 0);
}

export function Toast({ message, type = "success", onClose }) {
  const config = {
    success: {
      wrapper: "border-emerald-800 bg-emerald-950",
      text: "text-emerald-100",
      Icon: CheckCircle2,
    },
    error: {
      wrapper: "border-rose-800 bg-rose-950",
      text: "text-rose-100",
      Icon: AlertCircle,
    },
    info: {
      wrapper: "border-slate-700 bg-slate-900",
      text: "text-slate-100",
      Icon: Info,
    },
  }[type] || {
    wrapper: "border-slate-700 bg-slate-900",
    text: "text-slate-100",
    Icon: Info,
  };

  useEffect(() => {
    const timer = window.setTimeout(onClose, 3000);
    return () => window.clearTimeout(timer);
  }, [onClose]);

  const Icon = config.Icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 420, damping: 30 }}
      className={`fixed bottom-5 left-1/2 z-[999] flex max-w-[92vw] -translate-x-1/2 items-center gap-3 rounded-2xl border px-4 py-3 shadow-2xl backdrop-blur ${config.wrapper}`}
    >
      <Icon className={`h-4 w-4 flex-shrink-0 ${config.text}`} />
      <span className={`whitespace-nowrap text-sm font-bold ${config.text}`}>
        {message}
      </span>
      <button
        type="button"
        onClick={onClose}
        className={`rounded-lg p-1 opacity-70 transition hover:opacity-100 ${config.text}`}
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </motion.div>
  );
}

function ShippingProgress({ subtotal, freeDeliveryThreshold }) {
  const threshold = safeNumber(freeDeliveryThreshold || 999);
  const remaining = Math.max(0, threshold - subtotal);
  const progress = Math.min(100, Math.round((subtotal / threshold) * 100));

  return (
    <AnimatePresence mode="wait">
      {remaining === 0 ? (
        <motion.div
          key="free"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="overflow-hidden rounded-3xl border border-emerald-200/70 bg-gradient-to-r from-emerald-50 to-teal-50 p-4 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-emerald-100">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-black text-emerald-900">
                Free delivery unlocked 🎉
              </p>
              <p className="mt-0.5 text-xs font-semibold text-emerald-700">
                Your order ships for free.
              </p>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="progress"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm"
        >
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <Truck className="h-4 w-4 flex-shrink-0 text-teal-600" />
              <span className="truncate text-sm font-semibold text-slate-700">
                Add{" "}
                <span className="font-black text-teal-700">
                  {fmt(remaining)}
                </span>{" "}
                for free delivery
              </span>
            </div>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-black text-slate-500">
              {progress}%
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
            />
          </div>
          {remaining <= 400 ? (
            <p className="mt-2 flex items-center gap-1 text-[11px] font-black text-teal-700">
              <Sparkles className="h-3 w-3" />
              Almost there!
            </p>
          ) : null}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function CouponBox({ coupons = DEFAULT_COUPONS, onApply, applied, onRemove }) {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    const upper = code.trim().toUpperCase();
    if (!upper) return;

    setLoading(true);
    await new Promise((resolve) => window.setTimeout(resolve, 350));

    const coupon = coupons[upper];
    if (coupon) {
      setStatus("valid");
      onApply({ code: upper, ...coupon });
    } else {
      setStatus("invalid");
      window.setTimeout(() => setStatus(null), 2200);
    }

    setLoading(false);
  };

  if (applied) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-3xl border border-teal-200 bg-teal-50 p-4"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-teal-100">
              <Gift className="h-4 w-4 text-teal-700" />
            </div>
            <div>
              <p className="text-sm font-black text-teal-900">
                {applied.code} applied
              </p>
              <p className="mt-0.5 text-xs font-bold text-teal-700">
                {applied.label} on this order
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="rounded-xl p-1.5 text-teal-500 transition hover:bg-teal-100 hover:text-teal-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <Gift className="h-4 w-4 text-teal-600" />
        <span className="text-sm font-black text-slate-800">
          Have a coupon?
        </span>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            value={code}
            onChange={(event) => {
              setCode(event.target.value.toUpperCase());
              setStatus(null);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") handleApply();
            }}
            placeholder="Enter coupon"
            className={`w-full rounded-2xl border px-3.5 py-3 text-sm font-black uppercase outline-none transition ${
              status === "valid"
                ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                : status === "invalid"
                  ? "border-rose-400 bg-rose-50 text-rose-600"
                  : "border-slate-200 bg-slate-50 text-slate-900 focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-100"
            }`}
          />
          {status === "valid" ? (
            <CheckCircle2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-500" />
          ) : null}
          {status === "invalid" ? (
            <AlertCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-rose-500" />
          ) : null}
        </div>

        <motion.button
          type="button"
          whileTap={{ scale: 0.96 }}
          onClick={handleApply}
          disabled={loading || !code.trim()}
          className="rounded-2xl bg-teal-600 px-4 py-3 text-sm font-black text-white shadow-sm transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
        >
          {loading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
            >
              <RefreshCw className="h-4 w-4" />
            </motion.div>
          ) : (
            "Apply"
          )}
        </motion.button>
      </div>

      {status === "invalid" ? (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-xs font-bold text-rose-500"
        >
          Invalid code. Try SAVE10, FLAT500, or WELCOME20.
        </motion.p>
      ) : null}

      <div className="mt-3 flex flex-wrap gap-2">
        {Object.keys(coupons).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setCode(item)}
            className="rounded-full border border-teal-100 bg-teal-50 px-2.5 py-1 text-[10px] font-black text-teal-700 transition hover:bg-teal-100"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

function OrderSummary({ summary, onCheckout }) {
  const rows = [
    {
      label: `Subtotal (${summary.totalItems} items)`,
      value: fmt(summary.subtotal),
    },
    summary.productSavings > 0 && {
      label: "Product discount",
      value: `-${fmt(summary.productSavings)}`,
      tone: "success",
    },
    summary.couponDiscount > 0 && {
      label: `Coupon (${summary.coupon?.code})`,
      value: `-${fmt(summary.couponDiscount)}`,
      tone: "success",
    },
    {
      label: "Delivery",
      value: summary.shipping === 0 ? "FREE" : fmt(summary.shipping),
      tone: summary.shipping === 0 ? "success" : "muted",
    },
    {
      label: `GST (${summary.gstPercent || 0}%)`,
      value: fmt(summary.tax),
      tone: "muted",
    },
  ].filter(Boolean);

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm lg:sticky lg:top-24">
      <div className="flex items-center gap-2 border-b border-slate-100 px-5 pb-3 pt-5">
        <CreditCard className="h-4 w-4 text-teal-600" />
        <h3 className="text-sm font-black text-slate-950">Order Summary</h3>
      </div>

      <div className="space-y-3 px-5 py-4">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between gap-4"
          >
            <span
              className={`text-sm font-semibold ${row.tone === "muted" ? "text-slate-400" : "text-slate-600"}`}
            >
              {row.label}
            </span>
            <motion.span
              key={row.value}
              initial={{ opacity: 0, x: 6 }}
              animate={{ opacity: 1, x: 0 }}
              className={`text-sm font-black ${row.tone === "success" ? "text-emerald-600" : "text-slate-900"}`}
            >
              {row.value}
            </motion.span>
          </div>
        ))}
      </div>

      <div className="border-t border-dashed border-slate-200 bg-slate-50/70 px-5 py-4">
        <div className="flex items-center justify-between gap-4">
          <span className="font-black text-slate-950">Total Payable</span>
          <motion.span
            key={summary.total}
            initial={{ scale: 1.06 }}
            animate={{ scale: 1 }}
            className="text-xl font-black tabular-nums text-slate-950"
          >
            {fmt(summary.total)}
          </motion.span>
        </div>

        {summary.totalSavings > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 flex items-center gap-2 rounded-2xl border border-emerald-100 bg-emerald-50 px-3 py-2"
          >
            <Sparkles className="h-3.5 w-3.5 flex-shrink-0 text-emerald-600" />
            <span className="text-xs font-black text-emerald-700">
              You are saving {fmt(summary.totalSavings)} on this order.
            </span>
          </motion.div>
        ) : null}
      </div>

      <div className="px-5 pb-5 pt-4">
        <motion.button
          type="button"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={onCheckout}
          className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 py-4 text-sm font-black text-white shadow-lg shadow-teal-100 transition hover:from-teal-700 hover:to-emerald-700"
        >
          <Lock className="h-4 w-4" />
          Proceed to Checkout
          <ChevronRight className="h-4 w-4" />
        </motion.button>

        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          {["UPI", "Cards", "Net Banking", "COD", "Wallet"].map((method) => (
            <span
              key={method}
              className="rounded-md bg-slate-100 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-slate-400"
            >
              {method}
            </span>
          ))}
        </div>

        <p className="mt-2 flex items-center justify-center gap-1 text-center text-[10px] font-semibold text-slate-400">
          <Lock className="h-2.5 w-2.5" />
          256-bit SSL encrypted checkout
        </p>
      </div>
    </div>
  );
}

function EmptyCart() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto flex max-w-xl flex-col items-center justify-center px-6 py-24 text-center">
        <motion.div
          animate={{ y: [0, -9, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="mb-6 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-white shadow-xl shadow-teal-100 ring-1 ring-slate-100"
        >
          <ShoppingCart className="h-10 w-10 text-teal-500" />
        </motion.div>
        <h1 className="text-2xl font-black text-slate-950">
          Your cart is empty
        </h1>
        <p className="mt-3 max-w-sm text-sm font-medium leading-6 text-slate-500">
          Looks like you have not added anything yet. Explore our care range and
          add your essentials.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-teal-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-teal-100 transition hover:bg-teal-700"
        >
          Continue Shopping
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

export default function CartPage() {
  const { isMobile } = useDevice();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { cartItems = [], removeFromCart, clearCart } = useCart();
  const [coupon, setCoupon] = useState(null);
  const [toast, setToast] = useState(null);
  const [clearConfirm, setClearConfirm] = useState(false);
  const [pricingSettings, setPricingSettings] = useState(
    DEFAULT_PRICING_SETTINGS,
  );
  const [availableCoupons, setAvailableCoupons] = useState(DEFAULT_COUPONS);
  const [backendSummary, setBackendSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [backendSummaryKey, setBackendSummaryKey] = useState("");

  const cartSummaryKey = useMemo(() => {
    return cartItems
      .map((item) =>
        [
          item.id || item._id || item.product?._id || item.product,
          item.packId || item.variantId || item.variant?._id || "default",
          item.quantity,
          item.price,
          item.originalPrice,
        ].join(":"),
      )
      .join("|");
  }, [cartItems]);

  const summaryRequestKey = `${cartSummaryKey}__coupon:${coupon?.code || ""}`;

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type, id: Date.now() });
  }, []);

  const summary = useMemo(() => {
    const freeDeliveryThreshold = safeNumber(
      pricingSettings.freeDeliveryThreshold,
    );

    const deliveryChargeValue = safeNumber(pricingSettings.deliveryCharge);
    const gstPercent = safeNumber(pricingSettings.gstPercent);

    const totalItems = cartItems.reduce(
      (sum, item) => sum + safeNumber(item.quantity),
      0,
    );

    const subtotal = cartItems.reduce(
      (sum, item) => sum + safeNumber(item.price) * safeNumber(item.quantity),
      0,
    );

    const originalTotal = cartItems.reduce(
      (sum, item) =>
        sum +
        safeNumber(item.originalPrice || item.price) *
          safeNumber(item.quantity),
      0,
    );

    const productSavings = Math.max(0, originalTotal - subtotal);

    const shipping =
      subtotal >= freeDeliveryThreshold ? 0 : deliveryChargeValue;

    const couponDiscount = coupon
      ? coupon.type === "percent"
        ? Math.round((subtotal * coupon.value) / 100)
        : Math.min(coupon.value, subtotal)
      : 0;

    const taxableAmount = Math.max(0, subtotal - couponDiscount);
    const tax = Math.round((taxableAmount * gstPercent) / 100);
    const total = Math.max(0, taxableAmount + shipping + tax);

    const totalSavings =
      productSavings +
      couponDiscount +
      (shipping === 0 ? deliveryChargeValue : 0);

    return {
      totalItems,
      subtotal,
      originalTotal,
      productSavings,
      shipping,
      couponDiscount,
      tax,
      total,
      totalSavings,
      coupon,
      gstPercent,
      freeDeliveryThreshold,
      deliveryCharge: deliveryChargeValue,
    };
  }, [cartItems, coupon, pricingSettings]);

  useEffect(() => {
    const fetchCartPricingSettings = async () => {
      try {
        if (!isLoggedIn) {
          setBackendSummary(null);
          setBackendSummaryKey("");
          return;
        }

        const token = localStorage.getItem("accessToken");

        if (!token) {
          setBackendSummary(null);
          setBackendSummaryKey("");
          return;
        }

        // Important: quantity change hote hi stale backend summary hata do
        setBackendSummary(null);
        setBackendSummaryKey("");
        setSummaryLoading(true);

        const response = await cartService.getCartSummary(coupon?.code || "");
        const payload = response?.data || response || {};
        const data = payload?.data || payload;

        if (data?.summary) {
          setBackendSummary(data.summary);
          setBackendSummaryKey(summaryRequestKey);
        }

        if (data?.settings) {
          setPricingSettings({
            freeDeliveryThreshold:
              data.settings.freeDeliveryThreshold ??
              data.settings.freeShippingAbove ??
              DEFAULT_PRICING_SETTINGS.freeDeliveryThreshold,

            deliveryCharge:
              data.settings.deliveryCharge ??
              data.settings.shippingCharge ??
              DEFAULT_PRICING_SETTINGS.deliveryCharge,

            gstPercent:
              data.settings.gstPercent ??
              data.settings.taxRate ??
              DEFAULT_PRICING_SETTINGS.gstPercent,
          });
        }

        if (data?.coupons) {
          setAvailableCoupons(data.coupons);
        }
      } catch (error) {
        setBackendSummary(null);
        setBackendSummaryKey("");
        console.error("Cart pricing settings fetch error:", error);
      } finally {
        setSummaryLoading(false);
      }
    };

    fetchCartPricingSettings();
  }, [isLoggedIn, summaryRequestKey]);

  const displaySummary =
    backendSummary && backendSummaryKey === summaryRequestKey
      ? backendSummary
      : summary;

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      showToast("Your cart is empty", "error");
      return;
    }

    if (!isLoggedIn) {
      navigate("/login", {
        state: {
          from: "/checkout",
          checkoutAfterLogin: true,
        },
      });
      showToast("Please login to continue checkout", "info");
      return;
    }

    navigate("/checkout", {
      state: {
        coupon,
        cartSummary: displaySummary,
      },
    });
  };

  const handleClearCart = () => {
    clearCart();
    setCoupon(null);
    setClearConfirm(false);
    window.dispatchEvent(new Event("cart-changed"));
    showToast("Cart cleared", "info");
  };

  const handleRemove = useCallback(
    (id, packId) => {
      removeFromCart(id, packId);
      window.dispatchEvent(new Event("cart-changed"));
      showToast("Removed from cart", "info");
    },
    [removeFromCart, showToast],
  );

  if (!cartItems.length) return <EmptyCart />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-teal-50/30">
      <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-100 bg-white shadow-sm">
                <ShoppingCart className="h-5 w-5 text-teal-600" />
              </div>
              <motion.span
                key={displaySummary.totalItems}
                initial={{ scale: 1.5 }}
                animate={{ scale: 1 }}
                className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-teal-600 text-[10px] font-black text-white shadow-sm"
              >
                {displaySummary.totalItems}
              </motion.span>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-teal-600">
                Secure cart
              </p>
              <h1 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                Shopping Cart
              </h1>
              <p className="mt-0.5 text-xs font-semibold text-slate-400">
                {displaySummary.totalItems} item
                {displaySummary.totalItems !== 1 ? "s" : ""} ready for checkout
              </p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {clearConfirm ? (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex w-full items-center justify-between gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 sm:w-auto"
              >
                <span className="text-xs font-black text-rose-600">
                  Clear all items?
                </span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={handleClearCart}
                    className="rounded-xl bg-rose-500 px-3 py-1.5 text-xs font-black text-white transition hover:bg-rose-600"
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setClearConfirm(false)}
                    className="rounded-xl px-3 py-1.5 text-xs font-black text-slate-500 transition hover:bg-white"
                  >
                    No
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.button
                key="clear"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                type="button"
                onClick={() => setClearConfirm(true)}
                className="inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-black text-slate-400 transition hover:bg-rose-50 hover:text-rose-500"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Clear cart
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <div className="flex flex-col gap-6 xl:gap-8 lg:flex-row">
          <div className="min-w-0 flex-1 space-y-4">
            {!isMobile ? (
              <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
                <div className="grid grid-cols-[2.2fr_0.9fr_1fr_1fr_auto] gap-5 border-b border-slate-100 bg-slate-50/80 px-6 py-3.5">
                  {["Product", "Unit Price", "Quantity", "Total", ""].map(
                    (heading) => (
                      <div
                        key={heading}
                        className="text-[10px] font-black uppercase tracking-widest text-slate-400"
                      >
                        {heading}
                      </div>
                    ),
                  )}
                </div>
                <AnimatePresence initial={false}>
                  {cartItems.map((item) => (
                    <CartItemDesktop
                      key={`${item.id}-${item.packId || item.variantId || "default"}`}
                      item={item}
                    />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="space-y-3">
                <AnimatePresence initial={false}>
                  {cartItems.map((item) => (
                    <CartItemMobile
                      key={`${item.id}-${item.packId || item.variantId || "default"}`}
                      item={item}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                {
                  icon: ShieldCheck,
                  label: "Secure Payment",
                  sub: "Cashfree protected",
                  color: "bg-emerald-50 text-emerald-600",
                },
                {
                  icon: Package,
                  label: "Easy Returns",
                  sub: "Simple return flow",
                  color: "bg-blue-50 text-blue-600",
                },
                {
                  icon: Zap,
                  label: "Fast Dispatch",
                  sub: "Same day processing",
                  color: "bg-amber-50 text-amber-600",
                },
              ].map(({ icon: Icon, label, sub, color }) => (
                <div
                  key={label}
                  className="rounded-3xl border border-slate-100 bg-white px-4 py-4 text-center shadow-sm"
                >
                  <div
                    className={`mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-2xl ${color}`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <p className="text-xs font-black text-slate-800">{label}</p>
                  <p className="mt-0.5 text-[11px] font-semibold text-slate-400">
                    {sub}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-shrink-0 space-y-3 lg:w-[380px] xl:w-[400px]">
            <ShippingProgress
              subtotal={displaySummary.subtotal}
              freeDeliveryThreshold={displaySummary.freeDeliveryThreshold}
            />
            <OrderSummary
              summary={displaySummary}
              onCheckout={handleCheckout}
              loading={summaryLoading}
            />
            <CouponBox
              coupons={availableCoupons}
              applied={coupon}
              onApply={(nextCoupon) => {
                setCoupon(nextCoupon);
                setBackendSummary(null);
                showToast(`${nextCoupon.code} applied`);
              }}
              onRemove={() => {
                setCoupon(null);
                setBackendSummary(null);
                showToast("Coupon removed", "info");
              }}
            />
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-black text-slate-400 transition hover:bg-white hover:text-teal-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>
        </div>
      </div>

      <AnimatePresence>
        {toast ? (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
