import { useState, useEffect } from "react";
import { Job } from "../types/job";
import { useAuth } from "../contexts/AuthContext";
import api from "../lib/api";

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        let response = await api.jobs.getAvailableJobs();
        setJobs(response.sort((a, b) => (b?.suitability_score ?? 0) - (a?.suitability_score ?? 0)));
        setError(null);
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
        setError("Failed to load jobs. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [user]);

  return {
    jobs,
    isLoading,
    error,
  };
}
