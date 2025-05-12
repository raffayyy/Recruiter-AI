import React, { useState } from 'react';
import { JobList } from './JobList';
import { JobSearch } from './JobSearch';
import { JobFilters } from './JobFilters';
import { useJobSearch } from '../../hooks/useJobSearch';
import { Job } from '../../types/job';
import { Button } from '../ui/Button';
import { SlidersHorizontal, X } from 'lucide-react';

interface JobListContainerProps {
  jobs: Job[];
  onApply?: (jobId: string) => void;
  onEdit?: (jobId: string) => void;
  isRecruiter?: boolean;
}

export function JobListContainer({ jobs, onApply, onEdit, isRecruiter }: JobListContainerProps) {
  const { searchTerm, setSearchTerm, filters, setFilters } = useJobSearch(jobs);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  return (
    <div className="relative">
      {/* Mobile filters button */}
      <div className="sticky top-0 z-10 mb-4 flex items-center justify-between bg-white p-4 shadow-sm dark:bg-gray-900 lg:hidden">
        <div className="text-lg font-medium">
          {jobs.length} {jobs.length === 1 ? 'Job' : 'Jobs'} Found
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setMobileFiltersOpen(true)}
          className="flex items-center gap-2"
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span>Filters</span>
        </Button>
      </div>

      {/* Mobile filter drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-gray-900 lg:hidden">
          <div className="flex items-center justify-between border-b p-4 dark:border-gray-700">
            <h2 className="text-lg font-medium">Filters</h2>
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(false)}
              className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-800"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="flex-1 overflow-auto p-4">
            <JobFilters
              filters={filters}
              onChange={setFilters}
              onReset={() => setFilters({})}
            />
          </div>
          <div className="border-t p-4 dark:border-gray-700">
            <Button 
              className="w-full"
              onClick={() => setMobileFiltersOpen(false)}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Desktop filters sidebar */}
        <div className="hidden lg:col-span-1 lg:block">
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
    </div>
  );
}