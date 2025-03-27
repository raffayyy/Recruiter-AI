import React, { useState } from "react";
import { Search, Filter, ChevronDown } from "lucide-react";
import { ApplicationRow } from "./ApplicationRow";
import { ApplicationFilters } from "./filters/ApplicationFilters";
import { Button } from "../ui/Button";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { Application } from "../../types/application";

interface RecruiterApplicationsListProps {
  applications: Application[];
  isLoading: boolean;
  error: string | null;
  filters: any;
  onFiltersChange: (filters: any) => void;
}

export function RecruiterApplicationsList({
  applications,
  isLoading,
  error,
  filters,
  onFiltersChange,
}: RecruiterApplicationsListProps) {
  const [showFilters, setShowFilters] = useState(false);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div>
      <div className="border-b border-gray-200 p-4 dark:border-gray-700">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search applications..."
                className="w-full rounded-lg border border-gray-300 bg-white pl-9 pr-4 py-2 dark:border-gray-600 dark:bg-gray-700"
                value={filters.search || ""}
                onChange={(e) =>
                  onFiltersChange({ ...filters, search: e.target.value })
                }
              />
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                showFilters ? "rotate-180" : ""
              }`}
            />
          </Button>
        </div>

        {showFilters && (
          <div className="mt-4">
            <ApplicationFilters filters={filters} onChange={onFiltersChange} />
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-left text-sm font-medium text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
              <th className="px-4 py-3">Candidate</th>
              <th className="px-4 py-3">Position</th>
              <th className="px-4 py-3">Applied</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Match</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {Array.isArray(applications) ? applications.map((application) => (
              <ApplicationRow
                key={application.application_id}
                application={application}
              />
            )) : (
              <tr><td colSpan={6} className="px-4 py-3 text-center">No applications found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
