import express from 'express';
import { validate } from '../middlewares/validate.middleware.js';
import { 
  productSchema, 
  updateProductSchema, 
  getProductByIdSchema,
  searchProductsSchema 
} from '../schemas/product.schema.js';

import {
  getProducts,
  getProductById,
  getProductByCategory,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts
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
 * /products/search:
 *   get:
 *     summary: Búsqueda avanzada de productos con filtros
 *     tags: [Products]
 */
router.get('/search', validate(searchProductsSchema), searchProducts);

/**
 * @swagger
 * /products/category/{idCategory}:
 *   get:
 *     summary: Obtiene productos por ID de categoría
 *     tags: [Products]
 */
router.get('/category/:idCategory', getProductByCategory);

router.get('/:id', validate(getProductByIdSchema), getProductById);
router.post('/', validate(productSchema), createProduct);
router.put('/:id', validate(updateProductSchema), updateProduct);
router.delete('/:id', validate(getProductByIdSchema), deleteProduct);

export default router;