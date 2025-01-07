import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { JobForm } from '../../components/jobs/JobForm';
import { useJobPosting } from '../../hooks/useJobPosting';

export default function CreateJobPage() {
  const navigate = useNavigate();
  const { createJob, isLoading, error } = useJobPosting();

  const handleSubmit = async (data: any) => {
    try {
      await createJob(data);
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to create job:', err);
    }
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Job Posting</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Fill in the details below to create a new job posting
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-500/20 dark:bg-red-900/30 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <JobForm onSubmit={handleSubmit} isSubmitting={isLoading} />
        </div>
      </div>
    </DashboardLayout>
  );
}