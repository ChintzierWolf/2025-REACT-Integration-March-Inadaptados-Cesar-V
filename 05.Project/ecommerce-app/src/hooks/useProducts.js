import { useQuery } from '@tanstack/react-query';
import { fetchProducts, getProductById } from '../services/productService';

/**
 * Hook para obtener todos los productos con caché automático.
 */
export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
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
