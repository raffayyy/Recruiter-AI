import React from 'react';
import { useParams } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { ApplicationDetails } from '../../components/applications/ApplicationDetails';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useApplicationDetails } from '../../hooks/useApplicationDetails';

export default function ApplicationDetailsPage() {
  const { applicationId } = useParams<{ applicationId: string }>();
  const { application, isLoading, error } = useApplicationDetails(applicationId);

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingSpinner />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      </DashboardLayout>
    );
  }

  if (!application) {
    return (
      <DashboardLayout>
        <div className="text-center">Application not found</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <ApplicationDetails application={application} />
    </DashboardLayout>
  );
}