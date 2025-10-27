import { useState, useCallback, useEffect } from 'react';
import neuralApi from '../lib/neuralApi';

export function useNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async (limit: number = 20) => {
    try {
      setLoading(true);
      const data = await neuralApi.getNotifications(limit);
      setNotifications(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(() => fetchNotifications(), 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      setLoading(true);
      await neuralApi.markNotificationAsRead(notificationId);
      setNotifications(notifications.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      ));
      setError(null);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [notifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    loading,
    error,
    unreadCount,
    fetchNotifications,
    markAsRead
  };
}

export default useNotifications;
