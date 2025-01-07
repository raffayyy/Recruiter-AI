import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: LucideIcon;
}

export const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, icon: Icon, className, ...props }, ref) => {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
        <div className="relative">
          {Icon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Icon className="h-5 w-5 text-gray-400" />
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full rounded-lg border px-3 py-2 shadow-sm transition-colors',
              'border-gray-300 bg-white text-gray-900 placeholder-gray-500',
              'dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400',
              'focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500',
              'dark:focus:border-blue-400 dark:focus:ring-blue-400',
              Icon && 'pl-10',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
    );
  }
);