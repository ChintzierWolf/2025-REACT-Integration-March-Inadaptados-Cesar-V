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

const router = express.Router();

// Obtener todos los carritos (admin)
router.get('/', getCarts);

// Obtener carrito por ID
router.get('/:id', getCartById);

// Obtener carrito por usuario
router.get('/user/:id', getCartByUser);

// Crear nuevo carrito
router.post('/', createCart);

// Agregar producto al carrito (función especial)
router.post('/add-product', addProductToCart);

// Actualizar carrito completo
router.put('/:id', updateCart);

// Eliminar carrito
router.delete('/:id', deleteCart);

export default router;