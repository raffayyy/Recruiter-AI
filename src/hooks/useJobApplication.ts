import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

export function useJobApplication() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();

  const applyForJob = async (jobId: string) => {
    if (!user?.resumeUrl) {
      addToast('error', 'Resume Required', 'Please upload your resume in your profile before applying.');
      navigate('/profile');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await api.post('/api/applications', {
        jobId,
        candidateId: user?.id,
        resumeUrl: user.resumeUrl,
      });

      addToast('success', 'Application Submitted', 'Your application has been successfully submitted.');
      navigate('/applications');
    } catch (err) {
      setError('Failed to submit application. Please try again.');
      addToast('error', 'Application Failed', 'Failed to submit your application. Please try again.');
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