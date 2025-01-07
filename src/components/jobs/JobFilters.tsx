import React from 'react';
import { Button } from '../ui/Button';

const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship'];
const EXPERIENCE_LEVELS = [
  { label: 'Entry Level', value: 0 },
  { label: '1-3 years', value: 1 },
  { label: '3-5 years', value: 3 },
  { label: '5+ years', value: 5 },
];

interface JobFiltersProps {
  filters: {
    type?: string;
    location?: string;
    experience?: number;
  };
  onChange: (filters: any) => void;
  onReset: () => void;
}

export function JobFilters({ filters, onChange, onReset }: JobFiltersProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Job Type</label>
        <div className="mt-2 flex flex-wrap gap-2">
          {JOB_TYPES.map((type) => (
            <Button
              key={type}
              variant={filters.type === type ? 'primary' : 'outline'}
              size="sm"
              onClick={() => onChange({ ...filters, type: filters.type === type ? undefined : type })}
            >
              {type}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Experience Level</label>
        <div className="mt-2 flex flex-wrap gap-2">
          {EXPERIENCE_LEVELS.map((level) => (
            <Button
              key={level.value}
              variant={filters.experience === level.value ? 'primary' : 'outline'}
              size="sm"
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

      <div>
        <label className="block text-sm font-medium text-gray-700">Location</label>
        <input
          type="text"
          value={filters.location || ''}
          onChange={(e) => onChange({ ...filters, location: e.target.value })}
          placeholder="Filter by location..."
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={onReset}
        className="w-full"
      >
        Reset Filters
      </Button>
    </div>
  );
}