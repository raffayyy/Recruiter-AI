import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { JobForm } from '../../components/jobs/JobForm';
import { useJobPosting } from '../../hooks/useJobPosting';
import { useJobDetails } from '../../hooks/useJobDetails';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export default function EditJobPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { job, isLoading: isLoadingJob, error: jobError } = useJobDetails(jobId);
  const { updateJob, isLoading: isUpdating, error: updateError } = useJobPosting();

  const handleSubmit = async (data: any) => {
    try {
      await updateJob(jobId!, data);
      navigate(`/jobs/${jobId}/details`);
    } catch (err) {
      console.error('Failed to update job:', err);
    }
  };

  if (isLoadingJob) return <LoadingSpinner />;

  if (jobError || !job) {
    return (
      <DashboardLayout>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {jobError || 'Job not found'}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Job Posting</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Update the job details below
          </p>
        </div>

        {updateError && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {updateError}
          </div>
        )}

        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <JobForm 
            onSubmit={handleSubmit} 
            initialData={job}
            isSubmitting={isUpdating}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}