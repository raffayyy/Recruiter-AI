import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Mail,
  Lock,
  User,
  Briefcase,
  GraduationCap,
  FileText,
} from "lucide-react";
import { Button } from "../ui/Button";
import { InputField } from "../forms/InputField";
import { SkillInput } from "../profile/SkillInput";
import { candidateSchema } from "../../schemas/candidate";
import type { CandidateFormData } from "../../types/candidate";

interface CandidateFormProps {
  onSubmit: (data: CandidateFormData) => Promise<void>;
  isSubmitting?: boolean;
}

export function CandidateForm({ onSubmit, isSubmitting }: CandidateFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CandidateFormData>({
    resolver: zodResolver(candidateSchema),
    defaultValues: {
      role: "candidate",
      years_of_experience: 0,
      skills: [],
    },
  });

  const skills = watch("skills");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <InputField
        label="Email"
        type="email"
        icon={Mail}
        {...register("email")}
        error={errors.email?.message}
        placeholder="you@example.com"
      />

      <InputField
        label="Password"
        type="password"
        icon={Lock}
        {...register("password")}
        error={errors.password?.message}
        placeholder="••••••••"
      />

      <InputField
        label="Full Name"
        icon={User}
        {...register("full_name")}
        error={errors.full_name?.message}
        placeholder="John Doe"
      />

      <InputField
        label="Current Job Title"
        icon={Briefcase}
        {...register("current_job_title")}
        error={errors.current_job_title?.message}
        placeholder="Software Engineer"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Years of Experience
          </label>
          <input
            type="number"
            {...register("years_of_experience", { valueAsNumber: true })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
            min="0"
          />
          {errors.years_of_experience && (
            <p className="mt-1 text-sm text-red-600">
              {errors.years_of_experience.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Highest Education
          </label>
          <select
            {...register("highest_education")}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
          >
            <option value="">Select education level</option>
            <option value="high_school">High School</option>
            <option value="bachelors">Bachelor's Degree</option>
            <option value="masters">Master's Degree</option>
            <option value="phd">PhD</option>
          </select>
          {errors.highest_education && (
            <p className="mt-1 text-sm text-red-600">
              {errors.highest_education.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Skills
        </label>
        <SkillInput
          skills={skills}
          onChange={(newSkills) => setValue("skills", newSkills)}
        />
        {errors.skills && (
          <p className="mt-1 text-sm text-red-600">{errors.skills.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Brief Introduction
        </label>
        <textarea
          {...register("brief_intro")}
          rows={4}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
          placeholder="Tell us about yourself and your career goals..."
        />
        {errors.brief_intro && (
          <p className="mt-1 text-sm text-red-600">
            {errors.brief_intro.message}
          </p>
        )}
      </div>

      {/* <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Resume (PDF only, max 5MB)
        </label>
        <div className="mt-1 flex items-center gap-2">
          <input
        type="file"
        accept=".pdf"
        {...register("resume", {
          onChange: (e) => {
            const file = e.target.files?.[0];
            if (file) {
              console.log("Selected file:", {
                name: file.name,
                type: file.type,
                size: file.size,
                lastModified: file.lastModified
              });
            }
          }
        })}
        className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:file:bg-gray-700 dark:file:text-gray-200"
          />
          <FileText className="h-5 w-5 text-gray-400" />
        </div>
        {errors.resume?.message && (
          <p className="mt-1 text-sm text-red-600">{errors.resume.message?.toString()}</p>
        )}
      </div> */}

      <Button type="submit" className="w-full" isLoading={isSubmitting}>
        Create Account
      </Button>
    </form>
  );
}
