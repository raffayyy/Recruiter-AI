import { useState, useEffect } from "react";
import { Candidate } from "../types/candidate";
import api from "../lib/api";
import { getRecruiterDashboardApplications } from "../services/api/recruiter_endpoints";

interface CandidateFilters {
  searchTerm?: string;
  skills?: string[];
  experience?: number;
  education?: string;
}

export function useCandidates() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<CandidateFilters>({});

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await getRecruiterDashboardApplications();
        console.log(response);

        setCandidates(response);
      } catch (err) {
        const message = "Failed to fetch candidates. Please try again.";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCandidates();
  }, [filters]);

  return {
    candidates,
    isLoading,
    error,
    filters,
    setFilters,
  };
}
