import React from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { CandidateAnalytics } from '../../components/analytics/CandidateAnalytics';
import { DashboardActions } from '../../components/dashboard/DashboardActions';
import { JobListContainer } from '../../components/jobs/JobListContainer';
import { useJobs } from '../../hooks/useJobs';
import { useJobApplication } from '../../hooks/useJobApplication';
import { useAuth } from '../../contexts/AuthContext';
import { calculateJobMatch } from '../../lib/matching';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export default function CandidateDashboard() {
  const { jobs, isLoading, error } = useJobs();
  const { applyForJob, isSubmitting } = useJobApplication();
  const { user } = useAuth();

  // Calculate match scores for each job
  const jobsWithScores = React.useMemo(() => {
    if (!user || !jobs) return [];
    
    return jobs.map(job => ({
      ...job,
      matchScore: calculateJobMatch(
        job,
        {
          skills: user.skills || [],
          experience: user.yearsOfExperience || 0,
          preferredLocations: [],
          preferredTypes: [],
        }
      ).score
    }));
  }, [jobs, user]);

  const handleApply = async (jobId: string) => {
    try {
      await applyForJob(jobId);
    } catch (err) {
      console.error('Failed to apply:', err);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Track your applications and discover new opportunities
            </p>
          </div>
          <DashboardActions />
        </div>

        <CandidateAnalytics />
        
        <div>
          <h2 className="mb-4 text-xl font-semibold">Recommended Jobs</h2>
          {isLoading ? (
            <LoadingSpinner />
          ) : error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
              {error}
            </div>
          ) : (
            <JobListContainer 
              jobs={jobsWithScores} 
              onApply={handleApply}
              isSubmitting={isSubmitting}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}