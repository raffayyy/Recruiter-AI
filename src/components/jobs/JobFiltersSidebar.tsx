import React from 'react';
import { Button } from '../ui/Button';
import { JobFilters } from '../../types/filters';

const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship'];
const EXPERIENCE_LEVELS = [
  { label: 'Entry Level', value: 0 },
  { label: '1-3 years', value: 1 },
  { label: '3-5 years', value: 3 },
  { label: '5+ years', value: 5 },
];

interface JobFiltersSidebarProps {
  filters: JobFilters;
  onChange: (filters: JobFilters) => void;
  onReset: () => void;
}

export function JobFiltersSidebar({ filters, onChange, onReset }: JobFiltersSidebarProps) {
  return (
    <div className="space-y-6 rounded-lg border border-gray-200 bg-white p-4">
      <div>
        <h3 className="text-lg font-medium">Filters</h3>
        <p className="text-sm text-gray-500">Refine your job search</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Job Type</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {JOB_TYPES.map((type) => (
              <Button
                key={type}
                size="sm"
                variant={filters.type === type ? 'primary' : 'outline'}
                onClick={() => onChange({
                  ...filters,
                  type: filters.type === type ? undefined : type
                })}
              >
                {type}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Experience Level</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {EXPERIENCE_LEVELS.map((level) => (
              <Button
                key={level.value}
                size="sm"
                variant={filters.experience === level.value ? 'primary' : 'outline'}
                onClick={() => onChange({
                  ...filters,
                  experience: filters.experience === level.value ? undefined : level.value
                })}
              >
                {level.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={onReset}
      >
        Reset Filters
      </Button>
    </div>
  );
}