import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getShippingAddresses, createShippingAddress, deleteShippingAddress } from '../services/shippingService';
import { getPaymentMethods, createPaymentMethod, deletePaymentMethod } from '../services/paymentService';

/**
 * Hook para obtener las direcciones de envío del usuario.
 */
export function useShippingAddresses() {
  return useQuery({
    queryKey: ['shipping-addresses'],
    queryFn: getShippingAddresses,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

/**
 * Hook para obtener los métodos de pago del usuario.
 */
export function usePaymentMethods() {
  return useQuery({
    queryKey: ['payment-methods'],
    queryFn: getPaymentMethods,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

// --- MUTACIONES PARA DIRECCIONES ---

export function useCreateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createShippingAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipping-addresses'] });
    },
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteShippingAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipping-addresses'] });
    },
  });
}

// --- MUTACIONES PARA MÉTODOS DE PAGO ---

export function useCreatePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPaymentMethod,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
    },
  });
}

export function useDeletePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePaymentMethod,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
    },
  });
}
