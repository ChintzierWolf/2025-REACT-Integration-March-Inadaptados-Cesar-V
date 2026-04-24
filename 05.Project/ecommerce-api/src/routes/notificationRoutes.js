import express from 'express';
import { validate } from '../middlewares/validate.middleware.js';
import { 
  notificationSchema, 
  notificationIdParamSchema, 
  userIdParamSchema 
} from '../schemas/extra.schema.js';
import {
  getNotifications,
  getNotificationById,
  getNotificationByUser,
  createNotification,
  updateNotification,
  deleteNotification,
  markAsRead,
  markAllAsReadByUser,
  getUnreadNotificationsByUser,
} from '../controllers/notificationController.js';
import authMiddleware from '../middlewares/auth.js';
import isAdmin from '../middlewares/isAdminMiddleware.js';

const router = express.Router();

// Obtener todas las notificaciones (admin)
router.get('/', authMiddleware, isAdmin, getNotifications);

// Obtener notificaciones no leídas por usuario
router.get('/unread/:userId', authMiddleware, validate(userIdParamSchema), getUnreadNotificationsByUser);

// Obtener notificaciones por usuario
router.get('/user/:userId', authMiddleware, validate(userIdParamSchema), getNotificationByUser);

// Obtener notificación por ID
router.get('/:id', authMiddleware, validate(notificationIdParamSchema), getNotificationById);

// Crear nueva notificación
router.post('/', authMiddleware, isAdmin, validate(notificationSchema), createNotification);

// Marcar una notificación como leída
router.patch('/:id/mark-read', authMiddleware, validate(notificationIdParamSchema), markAsRead);

// Marcar todas las notificaciones de un usuario como leídas
router.patch('/user/:userId/mark-all-read', authMiddleware, validate(userIdParamSchema), markAllAsReadByUser);

// Actualizar notificación
router.put('/:id', authMiddleware, isAdmin, validate(notificationIdParamSchema), validate(notificationSchema), updateNotification);

// Eliminar notificación
router.delete('/:id', authMiddleware, isAdmin, validate(notificationIdParamSchema), deleteNotification);

export default router;