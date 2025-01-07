import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';

interface VideoStreamProps {
  muted?: boolean;
  isLocal?: boolean;
  className?: string;
}

export const VideoStream = forwardRef<HTMLVideoElement, VideoStreamProps>(
  ({ muted, isLocal, className }, ref) => {
    return (
      <video
        ref={ref}
        autoPlay
        playsInline
        muted={muted}
        className={cn(
          'h-full w-full rounded-lg object-cover',
          isLocal && 'mirror',
          className
        )}
      />
    );
  }
);