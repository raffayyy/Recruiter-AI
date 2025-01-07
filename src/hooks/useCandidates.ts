import { useState, useEffect } from 'react';
import { Candidate } from '../types/candidate';
import api from '../lib/api';

interface CandidateFilters {
  searchTerm?: string;
  skills?: string[];
  experience?: number;
  education?: string;
}

export function useCandidates() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<CandidateFilters>({});

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        // Mock data for development
        const mockCandidates: Candidate[] = [
          {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            currentJobTitle: 'Senior Software Engineer',
            location: 'New York, NY',
            highestEducation: 'Master\'s',
            yearsOfExperience: 5,
            skills: ['React', 'TypeScript', 'Node.js'],
          },
          {
            id: '2',
            name: 'Jane Smith',
            email: 'jane@example.com',
            currentJobTitle: 'Product Manager',
            location: 'San Francisco, CA',
            highestEducation: 'Bachelor\'s',
            yearsOfExperience: 3,
            skills: ['Product Strategy', 'Agile', 'User Research'],
          },
        ];

        setCandidates(mockCandidates);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch candidates:', err);
        setError('Failed to load candidates. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCandidates();
  }, [filters]);

  return {
    candidates,
    isLoading,
    error,
    filters,
    setFilters,
  };
}