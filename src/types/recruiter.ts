export interface RecruiterFormData {
  email: string;
  password: string;
  full_name: string;
  company_name: string;
  job_title: string;
  industry: string;
  role: "recruiter";
  company_summary: string;
}

export interface Recruiter {
  id: string;
  email: string;
  name: string;
  company_name: string;
  job_title: string;
  industry: string;
  createdAt: string;
}
