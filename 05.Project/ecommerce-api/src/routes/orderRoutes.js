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
import authorizeRoles from '../middlewares/authorizeRoles.js';
import { validate } from '../middlewares/validate.middleware.js';
import { 
  createOrderSchema, 
  updateOrderStatusSchema, 
  updatePaymentStatusSchema,
  orderIdParamSchema 
} from '../schemas/order.schema.js';

const router = express.Router();

// 📦 Obtener todas las órdenes (admin)
router.get('/', authMiddleware, authorizeRoles('admin'), getOrders);

// 📦 Obtener una orden por ID
router.get('/:id', authMiddleware, validate(orderIdParamSchema), getOrderById);

// 📦 Obtener órdenes por usuario
router.get('/user/:userId', authMiddleware, getOrdersByUser);

// 📝 Crear una nueva orden
router.post('/', authMiddleware, validate(createOrderSchema), createOrder);

// 🔄 Actualizar campos permitidos de una orden
router.put('/:id', authMiddleware, validate(orderIdParamSchema), updateOrder);

// ❌ Cancelar una orden
router.patch('/:id/cancel', authMiddleware, validate(orderIdParamSchema), cancelOrder);

// 🔄 Actualizar estado de la orden
router.patch('/:id/status', authMiddleware, validate(updateOrderStatusSchema), updateOrderStatus);

// 💳 Actualizar estado de pago
router.patch('/:id/payment', authMiddleware, validate(updatePaymentStatusSchema), updatePaymentStatus);

// 🗑️ Eliminar orden cancelada (solo admin)
router.delete('/:id', authMiddleware, authorizeRoles('admin'), validate(orderIdParamSchema), deleteOrder);

export default router;

