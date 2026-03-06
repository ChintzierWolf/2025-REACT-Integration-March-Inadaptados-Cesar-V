import express from 'express';
import { toggleWishlistItem, getWishList } from '../controllers/wishListController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/toggle', toggleWishlistItem);
router.get('/', getWishList);

export default router;
