import { ApiClient } from './client';
import { API_ENDPOINTS } from './endpoints';
import { Job } from '../../types/job';

export class JobsAPI {
  constructor(private client: ApiClient) {}

  // Recruiter endpoints
  async createJob(data: Partial<Job>): Promise<Job> {
    return this.client.post(API_ENDPOINTS.CREATE_JOB, data);
  }

  async getRecruiterJobs(): Promise<Job[]> {
    return this.client.get(API_ENDPOINTS.GET_JOBS);
  }

  // async getRecruiterJob(id: string): Promise<Job> {
  //   return this.client.get(API_ENDPOINTS.RECRUITER_JOB(id));
  // }

  // async updateJob(id: string, data: Partial<Job>): Promise<Job> {
  //   return this.client.put(API_ENDPOINTS.RECRUITER_JOB(id), data);
  // }

  // async deleteJob(id: string): Promise<void> {
  //   return this.client.delete(API_ENDPOINTS.RECRUITER_JOB(id));
  // }

  // // Candidate endpoints
  // async getCandidateJobs(): Promise<Job[]> {
  //   return this.client.get(API_ENDPOINTS.CANDIDATE_JOBS);
  // }

  // async applyForJob(jobId: string): Promise<void> {
  //   return this.client.post(API_ENDPOINTS.CANDIDATE_APPLY(jobId));
  // }
}