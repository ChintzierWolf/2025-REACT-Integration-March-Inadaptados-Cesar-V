import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

// --- CATEGORIES ---
export const categorySchema = z.object({
  body: z.object({
    name: z.string().min(3, "El nombre de la categoría debe tener al menos 3 caracteres"),
    description: z.string().optional(),
    icon: z.string().optional()
  })
});

export const categoryIdSchema = z.object({
  params: z.object({
    id: z.string().regex(objectIdRegex, "ID de categoría inválido")
  })
});

// --- REVIEWS ---
export const reviewSchema = z.object({
  body: z.object({
    product: z.string().regex(objectIdRegex, "ID de producto inválido"),
    rating: z.number().min(1).max(5, "La calificación debe estar entre 1 y 5"),
    comment: z.string().min(5, "El comentario debe tener al menos 5 caracteres")
  })
});

export const productIdParamSchema = z.object({
  params: z.object({
    productId: z.string().regex(objectIdRegex, "ID de producto inválido")
  })
});

export const reviewIdParamSchema = z.object({
  params: z.object({
    id: z.string().regex(objectIdRegex, "ID de reseña inválido")
  })
});

// --- NOTIFICATIONS ---
export const notificationSchema = z.object({
  body: z.object({
    user: z.string().regex(objectIdRegex, "ID de usuario inválido"),
    type: z.enum(['order', 'payment', 'system', 'promotion']),
    message: z.string().min(1, "El mensaje es obligatorio")
  })
});

export const notificationIdParamSchema = z.object({
  params: z.object({
    id: z.string().regex(objectIdRegex, "ID de notificación inválido")
  })
});

export const userIdParamSchema = z.object({
  params: z.object({
    userId: z.string().regex(objectIdRegex, "ID de usuario inválido")
  })
});
