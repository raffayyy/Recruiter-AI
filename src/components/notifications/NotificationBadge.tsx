import React from 'react';
import { Bell } from 'lucide-react';

interface NotificationBadgeProps {
  count: number;
  onClick: () => void;
}

export function NotificationBadge({ count, onClick }: NotificationBadgeProps) {
  return (
    <button
      onClick={onClick}
      className="relative rounded-full p-1 hover:bg-gray-100"
    >
      <Bell className="h-6 w-6 text-gray-600" />
      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </button>
  );
}