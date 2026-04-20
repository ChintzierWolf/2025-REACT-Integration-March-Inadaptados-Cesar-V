import http from '../utils/http';
import { getCurrentUser } from '../utils/auth';

export const getShippingAddresses = async () => {
  const user = getCurrentUser();
  if (!user?._id) return [];
  try {
    return await http.get('/shipping-addresses');
  } catch (error) {
    console.error('Error fetching addresses:', error);
    return [];
  }
};

export const getDefaultShippingAddress = async () => {
  const addresses = await getShippingAddresses();
  return addresses.find((a) => a.isDefault) || addresses[0] || null;
};

export const createShippingAddress = async (addressData) => {
  const user = getCurrentUser();
  if (!user?._id) throw new Error('Debes iniciar sesión');
  return await http.post('/shipping-addresses', {
    ...addressData,
    user: user._id
  });
};

export const deleteShippingAddress = async (addressId) => {
  return await http.delete(`/shipping-addresses/${addressId}`);
};
