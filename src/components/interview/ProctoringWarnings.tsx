import React from 'react';
import { AlertTriangle, CheckCircle2, Info, AlertCircle, Camera, Users, RotateCcw, Smartphone } from 'lucide-react';
import { FaceViolation } from '../../hooks/useFaceDetection';
import { ProctoringViolationType } from '../../lib/faceDetectionService';

interface ProctoringWarningsProps {
  violations?: FaceViolation[];
}

export function ProctoringWarnings({ violations = [] }: ProctoringWarningsProps) {
  // Get unique violations by type (only show the most recent of each type)
  const uniqueViolations = violations
    .sort((a, b) => b.timestamp - a.timestamp) // Sort by timestamp descending
    .filter((v, index, self) => 
      self.findIndex(v2 => v2.type === v.type) === index
    );

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h3 className="text-lg font-medium text-white flex items-center gap-2 mb-3">
        <Info className="h-5 w-5 text-blue-400" />
        Interview Tips
      </h3>
      
      <div className="space-y-3">
        {/* Show active proctoring violations first if there are any */}
        {uniqueViolations.length > 0 && (
          <div className="mb-3 space-y-2">
            {uniqueViolations.map((violation, idx) => (
              <div key={`${violation.type}-${idx}`} className="flex items-start gap-2 p-2 bg-red-900/40 rounded-md">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white text-sm font-medium">{violation.message}</p>
                  <p className="text-white/70 text-xs">
                    {getViolationInstructions(violation.type)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-start gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-white text-sm">Speak clearly and at a steady pace when answering questions.</p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-white text-sm">Keep your face well-lit and centered in the camera frame.</p>
          </div>
        </div>
        
        <div className="flex items-start gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-white text-sm">Avoid leaving the camera frame during the interview.</p>
          </div>
        </div>
        
        <div className="flex items-start gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-white text-sm">Ensure your environment is quiet and free from distractions.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to get instructions for each violation type
function getViolationInstructions(type: ProctoringViolationType): string {
  switch (type) {
    case ProctoringViolationType.NO_FACE:
      return "Please position yourself in front of the camera.";
    case ProctoringViolationType.MULTIPLE_FACES:
      return "Please ensure you are the only person visible in the camera.";
    case ProctoringViolationType.LOOKING_AWAY:
      return "Please face the camera directly during the interview.";
    case ProctoringViolationType.MOBILE_DEVICE:
      return "Using mobile devices during the interview is not allowed.";
    default:
      return "Please follow interview guidelines.";
  }
}
