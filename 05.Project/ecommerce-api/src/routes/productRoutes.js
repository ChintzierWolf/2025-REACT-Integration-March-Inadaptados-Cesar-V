import express from 'express';

import {
  getProducts,
  getProductByCategory,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';

const router = express.Router();

router.get('/products', getProducts);
router.get('/products/category/:idCategory', getProductByCategory);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

export default router;