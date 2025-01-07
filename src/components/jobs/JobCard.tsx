import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, MapPin, Clock, Calendar, Percent } from 'lucide-react';
import { Button } from '../ui/Button';
import { Job } from '../../types/job';
import { formatDate } from '../../lib/date';
import { useAuth } from '../../contexts/AuthContext';

interface JobCardProps {
  job: Job & { matchScore?: number };
  onApply?: (jobId: string) => void;
  onEdit?: (jobId: string) => void;
  isSubmitting?: boolean;
}

export function JobCard({
  job,
  onApply,
  onEdit,
  isSubmitting,
}: JobCardProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isRecruiter = user?.role === 'recruiter';

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200';
    if (score >= 50) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200';
    return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200';
  };

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-sm transition-all hover:shadow-md dark:bg-gray-800 dark:border dark:border-gray-700">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">{job.title}</h3>
          {!isRecruiter && (
            <div className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${getMatchScoreColor(job.matchScore || 0)}`}>
              <Percent className="h-3.5 w-3.5" />
              <span>{job.matchScore || 0}% Match</span>
            </div>
          )}
        </div>

        <div className="mt-2 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Building2 className="h-4 w-4" />
            <span>{job.company}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <MapPin className="h-4 w-4" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Clock className="h-4 w-4" />
            <span>{job.type}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Calendar className="h-4 w-4" />
            <span>Posted {formatDate(job.createdAt)}</span>
          </div>
        </div>

        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          {job.description.length > 150 
            ? `${job.description.slice(0, 150)}...` 
            : job.description}
        </p>

        <div className="mt-4">
          {isRecruiter ? (
            <Button
              variant="outline"
              onClick={() => onEdit?.(job.id)}
              className="w-full"
            >
              Edit Job
            </Button>
          ) : (
            <Button
              onClick={() => onApply?.(job.id)}
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Applying...' : 'Apply Now'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}