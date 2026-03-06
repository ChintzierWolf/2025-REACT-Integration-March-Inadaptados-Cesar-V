import express from 'express';
import { createAddress, getUserAddresses, deleteAddress } from '../controllers/shippingAddressController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Todas las rutas de envío requieren autenticación
router.use(authMiddleware);

router.post('/', createAddress);
router.get('/', getUserAddresses);
router.delete('/:id', deleteAddress);

export default router;
