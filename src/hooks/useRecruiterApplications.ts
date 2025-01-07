import { useState, useEffect } from 'react';
import { Application } from '../types/application';

interface ApplicationStats {
  total: number;
  reviewing: number;
  accepted: number;
  rejected: number;
}

export function useRecruiterApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState<ApplicationStats>({
    total: 0,
    reviewing: 0,
    accepted: 0,
    rejected: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    // Mock data for development
    const mockApplications = [
      {
        id: '1',
        candidate: {
          name: 'John Doe',
          email: 'john@example.com',
        },
        job: {
          title: 'Senior Software Engineer',
          company: 'TechCorp',
        },
        status: 'Reviewing',
        appliedAt: new Date().toISOString(),
        match: 85,
      },
      {
        id: '2',
        candidate: {
          name: 'Jane Smith',
          email: 'jane@example.com',
        },
        job: {
          title: 'Product Manager',
          company: 'TechCorp',
        },
        status: 'Pending',
        appliedAt: new Date().toISOString(),
        match: 92,
      },
    ];

    setApplications(mockApplications);
    setStats({
      total: mockApplications.length,
      reviewing: 1,
      accepted: 0,
      rejected: 0,
    });
    setIsLoading(false);
  }, []);

  return {
    applications,
    stats,
    isLoading,
    error,
    filters,
    setFilters,
  };
}