import React from 'react';
import { NotificationItem } from './NotificationItem';
import { Notification } from '../../types/notification';

interface NotificationListProps {
  notifications: Notification[];
  onRead: (id: string) => void;
}

export function NotificationList({ notifications, onRead }: NotificationListProps) {
  if (notifications.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No notifications
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onRead={onRead}
        />
      ))}
    </div>
  );
}