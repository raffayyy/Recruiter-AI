import React, { useState, useEffect } from "react";
import { Mic, MicOff } from "lucide-react";
import { AvatarCanvas } from "./AvatarCanvas";

interface VirtualInterviewerProps {
  isAnswering?: boolean;
  question?: string;
  serverQuestion?: string;
  isRecording?: boolean;
  isPlaying?: boolean;
  speaking: boolean;
  onToggleRecording?: () => void;
  onEndInterview?: () => void;
  modelPath?: string;
}

export function VirtualInterviewer({
  isAnswering = false,
  question,
  serverQuestion,
  isPlaying = false,
  speaking = false,
  modelPath = "/models/interviewer.glb",
}: VirtualInterviewerProps) {
  const [currentQuestion, setCurrentQuestion] = useState<string>("");

  // Debug speaking state
  useEffect(() => {
    console.log("speaking state in VirtualInterviewer:", speaking);
  }, [speaking]);

  useEffect(() => {
    setCurrentQuestion(question ?? serverQuestion ?? "");
  }, [question, serverQuestion]);

  return (
    <div className="flex h-full flex-col items-center justify-center rounded-lg bg-gradient-to-b from-gray-800 to-gray-900 p-6">
      {/* Question display */}
      <div className="w-full max-w-3xl mb-10 rounded-lg bg-gray-900/80 p-6 shadow-lg border border-gray-700">
        <h2 className="text-lg font-medium text-gray-400 mb-3">
          Interview Question:
        </h2>
        <p className="text-xl text-white leading-relaxed">
          {currentQuestion || "Waiting for the next question..."}
        </p>
      </div>

      {/* 3D virtual interviewer avatar */}
      <div className="flex flex-col items-center w-full max-w-md">
        <div
          className={`relative w-full transition-all duration-300 ease-in-out
          ${
            isAnswering
              ? "ring-4 ring-red-500 ring-opacity-70 shadow-lg shadow-red-500/20"
              : ""
          }`}
        >
          <AvatarCanvas isPlaying={isPlaying} modelPath={modelPath} speaking={speaking} />

          {/* Recording status indicator */}
          <div
            className={`absolute bottom-4 right-4 rounded-full p-2 transition-colors
            ${isAnswering ? "bg-red-500" : "bg-gray-600"}`}
          >
            {isAnswering ? (
              <Mic className="h-5 w-5 text-white animate-pulse" />
            ) : (
              <MicOff className="h-5 w-5 text-gray-400" />
            )}
          </div>
        </div>
      </div>

      {/* Instructions or recording status */}
      <div className="text-center max-w-md">
        {isAnswering ? (
          <div className="flex items-center justify-center gap-2 rounded-full bg-red-700/70 px-6 py-3 text-white animate-pulse">
            <span className="h-2 w-2 animate-pulse rounded-full bg-red-400"></span>
            <span className="font-medium">Recording your answer...</span>
          </div>
        ) : (
          <div className="text-center space-y-3">
            <p className="text-gray-300">
              {currentQuestion
                ? "Click the blue button to record your answer"
                : "Waiting for the interviewer's question..."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
