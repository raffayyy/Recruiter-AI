import React from 'react';
import { FileText, Clock, CheckCircle, TrendingUp } from 'lucide-react';
import { Card } from '../ui/Card';
import { useCandidateAnalytics } from '../../hooks/useCandidateAnalytics';
import { LoadingSpinner } from '../common/LoadingSpinner';

export function CandidateAnalytics() {
  const { stats, isLoading, error } = useCandidateAnalytics();

  if (isLoading) return <LoadingSpinner />;
  if (error) return null;

  const metrics = [
    {
      label: 'Active Applications',
      value: stats.activeApplications,
      icon: FileText,
      color: 'text-blue-500',
      description: 'Applications under review',
    },
    {
      label: 'Average Response Time',
      value: `${stats.avgResponseTime} days`,
      icon: Clock,
      color: 'text-purple-500',
      description: 'Time to hear back from recruiters',
    },
    {
      label: 'Interviews Scheduled',
      value: stats.interviewsScheduled,
      icon: CheckCircle,
      color: 'text-green-500',
      description: 'Upcoming interviews',
    },
    {
      label: 'Profile Match Rate',
      value: `${stats.profileMatchRate}%`,
      icon: TrendingUp,
      color: 'text-yellow-500',
      description: 'Average job match score',
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.label} className="relative overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-4">
              <div className={`rounded-lg bg-gray-100 p-3 dark:bg-gray-800 ${metric.color}`}>
                <metric.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {metric.label}
                </p>
                <p className="mt-1 text-2xl font-semibold">{metric.value}</p>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {metric.description}
            </p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-20" />
        </Card>
      ))}
    </div>
  );
}