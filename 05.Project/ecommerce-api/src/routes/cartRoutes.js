import express from 'express';
import {
  getCarts,
  getCartById,
  getCartByUser,
  createCart,
  updateCart,
  deleteCart,
  addProductToCart,
} from '../controllers/cartController.js';
import { validate } from '../middlewares/validate.middleware.js';
import { addProductToCartSchema, updateCartSchema } from '../schemas/cart.schema.js';

const router = express.Router();

// Obtener todos los carritos (admin)
router.get('/', getCarts);

// Obtener carrito por ID
router.get('/:id', getCartById);

// Obtener carrito por usuario
router.get('/user/:id', getCartByUser);

// Crear nuevo carrito
router.post('/', validate(updateCartSchema.pick({ body: true })), createCart);

// Agregar producto al carrito (función especial)
router.post('/add-product', validate(addProductToCartSchema), addProductToCart);

// Actualizar carrito completo
router.put('/:id', validate(updateCartSchema), updateCart);

// Eliminar carrito
router.delete('/:id', deleteCart);

export default router;