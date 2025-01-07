import React from 'react';
import { NotificationList } from './NotificationList';
import { NotificationBadge } from './NotificationBadge';
import { useNotifications } from '../../hooks/useNotifications';

export function NotificationPopover() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { notifications, unreadCount, error, markAsRead } = useNotifications();

  return (
    <div className="relative">
      <NotificationBadge
        count={unreadCount}
        onClick={() => setIsOpen(!isOpen)}
      />
      
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 z-40 mt-2 w-80 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
            <div className="p-4 border-b">
              <h3 className="text-lg font-medium">Notifications</h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {error ? (
                <div className="p-4 text-center text-sm text-red-600">
                  {error}
                </div>
              ) : (
                <NotificationList
                  notifications={notifications}
                  onRead={markAsRead}
                />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}