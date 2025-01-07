import React from 'react';
import { Users, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Card } from '../ui/Card';

interface ApplicationStatsProps {
  stats: {
    total: number;
    reviewing: number;
    accepted: number;
    rejected: number;
  };
}

export function ApplicationStats({ stats }: ApplicationStatsProps) {
  const statItems = [
    {
      label: 'Total Applications',
      value: stats.total,
      icon: Users,
      color: 'text-blue-500',
    },
    {
      label: 'In Review',
      value: stats.reviewing,
      icon: Clock,
      color: 'text-yellow-500',
    },
    {
      label: 'Accepted',
      value: stats.accepted,
      icon: CheckCircle,
      color: 'text-green-500',
    },
    {
      label: 'Rejected',
      value: stats.rejected,
      icon: XCircle,
      color: 'text-red-500',
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statItems.map((item) => (
        <Card key={item.label}>
          <div className="flex items-center gap-4 p-4">
            <div className={`rounded-lg bg-gray-100 p-3 dark:bg-gray-800 ${item.color}`}>
              <item.icon className="h-6 w-6" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {item.label}
              </div>
              <div className="text-2xl font-semibold">{item.value}</div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}