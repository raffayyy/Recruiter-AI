import { useState, useEffect } from 'react';
import { getRecruiterDashboardApplications } from '../services/api/recruiter_endpoints';

interface ApplicationStats {
  total: number;
  reviewing: number;
  accepted: number;
  rejected: number;
}

export function useRecruiterApplications() {
  const [applications, setApplications] = useState<any[]>([]);
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
    const CandidateJobs = async () => {
      try {
        const response = await getRecruiterDashboardApplications();
        console.log(response);
        
        setApplications(response);
        setStats({
          total: response ? response.length : 0,
          reviewing: 1,
          accepted: 0,
          rejected: 0,
        });
      } catch (err) {
        const message = "Failed to create job posting. Please try again.";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };
    
    CandidateJobs();
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