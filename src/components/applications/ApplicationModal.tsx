import React from 'react';
import { X } from 'lucide-react';
import { Job } from '../../types/job';
import { ApplicationForm } from './ApplicationForm';
import { ApplicationFormData } from '../../types/application';

interface ApplicationModalProps {
  job: Job;
  onClose: () => void;
  onSubmit: (data: ApplicationFormData) => Promise<void>;
  isSubmitting?: boolean;
}

export function ApplicationModal({ job, onClose, onSubmit, isSubmitting }: ApplicationModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Apply for {job.title}</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            {job.company} • {job.location}
          </p>
        </div>

        <ApplicationForm onSubmit={onSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
}