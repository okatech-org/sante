import express from 'express';
import { authenticate } from '../neurons/auth/AuthMiddleware.js';
import notificationNeuron from '../neurons/NotificationNeuron.js';

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    const notifications = await notificationNeuron.getNotifications(req.user.userId, parseInt(limit));

    res.json({
      success: true,
      notifications
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

router.put('/:notificationId/read', authenticate, async (req, res) => {
  try {
    const notification = await notificationNeuron.markAsRead(req.params.notificationId);

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json({
      success: true,
      notification
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

export default router;
