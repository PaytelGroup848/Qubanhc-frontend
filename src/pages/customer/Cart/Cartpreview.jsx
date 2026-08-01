import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight, ImageOff, ShoppingCart, Trash2, X } from 'lucide-react';
import { useCart } from '../../../context/CartContext';

function fmt(value) {
  return `₹${Number(value || 0).toLocaleString('en-IN')}`;
}

function getProductPath(item) {
  return `/products/${item.slug || item.productSlug || item.id || item.productId}`;
}

export default function Cartpreview({ open = false, onClose }) {
  const navigate = useNavigate();
  const { cartItems = [], removeFromCart } = useCart();

  const totalItems = cartItems.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1),
    0
  );

  const handleCheckout = () => {
    onClose?.();
    navigate('/checkout');
  };

  const handleRemove = (item) => {
    removeFromCart(item.id, item.packId || item.variantId);
    window.dispatchEvent(new Event('cart-changed'));
  };

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            aria-label="Close cart preview overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[998] bg-slate-950/40 backdrop-blur-[2px]"
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 360, damping: 34 }}
            className="fixed right-0 top-0 z-[999] flex h-dvh w-full max-w-md flex-col bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-teal-600">Quick cart</p>
                <h2 className="text-lg font-black text-slate-950">{totalItems} item{totalItems !== 1 ? 's' : ''}</h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-2xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {cartItems.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
                <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-teal-50">
                  <ShoppingCart className="h-9 w-9 text-teal-600" />
                </div>
                <h3 className="text-xl font-black text-slate-950">Your cart is empty</h3>
                <p className="mt-2 text-sm font-medium text-slate-500">Add products and they will appear here.</p>
                <Link
                  to="/products"
                  onClick={onClose}
                  className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-teal-600 px-5 py-3 text-sm font-black text-white transition hover:bg-teal-700"
                >
                  Start Shopping
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
                  {cartItems.map((item) => (
                    <div
                      key={`${item.id}-${item.packId || item.variantId || 'default'}`}
                      className="flex gap-3 rounded-3xl border border-slate-100 bg-white p-3 shadow-sm"
                    >
                      <Link
                        to={getProductPath(item)}
                        onClick={onClose}
                        className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-100"
                      >
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                        ) : (
                          <ImageOff className="h-5 w-5 text-slate-300" />
                        )}
                      </Link>

                      <div className="min-w-0 flex-1">
                        <Link
                          to={getProductPath(item)}
                          onClick={onClose}
                          className="line-clamp-2 text-sm font-black text-slate-900 hover:text-teal-700"
                        >
                          {item.name || 'Product'}
                        </Link>
                        <p className="mt-1 text-xs font-semibold text-slate-400">
                          Qty {item.quantity || 1} × {fmt(item.price)}
                        </p>
                        <p className="mt-1 text-sm font-black text-slate-950">
                          {fmt(Number(item.price || 0) * Number(item.quantity || 1))}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemove(item)}
                        className="self-start rounded-xl p-2 text-slate-300 transition hover:bg-rose-50 hover:text-rose-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-100 bg-slate-50 px-5 py-4">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-sm font-black text-slate-600">Subtotal</span>
                    <span className="text-xl font-black text-slate-950">{fmt(subtotal)}</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleCheckout}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-teal-600 py-3.5 text-sm font-black text-white shadow-lg shadow-teal-100 transition hover:bg-teal-700"
                  >
                    Checkout
                    <ChevronRight className="h-4 w-4" />
                  </button>

                  <Link
                    to="/cart"
                    onClick={onClose}
                    className="mt-3 flex w-full items-center justify-center rounded-2xl bg-white py-3 text-sm font-black text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50"
                  >
                    View full cart
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
