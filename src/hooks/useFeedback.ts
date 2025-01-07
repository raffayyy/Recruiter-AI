import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Feedback, FeedbackFormData } from '../types/feedback';

export function useFeedback(applicationId: string) {
  const { token } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const submitFeedback = async (data: FeedbackFormData): Promise<void> => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `/api/applications/${applicationId}/feedback`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFeedback(response.data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    feedback,
    submitFeedback,
    isSubmitting,
  };
}