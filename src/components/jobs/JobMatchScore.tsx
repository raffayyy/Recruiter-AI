import React from 'react';
import { Percent, CheckCircle, XCircle, Lightbulb } from 'lucide-react';

interface JobMatchScoreProps {
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  recommendations: string[];
}

export function JobMatchScore({
  score,
  matchedSkills,
  missingSkills,
  recommendations,
}: JobMatchScoreProps) {
  const getScoreColor = (value: number) => {
    if (value >= 80) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    if (value >= 60) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
  };

  return (
    <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Match Score</h3>
        <span className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-sm font-medium ${getScoreColor(score)}`}>
          <Percent className="h-3.5 w-3.5" />
          {score}% Match
        </span>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Matched Skills
            </span>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {matchedSkills.map(skill => (
              <span
                key={skill}
                className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {missingSkills.length > 0 && (
          <div>
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Missing Skills
              </span>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {missingSkills.map(skill => (
                <span
                  key={skill}
                  className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {recommendations.length > 0 && (
          <div>
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Recommendations
              </span>
            </div>
            <ul className="mt-2 space-y-1">
              {recommendations.map((rec, index) => (
                <li key={index} className="text-sm text-gray-600 dark:text-gray-400">
                  • {rec}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}