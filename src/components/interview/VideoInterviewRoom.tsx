import React, { useEffect, useState, useCallback } from 'react';
import { useWebRTC } from '../../lib/webrtc';
import { VideoStream } from './VideoStream';
import { InterviewControls } from './InterviewControls';
import { VirtualInterviewer } from './VirtualInterviewer';
import { ProctoringWarnings } from './ProctoringWarnings';
import { Loader2, AlertCircle } from 'lucide-react';

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

export function VideoInterviewRoom() {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isConnecting, setIsConnecting] = useState(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const webrtc = useWebRTC(ICE_SERVERS);
  
  // Set up media streams and WebRTC connection
  useEffect(() => {
    async function setupMedia() {
      try {
        setIsConnecting(true);
        
        // Request camera and microphone access
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        
        setLocalStream(stream);
        
        // Add tracks to RTCPeerConnection only after stream is obtained
        if (webrtc) {
          stream.getTracks().forEach(track => {
            webrtc.addTrack(track, stream);
          });
        }
        
        setIsConnecting(false);
      } catch (err) {
        console.error('Error accessing media devices:', err);
        setMediaError(err.message || 'Failed to access camera or microphone');
        setIsConnecting(false);
      }
    }

    setupMedia();

    // Set up listeners for remote streams
    if (webrtc) {
      webrtc.addEventListener('track', (event: RTCTrackEvent) => {
        console.log('Remote track received:', event);
        setRemoteStream(event.streams[0]);
      });
      
      webrtc.addEventListener('iceconnectionstatechange', () => {
        console.log('ICE connection state:', webrtc.iceConnectionState);
        if (webrtc.iceConnectionState === 'failed' || 
            webrtc.iceConnectionState === 'disconnected') {
          setConnectionError('Connection to the interviewer was lost. Please try refreshing the page.');
        }
      });
      
      webrtc.addEventListener('icecandidateerror', (event) => {
        console.error('ICE candidate error:', event);
      });
    }

    // Clean up resources when component unmounts
    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      
      if (webrtc) {
        webrtc.close();
      }
    };
  }, [webrtc]); // Only depend on webrtc, not localStream

  // Toggle audio on/off
  const toggleAudio = useCallback(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  }, [localStream]);

  // Toggle video on/off
  const toggleVideo = useCallback(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOn(videoTrack.enabled); // Fix: Use the actual track state
      }
    }
  }, [localStream]);

  // Handle ending the interview
  const handleEndInterview = useCallback(() => {
    if (confirm('Are you sure you want to end the interview?')) {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      
      if (webrtc) {
        webrtc.close();
      }
      
      // Navigate to dashboard or completion page
      window.location.href = '/dashboard';
    }
  }, [localStream, webrtc]);

  // Show loading state
  if (isConnecting) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-500" />
          <h3 className="mt-4 text-xl font-medium">Connecting to interview...</h3>
          <p className="mt-2 text-gray-400">Please wait while we set up your video feed</p>
        </div>
      </div>
    );
  }

  // Show media access error
  if (mediaError) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900 p-6 text-white">
        <div className="max-w-md rounded-lg bg-red-900/30 p-6 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
          <h3 className="mt-4 text-xl font-medium">Camera/Microphone Error</h3>
          <p className="mt-2 text-gray-300">{mediaError}</p>
          <p className="mt-4 text-sm text-gray-400">
            Please ensure you've granted permission to use your camera and microphone, 
            and that no other application is currently using them.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-6 rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show connection error
  if (connectionError) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900 p-6 text-white">
        <div className="max-w-md rounded-lg bg-red-900/30 p-6 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
          <h3 className="mt-4 text-xl font-medium">Connection Error</h3>
          <p className="mt-2 text-gray-300">{connectionError}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-6 rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
          >
            Reconnect
          </button>
        </div>
      </div>
    );
  }

  // Main interview UI
  return (
    <div className="flex h-screen flex-col bg-gray-900">
      <div className="flex flex-1 gap-4 p-4">
        {/* Local video stream */}
        <div className="relative flex-1">
          {localStream ? (
            <VideoStream
              stream={localStream}
              muted
              isLocal
              className="h-full w-full rounded-lg object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center rounded-lg bg-gray-800">
              <p className="text-gray-400">Camera not available</p>
            </div>
          )}
          <div className="absolute bottom-4 left-0 right-0 px-4">
            <ProctoringWarnings />
          </div>
        </div>
        
        {/* Remote video stream / Virtual interviewer */}
        <div className="relative flex-1">
          {remoteStream ? (
            <VideoStream
              stream={remoteStream}
              className="h-full w-full rounded-lg object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center rounded-lg bg-gray-800">
              <VirtualInterviewer isAnswering={false} />
            </div>
          )}
        </div>
      </div>
      
      {/* Interview controls */}
      <InterviewControls
        isMuted={isMuted}
        isVideoOn={isVideoOn}
        onToggleAudio={toggleAudio}
        onToggleVideo={toggleVideo}
        onEndInterview={handleEndInterview}
      />
    </div>
  );
}