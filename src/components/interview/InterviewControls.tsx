import React from 'react';
import { Button } from '../ui/Button';
import { Mic, MicOff, MessageSquare, ThumbsUp, XCircle } from 'lucide-react';

interface InterviewControlsProps {
  isMuted: boolean;
  onToggleAudio: () => void;
  onEndInterview: () => void;
}

export function InterviewControls({
  isMuted,
  onToggleAudio,
  onEndInterview,
}: InterviewControlsProps) {
  return (
    <div className="flex items-center justify-between bg-gray-900 p-4 border-t border-gray-800">
      <div className="flex gap-4">
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
        
        <Button variant="outline" size="sm">
          <MessageSquare className="mr-2 h-4 w-4" />
          Chat
        </Button>
        <Button variant="outline" size="sm">
          <ThumbsUp className="mr-2 h-4 w-4" />
          React
        </Button>
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