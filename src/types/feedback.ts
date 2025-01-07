export interface Feedback {
  id: string;
  applicationId: string;
  interviewerId: string;
  candidateId: string;
  rating: number;
  technicalScore: number;
  communicationScore: number;
  culturalFitScore: number;
  comments: string;
  strengths: string[];
  areasForImprovement: string[];
  recommendation: 'Strong Yes' | 'Yes' | 'Maybe' | 'No';
  createdAt: string;
}

export interface FeedbackFormData {
  rating: number;
  technicalScore: number;
  communicationScore: number;
  culturalFitScore: number;
  comments: string;
  strengths: string[];
  areasForImprovement: string[];
  recommendation: 'Strong Yes' | 'Yes' | 'Maybe' | 'No';
}