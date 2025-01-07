import React from 'react';

interface DateRangeFilterProps {
  value?: string;
  onChange: (dateRange: string) => void;
}

export function DateRangeFilter({ value, onChange }: DateRangeFilterProps) {
  const ranges = ['All Time', 'Today', 'Last 7 Days', 'Last 30 Days', 'Last 90 Days'];

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Date Range
      </label>
      <div className="space-y-2">
        {ranges.map((range) => (
          <label key={range} className="flex items-center">
            <input
              type="radio"
              name="dateRange"
              value={range}
              checked={value === range}
              onChange={(e) => onChange(e.target.value)}
              className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              {range}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}