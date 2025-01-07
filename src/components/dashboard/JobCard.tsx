import React from 'react';
import { Button } from '../ui/Button';

interface JobCardProps {
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  onApply?: () => void;
  onEdit?: () => void;
  isRecruiter?: boolean;
}

export function JobCard({
  title,
  company,
  location,
  type,
  description,
  onApply,
  onEdit,
  isRecruiter,
}: JobCardProps) {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
            {type}
          </span>
        </div>
        <p className="mt-1 text-sm text-gray-500">{company} • {location}</p>
        <p className="mt-3 text-sm text-gray-600">{description}</p>
        <div className="mt-4">
          {isRecruiter ? (
            <Button variant="outline" onClick={onEdit}>
              Edit Job
            </Button>
          ) : (
            <Button onClick={onApply}>Apply Now</Button>
          )}
        </div>
      </div>
    </div>
  );
}