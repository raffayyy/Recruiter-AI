import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api/auth.service';
import { useToast } from '../contexts/ToastContext';
import type { LoginForm } from '../schemas/auth';
import type { CandidateFormData } from '../types/candidate';
import type { RecruiterFormData } from '../types/recruiter';

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToast();
  const navigate = useNavigate();

  const login = async (data: LoginForm) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.login(data);
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('user_role', data.role);
      addToast('success', 'Welcome back!', 'You have successfully logged in.');
      return response.user;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Invalid credentials';
      setError(message);
      addToast('error', 'Login Failed', message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: CandidateFormData | RecruiterFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.register(data);
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('user_role', data.role);
      addToast('success', 'Welcome!', 'Your account has been created successfully.');
      return response.user;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setError(message);
      addToast('error', 'Registration Failed', message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_role');
    addToast('info', 'Logged Out', 'You have been logged out successfully.');
    navigate('/login');
  };

  return {
    login,
    register,
    logout,
    isLoading,
    error,
  };
}