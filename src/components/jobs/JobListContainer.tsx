import React from 'react';
import { JobList } from './JobList';
import { JobSearch } from './JobSearch';
import { JobFilters } from './JobFilters';
import { useJobSearch } from '../../hooks/useJobSearch';
import { Job } from '../../types/job';
import { calculateJobMatch } from '../../lib/matching';
import { useAuth } from '../../contexts/AuthContext';

interface JobListContainerProps {
  jobs: Job[];
  onApply?: (jobId: string) => void;
  onEdit?: (jobId: string) => void;
  isRecruiter?: boolean;
}

export function JobListContainer({ jobs, onApply, onEdit, isRecruiter }: JobListContainerProps) {
  const { user } = useAuth();
  const { searchTerm, setSearchTerm, filters, setFilters, filteredJobs } = useJobSearch(jobs);

  // Calculate match scores for each job if user is a candidate
  const jobsWithScores = filteredJobs.map(job => ({
    ...job,
    matchScore: user?.role === 'candidate' ? calculateJobMatch(
      job,
      {
        skills: user.skills || [],
        experience: user.yearsOfExperience || 0,
        preferredLocations: [],
        preferredTypes: [],
      }
    ).score : undefined
  }));

  return (
    <div className="grid gap-6 lg:grid-cols-4">
      <div className="lg:col-span-1">
        <div className="sticky top-6 space-y-6 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <JobFilters
            filters={filters}
            onChange={setFilters}
            onReset={() => setFilters({})}
          />
        </div>
      </div>
      
      <div className="lg:col-span-3">
        <div className="mb-6">
          <JobSearch value={searchTerm} onChange={setSearchTerm} />
        </div>
        
        <JobList
          jobs={jobsWithScores}
          onApply={onApply}
          onEdit={onEdit}
          isRecruiter={isRecruiter}
        />
      </div>
    </div>
  );
}