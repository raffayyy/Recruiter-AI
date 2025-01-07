import { useState, useEffect } from 'react';
import api from '../lib/api';

interface InterviewMinute {
  timestamp: string;
  speaker: 'candidate' | 'interviewer';
  text: string;
}

interface AIAnalysis {
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

// Mock data for development/fallback
const mockMinutes: InterviewMinute[] = [
  {
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    speaker: 'interviewer',
    text: 'Can you tell me about your experience with React?'
  },
  {
    timestamp: new Date(Date.now() - 1000 * 60 * 29).toISOString(),
    speaker: 'candidate',
    text: 'I have been working with React for 3 years, building complex web applications...'
  }
];

const mockAIFeedback: AIAnalysis = {
  sentiment: 'positive',
  confidence: 85,
  strengths: [
    'Strong technical knowledge',
    'Clear communication',
    'Relevant experience'
  ],
  weaknesses: [
    'Could provide more specific examples',
    'Limited system design discussion'
  ],
  recommendations: [
    'Focus on concrete project examples',
    'Elaborate more on problem-solving approaches'
  ]
};

export function useInterviewData(applicationId: string | undefined) {
  const [minutes, setMinutes] = useState<InterviewMinute[]>([]);
  const [aiFeedback, setAIFeedback] = useState<AIAnalysis>({
    sentiment: 'neutral',
    confidence: 0,
    strengths: [],
    weaknesses: [],
    recommendations: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!applicationId) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        // In development, use mock data
        if (process.env.NODE_ENV === 'development') {
          setMinutes(mockMinutes);
          setAIFeedback(mockAIFeedback);
          return;
        }

        const [minutesResponse, feedbackResponse] = await Promise.all([
          api.get<InterviewMinute[]>(`/api/interviews/${applicationId}/minutes`),
          api.get<AIAnalysis>(`/api/interviews/${applicationId}/ai-feedback`),
        ]);

        setMinutes(minutesResponse);
        setAIFeedback(feedbackResponse);
      } catch (err) {
        console.error('Error fetching interview data:', err);
        // Fallback to mock data in case of error
        setMinutes(mockMinutes);
        setAIFeedback(mockAIFeedback);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [applicationId]);

  return {
    minutes,
    aiFeedback,
    isLoading,
    error,
  };
}