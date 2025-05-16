import React, { useRef, useEffect } from 'react';
import { User, AlertCircle, Camera, Users, RotateCcw, Smartphone } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useFaceDetection, FaceViolation } from '../../hooks/useFaceDetection';
import { ProctoringViolationType } from '../../lib/faceDetectionService';

interface VideoPanelProps {
  stream: MediaStream | null;
  isMuted: boolean;
  isVideoOn: boolean;
  onToggleAudio?: () => void;
  onToggleVideo?: () => void;
  onViolation?: (violation: FaceViolation) => void;
}

export function VideoPanel({
  stream,
  isMuted = true, 
  isVideoOn = true,
  onViolation,
}: VideoPanelProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Use our face detection hook
  const { detectionResult, violations } = useFaceDetection(videoRef, {
    enabled: !!stream && isVideoOn,
    onViolation,
    violationDisplayDuration: 3000, // Display for 3 seconds after resolving
  });

  // Connect the video stream to the video element
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  // Draw indicators for face detection status
  useEffect(() => {
    if (!canvasRef.current || !detectionResult || !videoRef.current) return;
    
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Determine status color
    let statusColor = '#22c55e'; // Green for good
    
    if (detectionResult.noFaceDetected) {
      statusColor = '#ef4444'; // Red for no face
    } else if (detectionResult.multipleFacesDetected) {
      statusColor = '#ef4444'; // Red for multiple faces
    } else if (
      detectionResult.headPose.lookingLeft || 
      detectionResult.headPose.lookingRight || 
      detectionResult.headPose.lookingUp || 
      detectionResult.headPose.lookingDown
    ) {
      statusColor = '#eab308'; // Yellow for looking away
    }
    
    // Draw status indicator
    ctx.beginPath();
    ctx.arc(30, 30, 10, 0, 2 * Math.PI);
    ctx.fillStyle = statusColor;
    ctx.fill();
    
  }, [detectionResult]);
  
  // Get all violations to display
  const displayViolations = violations
    .sort((a, b) => b.timestamp - a.timestamp)
    .filter((v, index, self) => 
      self.findIndex(v2 => v2.type === v.type) === index
    );

  // Has any violations to display
  const hasViolations = displayViolations.length > 0;
  
  // Function to get the appropriate icon for each violation type
  const getViolationIcon = (type: ProctoringViolationType) => {
    switch (type) {
      case ProctoringViolationType.NO_FACE:
        return <Camera className="h-4 w-4 mr-1 text-red-300" />;
      case ProctoringViolationType.MULTIPLE_FACES:
        return <Users className="h-4 w-4 mr-1 text-red-300" />;
      case ProctoringViolationType.LOOKING_AWAY:
        return <RotateCcw className="h-4 w-4 mr-1 text-red-300" />;
      case ProctoringViolationType.MOBILE_DEVICE:
        return <Smartphone className="h-4 w-4 mr-1 text-red-300" />;
      default:
        return <AlertCircle className="h-4 w-4 mr-1 text-red-300" />;
    }
  };

  return (
    <div className="relative rounded-lg bg-gradient-to-b from-gray-800 to-gray-900 overflow-hidden aspect-video shadow-md">
      {/* Video Preview */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={true}
        className="h-full w-full object-cover"
      />
      
      {/* Canvas overlay for face detection visualization */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
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
      
      {/* Proctoring violation indicators - more prominent and specific */}
      {hasViolations && (
        <div className="absolute top-10 right-2 flex flex-col gap-1">
          {displayViolations.map((violation, idx) => (
            <div 
              key={`${violation.type}-${idx}`} 
              className={`rounded-md px-3 py-2 text-xs text-white flex items-center transition-opacity duration-300
                ${violation.active 
                  ? 'bg-red-900/90 animate-pulse' 
                  : 'bg-orange-700/80'}
              `}
            >
              {getViolationIcon(violation.type)}
              <span>
                {getViolationMessage(violation.type)}
                {!violation.active && ' (resolved)'}
              </span>
            </div>
          ))}
        </div>
      )}
      
      {/* "You" label */}
      <div className="absolute top-2 right-2 rounded-md bg-gray-800/80 px-2 py-1 text-xs text-white">
        You
      </div>
    </div>
  );
}

// Helper function to get user-friendly violation messages
function getViolationMessage(type: ProctoringViolationType): string {
  switch (type) {
    case ProctoringViolationType.NO_FACE:
      return "Face not visible";
    case ProctoringViolationType.MULTIPLE_FACES:
      return "Multiple faces detected";
    case ProctoringViolationType.LOOKING_AWAY:
      return "Looking away from camera";
    case ProctoringViolationType.MOBILE_DEVICE:
      return "Mobile device detected";
    default:
      return "Proctoring violation";
  }
}
