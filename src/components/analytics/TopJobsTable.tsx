import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface JobStats {
  id: string;
  title: string;
  applications: number;
  views: number;
  conversionRate: number;
}

interface TopJobsTableProps {
  jobs: JobStats[];
}

export function TopJobsTable({ jobs }: TopJobsTableProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Top Performing Jobs</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-sm dark:border-gray-700 dark:bg-gray-900">
              <th className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Job Title</th>
              <th className="px-6 py-3 text-right font-medium text-gray-500 dark:text-gray-400">Applications</th>
              <th className="px-6 py-3 text-right font-medium text-gray-500 dark:text-gray-400">Views</th>
              <th className="px-6 py-3 text-right font-medium text-gray-500 dark:text-gray-400">Conversion</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id} className="border-b border-gray-200 last:border-0 dark:border-gray-700">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <span className="font-medium text-gray-900 dark:text-white">{job.title}</span>
                    <ArrowUpRight className="ml-2 h-4 w-4 text-green-500" />
                  </div>
                </td>
                <td className="px-6 py-4 text-right">{job.applications}</td>
                <td className="px-6 py-4 text-right">{job.views}</td>
                <td className="px-6 py-4 text-right">{job.conversionRate}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}