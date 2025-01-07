// src/types/candidate.ts
export interface CandidateFormData {
  email: string;
  password: string;
  full_name: string;
  current_job_title: string;
  years_of_experience: number;
  highest_education: "high_school" | "bachelors" | "masters" | "phd";
  skills: string[];
  brief_intro: string;
  role: "candidate";
}

export interface Candidate {
  id: string;
  email: string;
  fullName: string;
  currentJobTitle: string;
  yearsOfExperience: number;
  highestEducation: string;
  skills: string[];
  briefIntro: string;
  resumeUrl?: string;
  createdAt: string;
}
