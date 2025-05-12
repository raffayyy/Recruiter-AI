import React, { forwardRef, useEffect, useRef } from 'react';
import { cn } from '../../lib/utils';

interface VideoStreamProps {
  stream?: MediaStream;
  muted?: boolean;
  isLocal?: boolean;
  className?: string;
}

export const VideoStream = forwardRef<HTMLVideoElement, VideoStreamProps>(
  ({ muted, isLocal, className, stream }, ref) => {
    const localRef = useRef<HTMLVideoElement | null>(null);
    
    // Combine the forwarded ref with our local ref
    const videoRef = (node: HTMLVideoElement) => {
      // For the forwarded ref
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
      // For our local ref
      localRef.current = node;
    };
    
    // Set srcObject using useEffect
    useEffect(() => {
      if (localRef.current && stream) {
        localRef.current.srcObject = stream;
      }
      
      return () => {
        if (localRef.current) {
          localRef.current.srcObject = null;
        }
      };
    }, [stream]);
    
    return (
      <video
        ref={videoRef}
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