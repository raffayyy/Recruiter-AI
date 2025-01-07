import React from 'react';
import { useParams } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { CandidateProfile } from '../../components/recruiter/CandidateProfile';
import { CandidateApplications } from '../../components/recruiter/CandidateApplications';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useCandidateProfile } from '../../hooks/useCandidateProfile';

export default function CandidateProfilePage() {
  const { candidateId } = useParams<{ candidateId: string }>();
  const { candidate, applications, isLoading, error } = useCandidateProfile(candidateId);

  if (isLoading) return <LoadingSpinner />;

  if (error) {
    return (
      <DashboardLayout>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      </DashboardLayout>
    );
  }

  if (!candidate) {
    return (
      <DashboardLayout>
        <div className="text-center">Candidate not found</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <CandidateProfile candidate={candidate} />
        <CandidateApplications applications={applications} />
      </div>
    </DashboardLayout>
  );
}