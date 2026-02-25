import { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { CART_ACTIONS, cartInitialState, cartReducer } from "./cartReducer";

const CartContext = createContext();

export function CartProvider({ children }) {

  const [state, dispatch] = useReducer(cartReducer, cartInitialState);

  // Funciones auxiliares
  const getTotalItems = () => {
    return state.items.reduce((sum, i) => sum + i.quantity, 0);
  };

  const getTotalPrice = () => {
    return state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  };

  // Actualizar localStorage cuando cambie el carrito
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state.items));
    setTotal(getTotalPrice());
  }, [state.items]);

  const calculateTotal = (items) => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter((item) => item._id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    dispatch({ type: CART_ACTIONS.SET_QTY, payload: { _id: productId, quantity: newQuantity } });
  };

  const addToCart = (product, quantity = 1) => {
    dispatch({ type: CART_ACTIONS.ADD, payload: { ...product, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR });
  };

  //const getTotalItems = () => {
  //  return cartItems.reduce((total, item) => total + item.quantity, 0);
  //};
  //
  //const getTotalPrice = () => {
  //  return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  //};

  const value = useMemo(
    () => ({
      cartItems: state.items,
      total: getTotalPrice(),
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalItems,
      getTotalPrice,
    }),
    [state.items]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context)
    throw new Error("useCart debe ser usado dentro de CartProvider");
  return context;
}
