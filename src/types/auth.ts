export interface User {
  id: string;
  email: string;
  full_name: string;
  role: "candidate" | "recruiter";
  skills?: string[];
  yearsOfExperience?: number;
  company?: string;
  createdAt: string;
  resume: File;
  resumeUrl: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}
