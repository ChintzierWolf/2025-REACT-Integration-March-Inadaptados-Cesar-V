import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getWishlist, toggleWishlistItem } from '../services/wishlistService';

/**
 * Hook para obtener la lista de deseos del usuario actual.
 */
export function useWishlist() {
  return useQuery({
    queryKey: ['wishlist'],
    queryFn: getWishlist,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

/**
 * Hook para alternar un producto en la lista de deseos.
 */
export function useToggleWishlist() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: toggleWishlistItem,
    onSuccess: () => {
      // Invalidar y refrescar la lista de deseos después de un cambio
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });
}
