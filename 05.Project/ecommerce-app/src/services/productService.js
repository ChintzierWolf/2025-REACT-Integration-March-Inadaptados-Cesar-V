import http from '../utils/http';

export const fetchProducts = async () => {
  return await http.get('/products');
};

export const searchProducts = async (query) => {
  // En un ambiente ideal usaríamos la API /api/products?search=query
  // Sin embargo, para no forzar la reescritura de APIs complejas si no existe ruta de búsqueda:
  const lowerQuery = query.trim().toLowerCase();
  const data = await fetchProducts();
  
  return data.filter(
    (product) =>
      product.name.toLowerCase().includes(lowerQuery) ||
      product.description?.toLowerCase().includes(lowerQuery)
  );
};

export const getProductsByCategory = async (categoryId) => {
  return await http.get(`/products/category/${categoryId}`);
};

export async function getProductById(id) {
  // Dependiendo de si tenemos GET /products/:id, llamamos,
  // si el backend no lo tuviera implementado, extraemos así temporalmente:
  const products = await fetchProducts();
  const target = products.find((p) => p._id === id);
  if(!target) throw new Error('Producto no encontrado');
  return target;
}