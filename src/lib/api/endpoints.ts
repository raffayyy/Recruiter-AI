export const API_ENDPOINTS = {
  // Auth
  LOGIN: "/auth/login",
  REGISTER_CANDIDATE: "/auth/candidate/signup",
  REGISTER_RECRUITER: "/auth/recruiter/signup",
  PROFILE: "/auth/profile",
  UPLOAD_RESUME: "/auth/upload-resume",

  //JOBS
  CREATE_JOB: "recruiter/jobs",
  GET_JOBS: "recruiter/jobs",
  // Jobs
  JOBS: "/jobs",
  JOB: (id: string) => `/jobs/${id}`,

  // Applications
  APPLICATIONS: "/applications",
  APPLICATION: (id: string) => `/applications/${id}`,

  // Candidates
  CANDIDATES: "/candidates",
  CANDIDATE: (id: string) => `/candidates/${id}`,
} as const;
