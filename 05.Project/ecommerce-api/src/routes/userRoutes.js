import express from 'express';
import { body, param, query } from 'express-validator';
import validate from '../middlewares/validation.js';
import {
  getUserProfile,
  getAllUsers,
  getUserById,
  updateUserProfile,
  changePassword,
  updateUser,
  deactivateUser,
  toggleUserStatus,
  deleteUser
} from '../controllers/userController.js';
import authMiddleware from '../middlewares/auth.js'; // Middleware de autenticación
import isAdmin from '../middlewares/isAdminMiddleware.js'; // Middleware de admin

const router = express.Router();

// Validaciones comunes para actualizar perfil
const profileValidations = [
  body('displayName')
    .optional()
    .isLength({ min: 2, max: 50 }).withMessage('Display name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/).withMessage('Display name must contain only letters, numbers and spaces')
    .trim(),

  body('email')
    .optional()
    .isEmail().withMessage('Valid email is required')
    .normalizeEmail(),

  body('phone')
    .optional()
    .isLength({ min: 10, max: 10 }).withMessage('Phone must be exactly 10 digits')
    .isNumeric().withMessage('Phone must contain only numbers'),

  body('avatar')
    .optional()
    .isURL().withMessage('Avatar must be a valid URL')
];

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Obtener perfil del usuario autenticado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos del perfil del usuario
 */
router.get('/profile', authMiddleware, getUserProfile);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtener todos los usuarios (Solo Admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 */
router.get('/', [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),

  query('role')
    .optional()
    .isIn(['admin', 'customer', 'guest']).withMessage('Role must be admin, customer, or guest'),

  query('isActive')
    .optional()
    .isBoolean().withMessage('isActive must be a boolean value')
], validate, authMiddleware, isAdmin, getAllUsers);

/**
 * @swagger
 * /api/users/{userId}:
 *   get:
 *     summary: Obtener usuario por ID (Solo Admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Datos del usuario
 */
router.get('/:userId', [
  param('userId')
    .isMongoId().withMessage('User ID must be a valid MongoDB ObjectId')
], validate, authMiddleware, isAdmin, getUserById);


/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Actualizar perfil del usuario
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil actualizado
 */
router.put('/profile', profileValidations, validate, authMiddleware, updateUserProfile);

/**
 * @swagger
 * /api/users/change-password:
 *   put:
 *     summary: Cambiar contraseña
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Contraseña cambiada exitosamente
 */
router.put('/change-password', [
  body('currentPassword')
    .notEmpty().withMessage('Current password is required'),

  body('newPassword')
    .isLength({ min: 6 }).withMessage('New password must be at least 6 characters long')
    .matches(/\d/).withMessage('New password must contain at least one number')
    .matches(/[a-zA-Z]/).withMessage('New password must contain at least one letter'),

  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Password confirmation does not match new password');
      }
      return true;
    })
], validate, authMiddleware, changePassword);

/**
 * @swagger
 * /api/users/{userId}:
 *   put:
 *     summary: Actualizar usuario (Solo Admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario actualizado
 */
router.put('/:userId', [
  param('userId')
    .isMongoId().withMessage('User ID must be a valid MongoDB ObjectId'),

  ...profileValidations,

  body('role')
    .optional()
    .isIn(['admin', 'customer', 'guest']).withMessage('Role must be admin, customer, or guest'),

  body('isActive')
    .optional()
    .isBoolean().withMessage('isActive must be a boolean value')
], validate, authMiddleware, isAdmin, updateUser);

/**
 * @swagger
 * /api/users/deactivate:
 *   patch:
 *     summary: Desactivar cuenta propia
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cuenta desactivada
 */
router.patch('/deactivate', authMiddleware, deactivateUser);

/**
 * @swagger
 * /api/users/{userId}/toggle-status:
 *   patch:
 *     summary: Activar/Desactivar usuario (Solo Admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Estado del usuario actualizado
 */
router.patch('/:userId/toggle-status', [
  param('userId')
    .isMongoId().withMessage('User ID must be a valid MongoDB ObjectId')
], validate, authMiddleware, isAdmin, toggleUserStatus);

/**
 * @swagger
 * /api/users/{userId}:
 *   delete:
 *     summary: Eliminar usuario (Solo Admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Usuario eliminado
 */
router.delete('/:userId', [
  param('userId')
    .isMongoId().withMessage('User ID must be a valid MongoDB ObjectId')
], validate, authMiddleware, isAdmin, deleteUser);

export default router;