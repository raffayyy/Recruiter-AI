import { useState, useEffect } from 'react';
import { Application } from '../types/application';

interface ApplicationFilters {
  status?: string;
  dateRange?: string;
  searchTerm?: string;
}

export function useApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ApplicationFilters>({});

  useEffect(() => {
    // Mock data for development
    const mockApplications: Application[] = [
      {
        id: '1',
        jobId: '1',
        candidateId: '1',
        status: 'Reviewing',
        appliedAt: new Date().toISOString(),
        coverLetter: 'I am excited to apply...',
        job: {
          id: '1',
          title: 'Senior Software Engineer',
          company: 'TechCorp',
          location: 'Remote',
          type: 'Full-time',
          description: 'We are looking for...',
        },
      },
      {
        id: '2',
        jobId: '2',
        candidateId: '1',
        status: 'Scheduled',
        appliedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        coverLetter: 'I would love to join...',
        job: {
          id: '2',
          title: 'Product Manager',
          company: 'InnovateCo',
          location: 'New York',
          type: 'Full-time',
          description: 'Seeking an experienced...',
        },
      },
    ];

    setApplications(mockApplications);
    setIsLoading(false);
  }, []);

  return {
    applications,
    isLoading,
    error,
    filters,
    setFilters,
  };
}