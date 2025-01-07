import React from "react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { ApplicationsList } from "../../components/applications/ApplicationsList";
import { ApplicationFilters } from "../../components/applications/ApplicationFilters";
import { useApplications } from "../../hooks/useApplications";
import { useAuth } from "../../contexts/AuthContext";

export default function ApplicationsPage() {
  const { applications, isLoading, error, filters, setFilters } =
    useApplications();
  const { user } = useAuth();
  console.log("user", user);
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            My Applications
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Track and manage your job applications
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <ApplicationFilters filters={filters} onChange={setFilters} />
          </div>
          <div className="lg:col-span-3">
            {user?.role ? 
            <ApplicationsList
              applications={applications}
              isLoading={isLoading}
              error={error}
            />
            :<></>}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
