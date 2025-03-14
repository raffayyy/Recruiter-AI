import React from "react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { RealTimeStats } from "../../components/analytics/RealTimeStats";
import { DashboardActions } from "../../components/dashboard/DashboardActions";
import { RecruiterApplicationsList } from "../../components/recruiter/RecruiterApplicationsList";
import { useRecruiterApplications } from "../../hooks/useRecruiterApplications";

export default function RecruiterDashboard() {
  const { applications, stats, isLoading, error, filters, setFilters } =
    useRecruiterApplications();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Recruiter Dashboard
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Monitor recruitment activities and manage applications
            </p>
          </div>
          <DashboardActions />
        </div>

        <RealTimeStats />

        <div>
          <h2 className="mb-4 text-xl font-semibold">Recent Applications</h2>
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
