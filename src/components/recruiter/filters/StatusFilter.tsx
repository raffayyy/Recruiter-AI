import React from 'react';

interface StatusFilterProps {
  value?: string;
  onChange: (status: string) => void;
}

export function StatusFilter({ value, onChange }: StatusFilterProps) {
  const statuses = ['All', 'Pending', 'Reviewing', 'Scheduled', 'Accepted', 'Rejected'];

  return (
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
              checked={value === status}
              onChange={(e) => onChange(e.target.value)}
              className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              {status}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}