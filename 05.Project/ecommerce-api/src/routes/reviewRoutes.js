import express from 'express';
import { validate } from '../middlewares/validate.middleware.js';
import { reviewSchema, productIdParamSchema, reviewIdParamSchema } from '../schemas/extra.schema.js';
import { createReview, getProductReviews, deleteReview } from '../controllers/reviewController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, validate(reviewSchema), createReview);
router.get('/product/:productId', validate(productIdParamSchema), getProductReviews);
router.delete('/:id', authMiddleware, validate(reviewIdParamSchema), deleteReview);

export default router;
