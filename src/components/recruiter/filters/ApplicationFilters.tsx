import React from 'react';
import { Button } from '../../ui/Button';
import { StatusFilter } from './StatusFilter';
import { DateRangeFilter } from './DateRangeFilter';

interface ApplicationFiltersProps {
  filters: {
    status?: string;
    dateRange?: string;
    searchTerm?: string;
  };
  onChange: (filters: any) => void;
}

export function ApplicationFilters({ filters, onChange }: ApplicationFiltersProps) {
  return (
    <div className="space-y-4 p-4">
      <StatusFilter
        value={filters.status}
        onChange={(status) => onChange({ ...filters, status })}
      />
      <DateRangeFilter
        value={filters.dateRange}
        onChange={(dateRange) => onChange({ ...filters, dateRange })}
      />
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