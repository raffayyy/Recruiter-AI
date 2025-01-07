import React from 'react';
import { User, MapPin, Briefcase, GraduationCap, Mail, Phone, Calendar } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Candidate } from '../../types/candidate';
import { formatDate } from '../../lib/date';

interface CandidateProfileProps {
  candidate: Candidate;
}

export function CandidateProfile({ candidate }: CandidateProfileProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{candidate.name}</h1>
          <p className="text-gray-600 dark:text-gray-400">{candidate.currentJobTitle}</p>
        </div>
        <Button>Schedule Interview</Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <Card.Header>
            <Card.Title>Profile Information</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span>{candidate.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span>{candidate.phone || 'Not provided'}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>{candidate.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>Joined {formatDate(candidate.createdAt)}</span>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-medium">About</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {candidate.bio || 'No bio provided'}
              </p>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title>Experience & Education</Card.Title>
          </Card.Header>
          <Card.Content className="space-y-6">
            <div>
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-gray-500" />
                <h3 className="font-medium">Experience</h3>
              </div>
              <p className="mt-1 text-gray-600 dark:text-gray-400">
                {candidate.yearsOfExperience} years
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-gray-500" />
                <h3 className="font-medium">Education</h3>
              </div>
              <p className="mt-1 text-gray-600 dark:text-gray-400">
                {candidate.highestEducation}
              </p>
            </div>

            <div>
              <h3 className="font-medium">Skills</h3>
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
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}