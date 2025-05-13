import React from 'react';
import { User } from 'lucide-react';
import { cn } from '../../lib/utils';

interface VideoPanelProps {
  stream: MediaStream | null;
  isMuted: boolean;
  isVideoOn: boolean;
  onToggleAudio?: () => void; // Keep as optional for compatibility
  onToggleVideo?: () => void; // Keep as optional for compatibility
}

export function VideoPanel({
  stream,
  isMuted = true, // Always mute by default
  isVideoOn = true, // Always show video by default
}: VideoPanelProps) {
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="relative rounded-lg bg-gradient-to-b from-gray-800 to-gray-900 overflow-hidden aspect-video shadow-md">
      {/* Video Preview */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={true} // Always muted
        className="h-full w-full object-cover"
      />
      
      {/* Fallback when no stream is available */}
      {!stream && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900">
          <div className="rounded-full bg-gray-800 p-4 mb-2">
            <User className="h-10 w-10 text-gray-400" />
          </div>
          <p className="text-gray-400 text-sm">Camera preview</p>
        </div>
      )}
      
      {/* "You" label */}
      <div className="absolute top-2 right-2 rounded-md bg-gray-800/80 px-2 py-1 text-xs text-white">
        You
      </div>
    </div>
  );
}
