import React from 'react';
import { useParams } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { JobDetails } from '../../components/jobs/JobDetails';
import { ApplicantsList } from '../../components/jobs/ApplicantsList';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useJobDetails } from '../../hooks/useJobDetails';

export default function JobDetailsPage() {
  const { jobId } = useParams();
  const { job, applicants, isLoading, error } = useJobDetails(jobId);

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingSpinner />
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

  if (!job) {
    return (
      <DashboardLayout>
        <div className="text-center">Job not found</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <JobDetails job={job} applicantsCount={applicants.length} />
        <ApplicantsList applicants={applicants} />
      </div>
    </DashboardLayout>
  );
}