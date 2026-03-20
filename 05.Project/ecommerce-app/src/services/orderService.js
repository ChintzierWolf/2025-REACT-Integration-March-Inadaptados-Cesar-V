import http from '../utils/http';
import { getCurrentUser } from '../utils/auth';

export const getOrders = async () => {
  const user = getCurrentUser();
  if (!user?._id) {
    return [];
  }
  return await http.get(`/orders/user/${user._id}`);
};

export const getOrderById = async (orderId) => {
  return await http.get(`/orders/${orderId}`);
};

export const cancelOrder = async (orderId) => {
  return await http.patch(`/orders/${orderId}/cancel`);
};
