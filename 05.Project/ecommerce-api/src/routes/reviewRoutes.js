import express from 'express';
import { createReview, getProductReviews, deleteReview } from '../controllers/reviewController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, createReview);
router.get('/product/:productId', getProductReviews);
router.delete('/:id', authMiddleware, deleteReview);

export default router;
