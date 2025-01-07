import { LoadingSpinner } from '../common/LoadingSpinner';
import { Job } from '../../types/job';
import { RecruiterApplicationCard } from './RecruiterApplicationCard';

interface ApplicationsListProps {
  applications: Job[];
  isLoading: boolean;
  error: string | null;
}

export function RecruiterApplicationsList({ applications, isLoading, error }: ApplicationsListProps) {
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

  if (applications.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 text-center dark:border-gray-700 dark:bg-gray-800">
        <p className="text-gray-600 dark:text-gray-400">No applications found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {applications.map((application) => (
        <RecruiterApplicationCard key={application.job_id} application={application} />
      ))}
    </div>
  );
}