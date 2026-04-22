/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Gestión de pedidos, checkout y estados de envío
 */

import errorHandler from '../middlewares/errorHandler.js';
import Order from '../models/order.js';

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Obtener todos los pedidos (Solo Admin)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pedidos recuperada exitosamente
 *       403:
 *         description: No autorizado
 */
async function getOrders(req, res) {
  try {
    const orders = await Order.find()
      .populate('user')
      .populate('products.productId')
      .populate('shippingAddress')
      .populate('paymentMethod')
      .sort({ status: 1 });
    res.json(orders);
  } catch (error) {
    errorHandler(error, req, res);
  }
}

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Obtener un pedido por ID
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
 *         description: Detalles del pedido recuperados
 *       404:
 *         description: Pedido no encontrado
 */
async function getOrderById(req, res) {
  try {
    const id = req.params.id;
    const order = await Order.findById(id)
      .populate('user')
      .populate('products.productId')
      .populate('shippingAddress')
      .populate('paymentMethod');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    errorHandler(error, req, res);
  }
}

/**
 * @swagger
 * /orders/user/{userId}:
 *   get:
 *     summary: Obtener pedidos de un usuario específico
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
 *         description: Lista de pedidos del usuario
 */
async function getOrdersByUser(req, res) {
  try {
    const userId = req.params.userId;
    const orders = await Order.find({ user: userId })
      .populate('user')
      .populate('products.productId')
      .populate('shippingAddress')
      .populate('paymentMethod')
      .sort({ status: 1 });

    if (orders.length === 0) {
      return res.status(200).json([]);
    }
    res.json(orders);
  } catch (error) {
    errorHandler(error, req, res);
  }
}

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Crear un nuevo pedido (Checkout)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [user, products, shippingAddress, paymentMethod]
 *             properties:
 *               user:
 *                 type: string
 *               shippingAddress:
 *                 type: string
 *               paymentMethod:
 *                 type: string
 *               shippingCost:
 *                 type: number
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *                     price:
 *                       type: number
 *     responses:
 *       201:
 *         description: Pedido creado exitosamente
 *       400:
 *         description: Error en la validación de datos
 */
async function createOrder(req, res) {
  try {
    const {
      user,
      products,
      shippingAddress,
      paymentMethod,
      shippingCost = 0
    } = req.body;

    // Validaciones básicas
    if (!user || !products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: 'User and products array are required' });
    }
    if (!shippingAddress || !paymentMethod) {
      return res.status(400).json({ error: 'Shipping address and payment method are required' });
    }

    // Validar estructura de productos
    for (const item of products) {
      if (!item.productId || !item.quantity || !item.price || item.quantity < 1) {
        return res.status(400).json({
          error: 'Each product must have productId, quantity >= 1, and price'
        });
      }
    }

    // Calcular precio total
    const subtotal = products.reduce((total, item) => total + (item.price * item.quantity), 0);
    const totalPrice = subtotal + shippingCost;

    const newOrder = await Order.create({
      user,
      products,
      shippingAddress,
      paymentMethod,
      shippingCost,
      totalPrice,
      status: 'pending',
      paymentStatus: 'pending'
    });

    await newOrder.populate('user');
    await newOrder.populate('products.productId');
    await newOrder.populate('shippingAddress');
    await newOrder.populate('paymentMethod');

    res.status(201).json(newOrder);
  } catch (error) {
    errorHandler(error, req, res);
  }
}

async function updateOrder(req, res) {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Solo permitir actualizar ciertos campos
    const allowedFields = ['status', 'paymentStatus', 'shippingCost'];
    const filteredUpdate = {};

    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        filteredUpdate[field] = updateData[field];
      }
    }

    // Si se actualiza shippingCost, recalcular totalPrice
    if (filteredUpdate.shippingCost !== undefined) {
      const order = await Order.findById(id);
      if (order) {
        const subtotal = order.products.reduce((total, item) => total + (item.price * item.quantity), 0);
        filteredUpdate.totalPrice = subtotal + filteredUpdate.shippingCost;
      }
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      filteredUpdate,
      { new: true }
    )
      .populate('user')
      .populate('products.productId')
      .populate('shippingAddress')
      .populate('paymentMethod');

    if (updatedOrder) {
      return res.status(200).json(updatedOrder);
    } else {
      return res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    errorHandler(error, req, res);
  }
}

async function cancelOrder(req, res) {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Solo permitir cancelar si el estado lo permite
    if (order.status === 'delivered' || order.status === 'cancelled') {
      return res.status(400).json({
        message: 'Cannot cancel order with status: ' + order.status
      });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      {
        status: 'cancelled',
        paymentStatus: order.paymentStatus === 'paid' ? 'refunded' : 'failed'
      },
      { new: true }
    )
      .populate('user')
      .populate('products.productId')
      .populate('shippingAddress')
      .populate('paymentMethod');

    res.status(200).json(updatedOrder);
  } catch (error) {
    errorHandler(error, req, res);
  }
}

/**
 * @swagger
 * /orders/{id}/status:
 *   patch:
 *     summary: Actualizar estado de envío de un pedido
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, processing, shipped, delivered, cancelled]
 *     responses:
 *       200:
 *         description: Estado actualizado exitosamente
 */
async function updateOrderStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: 'Invalid status. Valid statuses: ' + validStatuses.join(', ')
      });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )
      .populate('user')
      .populate('products.productId')
      .populate('shippingAddress')
      .populate('paymentMethod');

    if (updatedOrder) {
      return res.status(200).json(updatedOrder);
    } else {
      return res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    errorHandler(error, req, res);
  }
}

/**
 * @swagger
 * /orders/{id}/payment:
 *   patch:
 *     summary: Actualizar estado de pago de un pedido
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paymentStatus:
 *                 type: string
 *                 enum: [pending, paid, failed, refunded]
 *     responses:
 *       200:
 *         description: Estado de pago actualizado
 */
async function updatePaymentStatus(req, res) {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;

    const validPaymentStatuses = ['pending', 'paid', 'failed', 'refunded'];
    if (!validPaymentStatuses.includes(paymentStatus)) {
      return res.status(400).json({
        error: 'Invalid payment status. Valid statuses: ' + validPaymentStatuses.join(', ')
      });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { paymentStatus },
      { new: true }
    )
      .populate('user')
      .populate('products.productId')
      .populate('shippingAddress')
      .populate('paymentMethod');

    if (updatedOrder) {
      return res.status(200).json(updatedOrder);
    } else {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }
  } catch (error) {
    errorHandler(error, req, res);
  }
}

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: Eliminar una orden cancelada (Solo Admin)
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
 *         description: Orden eliminada
 *       400:
 *         description: Solo se pueden eliminar órdenes canceladas
 */
async function deleteOrder(req, res) {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }

    // Solo permitir eliminar órdenes canceladas
    if (order.status !== 'cancelled') {
      return res.status(400).json({
        message: 'Solo se pueden eliminar ordenes canceladas'
      });
    }

    await Order.findByIdAndDelete(id);
    res.status(200).json({message: 'Orden eliminada exitosamente'});
  } catch (error) {
    res.status(500).json({ error });
  }
}

export {
  getOrders,
  getOrderById,
  getOrdersByUser,
  createOrder,
  updateOrder,
  cancelOrder,
  updateOrderStatus,
  updatePaymentStatus,
  deleteOrder,
};