import { useQuery } from '@tanstack/react-query';
import { 
  fetchCategories, 
  getCategoryById, 
  getProductsByCategoryAndChildren 
} from '../services/categoryService';

/**
 * Hook para obtener todas las categorías.
 */
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });
}

/**
 * Hook para obtener una categoría específica por ID.
 */
export function useCategory(categoryId) {
  return useQuery({
    queryKey: ['categories', categoryId],
    queryFn: () => getCategoryById(categoryId),
    enabled: !!categoryId,
  });
}

/**
 * Hook para obtener los productos de una categoría y sus subcategorías.
 */
export function useCategoryProducts(categoryId) {
  return useQuery({
    queryKey: ['categoryProducts', categoryId],
    queryFn: () => getProductsByCategoryAndChildren(categoryId),
    enabled: !!categoryId,
  });
}
