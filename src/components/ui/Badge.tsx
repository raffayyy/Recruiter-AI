import React from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        {
          'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100': variant === 'default',
          'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100': variant === 'success',
          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100': variant === 'warning',
          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100': variant === 'error',
          'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100': variant === 'info',
        },
        className
      )}
      {...props}
    />
  );
}