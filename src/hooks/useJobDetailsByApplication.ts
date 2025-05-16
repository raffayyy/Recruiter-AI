import { useState, useEffect } from 'react';
import { apiRequest, MethodMap } from '../services/api/request';

interface JobDetails {
  job_id: number;
  title: string;
  company_name: string;
  location: string;
  time: string;
  short_description: string;
  long_description: string;
  requirements: string;
  max_salary: number;
  min_salary: number;
  created_at: string;
  suitability_score: number;
  recruiter_id: number;
  has_applied: boolean;
}

export function useJobDetailsByApplication(applicationId?: string) {
  const [jobDetails, setJobDetails] = useState<JobDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!applicationId) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        // Endpoint should be updated to match the actual API
        const response = await apiRequest(MethodMap.GET, `/applications/${applicationId}/job-details`);
        setJobDetails(response);
      } catch (err) {
        console.error('Failed to fetch job details:', err);
        setError('Failed to load job details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobDetails();
  }, [applicationId]);

  return { jobDetails, isLoading, error };
} 