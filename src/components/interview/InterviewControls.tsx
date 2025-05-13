import React from 'react';
import { Button } from '../ui/Button';
import { Mic, XCircle } from 'lucide-react';

interface InterviewControlsProps {
  isMuted?: boolean;
  onToggleAudio?: () => void;
  onEndInterview: () => void;
  isRecording?: boolean; 
  onToggleRecording?: () => void;
  isVideoOn?: boolean;
  onToggleVideo?: () => void;
  onHoldToRecord?: (isHolding: boolean) => void;
  isAudioPlaying?: boolean;
}

export function InterviewControls({
  isRecording = false,
  onEndInterview,
  onHoldToRecord,
  isAudioPlaying = false,
}: InterviewControlsProps) {
  return (
    <div className="flex items-center justify-between bg-gray-900 p-4 border-t border-gray-800">
      {/* Main hold-to-talk button - centered and prominent */}
      <div className="flex-1 flex justify-center">
        {onHoldToRecord && (
          <Button
            variant="outline"
            size="lg"
            className={`py-6 px-8 text-lg font-medium rounded-xl bg-blue-600 hover:bg-blue-700 text-white 
              transition-all duration-150 focus:ring-4 focus:ring-blue-500/50 focus:outline-none
              ${isRecording ? 'bg-red-600 hover:bg-red-700 shadow-lg shadow-red-500/30 scale-105' : ''}
              ${isAudioPlaying ? 'opacity-50 cursor-not-allowed' : ''}`}
            onMouseDown={() => !isAudioPlaying && onHoldToRecord(true)}
            onMouseUp={() => !isAudioPlaying && onHoldToRecord(false)}
            onMouseLeave={() => !isAudioPlaying && onHoldToRecord(false)}
            onTouchStart={() => !isAudioPlaying && onHoldToRecord(true)}
            onTouchEnd={() => !isAudioPlaying && onHoldToRecord(false)}
            // Make it accessible via keyboard
            onKeyDown={(e) => {
              if (!isAudioPlaying && (e.key === 'Enter' || e.key === ' ')) {
                onHoldToRecord(true);
              }
            }}
            onKeyUp={(e) => {
              if (!isAudioPlaying && (e.key === 'Enter' || e.key === ' ')) {
                onHoldToRecord(false);
              }
            }}
            disabled={isAudioPlaying}
          >
            <Mic className={`mr-3 h-5 w-5 ${isRecording ? 'animate-pulse' : ''}`} />
            {isRecording ? 'Recording...' : isAudioPlaying ? 'Please Wait...' : 'Hold to Speak'}
          </Button>
        )}
      </div>

      {/* End Interview Button - positioned on the right */}
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onEndInterview}
        className="bg-red-600 text-white hover:bg-red-700 transition-colors duration-150"
      >
        <XCircle className="mr-2 h-4 w-4" />
        End Interview
      </Button>
    </div>
  );
}