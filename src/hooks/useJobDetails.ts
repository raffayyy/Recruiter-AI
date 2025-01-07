import { useState, useEffect } from "react";
import api from "../lib/api";

interface Applicant {
  application_id: number;
  applied_at: string;
  candidate_name: string;
  current_job_title: string;
  status: string;
  suitability_score: number;
}

export function useJobDetails(jobId: string | undefined) {
  const [job, setJob] = useState({
    id: Number(jobId),
    title: "",
    location: "",
    time: "",
    company: "",
    description: "",
  });
  const [completeJobDetails, setCompleteJobDetails] = useState<any>(undefined);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const responseFormatter = (response: any) => {
    setJob((prev: any) => {
      return {
        ...prev,
        title: response.job_title,
        location: response.job_location,
        time: response.job_time,
        company: response.job_company,
        description: response.job_description,
      };
    });
    setApplicants(response.applications);
  };
  useEffect(() => {
    if (!jobId) return;
    let response: any;
    const fetchJobDetails = async () => {
      try {
        response = await api.jobs.getRecruiterJob(jobId);
        responseFormatter(response);
        const jobDetails = await api.jobs.getRecruiterJobDetails(jobId);
        setCompleteJobDetails(jobDetails);
      } catch (err) {
        console.error("Failed to fetch job details:", err);
        setError("Failed to load job details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  return {
    job,
    completeJobDetails,
    applicants,
    isLoading,
    error,
  };
}
