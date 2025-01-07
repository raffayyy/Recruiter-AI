import React from 'react';
import { Search } from 'lucide-react';
import { Button } from '../../ui/Button';

interface CandidateFilters {
  searchTerm?: string;
  skills?: string[];
  experience?: number;
  education?: string;
}

interface CandidateFiltersProps {
  filters: CandidateFilters;
  onChange: (filters: CandidateFilters) => void;
}

export function CandidateFilters({ filters, onChange }: CandidateFiltersProps) {
  const educationLevels = ['High School', 'Bachelor\'s', 'Master\'s', 'PhD'];
  const experienceLevels = [
    { label: '0-2 years', value: 2 },
    { label: '3-5 years', value: 5 },
    { label: '5+ years', value: 6 },
  ];

  return (
    <div className="space-y-6 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Search
        </label>
        <div className="relative mt-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={filters.searchTerm || ''}
            onChange={(e) => onChange({ ...filters, searchTerm: e.target.value })}
            placeholder="Search candidates..."
            className="w-full rounded-lg border border-gray-300 pl-9 pr-4 py-2 dark:border-gray-700 dark:bg-gray-900"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Education Level
        </label>
        <div className="mt-2 space-y-2">
          {educationLevels.map((level) => (
            <label key={level} className="flex items-center">
              <input
                type="radio"
                name="education"
                value={level}
                checked={filters.education === level}
                onChange={(e) => onChange({ ...filters, education: e.target.value })}
                className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                {level}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Experience
        </label>
        <div className="mt-2 space-y-2">
          {experienceLevels.map((level) => (
            <label key={level.value} className="flex items-center">
              <input
                type="radio"
                name="experience"
                value={level.value}
                checked={filters.experience === level.value}
                onChange={(e) => onChange({ ...filters, experience: Number(e.target.value) })}
                className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                {level.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={() => onChange({})}
      >
        Reset Filters
      </Button>
    </div>
  );
}