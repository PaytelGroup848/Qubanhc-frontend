import { useState } from 'react';
import { useCartStore } from '../store/useCartStore';

export default function CouponInput() {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const { applyCoupon, removeCoupon, coupon, discount } = useCartStore();

  const handleApply = async () => {
    if (!code.trim()) return;
    setLoading(true);
    const result = await applyCoupon(code);
    if (result.success) {
      setStatus({ type: 'success', message: `Coupon applied! ${result.discount}% off` });
      setCode('');
    } else {
      setStatus({ type: 'error', message: result.message });
    }
    setLoading(false);
    setTimeout(() => setStatus(null), 3000);
  };

  return (
    <div className="mt-4 p-4 bg-white rounded-xl shadow-sm border">
      <h3 className="font-medium mb-2">Apply Coupon</h3>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Coupon code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
        />
        <button
          onClick={handleApply}
          disabled={loading}
          className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 transition disabled:opacity-50"
        >
          Apply
        </button>
      </div>
      {status && (
        <p className={`text-xs mt-2 ${status.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
          {status.message}
        </p>
      )}
      {coupon && (
        <div className="mt-2 flex justify-between items-center text-sm">
          <span className="text-green-600">Coupon {coupon} applied ({discount}% off)</span>
          <button onClick={removeCoupon} className="text-red-500 text-xs">Remove</button>
        </div>
      )}
    </div>
  );
}