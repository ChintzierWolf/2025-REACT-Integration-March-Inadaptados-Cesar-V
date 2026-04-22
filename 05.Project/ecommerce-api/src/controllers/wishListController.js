/**
 * @swagger
 * tags:
 *   name: Wishlist
 *   description: Gestión de la lista de deseos de los usuarios
 */

import WishList from '../models/wishList.js';

/**
 * @swagger
 * /wishlists/toggle:
 *   post:
 *     summary: Agregar o quitar un producto de la lista de deseos
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productId]
 *             properties:
 *               productId:
 *                 type: string
 *                 description: ID del producto a alternar
 *     responses:
 *       200:
 *         description: WishList actualizada exitosamente
 *       201:
 *         description: WishList creada y producto agregado
 *       401:
 *         description: No autorizado
 */
export const toggleWishlistItem = async (req, res, next) => {
  try {
    const { productId } = req.body;
    let wishList = await WishList.findOne({ user: req.user._id });

    if (!wishList) {
      wishList = await WishList.create({ 
        user: req.user._id, 
        products: [{ product: productId }] 
      });
      return res.status(201).json({ success: true, message: 'Agregado a WishList', data: wishList });
    }

    const index = wishList.products.findIndex(p => p.product.toString() === productId);
    if (index > -1) {
      wishList.products.splice(index, 1);
    } else {
      wishList.products.push({ product: productId });
    }
    
    await wishList.save();
    res.status(200).json({ success: true, message: 'WishList actualizada', data: wishList });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /wishlists:
 *   get:
 *     summary: Obtener la lista de deseos del usuario autenticado
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de deseos recuperada exitosamente
 *       401:
 *         description: No autorizado
 */
export const getWishList = async (req, res, next) => {
  try {
    const wishList = await WishList.findOne({ user: req.user._id }).populate('products.product');
    if (!wishList) {
      return res.status(200).json({ success: true, data: { products: [] } });
    }
    res.status(200).json({ success: true, data: wishList });
  } catch (error) {
    next(error);
  }
};
