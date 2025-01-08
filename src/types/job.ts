export interface Job {
  title: string;
  location: "remote" | "hybrid" | "onsite";
  time: "full_time" | "part_time";
  short_description: string;
  long_description: string;
  requirements: string;
  max_salary: number | null;
  min_salary: number | null;
  company_name?: string;
  recruiter_id?: number;
  job_id?: number;
  suitability_score?: number;
  created_at?: string;
  has_applied?:boolean;
}
