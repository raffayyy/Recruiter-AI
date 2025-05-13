import React, { useState, useEffect } from 'react';
import { AlertTriangle, MicOff } from 'lucide-react';

interface Warning {
  id: string;
  message: string;
  type: 'movement' | 'face' | 'audio' | 'objects';
}

interface ProctoringWarningsProps {
  showMicrophoneWarning?: boolean;
}

export function ProctoringWarnings({ showMicrophoneWarning = false }: ProctoringWarningsProps) {
  const [warnings, setWarnings] = useState<Warning[]>([]);

  // Simulate proctoring warnings
  useEffect(() => {
    // Disable random warnings for now (can be enabled later)
    return;
    
    const warningTypes: Array<Omit<Warning, 'id'>> = [
      {
        type: 'movement',
        message: 'Please remain centered in the camera view',
      },
      {
        type: 'face',
        message: 'Multiple faces detected in frame',
      },
      {
        type: 'audio',
        message: 'Background noise detected',
      },
      {
        type: 'objects',
        message: 'Unauthorized objects detected',
      },
    ];

    const interval = setInterval(() => {
      const randomWarning = warningTypes[Math.floor(Math.random() * warningTypes.length)];
      if (Math.random() > 0.7) {
        setWarnings(prev => [
          ...prev,
          {
            id: Date.now().toString(),
            ...randomWarning,
          },
        ]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Remove warnings after 5 seconds
  useEffect(() => {
    const timeout = setTimeout(() => {
      setWarnings(prev => prev.slice(1));
    }, 5000);

    return () => clearTimeout(timeout);
  }, [warnings]);

  if (warnings.length === 0 && !showMicrophoneWarning) return null;

  return (
    <div className="absolute bottom-4 left-4 right-4 space-y-2">
      {showMicrophoneWarning && (
        <div className="flex items-center gap-2 rounded-lg bg-red-500 bg-opacity-90 px-4 py-2 text-white">
          <MicOff className="h-5 w-5" />
          <span>Microphone issue detected. Please check your microphone settings.</span>
        </div>
      )}
      
      {warnings.map(warning => (
        <div
          key={warning.id}
          className="flex items-center gap-2 rounded-lg bg-red-500 bg-opacity-90 px-4 py-2 text-white"
        >
          <AlertTriangle className="h-5 w-5" />
          <span>{warning.message}</span>
        </div>
      ))}
    </div>
  );
}
