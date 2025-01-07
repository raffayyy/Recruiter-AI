import { useState, useMemo } from 'react';
import { Job } from '../types/job';

interface JobFilters {
  type?: string;
  location?: string;
  experience?: number;
}

export function useJobSearch(jobs: Job[]) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<JobFilters>({});

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchesSearch = !searchTerm || 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = !filters.type || job.type === filters.type;
      const matchesLocation = !filters.location || 
        job.location.toLowerCase().includes(filters.location.toLowerCase());
      const matchesExperience = !filters.experience || 
        job.requiredExperience <= filters.experience;

      return matchesSearch && matchesType && matchesLocation && matchesExperience;
    });
  }, [jobs, searchTerm, filters]);

  return {
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    filteredJobs,
  };
}