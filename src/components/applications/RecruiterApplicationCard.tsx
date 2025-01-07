import { useNavigate } from "react-router-dom";
import { Building2, Clock, ArrowRight } from "lucide-react";
import { Job } from "../../types/job";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { useAuth } from "../../contexts/AuthContext";

interface ApplicationCardProps {
  application: Job;
  applicantsCount?: number;
}

export function RecruiterApplicationCard({
  application,
}: ApplicationCardProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isRecruiter = user?.role === "recruiter";

  const handleViewDetails = () => {
    if (isRecruiter) {
      navigate(`/jobs/${application.job_id}/details`);
    } else {
      navigate(`/applications/${application.job_id}/details`);
    }
  };

  return (
    <Card variant="hover" className="transition-all hover:border-blue-500/50">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold">{application.title}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Building2 className="h-4 w-4" />
              <span>{application.company_name}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{application.time}</span>
          </div>
        </div>

        <div className="mt-4">
          <Button
            variant="outline"
            onClick={handleViewDetails}
            className="group w-full gap-2"
          >
            {isRecruiter ? "View All Applications" : "View Details"}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
