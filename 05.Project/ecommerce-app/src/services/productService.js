import http from '../utils/http';

export const fetchProducts = async (params = {}) => {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, value);
    }
  });
  const queryString = queryParams.toString();
  return await http.get(`/products${queryString ? `?${queryString}` : ''}`);
};

export const searchProducts = async (params = {}) => {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, value);
    }
  });
  const queryString = queryParams.toString();
  // El backend tiene una ruta específica para búsqueda avanzada /api/products/search
  const response = await http.get(`/products/search?${queryString}`);
  // El endpoint /search retorna { products, pagination }
  return response.products || response;
};

export const getProductsByCategory = async (categoryId) => {
  return await http.get(`/products/category/${categoryId}`);
};

export async function getProductById(id) {
  return await http.get(`/products/${id}`);
}