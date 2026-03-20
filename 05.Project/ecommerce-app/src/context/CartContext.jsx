import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { getCurrentUser, isAuthenticated } from "../utils/auth";
import { getCart, addToCart as addToCartApi } from "../services/cartService";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [cartId, setCartId] = useState(null);
  const [cartDbSynced, setCartDbSynced] = useState(false);

  const calculateTotal = (items) => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const [total, setTotal] = useState(() => calculateTotal(cartItems));

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
    setTotal(calculateTotal(cartItems));
  }, [cartItems]);

  const syncCartWithBackend = useCallback(async () => {
    const user = getCurrentUser();
    if (!user?._id || cartDbSynced) return;

    try {
      const dbCart = await getCart(user._id);
      if (dbCart && dbCart.products && dbCart.products.length > 0) {
        const dbItems = dbCart.products.map((item) => ({
          _id: item.product?._id || item.product,
          name: item.product?.name || item.name,
          price: item.product?.price || item.price,
          quantity: item.quantity,
          image: item.product?.image || item.image,
        }));
        
        const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
        const mergedCart = [...localCart];
        
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
        
        setCartItems(mergedCart);
        setCartId(dbCart._id);
      } else if (cartItems.length > 0 && !dbCart.products?.length) {
        await addToCartApi(cartItems[0]._id, 0);
        for (const item of cartItems) {
          try {
            await addToCartApi(item._id, item.quantity);
          } catch (e) {}
        }
      }
      setCartDbSynced(true);
    } catch (error) {
      console.error("Error syncing cart with backend:", error);
    }
  }, [cartDbSynced, cartItems]);

  useEffect(() => {
    if (isAuthenticated()) {
      syncCartWithBackend();
    }
  }, [isAuthenticated(), syncCartWithBackend]);

  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item._id !== productId)
    );
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const addToCart = async (product, quantity = 1) => {
    const user = getCurrentUser();
    
    if (user?._id) {
      try {
        await addToCartApi(product._id, quantity);
      } catch (error) {
        console.error("Error adding to backend cart:", error);
      }
    }

    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item._id === product._id);

      if (existingItem) {
        return prevItems.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity }];
      }
    });
  };

  const clearCart = () => {
    setCartItems([]);
    setCartId(null);
    setCartDbSynced(false);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const value = {
    cartItems,
    cartId,
    total: getTotalPrice(),
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context)
    throw new Error("useCart debe ser usado dentro de CartProvider");
  return context;
}
