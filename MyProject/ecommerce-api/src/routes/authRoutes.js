import express from 'express';
import {body} from 'express-validator';
import validate from '../middlewares/validation.js';
import { register, login } from '../controllers/authController.js';

const router = express.Router();

router.post('register', [
    body 
], validate, register);
router.post('login', login);

export default router;

