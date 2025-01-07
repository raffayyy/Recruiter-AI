import React from 'react';
import { CandidateCard } from './CandidateCard';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { Candidate } from '../../types/candidate';

interface CandidatesListProps {
  candidates: Candidate[];
  isLoading: boolean;
  error: string | null;
}

export function CandidatesList({ candidates, isLoading, error }: CandidatesListProps) {
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-500/20 dark:bg-red-900/30 dark:text-red-400">
        {error}
      </div>
    );
  }

  if (candidates.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 text-center dark:border-gray-700 dark:bg-gray-800">
        <p className="text-gray-600 dark:text-gray-400">No candidates found</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {candidates.map((candidate) => (
        <CandidateCard key={candidate.id} candidate={candidate} />
      ))}
    </div>
  );
}