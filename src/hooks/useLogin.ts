import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

interface LoginCredentials {
  email: string;
  password: string;
  role: 'candidate' | 'recruiter';
}

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const { addToast } = useToast();

  const handleLogin = async ({ email, password, role }: LoginCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      await login(email, password, role);
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to login';
      setError(message);
      addToast('error', 'Login Failed', message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleLogin,
    isLoading,
    error,
  };
}