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

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: API para gestión de órdenes de compra
 */

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Obtener todas las órdenes (Solo Admin)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de todas las órdenes
 */
router.get('/', authMiddleware, authorizeRoles('admin'), getOrders);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Obtener una orden por ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Datos de la orden
 */
router.get('/:id', authMiddleware, validate(orderIdParamSchema), getOrderById);

/**
 * @swagger
 * /api/orders/user/{userId}:
 *   get:
 *     summary: Obtener órdenes por usuario
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de órdenes del usuario
 */
router.get('/user/:userId', authMiddleware, getOrdersByUser);

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Crear una nueva orden
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *               shippingAddress:
 *                 type: string
 *               paymentMethod:
 *                 type: string
 *     responses:
 *       201:
 *         description: Orden creada exitosamente
 */
router.post('/', authMiddleware, validate(createOrderSchema), createOrder);

/**
 * @swagger
 * /api/orders/{id}:
 *   put:
 *     summary: Actualizar campos de una orden
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Orden actualizada
 */
router.put('/:id', authMiddleware, validate(orderIdParamSchema), updateOrder);

/**
 * @swagger
 * /api/orders/{id}/cancel:
 *   patch:
 *     summary: Cancelar una orden
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Orden cancelada
 */
router.patch('/:id/cancel', authMiddleware, validate(orderIdParamSchema), cancelOrder);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   patch:
 *     summary: Actualizar estado de la orden
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Estado actualizado
 */
router.patch('/:id/status', authMiddleware, validate(updateOrderStatusSchema), updateOrderStatus);

/**
 * @swagger
 * /api/orders/{id}/payment:
 *   patch:
 *     summary: Actualizar estado de pago
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Estado de pago actualizado
 */
router.patch('/:id/payment', authMiddleware, validate(updatePaymentStatusSchema), updatePaymentStatus);

/**
 * @swagger
 * /api/orders/{id}:
 *   delete:
 *     summary: Eliminar orden cancelada (Solo Admin)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Orden eliminada
 */
router.delete('/:id', authMiddleware, authorizeRoles('admin'), validate(orderIdParamSchema), deleteOrder);

export default router;

