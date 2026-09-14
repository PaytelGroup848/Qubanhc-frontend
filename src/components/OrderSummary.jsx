import { useMemo, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Gift,
  Loader2,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  TicketPercent,
  Trash2,
  Truck,
  X,
} from 'lucide-react';

const formatPrice = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(amount || 0));
};

const safeNumber = (value) => Number(value || 0);

export default function OrderSummary({
  subtotal = 0,
  total = 0,

 
  summary = null,

  // ✅ Admin/backend settings fallback
  pricingSettings = null,

  cartCount = 0,
  loading = false,
  checkoutLoading = false,
  clearLoading = false,

  couponCode = '',
  appliedCoupon = null,
  onCouponChange,
  onApplyCoupon,
  onRemoveCoupon,

  onCheckout,
  onClearCart,
}) {
  const [couponInput, setCouponInput] = useState(couponCode || '');

  const calculated = useMemo(() => {
    const fallbackFreeShippingAbove = safeNumber(
      pricingSettings?.freeDeliveryThreshold ?? pricingSettings?.freeShippingAbove ?? 999
    );

    const fallbackDeliveryCharge = safeNumber(
      pricingSettings?.deliveryCharge ?? 79
    );

    const fallbackTaxRate = safeNumber(pricingSettings?.gstPercent ?? pricingSettings?.taxRate ?? 18);

    const backendSubtotal = safeNumber(
      summary?.subtotal ?? summary?.itemsTotal ?? subtotal
    );

    const backendDiscount = safeNumber(
      summary?.discount ?? summary?.couponDiscount ?? Math.max(0, subtotal - total)
    );

    const taxableAmount = Math.max(0, backendSubtotal - backendDiscount);

    const backendDeliveryCharge =
      summary?.shipping !== undefined ||
      summary?.deliveryCharge !== undefined ||
      summary?.shippingCharge !== undefined
        ? safeNumber(
            summary?.shipping ?? summary?.deliveryCharge ?? summary?.shippingCharge
          )
        : backendSubtotal >= fallbackFreeShippingAbove
          ? 0
          : fallbackDeliveryCharge;

    const backendTax =
      summary?.tax !== undefined || summary?.gst !== undefined
        ? safeNumber(summary?.tax ?? summary?.gst)
        : Math.round((taxableAmount * fallbackTaxRate) / 100);

    const backendTotal =
      summary?.total !== undefined || summary?.grandTotal !== undefined
        ? safeNumber(summary?.total ?? summary?.grandTotal)
        : taxableAmount + backendDeliveryCharge + backendTax;

    const productSavings = safeNumber(
      summary?.productSavings ?? summary?.savings ?? backendDiscount
    );

    const freeShippingAbove = safeNumber(
      summary?.freeDeliveryThreshold ?? summary?.freeShippingAbove ?? fallbackFreeShippingAbove
    );

    const amountForFreeDelivery = Math.max(0, freeShippingAbove - backendSubtotal);

    const progress =
      freeShippingAbove > 0
        ? Math.min(100, Math.round((backendSubtotal / freeShippingAbove) * 100))
        : 100;

    return {
      subtotal: backendSubtotal,
      discount: backendDiscount,
      deliveryCharge: backendDeliveryCharge,
      tax: backendTax,
      total: backendTotal,
      savings: productSavings,
      freeShippingAbove,
      amountForFreeDelivery,
      progress,
    };
  }, [summary, subtotal, total, pricingSettings]);

  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase();

    if (!code) return;

    onCouponChange?.(code);
    onApplyCoupon?.(code);
  };

  const rows = [
    {
      label: `Subtotal${cartCount ? ` (${cartCount} item${cartCount > 1 ? 's' : ''})` : ''}`,
      value: formatPrice(calculated.subtotal),
    },
    calculated.discount > 0 && {
      label: appliedCoupon?.code
        ? `Coupon Discount (${appliedCoupon.code})`
        : 'Discount',
      value: `- ${formatPrice(calculated.discount)}`,
      type: 'success',
    },
    {
      label: 'Delivery Charge',
      value:
        calculated.deliveryCharge === 0
          ? 'FREE'
          : formatPrice(calculated.deliveryCharge),
      type: calculated.deliveryCharge === 0 ? 'success' : 'normal',
    },
    calculated.tax > 0 && {
      label: 'Taxes / GST',
      value: formatPrice(calculated.tax),
      type: 'muted',
    },
  ].filter(Boolean);

  return (
    <aside className="sticky top-24 space-y-4">
      <div className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-2xl shadow-teal-100/50">
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 px-6 py-6 text-white">
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-teal-400/20 blur-3xl" />
          <div className="absolute -bottom-12 left-8 h-28 w-28 rounded-full bg-emerald-400/20 blur-3xl" />

          <div className="relative flex items-start justify-between gap-4">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-teal-100 ring-1 ring-white/10">
                <ShieldCheck className="h-3.5 w-3.5" />
                Secure Summary
              </p>

              <h2 className="mt-4 text-2xl font-black tracking-tight">
                Order Summary
              </h2>

              <p className="mt-1 text-sm text-slate-300">
                Final amount calculated using latest store rules.
              </p>
            </div>

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/10">
              <LockKeyhole className="h-5 w-5 text-teal-200" />
            </div>
          </div>
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex items-center justify-between">
                  <div className="h-4 w-28 animate-pulse rounded bg-slate-100" />
                  <div className="h-4 w-20 animate-pulse rounded bg-slate-100" />
                </div>
              ))}
              <div className="h-12 animate-pulse rounded-2xl bg-slate-100" />
            </div>
          ) : (
            <>
              {calculated.amountForFreeDelivery > 0 ? (
                <div className="rounded-2xl border border-teal-100 bg-gradient-to-br from-teal-50 to-emerald-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm">
                        <Truck className="h-4 w-4 text-teal-600" />
                      </div>

                      <div>
                        <p className="text-sm font-black text-slate-900">
                          Add {formatPrice(calculated.amountForFreeDelivery)}
                        </p>
                        <p className="text-xs text-slate-500">
                          to unlock free delivery
                        </p>
                      </div>
                    </div>

                    <span className="rounded-full bg-white px-2.5 py-1 text-xs font-black text-teal-700 shadow-sm">
                      {calculated.progress}%
                    </span>
                  </div>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-700"
                      style={{ width: `${calculated.progress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  </div>

                  <div>
                    <p className="text-sm font-black text-emerald-800">
                      Free Delivery Unlocked
                    </p>
                    <p className="text-xs text-emerald-600">
                      Your order ships with zero delivery charge.
                    </p>
                  </div>
                </div>
              )}

              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
                        <TicketPercent className="h-4 w-4 text-emerald-700" />
                      </div>

                      <div>
                        <p className="text-sm font-black text-slate-900">
                          {appliedCoupon.code} applied
                        </p>
                        <p className="text-xs text-slate-500">
                          Coupon discount added successfully
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={onRemoveCoupon}
                      className="rounded-xl p-2 text-slate-400 transition hover:bg-white hover:text-red-500"
                      aria-label="Remove coupon"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="mb-3 flex items-center gap-2">
                      <Gift className="h-4 w-4 text-teal-600" />
                      <p className="text-sm font-black text-slate-800">
                        Apply Coupon
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <input
                        value={couponInput}
                        onChange={(event) =>
                          setCouponInput(event.target.value.toUpperCase())
                        }
                        onKeyDown={(event) => {
                          if (event.key === 'Enter') {
                            event.preventDefault();
                            handleApplyCoupon();
                          }
                        }}
                        placeholder="COUPON"
                        className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-black uppercase outline-none transition focus:border-teal-400 focus:ring-4 focus:ring-teal-100"
                      />

                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={!couponInput.trim()}
                        className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-black text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Apply
                      </button>
                    </div>
                  </>
                )}
              </div>

              <div className="space-y-3">
                {rows.map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between gap-4 text-sm"
                  >
                    <span
                      className={
                        row.type === 'muted'
                          ? 'text-slate-400'
                          : 'text-slate-500'
                      }
                    >
                      {row.label}
                    </span>

                    <span
                      className={`font-black ${
                        row.type === 'success'
                          ? 'text-emerald-600'
                          : 'text-slate-900'
                      }`}
                    >
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-dashed border-slate-200 pt-5">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-slate-500">
                      Total Payable
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Inclusive of applicable taxes
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-3xl font-black tracking-tight text-slate-950">
                      {formatPrice(calculated.total)}
                    </p>

                    {calculated.savings > 0 && (
                      <p className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-black text-emerald-700">
                        <Sparkles className="h-3 w-3" />
                        Saved {formatPrice(calculated.savings)}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={onCheckout}
                  disabled={checkoutLoading}
                  className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 px-5 py-4 text-sm font-black text-white shadow-xl shadow-teal-200/70 transition hover:from-teal-700 hover:to-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {checkoutLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Proceed to Checkout
                      <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={onClearCart}
                  disabled={clearLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-100 bg-red-50 px-5 py-3 text-sm font-black text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {clearLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Clearing...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      Clear Cart
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="rounded-[1.5rem] border border-emerald-100 bg-emerald-50 p-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

          <div>
            <p className="text-sm font-black text-emerald-900">
              Price protected by backend
            </p>
            <p className="mt-1 text-xs leading-5 text-emerald-700">
              Admin panel se delivery, coupon, tax ya discount change hoga to
              backend latest summary return karega, aur yaha automatically show
              hoga.
            </p>
          </div>
        </div>
      </div>

      {!summary && (
        <div className="rounded-[1.5rem] border border-amber-100 bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

            <p className="text-xs leading-5 text-amber-800">
              Backend summary prop nahi mila, isliye frontend fallback
              calculation use ho rahi hai. Production me cart summary backend se
              bhejna best hai.
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}