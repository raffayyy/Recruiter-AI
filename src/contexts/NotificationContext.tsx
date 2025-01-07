import React, { createContext, useContext, useEffect } from 'react';
import { useNotifications as useNotificationsHook } from '../hooks/useNotifications';
import { Notification } from '../types/notification';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  error: string | null;
  isConnected: boolean;
  markAsRead: (id: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const {
    notifications,
    unreadCount,
    error,
    isConnected,
    fetchNotifications,
    markAsRead,
  } = useNotificationsHook();

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  return (
    <NotificationContext.Provider 
      value={{ notifications, unreadCount, error, isConnected, markAsRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}