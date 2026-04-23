import { z } from 'zod';

export const addProductToCartSchema = z.object({
  body: z.object({
    userId: z.string().length(24, 'ID de usuario inválido'),
    productId: z.string().length(24, 'ID de producto inválido'),
    quantity: z.number().int().min(1, 'La cantidad debe ser al menos 1'),
  }),
});

export const updateCartSchema = z.object({
  params: z.object({
    id: z.string().length(24, 'ID de carrito inválido'),
  }),
  body: z.object({
    user: z.string().length(24, 'ID de usuario inválido'),
    products: z.array(
      z.object({
        product: z.string().length(24, 'ID de producto inválido'),
        quantity: z.number().int().min(1, 'La cantidad debe ser al menos 1'),
      })
    ).min(1, 'El carrito debe tener al menos un producto'),
  }),
});
