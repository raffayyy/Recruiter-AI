import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Briefcase, Star, Check, X } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { formatDate } from '../../utils/formatDate';
import { formatText } from '../../utils/formatText';
import { useAuth } from '../../contexts/AuthContext';
import { reviewApplication } from '../../services/api/recruiter_endpoints';

interface Applicant {
  application_id: number;
  applied_at: string;
  candidate_name: string;
  current_job_title: string;
  status: string;
  suitability_score: number;
}


interface ApplicantsListProps {
  applicants: Applicant[];
  onApplicantUpdated?: () => void;
}

export function ApplicantsList({ applicants, onApplicantUpdated }: ApplicantsListProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isRecruiter = user?.role === 'recruiter';
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Reviewed': return 'bg-blue-100 text-blue-800';
      case 'Interview Scheduled': return 'bg-purple-100 text-purple-800';
      case 'Interview Completed': return 'bg-indigo-100 text-indigo-800';
      case 'Accepted': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleReview = async (
    applicationId: number,
    decision: 'approved' | 'rejected'
  ) => {
    setError(null);
    setPendingId(applicationId);
    try {
      await reviewApplication(applicationId, decision);
      onApplicantUpdated?.();
    } catch (err) {
      console.error('Failed to review application:', err);
      setError('Failed to update the application. Please try again.');
    } finally {
      setPendingId(null);
    }
  };

  return (
    <Card>
      <Card.Header>
        <Card.Title>Applicants ({applicants.length})</Card.Title>
      </Card.Header>
      <Card.Content>
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-900/30 dark:text-red-400">
            {error}
          </div>
        )}
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {applicants.map((applicant) => (
            <div key={applicant.application_id} className="flex flex-wrap items-center justify-between gap-4 py-4">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-gray-200 p-2 dark:bg-gray-700">
                  <User className="h-full w-full text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <h3 className="font-medium">{applicant.candidate_name}</h3>
                  <div className="mt-1 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4" />
                      <span>{formatText(applicant.current_job_title)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>{applicant.suitability_score}% Match</span>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Applied {formatDate(applicant.applied_at)}
                  </span>
                </div>
                <span className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(applicant.status)}`}>
                  {applicant.status}
                </span>

                {isRecruiter && applicant.status === 'Pending' && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      disabled={pendingId === applicant.application_id}
                      onClick={() => handleReview(applicant.application_id, 'approved')}
                      className="gap-1 bg-green-600 hover:bg-green-700"
                    >
                      <Check className="h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      disabled={pendingId === applicant.application_id}
                      onClick={() => handleReview(applicant.application_id, 'rejected')}
                      className="gap-1"
                    >
                      <X className="h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                )}

                {isRecruiter && applicant.status === 'Interview Completed' && (
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/applications/${applicant.application_id}/feedback`)}
                  >
                    Review
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card.Content>
    </Card>
  );
}
