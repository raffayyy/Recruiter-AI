import { useState } from "react";
import api from "../lib/api";
import { useToast } from "../contexts/ToastContext";

export function useJobApplication() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToast();

  const applyForJob = async (jobId: string) => {
    setIsSubmitting(true);
    setError(null);

    try {
      await api.jobs.applyForJob(jobId);

      addToast(
        "success",
        "Application Submitted",
        "Your application has been successfully submitted."
      );
    } catch (err) {
      setError("Failed to submit application. Please try again.");
      addToast(
        "error",
        "Application Failed",
        "Failed to submit your application. Please try again."
      );
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    applyForJob,
    isSubmitting,
    error,
  };
}
