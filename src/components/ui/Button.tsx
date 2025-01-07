import React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium transition-all',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          {
            'bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 dark:from-blue-500 dark:to-blue-400': 
              variant === 'primary',
            'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700': 
              variant === 'secondary',
            'border-2 border-gray-200 bg-transparent hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800': 
              variant === 'outline',
            'hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800': 
              variant === 'ghost',
            'bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600':
              variant === 'danger',
            'h-8 px-3 text-sm': size === 'sm',
            'h-10 px-4 text-base': size === 'md',
            'h-12 px-6 text-lg': size === 'lg',
          },
          isLoading && 'relative text-transparent hover:text-transparent',
          className
        )}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {children}
        {isLoading && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-white" />
          </div>
        )}
      </button>
    );
  }
);