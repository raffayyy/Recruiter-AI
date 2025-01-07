import { useState } from 'react';
import { Job } from '../types/job';
import api from '../lib/api';
import { useToast } from '../contexts/ToastContext';

export function useJobPosting() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToast();

  const createJob = async (data: Partial<Job>): Promise<Job> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.jobs.createJob(data);
      addToast('success', 'Job Created', 'Your job posting has been successfully created.');
      return response;
    } catch (err) {
      const message = 'Failed to create job posting. Please try again.';
      setError(message);
      addToast('error', 'Creation Failed', message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // const updateJob = async (id: string, data: Partial<Job>): Promise<Job> => {
  //   setIsLoading(true);
  //   setError(null);

  //   try {
  //     const response = await api.put<Job>(`/api/jobs/${id}`, data);
  //     addToast('success', 'Job Updated', 'Your job posting has been successfully updated.');
  //     return response;
  //   } catch (err) {
  //     const message = 'Failed to update job posting. Please try again.';
  //     setError(message);
  //     addToast('error', 'Update Failed', message);
  //     throw err;
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return {
    createJob,
    //updateJob,
    isLoading,
    error,
  };
}