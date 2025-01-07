import React from 'react';
import { cn } from '../../lib/utils';
import { User } from 'lucide-react';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Avatar({ className, src, alt, size = 'md', ...props }: AvatarProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  return (
    <div
      className={cn(
        'relative shrink-0 overflow-hidden rounded-full',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gray-100 dark:bg-gray-800">
          <User className="h-1/2 w-1/2 text-gray-500 dark:text-gray-400" />
        </div>
      )}
    </div>
  );
}