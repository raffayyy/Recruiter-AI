import React from 'react';
import { Button } from '../ui/Button';
import { Mic, MicOff, MessageSquare, ThumbsUp, XCircle, Radio } from 'lucide-react';

interface InterviewControlsProps {
  isMuted?: boolean;
  onToggleAudio?: () => void;
  onEndInterview: () => void;
  isRecording?: boolean; 
  onToggleRecording?: () => void;
  isVideoOn?: boolean;
  onToggleVideo?: () => void;
  onHoldToRecord?: (isHolding: boolean) => void;
}

export function InterviewControls({
  isMuted = true,
  onToggleAudio,
  onEndInterview,
  isRecording,
  onToggleRecording,
  onHoldToRecord,
}: InterviewControlsProps) {
  return (
    <div className="flex items-center justify-between bg-gray-900 p-4 border-t border-gray-800">
      <div className="flex gap-4">
        {onToggleAudio && (
          <Button 
            variant={isMuted ? "outline" : "primary"}
            onClick={onToggleAudio}
            className={isMuted ? "" : "bg-green-600 hover:bg-green-700"}
          >
            {isMuted ? (
              <>
                <MicOff className="mr-2 h-4 w-4" />
                Unmute
              </>
            ) : (
              <>
                <Mic className="mr-2 h-4 w-4" />
                Mute
              </>
            )}
          </Button>
        )}
        
        <Button variant="outline" size="sm">
          <MessageSquare className="mr-2 h-4 w-4" />
          Chat
        </Button>
        <Button variant="outline" size="sm">
          <ThumbsUp className="mr-2 h-4 w-4" />
          React
        </Button>
        
        {onHoldToRecord && (
          <Button
            variant="outline"
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            onMouseDown={() => onHoldToRecord(true)}
            onMouseUp={() => onHoldToRecord(false)}
            onMouseLeave={() => onHoldToRecord(false)}
            onTouchStart={() => onHoldToRecord(true)}
            onTouchEnd={() => onHoldToRecord(false)}
          >
            <Mic className="mr-2 h-4 w-4" />
            Hold to Talk
          </Button>
        )}
        
        {onToggleRecording && !onHoldToRecord && (
          <Button
            variant={isRecording ? "primary" : "outline"}
            size="sm"
            onClick={onToggleRecording}
            className={isRecording ? "bg-red-600 hover:bg-red-700 animate-pulse" : ""}
          >
            <Radio className={`mr-2 h-4 w-4 ${isRecording ? 'animate-ping' : ''}`} />
            {isRecording ? "Recording..." : "Record"}
          </Button>
        )}
      </div>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onEndInterview}
        className="bg-red-600 text-white hover:bg-red-700"
      >
        <XCircle className="mr-2 h-4 w-4" />
        End Interview
      </Button>
    </div>
  );
}