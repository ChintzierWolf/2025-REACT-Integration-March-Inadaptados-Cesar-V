import express from 'express';
import { validate } from '../middlewares/validate.middleware.js';
import { categorySchema, categoryIdSchema } from '../schemas/extra.schema.js';
import 
{
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';

import authMiddleware from '../middlewares/authMiddleware.js';
import isAdmin from '../middlewares/isAdminMiddleware.js';

const router = express.Router();

router.get('/', getCategories);
router.get('/:id', validate(categoryIdSchema), getCategoryById);
router.post('/', authMiddleware, isAdmin, validate(categorySchema), createCategory);
router.put('/:id', authMiddleware, isAdmin, validate(categoryIdSchema), validate(categorySchema), updateCategory);
router.delete('/:id', authMiddleware, isAdmin, validate(categoryIdSchema), deleteCategory);

export default router;