import { z } from 'zod';

export const toggleWishlistSchema = z.object({
  body: z.object({
    productId: z.string().length(24, 'ID de producto inválido (debe tener 24 caracteres)'),
  }),
});
