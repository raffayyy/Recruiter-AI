import { useState, useEffect } from "react";
import { Job } from "../types/job";
import api from "../lib/api";
import { getJobsCandidates } from "../services/api/candidate_endpoints";
import { useAuth } from "../contexts/AuthContext";
import { getJobsRecruiter } from "../services/api/recruiter_endpoints";

interface ApplicationFilters {
  status?: string;
  dateRange?: string;
  searchTerm?: string;
}

export function useApplications() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ApplicationFilters>({});

  useEffect(() => {
    let response: any;
    if (user?.role !== "recruiter") {
      const CandidateJobs = async () => {
        try {
          response = await getJobsCandidates();
          console.log(response);
        } catch (err) {
          const message = "Failed to create job posting. Please try again.";
          setError(message);
        } finally {
          setIsLoading(false);
        }
        setApplications(response);
      };

      CandidateJobs();
    } else {
      const RecruiterJobs = async () => {
        try {
          response = await getJobsRecruiter();
          console.log(response);
        } catch (err) {
          const message = "Failed to create job posting. Please try again.";
          setError(message);
        } finally {
          setIsLoading(false);
        }
        setApplications(response);
      };

      RecruiterJobs();
    }
  }, []);

  return {
    applications,
    isLoading,
    error,
    filters,
    setFilters,
  };
}
