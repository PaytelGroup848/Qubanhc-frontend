import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
      wrapper: "border-teal-200 bg-white",
      text: "text-teal-800",
      Icon: CheckCircle2,
    },
    error: {
      wrapper: "border-rose-200 bg-white",
      text: "text-rose-700",
      Icon: AlertCircle,
    },
    info: {
      wrapper: "border-gray-200 bg-white",
      text: "text-gray-700",
      Icon: Info,
    },
  }[type] || {
    wrapper: "border-gray-200 bg-white",
    text: "text-gray-700",
    Icon: Info,
  };

  useEffect(() => {
    const timer = window.setTimeout(onClose, 3000);
    return () => window.clearTimeout(timer);
  }, [onClose]);

  const Icon = config.Icon;

  return (
    <div
      className={`fixed bottom-5 left-1/2 z-[999] flex max-w-[92vw] -translate-x-1/2 items-center gap-3 rounded-md border px-4 py-3 shadow-md ${config.wrapper}`}
    >
      <Icon className={`h-4 w-4 flex-shrink-0 ${config.text}`} />
      <span className={`whitespace-nowrap text-sm font-medium ${config.text}`}>
        {message}
      </span>
      <button
        type="button"
        onClick={onClose}
        className={`rounded p-1 opacity-70 transition hover:opacity-100 ${config.text}`}
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function ShippingProgress({ subtotal, freeDeliveryThreshold }) {
  const threshold = safeNumber(freeDeliveryThreshold || 999);
  const remaining = Math.max(0, threshold - subtotal);
  const progress = Math.min(100, Math.round((subtotal / threshold) * 100));

  if (remaining === 0) {
    return (
      <div className="flex items-center gap-3 rounded-md border border-teal-200 bg-teal-50 p-3">
        <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-teal-600" />
        <p className="text-sm font-medium text-teal-800">
          Free delivery unlocked on this order
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-gray-200 bg-white p-3">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <Truck className="h-4 w-4 flex-shrink-0 text-teal-600" />
          <span className="truncate text-sm text-gray-600">
            Add{" "}
            <span className="font-semibold text-gray-900">
              {fmt(remaining)}
            </span>{" "}
            for free delivery
          </span>
        </div>
        <span className="text-xs font-medium text-gray-400">{progress}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-teal-600 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
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
    await new Promise((resolve) => window.setTimeout(resolve, 300));

    const coupon = coupons[upper];
    if (coupon) {
      setStatus("valid");
      onApply({ code: upper, ...coupon });
    } else {
      setStatus("invalid");
      window.setTimeout(() => setStatus(null), 2000);
    }

    setLoading(false);
  };

  if (applied) {
    return (
      <div className="rounded-md border border-teal-200 bg-teal-50 p-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Gift className="h-4 w-4 text-teal-700" />
            <div>
              <p className="text-sm font-semibold text-teal-900">
                {applied.code} applied
              </p>
              <p className="text-xs text-teal-700">
                {applied.label} on this order
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="rounded p-1 text-teal-600 hover:bg-teal-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-gray-200 bg-white p-3">
      <div className="mb-2 flex items-center gap-2">
        <Gift className="h-4 w-4 text-teal-600" />
        <span className="text-sm font-semibold text-gray-800">
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
            className={`w-full rounded-md border px-3 py-2 text-sm uppercase outline-none transition ${
              status === "valid"
                ? "border-teal-400 bg-teal-50 text-teal-700"
                : status === "invalid"
                  ? "border-rose-300 bg-rose-50 text-rose-600"
                  : "border-gray-300 text-gray-900 focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            }`}
          />
        </div>

        <button
          type="button"
          onClick={handleApply}
          disabled={loading || !code.trim()}
          className="rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
        >
          {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : "Apply"}
        </button>
      </div>

      {status === "invalid" ? (
        <p className="mt-2 text-xs text-rose-600">
          Invalid code. Try SAVE10, FLAT500, or WELCOME20.
        </p>
      ) : null}

      <div className="mt-2 flex flex-wrap gap-2">
        {Object.keys(coupons).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setCode(item)}
            className="rounded border border-teal-200 bg-teal-50 px-2 py-1 text-[11px] font-medium text-teal-700 hover:bg-teal-100"
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
    <div className="rounded-md border border-gray-200 bg-white">
      <div className="flex items-center gap-2 border-b border-gray-200 px-4 py-3">
        <CreditCard className="h-4 w-4 text-teal-600" />
        <h3 className="text-sm font-semibold text-gray-900">Order Summary</h3>
      </div>

      <div className="space-y-2 px-4 py-3 text-sm">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between gap-4"
          >
            <span
              className={
                row.tone === "muted" ? "text-gray-400" : "text-gray-600"
              }
            >
              {row.label}
            </span>
            <span
              className={`font-medium ${row.tone === "success" ? "text-teal-600" : "text-gray-900"}`}
            >
              {row.value}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm font-semibold text-gray-900">
            Total Payable
          </span>
          <span className="text-lg font-bold text-gray-900">
            {fmt(summary.total)}
          </span>
        </div>

        {summary.totalSavings > 0 ? (
          <p className="mt-2 text-xs text-teal-600">
            You are saving {fmt(summary.totalSavings)} on this order.
          </p>
        ) : null}
      </div>

      <div className="px-4 pb-4 pt-3">
        <button
          type="button"
          onClick={onCheckout}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-teal-600 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
        >
          <Lock className="h-4 w-4" />
          Proceed to Checkout
        </button>

        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          {["UPI", "Cards", "Net Banking", "COD", "Wallet"].map((method) => (
            <span
              key={method}
              className="rounded border border-gray-200 px-2 py-0.5 text-[10px] font-medium text-gray-500"
            >
              {method}
            </span>
          ))}
        </div>

        <p className="mt-2 flex items-center justify-center gap-1 text-center text-[10px] text-gray-400">
          <Lock className="h-2.5 w-2.5" />
          256-bit SSL encrypted checkout
        </p>
      </div>
    </div>
  );
}

function EmptyCart() {
  return (
    <div className="min-h-screen bg-[#fffaf0]">
      <div className="mx-auto flex max-w-xl flex-col items-center justify-center px-6 py-24 text-center">
        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-gray-200 bg-white">
          <ShoppingCart className="h-9 w-9 text-teal-500" />
        </div>
        <h1 className="text-xl font-semibold text-gray-900">
          Your cart is empty
        </h1>
        <p className="mt-2 max-w-sm text-sm text-gray-500">
          Looks like you have not added anything yet. Explore our care range and
          add your essentials.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700"
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
    <div className="min-h-screen bg-[#f4faee]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 bg-white">
              <ShoppingCart className="h-5 w-5 text-teal-600" />
              <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-teal-600 text-[10px] font-bold text-white">
                {displaySummary.totalItems}
              </span>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Shopping Cart
              </h1>
              <p className="text-xs text-gray-500">
                {displaySummary.totalItems} item
                {displaySummary.totalItems !== 1 ? "s" : ""} ready for checkout
              </p>
            </div>
          </div>

          {clearConfirm ? (
            <div className="flex w-full items-center justify-between gap-2 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 sm:w-auto">
              <span className="text-xs font-medium text-rose-600">
                Clear all items?
              </span>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={handleClearCart}
                  className="rounded bg-rose-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-600"
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setClearConfirm(false)}
                  className="rounded px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-white"
                >
                  No
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setClearConfirm(true)}
              className="inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-xs font-medium text-gray-500 transition hover:bg-rose-50 hover:text-rose-500"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear cart
            </button>
          )}
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="min-w-0 flex-1 space-y-4">
            {!isMobile ? (
              <div className="overflow-hidden rounded-md border border-gray-200 bg-white">
                <div className="grid grid-cols-[2.2fr_0.9fr_1fr_1fr_auto] gap-5 border-b border-gray-200 bg-gray-50 px-5 py-2.5">
                  {["Product", "Unit Price", "Quantity", "Total", ""].map(
                    (heading) => (
                      <div
                        key={heading}
                        className="text-xs font-semibold uppercase tracking-wide text-gray-500"
                      >
                        {heading}
                      </div>
                    ),
                  )}
                </div>
                {cartItems.map((item) => (
                  <CartItemDesktop
                    key={`${item.id}-${item.packId || item.variantId || "default"}`}
                    item={item}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <CartItemMobile
                    key={`${item.id}-${item.packId || item.variantId || "default"}`}
                    item={item}
                  />
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                {
                  icon: ShieldCheck,
                  label: "Secure Payment",
                  sub: "Protected Payments",
                },
                {
                  icon: Package,
                  label: "Easy Returns",
                  sub: "Simple return flow",
                },
                {
                  icon: Zap,
                  label: "Fast Dispatch",
                  sub: "Same day processing",
                },
              ].map(({ icon: Icon, label, sub }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 rounded-md border border-gray-200 bg-white px-4 py-3"
                >
                  <Icon className="h-5 w-5 text-teal-600" />
                  <div>
                    <p className="text-xs font-semibold text-gray-800">
                      {label}
                    </p>
                    <p className="text-[11px] text-gray-400">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-shrink-0 space-y-3 lg:w-[360px] lg:sticky lg:top-6 self-start">
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

        <div className="mt-6 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-gray-500 transition hover:bg-white hover:text-teal-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>
        </div>
      </div>

      {toast ? (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      ) : null}
    </div>
  );
}
