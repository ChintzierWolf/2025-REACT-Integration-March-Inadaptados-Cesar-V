import express from 'express';

import authRoutes from './authRoutes.js';
import cartRoutes from './cartRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import notificationRoutes from './notificationRoutes.js';
import orderRoutes from './orderRoutes.js';
import paymentMethodRoutes from './paymentMethodRoutes.js';
import productRoutes from './productRoutes.js';
import reviewRoutes from './reviewRoutes.js';
import shippingAddressRoutes from './shippingAddressRoutes.js';
import wishListRoutes from './wishListRoutes.js';

const router = express.Router();

// 🧑‍💻 Autenticación y sesión
router.use('/auth', authRoutes);

// 🛒 Carrito de compras
router.use('/cart', cartRoutes);

// 📦 Gestión de productos y categorías
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);

// 📬 Notificaciones
router.use('/notifications', notificationRoutes);

// 📑 Pedidos y pagos
router.use('/orders', orderRoutes);
router.use('/payment-methods', paymentMethodRoutes);

// 🚚 Direcciones de Envío
router.use('/shipping-addresses', shippingAddressRoutes);

// ⭐ Reseñas de Productos
router.use('/reviews', reviewRoutes);

// ❤️ Lista de Deseos
router.use('/wishlists', wishListRoutes);

export default router;