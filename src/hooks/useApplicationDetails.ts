import { useState, useEffect } from 'react';
import { Application } from '../types/application';
import api from '../lib/api';

export function useApplicationDetails(applicationId: string | undefined) {
  const [application, setApplication] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!applicationId) return;

    const fetchApplication = async () => {
      try {
        // Mock data for development
        const mockApplication: Application = {
          id: applicationId,
          jobId: '1',
          candidateId: '1',
          status: 'Accepted',
          appliedAt: new Date().toISOString(),
          coverLetter: 'I am excited about this opportunity...',
          resumeUrl: 'https://example.com/resume.pdf',
          job: {
            id: '1',
            title: 'Senior Software Engineer',
            company: 'TechCorp',
            location: 'Remote',
            type: 'Full-time',
            description: 'We are looking for an experienced software engineer...',
          },
          feedback: {
            id: '1',
            rating: 4,
            technicalScore: 4,
            communicationScore: 5,
            culturalFitScore: 4,
            comments: 'Great candidate with strong technical skills...',
            strengths: ['Technical expertise', 'Communication'],
            areasForImprovement: ['System design'],
            recommendation: 'Strong Yes',
          },
        };

        setApplication(mockApplication);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch application:', err);
        setError('Failed to load application details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplication();
  }, [applicationId]);

  return {
    application,
    isLoading,
    error,
  };
}