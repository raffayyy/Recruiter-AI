import { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Notification } from '../types/notification';

export function useNotifications() {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const fetchNotifications = useCallback(async () => {
    // Mock data for development
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'info',
        title: 'New Application',
        message: 'You have a new application for Senior Software Engineer position',
        createdAt: new Date().toISOString(),
        read: false,
      },
      {
        id: '2',
        type: 'success',
        title: 'Interview Scheduled',
        message: 'Interview scheduled for tomorrow at 2 PM',
        createdAt: new Date().toISOString(),
        read: true,
      },
    ];

    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);
    setError(null);
  }, [token]);

  const markAsRead = useCallback(async (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  return {
    notifications,
    unreadCount,
    error,
    isConnected,
    fetchNotifications,
    markAsRead,
  };
}