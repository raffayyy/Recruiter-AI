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
  GET_SPECIFIED_JOB_DETAILS: (id: string)=>`recruiter/applications/${id}`,
  GET_JOB_DETAILS: (id: string)=>`recruiter/jobs/${id}`,
  UPDATE_PARTICULAR_JOB: (id: string)=>`recruiter/jobs/${id}`,
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
