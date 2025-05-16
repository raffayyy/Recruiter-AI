import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { JobDetailsForCandidate } from '../../components/jobs/JobDetailsForCandidate';
import { useAuth } from '../../contexts/AuthContext';
import { useJobDetailsByApplication } from '../../hooks/useJobDetailsByApplication';

export default function ApplicationDetailsPage() {
  const { applicationId } = useParams<{ applicationId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { jobDetails, isLoading, error } = useJobDetailsByApplication(applicationId);

  // Redirect recruiters to feedback page
  useEffect(() => {
    if (user?.role === 'recruiter') {
      navigate(`/applications/${applicationId}/feedback`);
    }
  }, [applicationId, navigate, user?.role]);

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