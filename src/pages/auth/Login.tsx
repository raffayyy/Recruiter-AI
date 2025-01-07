import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BriefcaseIcon } from 'lucide-react';
import { LoginForm } from '../../components/auth/LoginForm';
import { DemoAccounts } from '../../components/auth/DemoAccounts';
import { useLogin } from '../../hooks/useLogin';
import { useAuth } from '../../contexts/AuthContext';
import type { LoginForm as LoginFormType } from '../../schemas/auth';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { handleLogin, isLoading, error } = useLogin();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const onSubmit = async (data: LoginFormType) => {
    const success = await handleLogin(data);
    if (success) {
      const from = location.state?.from || '/dashboard';
      navigate(from, { replace: true });
    }
  };

  const fillDemoCredentials = (role: 'candidate' | 'recruiter') => {
    const demoData = {
      email: `${role}@demo.com`,
      password: 'demo123',
      role,
    };
    onSubmit(demoData);
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex w-full flex-col justify-center px-4 sm:w-1/2 sm:px-6 lg:px-8 xl:px-12">
        <div className="mx-auto w-full max-w-md space-y-8">
          <div className="flex items-center justify-center gap-2">
            <div className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 p-2 shadow-lg">
              <BriefcaseIcon className="h-6 w-6 text-white" />
            </div>
            <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-2xl font-bold text-transparent">
              Recruiter.AI
            </span>
          </div>

          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Sign in to your account to continue
            </p>
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-900/30 dark:text-red-400">
              {error}
            </div>
          )}

          <DemoAccounts onFill={fillDemoCredentials} />
          <LoginForm onSubmit={onSubmit} isSubmitting={isLoading} />
        </div>
      </div>

      <div className="hidden bg-gradient-to-br from-blue-500 to-blue-600 sm:block sm:w-1/2">
        <div className="flex h-full flex-col items-center justify-center px-8 text-white">
          <div className="max-w-md text-center">
            <h1 className="mb-4 text-4xl font-bold">Transform Your Hiring Process</h1>
            <p className="mb-8 text-lg text-blue-100">
              Join thousands of companies using AI-powered recruitment to find the perfect candidates.
            </p>
            <img
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=2940"
              alt="Recruitment"
              className="rounded-xl shadow-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}