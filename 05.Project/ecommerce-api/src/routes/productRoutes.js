import express from 'express';

import {
  getProducts,
  getProductByCategory,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';

const router = express.Router();

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Obtiene la lista de todos los productos
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Lista de productos obtenida exitosamente
 */
router.get('/', getProducts);

/**
 * @swagger
 * /products/category/{idCategory}:
 *   get:
 *     summary: Obtiene productos por ID de categoría
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: idCategory
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la categoría
 *     responses:
 *       200:
 *         description: Lista de productos filtrada
 *       404:
 *         description: Categoría no encontrada
 */
router.get('/category/:idCategory', getProductByCategory);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;