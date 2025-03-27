import React, { useState, useEffect } from "react";
import { User } from "lucide-react";

interface VirtualInterviewerProps {
  isAnswering: boolean;
  question?: string;
}

export function VirtualInterviewer({
  isAnswering,
  question,
}: VirtualInterviewerProps) {
  const [currentQuestion, setCurrentQuestion] = useState<string>("");

  useEffect(() => {
    setCurrentQuestion(question ?? "");
  }, [question]);

  return (
    <div className="flex h-full flex-col items-center justify-center rounded-lg bg-gray-800 p-8">
      <div className="mb-8 rounded-full bg-gray-700 p-8">
        <User className="h-24 w-24 text-gray-400" />
      </div>

      <div className="max-w-2xl rounded-lg bg-gray-900 p-6">
        <p className="text-center text-xl text-white">
          {question
            ? question
            : isAnswering
            ? currentQuestion
            : "Unmute your microphone to start answering"}
        </p>
      </div>
    </div>
  );
}