import { JobList } from './JobList';
import { JobSearch } from './JobSearch';
import { JobFilters } from './JobFilters';
import { useJobSearch } from '../../hooks/useJobSearch';
import { Job } from '../../types/job';

interface JobListContainerProps {
  jobs: Job[];
  onApply?: (jobId: string) => void;
  onEdit?: (jobId: string) => void;
  isRecruiter?: boolean;
}

export function JobListContainer({ jobs, onApply, onEdit, isRecruiter }: JobListContainerProps) {
  const { searchTerm, setSearchTerm, filters, setFilters } = useJobSearch(jobs);

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
          key={1}
          jobs={jobs}
          onApply={onApply}
          onEdit={onEdit}
        />
      </div>
    </div>
  );
}