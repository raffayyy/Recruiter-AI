import React from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { CandidatesList } from '../../components/recruiter/CandidatesList';
import { CandidateFilters } from '../../components/recruiter/filters/CandidateFilters';
import { useCandidates } from '../../hooks/useCandidates';

export default function CandidatesPage() {
  const { candidates, isLoading, error, filters, setFilters } = useCandidates();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Candidates</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Browse and manage candidate profiles
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <CandidateFilters
              filters={filters}
              onChange={setFilters}
            />
          </div>
          <div className="lg:col-span-3">
            <CandidatesList
              candidates={candidates}
              isLoading={isLoading}
              error={error}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}