import React from 'react';
import { Star } from 'lucide-react';
import { Feedback } from '../../types/feedback';
import { formatDate } from '../../lib/date';

interface FeedbackSummaryProps {
  feedback: Feedback;
}

export function FeedbackSummary({ feedback }: FeedbackSummaryProps) {
  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'Strong Yes': return 'bg-green-100 text-green-800';
      case 'Yes': return 'bg-blue-100 text-blue-800';
      case 'Maybe': return 'bg-yellow-100 text-yellow-800';
      case 'No': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
          <span className="text-lg font-medium">{feedback.rating}/5</span>
        </div>
        <span className={`rounded-full px-3 py-1 text-sm font-medium ${
          getRecommendationColor(feedback.recommendation)
        }`}>
          {feedback.recommendation}
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <p className="text-sm text-gray-500">Technical Skills</p>
          <p className="font-medium">{feedback.technicalScore}/5</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Communication</p>
          <p className="font-medium">{feedback.communicationScore}/5</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Cultural Fit</p>
          <p className="font-medium">{feedback.culturalFitScore}/5</p>
        </div>
      </div>

      <div>
        <h4 className="font-medium">Strengths</h4>
        <div className="mt-2 flex flex-wrap gap-2">
          {feedback.strengths.map((strength) => (
            <span
              key={strength}
              className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-800"
            >
              {strength}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-medium">Areas for Improvement</h4>
        <div className="mt-2 flex flex-wrap gap-2">
          {feedback.areasForImprovement.map((area) => (
            <span
              key={area}
              className="rounded-full bg-yellow-100 px-3 py-1 text-sm text-yellow-800"
            >
              {area}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-medium">Detailed Feedback</h4>
        <p className="mt-2 whitespace-pre-wrap text-gray-600">{feedback.comments}</p>
      </div>

      <div className="text-sm text-gray-500">
        Submitted on {formatDate(feedback.createdAt)}
      </div>
    </div>
  );
}