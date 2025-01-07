import React from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { RecruiterApplicationsList } from '../../components/recruiter/RecruiterApplicationsList';
import { ApplicationStats } from '../../components/recruiter/ApplicationStats';
import { useRecruiterApplications } from '../../hooks/useRecruiterApplications';

export default function RecruiterApplicationsPage() {
  const { applications, stats, isLoading, error, filters, setFilters } = useRecruiterApplications();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Applications</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Review and manage candidate applications
          </p>
        </div>

        <ApplicationStats stats={stats} />

        <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <RecruiterApplicationsList
            applications={applications}
            isLoading={isLoading}
            error={error}
            filters={filters}
            onFiltersChange={setFilters}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}