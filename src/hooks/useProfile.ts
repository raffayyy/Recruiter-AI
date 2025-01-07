import { useState } from 'react';
import { User } from '../types/auth';
import api from '../lib/api';
import { useToast } from '../contexts/ToastContext';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ['application/pdf'];

export function useProfile() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToast();

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return 'File size must be less than 5MB';
    }
    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      return 'Only PDF files are accepted';
    }
    return null;
  };

  const updateProfile = async (data: FormData): Promise<User> => {
    setIsLoading(true);
    setError(null);

    try {
      let resumeUrl;
      if (data.resume instanceof File) {
        const fileError = validateFile(data.resume);
        if (fileError) {
          throw new Error(fileError);
        }

        const formData = new FormData();
        formData.append('file', data.resume);
        const uploadResponse = await api.post('/api/upload', formData);
        resumeUrl = uploadResponse.url;
      }

      const response = await api.put<User>('/api/profile', {
        ...data,
        resumeUrl,
      });

      addToast('success', 'Profile Updated', 'Your profile has been successfully updated.');
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update profile. Please try again.';
      setError(message);
      addToast('error', 'Update Failed', message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateProfile,
    isLoading,
    error,
  };
}