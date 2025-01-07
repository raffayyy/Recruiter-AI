import React from 'react';
import { Card } from '../ui/Card';

interface MetricProps {
  label: string;
  value: string | number;
  change?: number;
}

export function DashboardMetric({ label, value, change }: MetricProps) {
  return (
    <Card className="p-4">
      <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
      {change !== undefined && (
        <p className={`mt-1 text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
        </p>
      )}
    </Card>
  );
}