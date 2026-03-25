import express from 'express';
import {
  getPaymentMethods,
  getPaymentMethodById,
  getPaymentMethodsByUser,
  createPaymentMethod,
  updatePaymentMethod,
  setDefaultPaymentMethod,
  deactivatePaymentMethod,
  deletePaymentMethod,
  getDefaultPaymentMethod,
} from '../controllers/paymentMethodController.js';

const router = express.Router();

// Obtener todos los métodos de pago activos (admin)
router.get('/', getPaymentMethods);

// Obtener método de pago predeterminado de un usuario
router.get('/default/:userId', getDefaultPaymentMethod);

// Obtener métodos de pago de un usuario
router.get('/user/:userId', getPaymentMethodsByUser);

// Obtener método de pago por ID
router.get('/:id', getPaymentMethodById);

// Crear nuevo método de pago
router.post('/', createPaymentMethod);

// Establecer método de pago como predeterminado
router.patch('/:id/set-default', setDefaultPaymentMethod);

// Desactivar método de pago
router.patch('/:id/deactivate', deactivatePaymentMethod);

// Actualizar método de pago
router.put('/:id', updatePaymentMethod);

// Eliminar método de pago permanentemente
router.delete('/:id', deletePaymentMethod);

export default router;