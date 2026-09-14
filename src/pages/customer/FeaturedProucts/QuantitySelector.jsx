export default function QuantitySelector({ quantity, setQuantity, max }) {
  const safeMax = max || 999;

  const increment = () => {
    const next = Math.min(Number(quantity || 1) + 1, safeMax);
    setQuantity(next);
  };

  const decrement = () => {
    const next = Math.max(Number(quantity || 1) - 1, 1);
    setQuantity(next);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={decrement}
        disabled={quantity <= 1}
        className="w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        -
      </button>
      <span className="w-12 text-center font-semibold">{quantity}</span>
      <button
        type="button"
        onClick={increment}
        disabled={quantity >= safeMax}
        className="w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        +
      </button>
    </div>
  );
}