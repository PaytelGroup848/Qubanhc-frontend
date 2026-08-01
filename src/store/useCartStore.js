import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,
      discount: 0,

      // Add item to cart (if exists, increase quantity)
      addItem: (product, quantity = 1, selectedPack = null) => {
        const existing = get().items.find(
          (item) => item.id === product.id && item.packId === (selectedPack?.id || null)
        );
        if (existing) {
          set({
            items: get().items.map((item) =>
              item.id === product.id && item.packId === (selectedPack?.id || null)
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          set({
            items: [
              ...get().items,
              {
                id: product.id,
                name: product.name,
                price: selectedPack?.price || product.price,
                originalPrice: selectedPack?.originalPrice || product.originalPrice,
                quantity,
                image: product.image,
                packId: selectedPack?.id || null,
                packName: selectedPack?.name || null,
              },
            ],
          });
        }
      },

      // Update quantity
      updateQuantity: (id, packId, quantity) => {
        if (quantity < 1) {
          get().removeItem(id, packId);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.id === id && item.packId === packId ? { ...item, quantity } : item
          ),
        });
      },

      // Remove item
      removeItem: (id, packId) => {
        set({
          items: get().items.filter((item) => !(item.id === id && item.packId === packId)),
        });
      },

      // Clear cart
      clearCart: () => set({ items: [], coupon: null, discount: 0 }),

      // Apply coupon (simulate API)
      applyCoupon: async (code) => {
        // Dummy coupon validation
        const validCoupons = { SAVE10: 10, SAVE20: 20, FREESHIP: 0 };
        if (validCoupons[code.toUpperCase()]) {
          set({ coupon: code.toUpperCase(), discount: validCoupons[code.toUpperCase()] });
          return { success: true, discount: validCoupons[code.toUpperCase()] };
        }
        return { success: false, message: 'Invalid coupon code' };
      },

      // Remove coupon
      removeCoupon: () => set({ coupon: null, discount: 0 }),

      // Getters
      getTotalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
      getSubtotal: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      getTotal: () => {
        const subtotal = get().getSubtotal();
        const discount = get().discount;
        const discountAmount = (subtotal * discount) / 100;
        return subtotal - discountAmount;
      },
    }),
    { name: 'cart-storage' } // persists in localStorage
  )
);