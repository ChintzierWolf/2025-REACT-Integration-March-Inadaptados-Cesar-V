import http from '../utils/http';
import { getCurrentUser } from '../utils/auth';

export const getPaymentMethods = async () => {
  const user = getCurrentUser();
  if (!user?._id) return [];
  try {
    return await http.get(`/payment-methods/user/${user._id}`);
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    return [];
  }
};

export const getDefaultPaymentMethod = async () => {
  const methods = await getPaymentMethods();
  return methods.find((m) => m.isDefault) || methods[0] || null;
};

export const createPaymentMethod = async (paymentData) => {
  const user = getCurrentUser();
  if (!user?._id) throw new Error('Debes iniciar sesión');
  return await http.post('/payment-methods', {
    ...paymentData,
    user: user._id
  });
};

export const deletePaymentMethod = async (paymentId) => {
  return await http.delete(`/payment-methods/${paymentId}`);
};

export const setDefaultPaymentMethod = async (paymentId) => {
  return await http.patch(`/payment-methods/${paymentId}/set-default`);
};
