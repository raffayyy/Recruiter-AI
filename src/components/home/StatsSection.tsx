import React from 'react';

const stats = [
  { label: 'Active Users', value: '10K+' },
  { label: 'Successful Hires', value: '50K+' },
  { label: 'Companies', value: '1000+' },
  { label: 'Time Saved', value: '75%' },
];

export function StatsSection() {
  return (
    <div className="bg-blue-600 py-12 dark:bg-blue-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center justify-center"
            >
              <dt className="text-3xl font-bold text-white md:text-4xl">
                {stat.value}
              </dt>
              <dd className="mt-2 text-sm text-blue-100">{stat.label}</dd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}