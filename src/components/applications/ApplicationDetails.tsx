import React from 'react';
import { Building2, MapPin, Calendar, Clock, FileText } from 'lucide-react';
import { Card } from '../ui/Card';
import { Application } from '../../types/application';
import { formatDate } from '../../lib/date';
import { FeedbackSummary } from '../feedback/FeedbackSummary';

interface ApplicationDetailsProps {
  application: Application;
}

export function ApplicationDetails({ application }: ApplicationDetailsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Reviewing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Scheduled': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'Accepted': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{application.job.title}</h1>
          <p className="text-gray-600 dark:text-gray-400">{application.job.company}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(application.status)}`}>
          {application.status}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <Card.Header>
            <Card.Title>Application Details</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-gray-500" />
                  <span>{application.job.company}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{application.job.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>Applied on {formatDate(application.appliedAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>{application.job.type}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Job Description</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {application.job.description}
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Your Cover Letter</h3>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                  <p className="whitespace-pre-wrap text-gray-600 dark:text-gray-400">
                    {application.coverLetter}
                  </p>
                </div>
              </div>

              {application.resumeUrl && (
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <a
                    href={application.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline dark:text-blue-400"
                  >
                    View Resume
                  </a>
                </div>
              )}
            </div>
          </Card.Content>
        </Card>

        <div className="space-y-6">
          {['Accepted', 'Rejected'].includes(application.status) && application.feedback && (
            <FeedbackSummary feedback={application.feedback} />
          )}

          {application.status === 'Scheduled' && application.interview && (
            <Card>
              <Card.Header>
                <Card.Title>Interview Details</Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>{formatDate(application.interview.scheduledAt)}</span>
                  </div>
                  <a
                    href={application.interview.meetingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full rounded-lg bg-blue-600 px-4 py-2 text-center text-white hover:bg-blue-700"
                  >
                    Join Interview
                  </a>
                </div>
              </Card.Content>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}