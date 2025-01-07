import { useState, useEffect } from 'react';
import { useWebSocket } from './useWebSocket';

interface RecruiterStats {
  activeApplications: number;
  todayApplications: number;
  averageTimeToHire: number;
  conversionRate: number;
}

export function useRecruiterRealTimeStats() {
  const [stats, setStats] = useState<RecruiterStats>({
    activeApplications: 0,
    todayApplications: 0,
    averageTimeToHire: 0,
    conversionRate: 0,
  });

  const { isConnected, messages } = useWebSocket('wss://api.example.com/stats');

  useEffect(() => {
    // Simulated real-time updates
    const interval = setInterval(() => {
      setStats({
        activeApplications: Math.floor(Math.random() * 100) + 50,
        todayApplications: Math.floor(Math.random() * 20) + 5,
        averageTimeToHire: Math.floor(Math.random() * 10) + 15,
        conversionRate: Math.floor(Math.random() * 20) + 70,
      });
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return {
    stats,
    isConnected,
  };
}