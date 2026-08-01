import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  CheckCircle2,
  FileText,
  Home,
  Loader2,
  Package,
  ShieldCheck,
  XCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';

import paymentService from '../../../services/payment';

function extractOrder(response) {
  const root = response?.data || response || {};
  const inner = root?.data || root;

  return (
    inner?.order ||
    inner?.data?.order ||
    root?.order ||
    root?.data?.order ||
    null
  );
}

export default function CashfreeSuccess() {
  const [searchParams] = useSearchParams();

  const cashfreeOrderId = searchParams.get('order_id');

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    verifyPayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cashfreeOrderId]);

  const verifyPayment = async () => {
    try {
      if (!cashfreeOrderId) {
        setFailed(true);
        toast.error('Order ID not found');
        return;
      }

      const response = await paymentService.verifyCashfreePayment(cashfreeOrderId);
      const verifiedOrder = extractOrder(response);

      if (!verifiedOrder) {
        setFailed(true);
        toast.error('Order verification failed');
        return;
      }

      setOrder(verifiedOrder);

      if (verifiedOrder?.payment?.status === 'paid') {
        toast.success('Payment verified successfully');
      } else {
        setFailed(true);
        toast.error('Payment is not completed');
      }
    } catch (error) {
      console.error('Payment success verify error:', error);
      setFailed(true);
      toast.error(error?.response?.data?.message || 'Payment verification failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50/30 to-emerald-50/40 px-4 py-10">
        <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center">
          <div className="rounded-3xl border border-white bg-white p-10 text-center shadow-xl shadow-teal-100/50">
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-teal-600" />
            <h1 className="mt-5 text-2xl font-black text-gray-950">
              Verifying Payment
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Please wait, hum Cashfree se payment status verify kar rahe hain.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (failed || order?.payment?.status !== 'paid') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50/30 to-orange-50/40 px-4 py-10">
        <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center">
          <div className="w-full rounded-3xl border border-white bg-white p-8 text-center shadow-xl shadow-red-100/50 sm:p-10">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
              <XCircle className="h-11 w-11 text-red-600" />
            </div>

            <h1 className="mt-6 text-3xl font-black text-gray-950">
              Payment Not Completed
            </h1>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-500">
              Payment verify nahi ho payi. Agar amount deduct hua hai, thoda wait
              karke My Orders me status check karo.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/account"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-6 py-3 text-sm font-black text-white hover:bg-slate-800"
              >
                <Package className="h-4 w-4" />
                Go to My Orders
              </Link>

              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-6 py-3 text-sm font-black text-gray-700 hover:bg-gray-50"
              >
                <Home className="h-4 w-4" />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const invoiceUrl = `/account/orders/${order._id}/invoice`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50/30 to-emerald-50/40 px-4 py-10">
      <div className="mx-auto flex min-h-[70vh] max-w-4xl items-center justify-center">
        <div className="w-full overflow-hidden rounded-[2rem] border border-white bg-white shadow-2xl shadow-teal-100/60">
          <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-10 text-center text-white sm:px-10">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-white/15 ring-8 ring-white/10">
              <CheckCircle2 className="h-14 w-14 text-white" />
            </div>

            <h1 className="mt-6 text-3xl font-black sm:text-4xl">
              Payment Successful
            </h1>

            <p className="mt-3 text-sm font-medium text-emerald-50">
              Your order has been confirmed successfully.
            </p>
          </div>

          <div className="p-6 sm:p-10">
            <div className="grid gap-4 sm:grid-cols-3">
              <InfoBox label="Order ID" value={`#${order.orderId}`} />
              <InfoBox label="Payment" value="Paid" />
              <InfoBox label="Status" value="Confirmed" />
            </div>

            <div className="mt-6 rounded-3xl border border-emerald-100 bg-emerald-50 p-5">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-6 w-6 text-emerald-600" />

                <div>
                  <h2 className="font-black text-emerald-900">
                    Secure payment verified
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-emerald-800">
                    Cashfree se payment verify ho chuki hai. Order paid mark ho
                    gaya hai aur invoice generate ho sakti hai.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/account"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-6 py-3 text-sm font-black text-white hover:bg-slate-800"
              >
                <Package className="h-4 w-4" />
                View My Orders
              </Link>

              <Link
                to={invoiceUrl}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-black text-white hover:bg-emerald-700"
              >
                <FileText className="h-4 w-4" />
                View Invoice
              </Link>

              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-6 py-3 text-sm font-black text-gray-700 hover:bg-gray-50"
              >
                <Home className="h-4 w-4" />
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoBox({ label, value }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 text-center">
      <p className="text-xs font-black uppercase tracking-wider text-gray-400">
        {label}
      </p>
      <p className="mt-2 text-sm font-black text-gray-950">{value}</p>
    </div>
  );
}