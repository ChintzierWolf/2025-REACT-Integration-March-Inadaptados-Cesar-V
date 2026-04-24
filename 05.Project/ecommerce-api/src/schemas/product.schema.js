import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const productSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "El nombre es obligatorio",
    }).min(3, "El nombre debe tener al menos 3 caracteres"),
    
    description: z.string({
      required_error: "La descripción es obligatoria",
    }).min(10, "La descripción debe tener al menos 10 caracteres"),
    
    price: z.number({
      required_error: "El precio es obligatorio",
      invalid_type_error: "El precio debe ser un número",
    }).positive("El precio debe ser un valor positivo"),
    
    stock: z.number({
      required_error: "El stock es obligatorio",
    }).int("El stock debe ser un número entero").nonnegative("El stock no puede ser negativo"),
    
    imagesUrl: z.array(z.string().url("Cada imagen debe ser una URL válida")).min(1, "Debe incluir al menos una imagen"),
    
    category: z.string({
      required_error: "La categoría es obligatoria",
    }).regex(objectIdRegex, "ID de categoría inválido"),
  }),
});

export const updateProductSchema = z.object({
  params: z.object({
    id: z.string().regex(objectIdRegex, "ID de producto inválido"),
  }),
  body: productSchema.shape.body.partial(),
});

export const getProductByIdSchema = z.object({
  params: z.object({
    id: z.string().regex(objectIdRegex, "ID de producto inválido"),
  }),
});

export const searchProductsSchema = z.object({
  query: z.object({
    q: z.string().optional(),
    category: z.string().regex(objectIdRegex).optional(),
    minPrice: z.string().regex(/^\d+(\.\d+)?$/).optional(),
    maxPrice: z.string().regex(/^\d+(\.\d+)?$/).optional(),
    inStock: z.enum(['true', 'false']).optional(),
    sort: z.string().optional(),
    order: z.enum(['asc', 'desc']).optional(),
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
  }),
});
