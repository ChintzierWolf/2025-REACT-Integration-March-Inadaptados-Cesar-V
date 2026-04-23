import http from '../utils/http';
import { getCurrentUser } from '../utils/auth';

export const getCart = async () => {
  const user = getCurrentUser();
  if (!user?._id) {
    return { products: [] };
  }
  try {
    return await http.get(`/cart/user/${user._id}`);
  } catch (error) {
    console.error('Error fetching cart:', error);
    return { products: [] };
  }
};

export const addToCart = async (productId, quantity = 1) => {
  const user = getCurrentUser();
  if (!user?._id) {
    throw new Error('Debes iniciar sesión para agregar productos al carrito');
  }
  return await http.post('/cart/add-product', {
    userId: user._id,
    productId,
    quantity
  });
};

export const updateCart = async (cartId, products) => {
  const user = getCurrentUser();
  if (!user?._id) {
    throw new Error('Debes iniciar sesión');
  }
  return await http.put(`/cart/${cartId}`, {
    user: user._id,
    products
  });
};

