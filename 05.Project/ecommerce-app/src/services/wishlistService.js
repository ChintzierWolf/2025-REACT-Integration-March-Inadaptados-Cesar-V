import http from '../utils/http';

export const getWishlist = async () => {
  return await http.get('/wishlists');
};

export const toggleWishlistItem = async (productId) => {
  return await http.post('/wishlists/toggle', { productId });
};
