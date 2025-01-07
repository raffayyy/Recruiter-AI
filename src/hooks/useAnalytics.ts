import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface Stats {
  totalApplications: number;
  applicationChange: number;
  activeJobs: number;
  avgTimeToHire: number;
  timeToHireChange: number;
  successRate: number;
  successRateChange: number;
}

interface JobStats {
  id: string;
  title: string;
  applications: number;
  views: number;
  conversionRate: number;
}

interface ApplicationTrend {
  date: string;
  count: number;
}

export function useAnalytics() {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats>({
    totalApplications: 0,
    applicationChange: 0,
    activeJobs: 0,
    avgTimeToHire: 0,
    timeToHireChange: 0,
    successRate: 0,
    successRateChange: 0,
  });
  const [applicationTrends, setApplicationTrends] = useState<ApplicationTrend[]>([]);
  const [topJobs, setTopJobs] = useState<JobStats[]>([]);

  useEffect(() => {
    // Mock data for development
    setStats({
      totalApplications: 150,
      applicationChange: 12,
      activeJobs: 8,
      avgTimeToHire: 15,
      timeToHireChange: -5,
      successRate: 85,
      successRateChange: 3,
    });

    setApplicationTrends([
      { date: '2024-01-01', count: 10 },
      { date: '2024-01-02', count: 15 },
      { date: '2024-01-03', count: 12 },
      { date: '2024-01-04', count: 18 },
      { date: '2024-01-05', count: 20 },
    ]);

    setTopJobs([
      {
        id: '1',
        title: 'Senior Software Engineer',
        applications: 45,
        views: 250,
        conversionRate: 18,
      },
      {
        id: '2',
        title: 'Product Manager',
        applications: 38,
        views: 180,
        conversionRate: 21,
      },
      {
        id: '3',
        title: 'UX Designer',
        applications: 32,
        views: 160,
        conversionRate: 20,
      },
    ]);

    setIsLoading(false);
  }, [token]);

  return {
    stats,
    applicationTrends,
    topJobs,
    isLoading,
    error,
  };
}