import React, { useState, useEffect } from "react";
import { User, Mic, MicOff } from "lucide-react";

interface VirtualInterviewerProps {
  isAnswering?: boolean;
  question?: string;
  serverQuestion?: string;
  isRecording?: boolean;
  onToggleRecording?: () => void;
  onEndInterview?: () => void;
}

export function VirtualInterviewer({
  isAnswering = false,
  question,
  serverQuestion,
  isRecording,
  onToggleRecording,
  onEndInterview,
}: VirtualInterviewerProps) {
  const [currentQuestion, setCurrentQuestion] = useState<string>("");

  useEffect(() => {
    setCurrentQuestion(question ?? serverQuestion ?? "");
  }, [question, serverQuestion]);

  return (
    <div className="flex h-full flex-col items-center justify-center rounded-lg bg-gray-800 p-8">
      <div className={`mb-8 rounded-full bg-gray-700 p-8 relative ${isAnswering ? "ring-4 ring-red-500 animate-pulse" : ""}`}>
        <User className="h-24 w-24 text-gray-400" />
        
        {/* Recording indicator */}
        {isAnswering && (
          <div className="absolute -bottom-2 -right-2 rounded-full bg-red-500 p-2">
            <Mic className="h-6 w-6 text-white animate-pulse" />
          </div>
        )}
        
        {!isAnswering && (
          <div className="absolute -bottom-2 -right-2 rounded-full bg-gray-600 p-2">
            <MicOff className="h-6 w-6 text-gray-400" />
          </div>
        )}
      </div>

      <div className="max-w-2xl rounded-lg bg-gray-900 p-6">
        <p className="text-center text-xl text-white">
          {currentQuestion
            ? currentQuestion
            : isAnswering
            ? "I'm listening to your response..."
            : "Press and hold the 'Hold to Talk' button to respond"}
        </p>
        
        {isAnswering && (
          <div className="mt-4 flex justify-center">
            <div className="flex items-center gap-2 rounded-full bg-red-700 px-4 py-2 text-white">
              <span className="h-3 w-3 animate-pulse rounded-full bg-red-400"></span>
              <span className="text-sm font-medium">Recording your response</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}