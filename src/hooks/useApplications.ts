import { useState, useEffect } from "react";
import { Job } from "../types/job";
import api from "../lib/api";

interface ApplicationFilters {
  status?: string;
  dateRange?: string;
  searchTerm?: string;
}

export function useApplications() {
  const [applications, setApplications] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ApplicationFilters>({});
 
  useEffect(() => {
    let response: any;
    const createJob = async () => {
      try {
        response = await api.jobs.getRecruiterJobs();
      } catch (err) {
        const message = "Failed to create job posting. Please try again.";
        setError(message);
      } finally {
        setIsLoading(false);
      }
      setApplications(response);
    };

    createJob();
  }, []);

  return {
    applications,
    isLoading,
    error,
    filters,
    setFilters,
  };
}
