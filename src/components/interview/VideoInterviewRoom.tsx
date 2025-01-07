import React, { useEffect, useRef, useState } from 'react';
import { useWebRTC } from '../../lib/webrtc';
import { VideoStream } from './VideoStream';
import { InterviewControls } from './InterviewControls';
import { VirtualInterviewer } from './VirtualInterviewer';
import { ProctoringWarnings } from './ProctoringWarnings';

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
  const webrtc = useWebRTC(ICE_SERVERS);
  
  useEffect(() => {
    async function setupMedia() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        
        setLocalStream(stream);
        
        if (webrtc) {
          stream.getTracks().forEach(track => {
            if (localStream) {
              webrtc.addTrack(track, localStream);
            }
          });
        }
      } catch (err) {
        console.error('Error accessing media devices:', err);
      }
    }

    setupMedia();

    return () => {
      localStream?.getTracks().forEach(track => track.stop());
    };
  }, [webrtc]);

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsMuted(!audioTrack.enabled);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setIsVideoOn(!videoTrack.enabled);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-gray-900">
      <div className="flex flex-1 gap-4 p-4">
        <div className="relative flex-1">
          <VideoStream
            stream={localStream}
            muted
            isLocal
            className="h-full w-full rounded-lg object-cover"
          />
          <ProctoringWarnings />
        </div>
        <div className="relative flex-1">
          <VirtualInterviewer />
          {remoteStream && (
            <VideoStream
              stream={remoteStream}
              className="h-full w-full rounded-lg object-cover"
            />
          )}
        </div>
      </div>
      <InterviewControls
        isMuted={isMuted}
        isVideoOn={isVideoOn}
        onToggleAudio={toggleAudio}
        onToggleVideo={toggleVideo}
      />
    </div>
  );
}