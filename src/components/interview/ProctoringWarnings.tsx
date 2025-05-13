import React from 'react';
import { AlertTriangle, CheckCircle2, Info } from 'lucide-react';

export function ProctoringWarnings() {
  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h3 className="text-lg font-medium text-white flex items-center gap-2 mb-3">
        <Info className="h-5 w-5 text-blue-400" />
        Interview Tips
      </h3>
      
      <div className="space-y-3">
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
