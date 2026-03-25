import express from 'express';
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

const router = express.Router();

// Obtener todas las notificaciones (admin)
router.get('/', getNotifications);

// Obtener notificaciones no leídas por usuario
router.get('/unread/:userId', getUnreadNotificationsByUser);

// Obtener notificaciones por usuario
router.get('/user/:userId', getNotificationByUser);

// Obtener notificación por ID
router.get('/:id', getNotificationById);

// Crear nueva notificación
router.post('/', createNotification);

// Marcar una notificación como leída
router.patch('/:id/mark-read', markAsRead);

// Marcar todas las notificaciones de un usuario como leídas
router.patch('/user/:userId/mark-all-read', markAllAsReadByUser);

// Actualizar notificación
router.put('/:id', updateNotification);

// Eliminar notificación
router.delete('/:id', deleteNotification);

export default router;