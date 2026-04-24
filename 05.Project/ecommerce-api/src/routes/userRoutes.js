import express from 'express';
import { validate } from '../middlewares/validate.middleware.js';
import {
  userProfileSchema,
  changePasswordSchema,
  adminUpdateUserSchema,
  userIdParamSchema,
  listUsersQuerySchema
} from '../schemas/user.schema.js';
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
import authMiddleware from '../middlewares/auth.js';
import isAdmin from '../middlewares/isAdminMiddleware.js';

const router = express.Router();

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
router.get('/', validate(listUsersQuerySchema), authMiddleware, isAdmin, getAllUsers);

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
router.get('/:userId', validate(userIdParamSchema), authMiddleware, isAdmin, getUserById);

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
router.put('/profile', validate(userProfileSchema), authMiddleware, updateUserProfile);

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
router.put('/change-password', validate(changePasswordSchema), authMiddleware, changePassword);

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
router.put('/:userId', validate(adminUpdateUserSchema), authMiddleware, isAdmin, updateUser);

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
router.patch('/:userId/toggle-status', validate(userIdParamSchema), authMiddleware, isAdmin, toggleUserStatus);

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
router.delete('/:userId', validate(userIdParamSchema), authMiddleware, isAdmin, deleteUser);

export default router;