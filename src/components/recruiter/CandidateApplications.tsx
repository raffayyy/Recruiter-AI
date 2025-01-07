import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Application } from '../../types/application';
import { formatDate } from '../../lib/date';

interface CandidateApplicationsProps {
  applications: Application[];
}

export function CandidateApplications({ applications }: CandidateApplicationsProps) {
  const navigate = useNavigate();

  return (
    <Card>
      <Card.Header>
        <Card.Title>Applications History</Card.Title>
        <Card.Description>
          View all applications submitted by this candidate
        </Card.Description>
      </Card.Header>
      <Card.Content>
        {applications.length === 0 ? (
          <p className="text-center text-gray-500">No applications found</p>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {applications.map((application) => (
              <div
                key={application.id}
                className="flex items-center justify-between py-4"
              >
                <div>
                  <h4 className="font-medium">{application.job.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Applied on {formatDate(application.appliedAt)}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                    application.status === 'Accepted'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : application.status === 'Rejected'
                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}>
                    {application.status}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/applications/${application.id}/feedback`)}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card.Content>
    </Card>
  );
}