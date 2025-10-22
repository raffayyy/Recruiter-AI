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
}: VirtualInterviewerProps) {
  const [currentQuestion, setCurrentQuestion] = useState<string>("");

  useEffect(() => {
    setCurrentQuestion(question ?? serverQuestion ?? "");
  }, [question, serverQuestion]);

  return (
    <div className="flex h-full flex-col items-center justify-center rounded-lg bg-gradient-to-b from-gray-800 to-gray-900 p-4">
      {/* Question display - removed scrolling */}
      <div className="w-full max-w-3xl mb-3 rounded-lg bg-gray-900/80 p-4 shadow-lg border border-gray-700">
        <h2 className="text-sm font-medium text-gray-400 mb-1">Interview Question:</h2>
        <p className="text-lg text-white leading-relaxed">
          {currentQuestion || "Waiting for the next question..."}
        </p>
      </div>
      
      {/* Virtual interviewer avatar with recording status - made smaller */}
      <div className="flex flex-col items-center mb-3">
        <div className={`rounded-full bg-gray-700 p-3 mb-2 relative transition-all duration-300 ease-in-out
          ${isAnswering ? "ring-4 ring-red-500 ring-opacity-70 shadow-lg shadow-red-500/20" : ""}`}>
          <User className="h-10 w-10 text-blue-300" />
          
          {/* Recording status indicator */}
          <div className={`absolute -bottom-2 -right-2 rounded-full p-1 transition-colors
            ${isAnswering ? "bg-red-500" : "bg-gray-600"}`}>
            {isAnswering ? (
              <Mic className="h-3 w-3 text-white animate-pulse" />
            ) : (
              <MicOff className="h-3 w-3 text-gray-400" />
            )}
          </div>
        </div>
      </div>
      
      {/* Instructions or recording status - condensed */}
      <div className="text-center max-w-md">
        {isAnswering ? (
          <div className="flex items-center justify-center gap-2 rounded-full bg-red-700/70 px-4 py-2 text-white animate-pulse">
            <span className="h-2 w-2 animate-pulse rounded-full bg-red-400"></span>
            <span className="font-medium">Recording your answer...</span>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-gray-300 text-sm">
              {currentQuestion 
                ? "Press and hold the button below to record your answer" 
                : "Waiting for the interviewer's question..."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}