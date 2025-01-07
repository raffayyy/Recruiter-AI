import { Job } from '../types/job';

export function searchJobs(jobs: Job[], searchTerm: string, filters: JobFilters): Job[] {
  return jobs.filter(job => {
    const matchesSearch = !searchTerm || [
      job.title,
      job.company,
      job.description,
      job.location
    ].some(field => 
      field.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const matchesType = !filters.type || job.type === filters.type;
    const matchesLocation = !filters.location || 
      job.location.toLowerCase().includes(filters.location.toLowerCase());
    const matchesExperience = !filters.experience || 
      job.requiredExperience <= filters.experience;
    const matchesSalary = !filters.salary || (
      job.salary && 
      job.salary.min >= filters.salary.min &&
      job.salary.max <= filters.salary.max
    );

    return matchesSearch && matchesType && 
           matchesLocation && matchesExperience && 
           matchesSalary;
  });
}