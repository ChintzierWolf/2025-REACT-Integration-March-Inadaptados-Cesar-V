import express from 'express';
import { toggleWishlistItem, getWishList } from '../controllers/wishListController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { toggleWishlistSchema } from '../schemas/wishlist.schema.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/toggle', validate(toggleWishlistSchema), toggleWishlistItem);
router.get('/', getWishList);

export default router;
