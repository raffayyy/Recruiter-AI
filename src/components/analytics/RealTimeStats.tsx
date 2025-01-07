import React from 'react';
import { Activity, Users, Clock, TrendingUp } from 'lucide-react';
import { Card } from '../ui/Card';

export function RealTimeStats() {
  // Mock data for demonstration
  const stats = {
    activeApplications: 42,
    todayApplications: 8,
    averageTimeToHire: 12,
    conversionRate: 68
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="p-4">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-blue-500" />
          <h3 className="font-medium">Active Applications</h3>
        </div>
        <p className="mt-2 text-2xl font-semibold">{stats.activeApplications}</p>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-green-500" />
          <h3 className="font-medium">Today's Applications</h3>
        </div>
        <p className="mt-2 text-2xl font-semibold">{stats.todayApplications}</p>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-purple-500" />
          <h3 className="font-medium">Avg Time to Hire</h3>
        </div>
        <p className="mt-2 text-2xl font-semibold">{stats.averageTimeToHire} days</p>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-yellow-500" />
          <h3 className="font-medium">Conversion Rate</h3>
        </div>
        <p className="mt-2 text-2xl font-semibold">{stats.conversionRate}%</p>
      </Card>
    </div>
  );
}