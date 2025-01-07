export function getRecommendationColor(recommendation: string): string {
  switch (recommendation) {
    case 'Strong Yes':
      return 'bg-green-100 text-green-800';
    case 'Yes':
      return 'bg-blue-100 text-blue-800';
    case 'Maybe':
      return 'bg-yellow-100 text-yellow-800';
    case 'No':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function calculateOverallScore(feedback: {
  technicalScore: number;
  communicationScore: number;
  culturalFitScore: number;
}): number {
  return Math.round(
    (feedback.technicalScore + feedback.communicationScore + feedback.culturalFitScore) / 3
  );
}