import React, { useState } from "react";
import { Building2, MapPin, Clock, Calendar, Percent } from "lucide-react";
import { Button } from "../ui/Button";
import { formatDate } from "../../lib/date";
import { useAuth } from "../../contexts/AuthContext";
import { formatText } from "../../utils/formatText";
import { useNavigate } from "react-router-dom";

interface JobCardProps {
  job: {
    job_id?: string;
    title: string;
    company_name: string;
    location: string;
    time: string;
    created_at?: string;
    suitability_score?: number;
    short_description: string;
    has_applied?: boolean;
  };
  onApply?: (jobId: string) => void;
  onEdit?: (jobId: string) => void;
}

export function JobCard({ job, onApply, onEdit }: JobCardProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isRecruiter = user?.role === "recruiter";
  const [currentJob, setCurrentJob] = useState(job);

  const getMatchScoreColor = (score: number) => {
    if (score >= 80)
      return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200";
    if (score >= 50)
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200";
    return "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200";
  };

  const handleCardClick = () => {
    if (!isRecruiter && currentJob.job_id) {
      navigate(`/jobs/${currentJob.job_id}/view`);
    }
  };

  return (
    <div 
      className={`overflow-hidden rounded-lg bg-white shadow-sm transition-all hover:shadow-md dark:bg-gray-800 dark:border dark:border-gray-700 ${!isRecruiter ? 'cursor-pointer' : ''}`}
      onClick={handleCardClick}
    >
      <div className="p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {currentJob.title}
          </h3>
          {!isRecruiter && (
            <div
              className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${getMatchScoreColor(
                currentJob.suitability_score || 0
              )}`}
            >
              <Percent className="h-3.5 w-3.5" />
              <span>{currentJob.suitability_score || 0}% Match</span>
            </div>
          )}
        </div>

        <div className="mt-2 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Building2 className="h-4 w-4" />
            <span>{currentJob.company_name}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <MapPin className="h-4 w-4" />
            <span>{formatText(currentJob.location)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Clock className="h-4 w-4" />
            <span>{formatText(currentJob.time)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Calendar className="h-4 w-4" />
            <span>Posted {formatDate(currentJob.created_at || "")}</span>
          </div>
        </div>

        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          {currentJob.short_description.length > 150
            ? `${currentJob.short_description.slice(0, 150)}...`
            : currentJob.short_description}
        </p>

        <div className="mt-4" onClick={(e) => e.stopPropagation()}>
          {isRecruiter ? (
            <Button
              variant="outline"
              onClick={() => onEdit?.(String(currentJob.job_id || ""))}
              className="w-full"
            >
              Edit Job
            </Button>
          ) : (
            <Button
              onClick={() => {
                onApply?.(String(currentJob.job_id || ""));
                setCurrentJob({ ...currentJob, has_applied: true });
              }}
              className="w-full"
              disabled={
                (currentJob.suitability_score ?? 0) < 50 ||
                currentJob.has_applied
              }
            >
              {currentJob.has_applied ? "Applied" : "Apply Now"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}