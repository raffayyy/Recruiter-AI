import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { JobDetailsForCandidate } from '../../components/jobs/JobDetailsForCandidate';
import { useAuth } from '../../contexts/AuthContext';
import { apiRequest, MethodMap } from '../../services/api/request';
import { getCandidateJobDetails } from '../../services/api/candidate_endpoints';

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

export default function CandidateJobDetailsPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [jobDetails, setJobDetails] = useState<JobDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect recruiters to the recruiter job details page
    if (user?.role === 'recruiter') {
      navigate(`/jobs/${jobId}/details`);
      return;
    }
    
    const fetchJobDetails = async () => {
      if (!jobId) return;
      
      try {
        setIsLoading(true);
        // Endpoint to get job details for candidates
        const response = await getCandidateJobDetails(jobId);
        setJobDetails(response);
      } catch (err) {
        console.error('Failed to fetch job details:', err);
        setError('Failed to load job details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId, navigate, user?.role]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-screen items-center justify-center">
          <LoadingSpinner />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      </DashboardLayout>
    );
  }

  if (!jobDetails) {
    return (
      <DashboardLayout>
        <div className="text-center">Job details not found</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <JobDetailsForCandidate job={jobDetails} />
    </DashboardLayout>
  );
} 