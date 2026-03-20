import http from '../utils/http';

export const getWishlist = async () => {
  return await http.get('/wishlist/');
};

export const toggleWishlistItem = async (productId) => {
  return await http.post('/wishlist/toggle', { productId });
};
