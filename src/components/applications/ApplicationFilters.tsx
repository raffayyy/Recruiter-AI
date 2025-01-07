import React from 'react';
import { Search } from 'lucide-react';
import { Card } from '../ui/Card';

interface ApplicationFilters {
  status?: string;
  dateRange?: string;
  searchTerm?: string;
}

interface ApplicationFiltersProps {
  filters: ApplicationFilters;
  onChange: (filters: ApplicationFilters) => void;
}

export function ApplicationFilters({ filters, onChange }: ApplicationFiltersProps) {
  const statuses = ['All', 'Pending', 'Reviewing', 'Scheduled', 'Accepted', 'Rejected'];
  const dateRanges = ['All Time', 'Past Week', 'Past Month', 'Past 3 Months'];

  return (
    <Card>
      <Card.Header>
        <Card.Title>Filters</Card.Title>
      </Card.Header>
      <Card.Content className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={filters.searchTerm || ''}
              onChange={(e) => onChange({ ...filters, searchTerm: e.target.value })}
              placeholder="Search applications..."
              className="w-full rounded-lg border border-gray-300 pl-9 pr-4 py-2 dark:border-gray-700 dark:bg-gray-800"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Status
          </label>
          <div className="space-y-2">
            {statuses.map((status) => (
              <label key={status} className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  value={status}
                  checked={filters.status === status}
                  onChange={(e) => onChange({ ...filters, status: e.target.value })}
                  className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-700"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  {status}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Date Range
          </label>
          <div className="space-y-2">
            {dateRanges.map((range) => (
              <label key={range} className="flex items-center">
                <input
                  type="radio"
                  name="dateRange"
                  value={range}
                  checked={filters.dateRange === range}
                  onChange={(e) => onChange({ ...filters, dateRange: e.target.value })}
                  className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-700"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  {range}
                </span>
              </label>
            ))}
          </div>
        </div>
      </Card.Content>
    </Card>
  );
}