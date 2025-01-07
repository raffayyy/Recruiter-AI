import { ApiClient } from './client';
import { API_ENDPOINTS } from './endpoints';
import { Application } from '../../types/application';

export interface ReviewDecision {
  decision: 'approved' | 'rejected';
}

export class ApplicationsAPI {
  constructor(private client: ApiClient) {}

  async getRecruiterApplications(): Promise<Application[]> {
    return this.client.get(API_ENDPOINTS.RECRUITER_APPLICATIONS);
  }

  async getRecruiterApplication(id: string): Promise<Application> {
    return this.client.get(API_ENDPOINTS.RECRUITER_APPLICATION(id));
  }

  async reviewApplication(id: string, decision: ReviewDecision): Promise<void> {
    return this.client.post(API_ENDPOINTS.REVIEW_APPLICATION(id), decision);
  }
}