import React from 'react';
import { Mic, MicOff, Video, VideoOff } from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';

interface VideoPanelProps {
  stream: MediaStream | null;
  isMuted: boolean;
  isVideoOn: boolean;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
}

export function VideoPanel({
  stream,
  isMuted,
  isVideoOn,
  onToggleAudio,
  onToggleVideo,
}: VideoPanelProps) {
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="relative rounded-lg bg-gray-900 overflow-hidden aspect-video">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isMuted}
        className={cn(
          "h-full w-full object-cover",
          !isVideoOn && "hidden"
        )}
      />
      
      {!isVideoOn && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-full bg-gray-800 p-4">
            <Video className="h-6 w-6 text-gray-400" />
          </div>
        </div>
      )}

      <div className="absolute bottom-2 right-2 flex gap-1">
        <Button
          variant="secondary"
          size="sm"
          onClick={onToggleAudio}
          className="bg-gray-900/75 hover:bg-gray-900 p-1.5"
        >
          {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={onToggleVideo}
          className="bg-gray-900/75 hover:bg-gray-900 p-1.5"
        >
          {isVideoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}