import { useQuery } from '@tanstack/react-query';
import { getOrders } from '../services/orderService';

/**
 * Hook para obtener las órdenes del usuario actual.
 */
export function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: getOrders,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}
