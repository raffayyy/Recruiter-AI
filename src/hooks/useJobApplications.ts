import { useState } from 'react';
import axios from 'axios';
import { ApplicationFormData, JobApplication } from '../types/application';
import { useAuth } from '../contexts/AuthContext';

export function useJobApplications() {
  const { token } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitApplication = async (
    jobId: string,
    data: ApplicationFormData
  ): Promise<JobApplication> => {
    setIsSubmitting(true);
    try {
      let resumeUrl;
      if (data.resume) {
        const formData = new FormData();
        formData.append('file', data.resume);
        const uploadResponse = await axios.post('/api/upload', formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        resumeUrl = uploadResponse.data.url;
      }

      const response = await axios.post(
        '/api/applications',
        {
          jobId,
          coverLetter: data.coverLetter,
          resumeUrl,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return response.data;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitApplication,
    isSubmitting,
  };
}