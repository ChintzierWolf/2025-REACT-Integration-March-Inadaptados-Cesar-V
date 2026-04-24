import { useQuery } from '@tanstack/react-query';
import { fetchProducts, getProductById } from '../services/productService';

/**
 * Hook para obtener todos los productos con caché automático y soporte para filtros.
 */
export function useProducts(params = {}) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => fetchProducts(params),
  });
}

/**
 * Hook para obtener un producto específico por ID.
 */
export function useProduct(id) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(id),
    enabled: !!id, // No ejecutar si el ID no existe
  });
}
