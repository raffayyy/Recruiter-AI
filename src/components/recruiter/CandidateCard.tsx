import { useNavigate } from "react-router-dom";
import { User, MapPin, Briefcase, Calendar, BarChart } from "lucide-react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";

interface ApplicationData {
  application_id: number;
  job_title: string;
  company_name: string;
  candidate_name: string;
  candidate_email: string;
  application_status: string;
  suitability_score: number;
  applied_at: string;
}



export function CandidateCard({ candidate }: any) {
  const navigate = useNavigate();
  console.log("application", candidate);

  return (
    <Card className="overflow-hidden">
      <div className="p-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-gray-100 p-2 dark:bg-gray-800">
            <User className="h-full w-full text-gray-600 dark:text-gray-400" />
          </div>
          <div>
            <h3 className="font-medium">{candidate?.candidate_name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {candidate?.candidate_email}
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Briefcase className="h-4 w-4" />
            <span>{candidate?.job_title}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <MapPin className="h-4 w-4" />
            <span>{candidate?.company_name}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <BarChart className="h-4 w-4" />
            <span>Suitability Score: {candidate?.suitability_score}%</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Calendar className="h-4 w-4" />
            <span>Applied: {candidate?.applied_at}</span>
          </div>
        </div>

        <div className="mt-4">
          <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            {candidate?.application_status}
          </span>
        </div>

        <div className="mt-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={() =>
              navigate(`/applications/${candidate.application_id}`)
            }
          >
            View Application
          </Button>
        </div>
      </div>
    </Card>
  );
}
