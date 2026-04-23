import { z } from 'zod';

export const createOrderSchema = z.object({
  body: z.object({
    user: z.string().length(24, 'ID de usuario inválido'),
    products: z.array(z.object({
      productId: z.string().length(24, 'ID de producto inválido'),
      quantity: z.number().int().min(1, 'La cantidad debe ser al menos 1'),
      price: z.number().min(0, 'El precio no puede ser negativo'),
    })).min(1, 'La orden debe tener al menos un producto'),
    shippingAddress: z.string().length(24, 'ID de dirección inválido'),
    paymentMethod: z.string().length(24, 'ID de método de pago inválido'),
    shippingCost: z.number().min(0).optional().default(0),
  }),
});

export const updateOrderStatusSchema = z.object({
  params: z.object({
    id: z.string().length(24, 'ID de orden inválido'),
  }),
  body: z.object({
    status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled'], {
      errorMap: () => ({ message: 'Estado de orden inválido' }),
    }),
  }),
});

export const updatePaymentStatusSchema = z.object({
  params: z.object({
    id: z.string().length(24, 'ID de orden inválido'),
  }),
  body: z.object({
    paymentStatus: z.enum(['pending', 'paid', 'failed', 'refunded'], {
      errorMap: () => ({ message: 'Estado de pago inválido' }),
    }),
  }),
});

export const orderIdParamSchema = z.object({
  params: z.object({
    id: z.string().length(24, 'ID de orden inválido'),
  }),
});
