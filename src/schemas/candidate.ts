import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const candidateSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  full_name: z.string().min(2, "Full name is required"),
  current_job_title: z.string().min(2, "Current job title is required"),
  years_of_experience: z
    .number()
    .min(0, "Years of experience cannot be negative"),
  highest_education: z.enum(["high_school", "bachelors", "masters", "phd"], {
    required_error: "Please select your education level",
  }),
  skills: z.array(z.string()).min(1, "Please add at least one skill"),
  brief_intro: z
    .string()
    .min(50, "Please provide a brief introduction (min 50 characters)"),
  role: z.literal("candidate"),
});

export type CandidateFormData = z.infer<typeof candidateSchema>;
