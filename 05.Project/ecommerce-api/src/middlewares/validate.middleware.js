/**
 * Middleware de validación genérico usando Zod.
 * Permite validar body, params y query de una petición.
 * 
 * @param {import('zod').AnyZodObject} schema - Esquema de Zod para validar.
 */
export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors: error.errors.map((err) => ({
        path: err.path.join('.'),
        message: err.message,
      })),
    });
  }
};
