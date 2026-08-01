import { useEffect, useState } from 'react';
import { Heart, ShoppingCart, Trash2, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../../../services/api';

export default function WishlistTab() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [removing, setRemoving] = useState(null);

    const fetchWishlist = async () => {
        try {
            setLoading(true);

            const res = await api.get('/wishlist');
            setItems(res.data.data.wishlist.products || []);

            const payload = res.data?.data;

            const wishlistData =
                payload?.wishlist?.products ||
                payload?.wishlist?.items ||
                payload?.wishlist ||
                payload?.products ||
                payload?.items ||
                [];

            setItems(Array.isArray(wishlistData) ? wishlistData : []);
        } catch {
            toast.error('Failed to load wishlist');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, []);

    const handleRemove = async (productId) => {
        try {
            setRemoving(productId);

            await api.delete(`/wishlist/${productId}`);

            toast.success('Removed from wishlist');
            fetchWishlist();
        } catch {
            toast.error('Failed to remove item');
        } finally {
            setRemoving(null);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="h-9 w-9 animate-spin text-teal-600" />
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="h-20 w-20 rounded-3xl bg-rose-50 flex items-center justify-center mb-5">
                    <Heart className="h-9 w-9 text-rose-400" />
                </div>

                <h3 className="text-lg font-black text-slate-900">Wishlist is empty</h3>

                <p className="text-sm text-slate-500 mt-1">
                    Save products you love and find them here later.
                </p>

                <Link
                    to="/categories"
                    className="mt-5 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-teal-700"
                >
                    Explore Products
                </Link>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-xl font-black text-slate-900">Wishlist</h2>
                <p className="text-sm text-slate-500 mt-1">
                    Your saved products and favorites.
                </p>
            </div>

            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {Array.isArray(items) && items.map((entry) => {
                    const product = entry.product || entry;
                    const productId = product._id || product.id;

                    return (
                        <div
                            key={productId}
                            className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm hover:shadow-md transition"
                        >
                            <Link to={`/products/${productId}`}>
                                <div className="aspect-square rounded-2xl bg-slate-100 overflow-hidden">
                                    {product.images?.[0]?.url || product.image ? (
                                        <img
                                            src={product.images?.[0]?.url || product.image}
                                            alt={product.name}
                                            className="h-full w-full object-cover hover:scale-105 transition"
                                        />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center">
                                            <Heart className="h-10 w-10 text-slate-300" />
                                        </div>
                                    )}
                                </div>
                            </Link>

                            <div className="mt-4">
                                <Link
                                    to={`/products/${productId}`}
                                    className="font-bold text-slate-900 line-clamp-2 hover:text-teal-600"
                                >
                                    {product.name}
                                </Link>

                                <p className="mt-1 text-sm text-slate-500">
                                    {product.category?.name || product.category || 'Product'}
                                </p>

                                <p className="mt-2 text-lg font-black text-slate-900">
                                    ₹{Number(product.price || 0).toLocaleString('en-IN')}
                                </p>
                            </div>

                            <div className="mt-4 flex gap-2">
                                <Link
                                    to={`/products/${productId}`}
                                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-3 py-2.5 text-sm font-bold text-white hover:bg-teal-700"
                                >
                                    <ShoppingCart className="h-4 w-4" />
                                    View
                                </Link>

                                <button
                                    onClick={() => handleRemove(productId)}
                                    disabled={removing === productId}
                                    className="inline-flex items-center justify-center rounded-xl border border-red-100 px-3 py-2.5 text-red-500 hover:bg-red-50 disabled:opacity-60"
                                >
                                    {removing === productId ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Trash2 className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}