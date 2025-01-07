import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { FeedbackFormData } from '../types/feedback';

export function useFeedbackSubmission() {
  const { token } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitFeedback = async (applicationId: string, data: FeedbackFormData) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await axios.post(
        `/api/applications/${applicationId}/feedback`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data;
    } catch (err) {
      setError('Failed to submit feedback');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitFeedback, isSubmitting, error };
}