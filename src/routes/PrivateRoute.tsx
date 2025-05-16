import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

interface PrivateRouteProps {
  children: React.ReactNode;
  recruiterOnly?: boolean;
}

export function PrivateRoute({ children, recruiterOnly = false }: PrivateRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Save the attempted URL for redirecting after login
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Restrict access to recruiter-only routes
  if (recruiterOnly && user?.role !== 'recruiter') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}