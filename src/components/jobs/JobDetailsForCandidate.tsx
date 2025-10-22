import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, MapPin, Clock, DollarSign, Calendar, Star, CheckCircle, Info } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { formatDate } from '../../lib/date';

interface JobDetailsProps {
  job: {
    job_id: number;
    title: string;
    company_name: string;
    location: string;
    time: string;
    short_description: string;
    long_description: string;
    requirements: string;
    max_salary: number;
    min_salary: number;
    created_at: string;
    suitability_score: number;
    recruiter_id: number;
    has_applied: boolean;
  };
}

export function JobDetailsForCandidate({ job }: JobDetailsProps) {
  const navigate = useNavigate();
  
  const formatSalary = (min: number, max: number) => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0
    });
    
    if (min && max) {
      return `${formatter.format(min)} - ${formatter.format(max)}`;
    } else if (min) {
      return `From ${formatter.format(min)}`;
    } else if (max) {
      return `Up to ${formatter.format(max)}`;
    }
    
    return 'Salary not specified';
  };

  return (
    <div className="space-y-6">
      <Card>
        <Card.Content className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold">{job.title}</h1>
                {job.has_applied && (
                  <Badge variant="success" className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Applied
                  </Badge>
                )}
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400 mb-4">
                <div className="flex items-center gap-1">
                  <Building2 className="h-4 w-4" />
                  <span>{job.company_name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{job.time}</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  <span>{formatSalary(job.min_salary, job.max_salary)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Posted on {formatDate(job.created_at)}</span>
                </div>
              </div>
              
              <p className="text-lg font-medium mb-2">{job.short_description}</p>
            </div>
            
            <div className="flex flex-col gap-4 min-w-[200px]">
              <div className="flex flex-col items-center justify-center p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <div className="flex items-center mb-2">
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 mr-1" />
                  <span className="text-2xl font-bold">{job.suitability_score}%</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">Match Score</p>
              </div>
              
              <Button 
                variant="primary"
                className="w-full"
                disabled={job.has_applied}
                onClick={() => navigate(`/jobs/${job.job_id}/apply`)}
              >
                {job.has_applied ? 'Already Applied' : 'Apply Now'}
              </Button>
            </div>
          </div>
        </Card.Content>
      </Card>
      
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <Card.Header>
            <Card.Title>Job Description</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="prose dark:prose-invert max-w-none">
              <div className="mb-6">
                <p className="whitespace-pre-line">{job.long_description}</p>
              </div>
              
              <h3 className="text-lg font-medium mb-2">Requirements</h3>
              <div className="whitespace-pre-line">{job.requirements}</div>
            </div>
          </Card.Content>
        </Card>
        
        <Card>
          <Card.Header>
            <Card.Title>Application Tips</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              <div className="flex gap-3">
                <Info className="h-5 w-5 text-blue-500 flex-shrink-0" />
                <p className="text-sm">Highlight relevant experience that matches the job requirements.</p>
              </div>
              <div className="flex gap-3">
                <Info className="h-5 w-5 text-blue-500 flex-shrink-0" />
                <p className="text-sm">Customize your resume to emphasize skills mentioned in the job description.</p>
              </div>
              <div className="flex gap-3">
                <Info className="h-5 w-5 text-blue-500 flex-shrink-0" />
                <p className="text-sm">Research the company before applying to better understand their culture and values.</p>
              </div>
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
} 