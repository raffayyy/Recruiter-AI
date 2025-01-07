import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreVertical, Calendar } from 'lucide-react';
import { Application } from '../../types/application';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { formatDate } from '../../lib/date';

interface ApplicationRowProps {
  application: Application;
}

export function ApplicationRow({ application }: ApplicationRowProps) {
  const navigate = useNavigate();

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

  const handleReview = () => {
    navigate(`/applications/${application.id}/feedback`);
  };

  return (
    <tr className="group hover:bg-gray-50 dark:hover:bg-gray-800/50">
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700" />
          <div>
            <div className="font-medium">{application.candidate?.name || 'Candidate'}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {application.candidate?.email || 'No email provided'}
            </div>
          </div>
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="font-medium">{application.job?.title || 'Position'}</div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {application.job?.company || 'Company'}
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
          <Calendar className="h-4 w-4" />
          {formatDate(application.appliedAt)}
        </div>
      </td>
      <td className="px-4 py-4">
        <Badge variant={getStatusColor(application.status)}>
          {application.status}
        </Badge>
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="h-2 w-24 rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className="h-2 rounded-full bg-blue-500"
              style={{ width: `${application.match || 0}%` }}
            />
          </div>
          <span className="text-sm font-medium">{application.match || 0}%</span>
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReview}
          >
            Review
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
}