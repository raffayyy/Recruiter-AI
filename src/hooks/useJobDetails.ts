import { useState, useEffect } from 'react';
import { Job } from '../types/job';
import api from '../lib/api';

interface Applicant {
  id: string;
  name: string;
  email: string;
  location: string;
  currentJobTitle: string;
  appliedAt: string;
  matchScore: number;
  status: string;
}

export function useJobDetails(jobId: string | undefined) {
  const [job, setJob] = useState<Job | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!jobId) return;

    const fetchJobDetails = async () => {
      try {
        // Mock data for development
        const mockJob: Job = {
          id: jobId,
          title: 'Senior Frontend Developer',
          company: 'TechCorp',
          location: 'New York, NY',
          type: 'Full-time',
          description: 'We are looking for an experienced Frontend Developer to join our team...',
          requirements: [
            'React',
            'TypeScript',
            'CSS/SCSS',
            '5+ years of experience'
          ],
          requiredExperience: 5,
          salary: {
            min: 120000,
            max: 180000,
            currency: 'USD'
          },
          createdAt: new Date().toISOString(),
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'Open',
          recruiterId: '1'
        };

        const mockApplicants: Applicant[] = [
          {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            location: 'New York, NY',
            currentJobTitle: 'Frontend Developer',
            appliedAt: new Date().toISOString(),
            matchScore: 85,
            status: 'Reviewing'
          },
          {
            id: '2',
            name: 'Jane Smith',
            email: 'jane@example.com',
            location: 'San Francisco, CA',
            currentJobTitle: 'Senior Developer',
            appliedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            matchScore: 92,
            status: 'Scheduled'
          }
        ];

        setJob(mockJob);
        setApplicants(mockApplicants);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch job details:', err);
        setError('Failed to load job details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  return {
    job,
    applicants,
    isLoading,
    error,
  };
}