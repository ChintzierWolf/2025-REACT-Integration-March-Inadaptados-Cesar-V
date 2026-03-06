import express from 'express';
import {
  getOrders,
  getOrderById,
  getOrdersByUser,
  createOrder,
  updateOrder,
  cancelOrder,
  updateOrderStatus,
  updatePaymentStatus,
  deleteOrder,
} from '../controllers/orderController.js';

import authMiddleware from '../middlewares/authMiddleware.js';
//import isAdminMiddleware from '../middlewares/isAdminMiddleware.js';
import authorizeRoles from '../middlewares/authorizeRoles.js';

const router = express.Router();

// Se grega authMiddleware a todas las rutas que deberían requerir autenticación, especialmente:

// 📦 Obtener todas las órdenes (admin)
router.get('/', authMiddleware, authorizeRoles('admin'), getOrders);

// 📦 Obtener una orden por ID
router.get('/:id', authMiddleware, getOrderById);

// 📦 Obtener órdenes por usuario
router.get('/user/:userId', authMiddleware, getOrdersByUser);

// 📝 Crear una nueva orden
router.post('/', authMiddleware, createOrder);

// 🔄 Actualizar campos permitidos de una orden
router.put('/:id', authMiddleware, updateOrder);

// ❌ Cancelar una orden
router.patch('/:id/cancel', authMiddleware, cancelOrder);

// 🔄 Actualizar estado de la orden
router.patch('/:id/status', authMiddleware, updateOrderStatus);

// 💳 Actualizar estado de pago
router.patch('/:id/payment', authMiddleware, updatePaymentStatus);

// 🗑️ Eliminar orden cancelada (solo admin)
router.delete('/:id', authMiddleware, authorizeRoles('admin'), deleteOrder);

export default router;

