import { ApiClient } from './client';
import { AuthAPI } from './auth';
import { JobsAPI } from './jobs';
import { ApplicationsAPI } from './applications';

class API {
  private static instance: API;
  private client: ApiClient;

  public auth: AuthAPI;
  public jobs: JobsAPI;
  public applications: ApplicationsAPI;

  private constructor() {
    this.client = new ApiClient();
    this.auth = new AuthAPI(this.client);
    this.jobs = new JobsAPI(this.client);
    this.applications = new ApplicationsAPI(this.client);
  }

  public static getInstance(): API {
    if (!API.instance) {
      API.instance = new API();
    }
    return API.instance;
  }
}

export default API.getInstance();