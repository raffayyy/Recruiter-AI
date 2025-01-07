import React from 'react';
import { Job } from '../../types/job';
import { JobCard } from './JobCard';

interface JobListProps {
  jobs: Job[];
  onApply?: (jobId: string) => void;
  onEdit?: (jobId: string) => void;
  isRecruiter?: boolean;
}

export function JobList({ jobs, onApply, onEdit, isRecruiter }: JobListProps) {
  if (jobs.length === 0) {
    return (
      <div className="text-center text-gray-500">
        No jobs found.
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          onApply={() => onApply?.(job.id)}
          onEdit={() => onEdit?.(job.id)}
          isRecruiter={isRecruiter}
        />
      ))}
    </div>
  );
}