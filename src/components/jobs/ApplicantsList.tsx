import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, MapPin, Briefcase, Star } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { formatDate } from '../../lib/date';

interface Applicant {
  id: string;
  name: string;
  email: string;
  location: string;
  currentJobTitle: string;
  appliedAt: string;
  matchScore: number;
  status: string;
}

interface ApplicantsListProps {
  applicants: Applicant[];
  jobId: string;
}

export function ApplicantsList({ applicants, jobId }: ApplicantsListProps) {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Reviewing': return 'bg-blue-100 text-blue-800';
      case 'Scheduled': return 'bg-purple-100 text-purple-800';
      case 'Accepted': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <Card.Header>
        <Card.Title>Applicants ({applicants.length})</Card.Title>
      </Card.Header>
      <Card.Content>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {applicants.map((applicant) => (
            <div key={applicant.id} className="flex items-center justify-between py-4">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-gray-200 p-2 dark:bg-gray-700">
                  <User className="h-full w-full text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <h3 className="font-medium">{applicant.name}</h3>
                  <div className="mt-1 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4" />
                      <span>{applicant.currentJobTitle}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{applicant.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>{applicant.matchScore}% Match</span>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Applied {formatDate(applicant.appliedAt)}
                  </span>
                </div>
                <span className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(applicant.status)}`}>
                  {applicant.status}
                </span>
                <Button
                  variant="outline"
                  onClick={() => navigate(`/applications/${applicant.id}/feedback`)}
                >
                  Review
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card.Content>
    </Card>
  );
}