import React from 'react';
import { Search } from 'lucide-react';

interface JobSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function JobSearch({ value, onChange }: JobSearchProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search jobs by title, company, or keywords..."
        className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
    </div>
  );
}