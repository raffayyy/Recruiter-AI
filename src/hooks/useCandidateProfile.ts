import { useState, useEffect } from 'react';
import { Candidate } from '../types/candidate';
import {  JobApplication as Application } from '../types/application';
import api from '../lib/api';

export function useCandidateProfile(candidateId: string | undefined) {
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!candidateId) return;

    const fetchData = async () => {
      try {
        // Mock data for development
        const mockCandidate: Candidate = {
          id: candidateId,
          fullName: 'John Doe',
          email: 'john@example.com',
          currentJobTitle: 'Senior Software Engineer',
          highestEducation: 'Master\'s',
          yearsOfExperience: 5,
          skills: ['React', 'TypeScript', 'Node.js'],
          briefIntro: 'Experienced software engineer with a passion for building scalable applications.',
          createdAt: '2024-01-01T00:00:00.000Z',
        };

        const mockApplications: Application[] = [
          {
            id: '1',
            jobId: '1',
            candidateId,
            status: 'Accepted',
            appliedAt: '2024-01-15T00:00:00.000Z',
            job: {
              id: '1',
              title: 'Senior Frontend Developer',
              company: 'TechCorp',
            },
          },
          {
            id: '2',
            jobId: '2',
            candidateId,
            status: 'Pending',
            appliedAt: '2024-02-01T00:00:00.000Z',
            job: {
              id: '2',
              title: 'Full Stack Engineer',
              company: 'StartupCo',
            },
          },
        ];

        setCandidate(mockCandidate);
        setApplications(mockApplications);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch candidate profile:', err);
        setError('Failed to load candidate profile. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [candidateId]);

  return {
    candidate,
    applications,
    isLoading,
    error,
  };
}