// src/hooks/useTimer.ts
import { useState, useEffect, useCallback } from "react";

interface UseTimerProps {
  initialTime: number; // in seconds
  onTimeEnd: () => void;
}

export function useTimer({ initialTime, onTimeEnd }: UseTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(true);

  const formatTime = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  }, []);

  const pauseTimer = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resumeTimer = useCallback(() => {
    setIsRunning(true);
  }, []);

  const resetTimer = useCallback(() => {
    setTimeRemaining(initialTime);
    setIsRunning(true);
  }, [initialTime]);

  useEffect(() => {
    if (!isRunning) return;

    const timerId = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerId);
          onTimeEnd();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [isRunning, onTimeEnd]);

  return {
    timeRemaining,
    formattedTime: formatTime(timeRemaining),
    isRunning,
    pauseTimer,
    resumeTimer,
    resetTimer,
  };
}
