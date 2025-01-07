export interface JobApplication {
  id: string;
  jobId: string;
  candidateId: string;
  status: 'Pending' | 'Reviewing' | 'Scheduled' | 'Rejected' | 'Accepted';
  appliedAt: string;
  coverLetter: string;
  resumeUrl?: string;
}

export interface ApplicationFormData {
  coverLetter: string;
  resume?: File;
}