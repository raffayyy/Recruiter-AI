import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { Notification, NotificationType } from '../../types/notification';
import { formatDate } from '../../lib/date';

interface NotificationItemProps {
  notification: Notification;
  onRead: (id: string) => void;
}

export function NotificationItem({ notification, onRead }: NotificationItemProps) {
  const navigate = useNavigate();
  
  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'info': return <Info className="h-5 w-5 text-blue-500" />;
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error': return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const handleClick = () => {
    if (!notification.read) {
      onRead(notification.id);
    }
    if (notification.link) {
      navigate(notification.link);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`flex cursor-pointer gap-3 p-4 transition-colors hover:bg-gray-50 ${
        !notification.read ? 'bg-blue-50' : ''
      }`}
    >
      {getIcon(notification.type)}
      <div className="flex-1">
        <h4 className="font-medium text-gray-900">{notification.title}</h4>
        <p className="text-sm text-gray-600">{notification.message}</p>
        <p className="mt-1 text-xs text-gray-500">
          {formatDate(notification.createdAt)}
        </p>
      </div>
    </div>
  );
}