import React, { useState } from 'react';
import { VideoPanel } from './VideoPanel';
import { InterviewControls } from './InterviewControls';
import { VirtualInterviewer } from './VirtualInterviewer';
import { ProctoringWarnings } from './ProctoringWarnings';
import { useVideoStream } from '../../hooks/useVideoStream';
import { useNavigate } from 'react-router-dom';




export function InterviewRoom() {
  const navigate = useNavigate();
  const [isMuted, setIsMuted] = useState(true); // Start muted by default
  const [isVideoOn, setIsVideoOn] = useState(true);
  const { stream, error } = useVideoStream();

  const handleEndInterview = () => {
    if (confirm('Are you sure you want to end the interview?')) {
      navigate('/dashboard');
    }
  };

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900 p-4 text-white">
        <div className="rounded-lg bg-red-900/50 p-6 text-center">
          <p className="text-lg">Failed to access camera and microphone</p>
          <p className="mt-2 text-sm text-red-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-gray-900">
      <div className="flex flex-1 p-6">
        {/* Main Content */}
        <div className="relative flex-1">
          {/* Virtual Interviewer (Main Focus) */}
          <VirtualInterviewer isAnswering={!isMuted} />
          
          {/* Self View (Small Overlay) */}
          <div className="absolute bottom-4 right-4 w-72">
            <VideoPanel
              stream={stream}
              isMuted={isMuted}
              isVideoOn={isVideoOn}
              onToggleAudio={() => setIsMuted(!isMuted)}
              onToggleVideo={() => setIsVideoOn(!isVideoOn)}
            />
          </div>

          {/* Proctoring Warnings */}
          <div className="absolute bottom-4 left-4 right-80">
            <ProctoringWarnings />
          </div>
        </div>
      </div>

      <InterviewControls
        isMuted={isMuted}
        onToggleAudio={() => setIsMuted(!isMuted)}
        onEndInterview={handleEndInterview}
      />
    </div>
  );
}