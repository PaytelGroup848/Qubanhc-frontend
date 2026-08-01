import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { cartService } from '../services/cart';
import { authService } from '../services/auth';

const CartContext = createContext();
const GUEST_CART_KEY = 'guest-cart';

const readGuestCart = () => {
  try {
    return JSON.parse(localStorage.getItem(GUEST_CART_KEY) || '[]');
  } catch {
    return [];
  }
};

const writeGuestCart = (items) => {
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
};

const getProductId = (product) => product?._id || product?.id;

const buildLocalItem = (product, quantity, variantId) => ({
  id: getProductId(product),
  packId: variantId || null,
  name: product?.name || product?.title || 'Product',
  price: Number(product?.price || product?.salePrice || product?.sellingPrice || 0),
  originalPrice: Number(product?.originalPrice || product?.mrp || product?.price || 0),
  quantity,
  image: product?.image || product?.images?.[0]?.url || product?.images?.[0] || '/images/placeholder.jpg',
  variantName: product?.variantName || null,
});

const formatBackendItems = (items = []) =>
  items.map((item) => ({
    id: item.product?._id,
    packId: item.variant?._id || null,
    name: item.product?.name,
    price: item.priceSnapshot?.price,
    originalPrice: item.priceSnapshot?.originalPrice,
    quantity: item.quantity,
    image: item.product?.images?.[0]?.url,
    variantName: item.priceSnapshot?.variantName,
    cartItemId: item._id,
  }));

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const syncGuestCartToBackend = useCallback(async () => {
    if (!authService.isAuthenticated()) return;
    const guestItems = readGuestCart();
    if (guestItems.length === 0) return;

    await Promise.allSettled(
      guestItems.map((item) =>
        cartService.addToCart(item.id, item.quantity, item.packId || null)
      )
    );
    localStorage.removeItem(GUEST_CART_KEY);
  }, []);

  const fetchCart = useCallback(async () => {
    setLoading(true);

    if (!authService.isAuthenticated()) {
      setCartItems(readGuestCart());
      setLoading(false);
      return;
    }

    try {
      await syncGuestCartToBackend();
      const response = await cartService.getCart();
      const items = response.data?.cart?.items || response.cart?.items || [];
      setCartItems(formatBackendItems(items));
    } catch (error) {
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, [syncGuestCartToBackend]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    const handleAuthChanged = () => fetchCart();
    window.addEventListener('auth-changed', handleAuthChanged);
    window.addEventListener('storage', handleAuthChanged);
    return () => {
      window.removeEventListener('auth-changed', handleAuthChanged);
      window.removeEventListener('storage', handleAuthChanged);
    };
  }, [fetchCart]);

  const addToCart = useCallback(async (product, quantity = 1, variantId = null) => {
    const productId = getProductId(product);
    if (!productId) throw new Error('Product id is required');

    if (!authService.isAuthenticated()) {
      const nextItem = buildLocalItem(product, quantity, variantId);
      const existingItems = readGuestCart();
      const existing = existingItems.find(
        (item) => item.id === nextItem.id && (item.packId || null) === (nextItem.packId || null)
      );

      const updated = existing
        ? existingItems.map((item) =>
            item.id === nextItem.id && (item.packId || null) === (nextItem.packId || null)
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        : [...existingItems, nextItem];

      writeGuestCart(updated);
      setCartItems(updated);
      return true;
    }

    await cartService.addToCart(productId, quantity, variantId);
    await fetchCart();
    return true;
  }, [fetchCart]);

  const updateQuantity = useCallback(async (productId, packId, newQuantity) => {
    const safeQuantity = Math.max(1, newQuantity);

    if (!authService.isAuthenticated()) {
      const updated = readGuestCart().map((item) =>
        item.id === productId && (item.packId || null) === (packId || null)
          ? { ...item, quantity: safeQuantity }
          : item
      );
      writeGuestCart(updated);
      setCartItems(updated);
      return;
    }

    const cartItem = cartItems.find(
      (item) => item.id === productId && (item.packId || null) === (packId || null)
    );
    if (!cartItem?.cartItemId) return;
    await cartService.updateQuantity(cartItem.cartItemId, safeQuantity);
    await fetchCart();
  }, [cartItems, fetchCart]);

  const removeFromCart = useCallback(async (productId, packId) => {
    if (!authService.isAuthenticated()) {
      const updated = readGuestCart().filter(
        (item) => !(item.id === productId && (item.packId || null) === (packId || null))
      );
      writeGuestCart(updated);
      setCartItems(updated);
      return;
    }

    const cartItem = cartItems.find(
      (item) => item.id === productId && (item.packId || null) === (packId || null)
    );
    if (!cartItem?.cartItemId) return;
    await cartService.removeItem(cartItem.cartItemId);
    await fetchCart();
  }, [cartItems, fetchCart]);

  const clearCart = useCallback(async () => {
    if (!authService.isAuthenticated()) {
      localStorage.removeItem(GUEST_CART_KEY);
      setCartItems([]);
      return;
    }

    await cartService.clearCart();
    await fetchCart();
  }, [fetchCart]);

  const applyCoupon = useCallback(async (couponCode) => {
    if (!authService.isAuthenticated()) {
      throw new Error('Please login to apply coupon');
    }
    const response = await cartService.applyCoupon(couponCode);
    await fetchCart();
    return response.data || response;
  }, [fetchCart]);

  const removeCoupon = useCallback(async () => {
    if (!authService.isAuthenticated()) return;
    await cartService.removeCoupon();
    await fetchCart();
  }, [fetchCart]);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => total + (item.price || 0) * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
        refreshCart: fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}