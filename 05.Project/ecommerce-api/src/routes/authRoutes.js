import express from 'express';
import {body} from 'express-validator';
import validate from '../middlewares/validation.js';
import { register, login } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', [
    body('displayName').notEmpty().withMessage('Display name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], validate, register);
router.post('/login', login);

export default router;

