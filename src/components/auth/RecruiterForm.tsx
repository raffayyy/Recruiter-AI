import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Mail,
  Lock,
  User,
  Briefcase,
  Building2,
  Globe as GlobeIcon,
  FileText,
} from "lucide-react";
import { Button } from "../ui/Button";
import { InputField } from "../forms/InputField";

const recruiterSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  full_name: z.string().min(2, "Full name is required"),
  company_name: z.string().min(2, "Company name is required"),
  job_title: z.string().min(2, "Job title is required"),
  industry: z.string().min(2, "Industry is required"),
  company_summary: z
    .string()
    .min(50, "Please provide a company summary (min 50 characters)"),
  role: z.literal("recruiter"),
});

type RecruiterFormData = z.infer<typeof recruiterSchema>;

interface RecruiterFormProps {
  onSubmit: (data: RecruiterFormData) => Promise<void>;
  isSubmitting: boolean;
}

export function RecruiterForm({ onSubmit }: RecruiterFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RecruiterFormData>({
    resolver: zodResolver(recruiterSchema),
    defaultValues: {
      role: "recruiter",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <InputField
        label="Email"
        type="email"
        icon={Mail}
        placeholder="you@company.com"
        {...register("email")}
        error={errors.email?.message}
      />

      <InputField
        label="Password"
        type="password"
        icon={Lock}
        placeholder="••••••••"
        {...register("password")}
        error={errors.password?.message}
      />

      <InputField
        label="Full Name"
        icon={User}
        placeholder="Jane Smith"
        {...register("full_name")}
        error={errors.full_name?.message}
      />

      <InputField
        label="Company Name"
        icon={Building2}
        placeholder="TechCorp Inc."
        {...register("company_name")}
        error={errors.company_name?.message}
      />

      <InputField
        label="Job Title"
        icon={Briefcase}
        placeholder="HR Manager"
        {...register("job_title")}
        error={errors.job_title?.message}
      />

      <InputField
        label="Industry"
        icon={GlobeIcon}
        placeholder="Technology"
        {...register("industry")}
        error={errors.industry?.message}
      />

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Company Summary
        </label>
        <div className="relative">
          <FileText className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <textarea
            {...register("company_summary")}
            rows={4}
            className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            placeholder="Tell us about your company's mission, culture, and what makes it a great place to work..."
          />
        </div>
        {errors.company_summary && (
          <p className="text-sm text-red-600">
            {errors.company_summary.message}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" isLoading={isSubmitting}>
        Create Account
      </Button>
    </form>
  );
}
