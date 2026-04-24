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

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: API para gestión del carrito de compras
 */

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Obtener todos los carritos (Solo Admin)
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: Lista de todos los carritos
 */
router.get('/', getCarts);

/**
 * @swagger
 * /api/cart/{id}:
 *   get:
 *     summary: Obtener carrito por ID
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Datos del carrito
 */
router.get('/:id', getCartById);

/**
 * @swagger
 * /api/cart/user/{id}:
 *   get:
 *     summary: Obtener carrito por ID de usuario
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Carrito del usuario
 */
router.get('/user/:id', getCartByUser);

/**
 * @swagger
 * /api/cart:
 *   post:
 *     summary: Crear nuevo carrito
 *     tags: [Cart]
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
 *     responses:
 *       201:
 *         description: Carrito creado
 */
router.post('/', validate(updateCartSchema.pick({ body: true })), createCart);

/**
 * @swagger
 * /api/cart/add-product:
 *   post:
 *     summary: Agregar un producto al carrito
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Producto agregado exitosamente
 */
router.post('/add-product', validate(addProductToCartSchema), addProductToCart);

/**
 * @swagger
 * /api/cart/{id}:
 *   put:
 *     summary: Actualizar carrito completo
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Carrito actualizado
 */
router.put('/:id', validate(updateCartSchema), updateCart);

/**
 * @swagger
 * /api/cart/{id}:
 *   delete:
 *     summary: Eliminar carrito
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Carrito eliminado
 */
router.delete('/:id', deleteCart);

export default router;