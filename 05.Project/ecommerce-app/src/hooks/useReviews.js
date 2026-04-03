import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProductReviews, createReview } from '../services/reviewService';

/**
 * Hook para obtener las reseñas de un producto.
 * @param {string} productId ID del producto.
 */
export function useReviews(productId) {
  return useQuery({
    queryKey: ['reviews', productId],
    queryFn: () => getProductReviews(productId),
    enabled: !!productId,
  });
}

/**
 * Hook para crear una nueva reseña.
 * Invalida automáticamente el caché de reseñas del producto al éxito.
 */
export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, rating, comment }) => 
      createReview(productId, rating, comment),
    onSuccess: (data, variables) => {
      // Invalidamos las reseñas de ese producto específico para forzar el refetch
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.productId] });
      // También podríamos invalidar el producto si la reseña afecta el promedio de calificación
      queryClient.invalidateQueries({ queryKey: ['product', variables.productId] });
    },
  });
}
