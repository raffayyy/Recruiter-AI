import { useState, useEffect } from 'react';
import api from '../lib/api';

interface CandidateStats {
  activeApplications: number;
  avgResponseTime: number;
  interviewsScheduled: number;
  profileMatchRate: number;
}

interface ApplicationTrend {
  date: string;
  count: number;
}

export function useCandidateAnalytics() {
  const [stats, setStats] = useState<CandidateStats>({
    activeApplications: 0,
    avgResponseTime: 0,
    interviewsScheduled: 0,
    profileMatchRate: 0,
  });
  const [applicationTrends, setApplicationTrends] = useState<ApplicationTrend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Mock data for development
        setStats({
          activeApplications: 5,
          avgResponseTime: 3,
          interviewsScheduled: 2,
          profileMatchRate: 85,
        });

        const trends = Array.from({ length: 7 }).map((_, i) => ({
          date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
          count: Math.floor(Math.random() * 3),
        }));
        setApplicationTrends(trends.reverse());
        
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
        setError('Failed to load analytics');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return {
    stats,
    applicationTrends,
    isLoading,
    error,
  };
}