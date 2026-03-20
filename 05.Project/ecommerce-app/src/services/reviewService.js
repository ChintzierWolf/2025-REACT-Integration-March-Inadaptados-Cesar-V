import http from '../utils/http';

export const getProductReviews = async (productId) => {
  return await http.get(`/reviews/product/${productId}`);
};

export const createReview = async (productId, rating, comment) => {
  return await http.post('/reviews/', { 
    productId, 
    rating, 
    comment 
  });
};

export const deleteReview = async (reviewId) => {
  return await http.delete(`/reviews/${reviewId}`);
};
