import React from 'react';
import { Line } from 'react-chartjs-2';
import { formatDate } from '../../lib/date';

interface ApplicationData {
  date: string;
  count: number;
}

interface ApplicationsChartProps {
  data: ApplicationData[];
}

export function ApplicationsChart({ data }: ApplicationsChartProps) {
  const chartData = {
    labels: data.map(d => formatDate(d.date)),
    datasets: [
      {
        label: 'Applications',
        data: data.map(d => d.count),
        fill: false,
        borderColor: 'rgb(59, 130, 246)',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
        Application Trends
      </h3>
      <Line data={chartData} options={options} />
    </div>
  );
}