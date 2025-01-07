import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Building2, Clock, ArrowRight, Users } from 'lucide-react';
import { Application } from '../../types/application';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { formatDate } from '../../lib/date';
import { useAuth } from '../../contexts/AuthContext';

interface ApplicationCardProps {
  application: Application;
  applicantsCount?: number;
}

export function ApplicationCard({ application, applicantsCount }: ApplicationCardProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isRecruiter = user?.role === 'recruiter';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'warning';
      case 'Reviewing': return 'info';
      case 'Scheduled': return 'info';
      case 'Accepted': return 'success';
      case 'Rejected': return 'error';
      default: return 'default';
    }
  };

  const handleViewDetails = () => {
    if (isRecruiter) {
      navigate(`/jobs/${application.jobId}/details`);
    } else {
      navigate(`/applications/${application.id}/details`);
    }
  };

  return (
    <Card variant="hover" className="transition-all hover:border-blue-500/50">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold">{application.job.title}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Building2 className="h-4 w-4" />
              <span>{application.job.company}</span>
            </div>
          </div>
          <Badge variant={getStatusColor(application.status)}>
            {application.status}
          </Badge>
        </div>

        <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>Applied on {formatDate(application.appliedAt)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{application.job.type}</span>
          </div>
          {isRecruiter && applicantsCount !== undefined && (
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{applicantsCount} Applicants</span>
            </div>
          )}
        </div>

        <div className="mt-4">
          <Button
            variant="outline"
            onClick={handleViewDetails}
            className="group w-full gap-2"
          >
            {isRecruiter ? 'View All Applications' : 'View Details'}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </Card>
  );
}