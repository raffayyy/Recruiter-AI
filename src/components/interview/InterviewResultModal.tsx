import { useEffect, useState } from "react";
import { X, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Button } from "../ui/Button";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { getApplicationResult } from "../../services/api/candidate_endpoints";

interface ApplicationResult {
  application_id: number;
  job_title: string;
  company_name: string;
  status: string;
  final_result: string; // "Pending" | "Accepted" | "Rejected"
  feedback?: string | null;
}

interface InterviewResultModalProps {
  applicationId: string;
  open: boolean;
  onClose: () => void;
}

export function InterviewResultModal({
  applicationId,
  open,
  onClose,
}: InterviewResultModalProps) {
  const [result, setResult] = useState<ApplicationResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    let active = true;
    setIsLoading(true);
    setError(null);
    getApplicationResult(applicationId)
      .then((data) => {
        if (active) setResult(data);
      })
      .catch(() => {
        if (active) setError("Failed to load your result. Please try again.");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [open, applicationId]);

  if (!open) return null;

  const decided = result?.final_result === "Accepted" || result?.final_result === "Rejected";
  const accepted = result?.final_result === "Accepted";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Interview Result
          </h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4">
          {isLoading ? (
            <div className="py-8">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-900/30 dark:text-red-400">
              {error}
            </div>
          ) : result ? (
            <div className="space-y-4">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {result.job_title}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {result.company_name}
                </p>
              </div>

              <div
                className={`flex items-center gap-3 rounded-lg p-4 ${
                  decided
                    ? accepted
                      ? "bg-green-50 dark:bg-green-900/30"
                      : "bg-red-50 dark:bg-red-900/30"
                    : "bg-blue-50 dark:bg-blue-900/30"
                }`}
              >
                {decided ? (
                  accepted ? (
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                  ) : (
                    <XCircle className="h-8 w-8 text-red-600" />
                  )
                ) : (
                  <Clock className="h-8 w-8 text-blue-600" />
                )}
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Result</p>
                  <p
                    className={`text-lg font-semibold ${
                      decided
                        ? accepted
                          ? "text-green-700 dark:text-green-400"
                          : "text-red-700 dark:text-red-400"
                        : "text-blue-700 dark:text-blue-400"
                    }`}
                  >
                    {decided
                      ? result.final_result
                      : "Awaiting recruiter decision"}
                  </p>
                </div>
              </div>

              {result.feedback && (
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Feedback
                  </p>
                  <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                    {result.feedback}
                  </p>
                </div>
              )}
            </div>
          ) : null}
        </div>

        <div className="mt-6 flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
