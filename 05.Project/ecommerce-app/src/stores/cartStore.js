import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getCart, addToCart as addToCartApi } from '../services/cartService';
import { getCurrentUser } from '../utils/auth';

const calculateTotal = (items) => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

export const useCartStore = create(
  persist(
    (set, get) => ({
      cartItems: [],
      cartId: null,
      cartDbSynced: false,
      total: 0,

      syncCartWithBackend: async () => {
        const { cartDbSynced, cartItems } = get();
        const user = getCurrentUser();
        if (!user?._id || cartDbSynced) return;

        try {
          const dbCart = await getCart();
          if (dbCart && dbCart.products && dbCart.products.length > 0) {
            const dbItems = dbCart.products.map((item) => ({
              _id: item.product?._id || item.product,
              name: item.product?.name || item.name,
              price: item.product?.price || item.price,
              quantity: item.quantity,
              image: item.product?.image || item.image,
            }));
            
            const mergedCart = [...cartItems];
            
            for (const dbItem of dbItems) {
              const existingIndex = mergedCart.findIndex((item) => item._id === dbItem._id);
              if (existingIndex >= 0) {
                mergedCart[existingIndex].quantity = Math.max(
                  mergedCart[existingIndex].quantity,
                  dbItem.quantity
                );
              } else {
                mergedCart.push(dbItem);
              }
            }
            
            set({ cartItems: mergedCart, cartId: dbCart._id, cartDbSynced: true, total: calculateTotal(mergedCart) });
          } else if (cartItems.length > 0 && !dbCart.products?.length) {
            await addToCartApi(cartItems[0]._id, 0);
            for (const item of cartItems) {
              try {
                await addToCartApi(item._id, item.quantity);
              } catch (e) {}
            }
            set({ cartDbSynced: true });
          } else {
             set({ cartDbSynced: true });
          }
        } catch (error) {
          console.error("Error syncing cart with backend:", error);
        }
      },

      removeFromCart: (productId) => {
        set((state) => {
          const newItems = state.cartItems.filter((item) => item._id !== productId);
          return { cartItems: newItems, total: calculateTotal(newItems) };
        });
      },

      updateQuantity: (productId, newQuantity) => {
        if (newQuantity <= 0) {
          get().removeFromCart(productId);
          return;
        }

        set((state) => {
          const newItems = state.cartItems.map((item) =>
            item._id === productId ? { ...item, quantity: newQuantity } : item
          );
          return { cartItems: newItems, total: calculateTotal(newItems) };
        });
      },

      addToCart: async (product, quantity = 1) => {
        const user = getCurrentUser();
        
        if (user?._id) {
          try {
            await addToCartApi(product._id, quantity);
          } catch (error) {
            console.error("Error adding to backend cart:", error);
          }
        }

        set((state) => {
          const existingItem = state.cartItems.find((item) => item._id === product._id);
          let newItems;
          if (existingItem) {
            newItems = state.cartItems.map((item) =>
              item._id === product._id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          } else {
            newItems = [...state.cartItems, { ...product, quantity }];
          }
          return { cartItems: newItems, total: calculateTotal(newItems) };
        });
      },

      clearCart: () => {
        set({ cartItems: [], cartId: null, cartDbSynced: false, total: 0 });
      },

      getTotalItems: () => {
        return get().cartItems.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().total;
      }
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ cartItems: state.cartItems, total: state.total })
    }
  )
);
