import { useState, useEffect } from 'react';
import { Job } from '../types/job';
import { useAuth } from '../contexts/AuthContext';
import { calculateJobMatch } from '../lib/matching';

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // Mock data for development
        const mockJobs: Job[] = [
          {
            id: '1',
            title: 'Senior Frontend Developer',
            company: 'TechCorp',
            location: 'New York, NY',
            type: 'Full-time',
            description: 'We are looking for an experienced Frontend Developer...',
            requirements: ['React', 'TypeScript', 'CSS/SCSS'],
            requiredExperience: 5,
            createdAt: new Date().toISOString(),
            deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'Open',
            recruiterId: '1'
          },
          {
            id: '2',
            title: 'Full Stack Engineer',
            company: 'StartupCo',
            location: 'Remote',
            type: 'Full-time',
            description: 'Join our fast-growing startup...',
            requirements: ['Node.js', 'React', 'MongoDB'],
            requiredExperience: 3,
            createdAt: new Date().toISOString(),
            deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'Open',
            recruiterId: '2'
          }
        ];

        // Calculate match scores if user is a candidate
        const jobsWithScores = mockJobs.map(job => ({
          ...job,
          matchScore: user?.role === 'candidate' ? calculateJobMatch(
            job,
            {
              skills: user.skills || [],
              experience: user.yearsOfExperience || 0,
              preferredLocations: [],
              preferredTypes: [],
            }
          ).score : 0
        }));

        setJobs(jobsWithScores);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch jobs:', err);
        setError('Failed to load jobs. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [user]);

  return {
    jobs,
    isLoading,
    error
  };
}