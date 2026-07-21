import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Building2, Clock, Users, Video, FileText } from "lucide-react";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { formatDate } from "../../lib/date";
import { useAuth } from "../../contexts/AuthContext";
import { formatText } from "../../utils/formatText";
import { InterviewResultModal } from "../interview/InterviewResultModal";

// Define a more specific type for application based on the existing properties
interface ApplicationData {
  application_id?: string | number;
  jobId?: string;
  job_title: string;
  company_name: string;
  status: string;
  applied_at: string;
  job_type: string;
  interview_scheduled?: boolean;
  interview_link?: string | null;
}

interface ApplicationCardProps {
  application: ApplicationData;
  applicantsCount?: number;
}

export function ApplicationCard({
  application,
  applicantsCount,
}: ApplicationCardProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isRecruiter = user?.role === "recruiter";
  const [showResult, setShowResult] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "warning";
      case "Reviewed":
        return "info";
      case "Interview Scheduled":
        return "info";
      case "Interview Completed":
        return "info";
      case "Accepted":
        return "success";
      case "Rejected":
        return "error";
      default:
        return "default";
    }
  };

  const applicationId = String(application?.application_id ?? "");
  const canJoin = !isRecruiter && application?.status === "Interview Scheduled";
  const canViewResult =
    !isRecruiter && application?.status === "Interview Completed";

  return (
    <Card variant="hover" className="transition-all hover:border-blue-500/50">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold">{application?.job_title}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Building2 className="h-4 w-4" />
              <span>{application?.company_name}</span>
            </div>
          </div>
          <Badge variant={getStatusColor(application?.status)}>
            {application?.status}
          </Badge>
        </div>

        <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>Applied on {formatDate(application?.applied_at)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{formatText(application?.job_type)}</span>
          </div>
          {isRecruiter && applicantsCount !== undefined && (
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{applicantsCount} Applicants</span>
            </div>
          )}
        </div>

        {(canJoin || canViewResult) && (
          <div className="mt-4 flex flex-wrap gap-3">
            {canJoin && (
              <Button
                variant="primary"
                onClick={() => navigate(`/interview/${applicationId}`)}
                className="gap-2"
              >
                <Video className="h-4 w-4" />
                Join Interview
              </Button>
            )}
            {canViewResult && (
              <Button
                variant="outline"
                onClick={() => setShowResult(true)}
                className="gap-2"
              >
                <FileText className="h-4 w-4" />
                View Result
              </Button>
            )}
          </div>
        )}
      </div>

      {canViewResult && (
        <InterviewResultModal
          applicationId={applicationId}
          open={showResult}
          onClose={() => setShowResult(false)}
        />
      )}
    </Card>
  );
}
