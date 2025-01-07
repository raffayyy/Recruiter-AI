import React from 'react';
import { Brain, Users, BarChart3, Globe } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Matching',
    description: 'Smart algorithm matches candidates with the perfect opportunities using advanced machine learning.',
  },
  {
    icon: Users,
    title: 'Video Interviews',
    description: 'Conduct seamless remote interviews with advanced proctoring and real-time assessment.',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Get comprehensive insights into your recruitment pipeline with detailed analytics and reporting.',
  },
  {
    icon: Globe,
    title: 'Global Talent Pool',
    description: 'Access top candidates from around the world with our extensive network of professionals.',
  },
];

export function FeatureSection() {
  return (
    <div className="bg-white py-24 dark:bg-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Everything you need to streamline hiring
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
            Our comprehensive suite of tools helps you find and hire the best talent efficiently.
          </p>
        </div>

        <div className="mt-20">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group relative"
              >
                <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 blur transition group-hover:opacity-100" />
                <div className="relative flex h-full flex-col rounded-lg bg-white p-6 dark:bg-gray-800">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-white">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-2 flex-grow text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}