import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const userProfileSchema = z.object({
  body: z.object({
    displayName: z.string()
      .min(2, 'El nombre debe tener al menos 2 caracteres')
      .max(50, 'El nombre no puede exceder los 50 caracteres')
      .regex(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras, números y espacios')
      .optional(),
    email: z.string().email('Email inválido').optional(),
    phone: z.string()
      .length(10, 'El teléfono debe tener exactamente 10 dígitos')
      .regex(/^\d+$/, 'El teléfono solo debe contener números')
      .optional(),
    avatar: z.string().url('El avatar debe ser una URL válida').optional(),
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'La contraseña actual es obligatoria'),
    newPassword: z.string()
      .min(6, 'La nueva contraseña debe tener al menos 6 caracteres')
      .regex(/\d/, 'La nueva contraseña debe contener al menos un número')
      .regex(/[a-zA-Z]/, 'La nueva contraseña debe contener al menos una letra'),
    confirmPassword: z.string().min(1, 'La confirmación de contraseña es obligatoria'),
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: "La confirmación de contraseña no coincide",
    path: ["confirmPassword"],
  }),
});

export const adminUpdateUserSchema = z.object({
  params: z.object({
    userId: z.string().regex(objectIdRegex, 'ID de usuario inválido'),
  }),
  body: z.object({
    displayName: userProfileSchema.shape.body.shape.displayName,
    email: userProfileSchema.shape.body.shape.email,
    phone: userProfileSchema.shape.body.shape.phone,
    role: z.enum(['admin', 'customer', 'guest'], {
      errorMap: () => ({ message: "El rol debe ser admin, customer o guest" })
    }).optional(),
    isActive: z.boolean({
      invalid_type_error: "isActive debe ser un valor booleano"
    }).optional(),
  }),
});

export const userIdParamSchema = z.object({
  params: z.object({
    userId: z.string().regex(objectIdRegex, 'ID de usuario inválido'),
  }),
});

export const listUsersQuerySchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    role: z.enum(['admin', 'customer', 'guest']).optional(),
    isActive: z.enum(['true', 'false']).transform(v => v === 'true').optional(),
  }),
});
