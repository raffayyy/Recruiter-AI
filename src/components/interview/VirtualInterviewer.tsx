import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';

const questions = [
  "Tell me about your experience with React.",
  "How do you handle challenging situations in a team?",
  "What interests you about this position?",
  "Describe a difficult project you worked on.",
  "How do you stay updated with new technologies?"
];

interface VirtualInterviewerProps {
  isAnswering: boolean;
}

export function VirtualInterviewer({ isAnswering }: VirtualInterviewerProps) {
  const [currentQuestion, setCurrentQuestion] = useState<string>("");

  useEffect(() => {
    if (isAnswering) {
      const nextQuestion = questions[Math.floor(Math.random() * questions.length)];
      setCurrentQuestion(nextQuestion);
    }
  }, [isAnswering]);

  return (
    <div className="flex h-full flex-col items-center justify-center rounded-lg bg-gray-800 p-8">
      <div className="mb-8 rounded-full bg-gray-700 p-8">
        <User className="h-24 w-24 text-gray-400" />
      </div>
      
      <div className="max-w-2xl rounded-lg bg-gray-900 p-6">
        <p className="text-center text-xl text-white">
          {isAnswering ? currentQuestion : "Unmute your microphone to start answering"}
        </p>
      </div>
    </div>
  );
}