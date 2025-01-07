import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, MapPin, Briefcase, GraduationCap } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Candidate } from '../../types/candidate';

interface CandidateCardProps {
  candidate: Candidate;
}

export function CandidateCard({ candidate }: CandidateCardProps) {
  const navigate = useNavigate();

  return (
    <Card className="overflow-hidden">
      <div className="p-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-gray-100 p-2 dark:bg-gray-800">
            <User className="h-full w-full text-gray-600 dark:text-gray-400" />
          </div>
          <div>
            <h3 className="font-medium">{candidate.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{candidate.email}</p>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Briefcase className="h-4 w-4" />
            <span>{candidate.currentJobTitle}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <MapPin className="h-4 w-4" />
            <span>{candidate.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <GraduationCap className="h-4 w-4" />
            <span>{candidate.highestEducation}</span>
          </div>
        </div>

        <div className="mt-4">
          <h4 className="text-sm font-medium">Skills</h4>
          <div className="mt-2 flex flex-wrap gap-2">
            {candidate.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate(`/candidates/${candidate.id}`)}
          >
            View Profile
          </Button>
        </div>
      </div>
    </Card>
  );
}