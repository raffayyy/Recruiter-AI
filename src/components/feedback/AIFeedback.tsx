import React from 'react';
import { Brain, ThumbsUp, ThumbsDown, AlertTriangle } from 'lucide-react';

interface AIFeedbackProps {
  analysis: {
    sentiment: 'positive' | 'negative' | 'neutral';
    confidence: number;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  };
}

export function AIFeedback({ analysis }: AIFeedbackProps) {
  const getSentimentIcon = () => {
    switch (analysis.sentiment) {
      case 'positive': return <ThumbsUp className="h-5 w-5 text-green-500" />;
      case 'negative': return <ThumbsDown className="h-5 w-5 text-red-500" />;
      default: return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    }
  };

  return (
    <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center gap-2">
        <Brain className="h-5 w-5 text-blue-500" />
        <h3 className="font-medium">AI Analysis</h3>
      </div>

      <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
        <div className="flex items-center gap-2">
          {getSentimentIcon()}
          <span className="font-medium capitalize">{analysis.sentiment} Response</span>
        </div>
        <span className="text-sm text-gray-500">
          {analysis.confidence}% Confidence
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="mb-2 font-medium text-green-600 dark:text-green-400">Strengths</h4>
          <ul className="list-inside list-disc space-y-1">
            {analysis.strengths.map((strength, index) => (
              <li key={index} className="text-sm">{strength}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-2 font-medium text-red-600 dark:text-red-400">Areas for Improvement</h4>
          <ul className="list-inside list-disc space-y-1">
            {analysis.weaknesses.map((weakness, index) => (
              <li key={index} className="text-sm">{weakness}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-2 font-medium text-blue-600 dark:text-blue-400">Recommendations</h4>
          <ul className="list-inside list-disc space-y-1">
            {analysis.recommendations.map((rec, index) => (
              <li key={index} className="text-sm">{rec}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}