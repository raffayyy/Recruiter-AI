import React from 'react';
import { Job } from '../../types/job';
import { JobCard } from './JobCard';

interface JobListProps {
  key:number;
  jobs: Job[];
  onApply?: (jobId: string) => void;
  onEdit?: (jobId: string) => void;
  isRecruiter?: boolean;
}

export function JobList({ jobs, onApply }: JobListProps) {
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
          key={job.job_id}
          job={job}
          onApply={() => job.job_id ? onApply?.(job.job_id.toString()) : undefined}
        />
      ))}
    </div>
  );
}