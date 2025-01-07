import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, MapPin, Clock, Calendar, Users, DollarSign } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Job } from '../../types/job';
import { formatDate } from '../../lib/date';

interface JobDetailsProps {
  job: Job;
  applicantsCount: number;
}

export function JobDetails({ job, applicantsCount }: JobDetailsProps) {
  const navigate = useNavigate();

  return (
    <Card>
      <Card.Content className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{job.title}</h1>
            <div className="mt-2 flex items-center gap-4 text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Building2 className="h-4 w-4" />
                <span>{job.company}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{job.type}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              <Users className="h-4 w-4" />
              <span>{applicantsCount} Applicants</span>
            </div>
            <Button 
              variant="outline"
              onClick={() => navigate(`/jobs/${job.id}/edit`)}
            >
              Edit Job
            </Button>
          </div>
        </div>

        {/* Rest of the component remains the same */}
      </Card.Content>
    </Card>
  );
}