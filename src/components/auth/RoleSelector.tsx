import React from 'react';
import { UserCircle, Building2 } from 'lucide-react';

interface RoleSelectorProps {
  onSelect: (role: 'candidate' | 'recruiter') => void;
}

export function RoleSelector({ onSelect }: RoleSelectorProps) {
  return (
    <div className="space-y-4">
      <p className="text-center text-sm font-medium text-gray-700 dark:text-gray-300">
        I want to...
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <button
          onClick={() => onSelect('candidate')}
          className="group relative overflow-hidden rounded-xl border-2 border-gray-200 bg-white p-6 text-left transition-all hover:border-blue-500 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-blue-500/0 opacity-0 transition-opacity group-hover:opacity-10" />
          <UserCircle className="h-8 w-8 text-blue-500" />
          <h3 className="mt-4 font-semibold">Find a Job</h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Browse opportunities and connect with great companies
          </p>
        </button>

        <button
          onClick={() => onSelect('recruiter')}
          className="group relative overflow-hidden rounded-xl border-2 border-gray-200 bg-white p-6 text-left transition-all hover:border-blue-500 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-blue-500/0 opacity-0 transition-opacity group-hover:opacity-10" />
          <Building2 className="h-8 w-8 text-blue-500" />
          <h3 className="mt-4 font-semibold">Hire Talent</h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Post jobs and find the perfect candidates
          </p>
        </button>
      </div>
    </div>
  );
}