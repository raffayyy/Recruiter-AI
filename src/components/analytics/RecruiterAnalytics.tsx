import React from 'react';
import { Users, BriefcaseIcon, Clock, Award } from 'lucide-react';
import { AnalyticsCard } from './AnalyticsCard';
import { ApplicationsChart } from './ApplicationsChart';
import { TopJobsTable } from './TopJobsTable';
import { useAnalytics } from '../../hooks/useAnalytics';

export function RecruiterAnalytics() {
  const { 
    stats, 
    applicationTrends, 
    topJobs, 
    isLoading, 
    error 
  } = useAnalytics();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
        Failed to load analytics data
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <AnalyticsCard
          title="Total Applications"
          value={stats.totalApplications}
          change={stats.applicationChange}
          icon={Users}
        />
        <AnalyticsCard
          title="Active Jobs"
          value={stats.activeJobs}
          icon={BriefcaseIcon}
        />
        <AnalyticsCard
          title="Avg. Time to Hire"
          value={`${stats.avgTimeToHire} days`}
          change={stats.timeToHireChange}
          icon={Clock}
        />
        <AnalyticsCard
          title="Success Rate"
          value={`${stats.successRate}%`}
          change={stats.successRateChange}
          icon={Award}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ApplicationsChart data={applicationTrends} />
        <TopJobsTable jobs={topJobs} />
      </div>
    </div>
  );
}