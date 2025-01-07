import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InputField } from "../forms/InputField";
import { Button } from "../ui/Button";

const jobSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  location: z.enum(["remote", "hybrid", "onsite"]),
  time: z.enum(["full_time", "part_time"]),
  short_description: z.string().max(100, "Should be a one line description"),
  long_description: z
    .string()
    .min(50, "Description must be at least 50 characters"),
  requirements: z.string(), 
  min_salary: z.number().min(0),
  max_salary: z.number().min(0),
});

type JobFormData = z.infer<typeof jobSchema>;

interface JobFormProps {
  onSubmit: (data: JobFormData) => Promise<void>;
  initialData?: Partial<JobFormData>;
  isSubmitting?: boolean;
}

export function JobForm({ onSubmit, initialData, isSubmitting }: JobFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <InputField
        label="Job Title"
        {...register("title")}
        error={errors.title?.message}
        placeholder="e.g., Senior Software Engineer"
      />

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Location
        </label>
        <select
          {...register("location")}
          className="w-full rounded-lg border border-gray-300 bg-white p-2.5 dark:border-gray-600 dark:bg-gray-700"
        >
          <option value="">Select job setting</option>
          <option value="remote">Remote</option>
          <option value="hybrid">Hybrid</option>
          <option value="onsite">On-site</option>
        </select>
        {errors.location && (
          <p className="text-sm text-red-600">{errors.location.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Job Type
        </label>
        <select
          {...register("time")}
          className="w-full rounded-lg border border-gray-300 bg-white p-2.5 dark:border-gray-600 dark:bg-gray-700"
        >
          <option value="">Select job type</option>
          <option value="full_time">Full-time</option>
          <option value="part_time">Part-time</option>
        </select>
        {errors.time && (
          <p className="text-sm text-red-600">{errors.time.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Short Description
        </label>
        <textarea
          {...register("short_description")}
          rows={2}
          className="w-full rounded-lg border border-gray-300 p-2.5 dark:border-gray-600 dark:bg-gray-700"
          placeholder="Provide a detailed description of the role..."
        />
        {errors.short_description && (
          <p className="text-sm text-red-600">
            {errors.short_description.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Description
        </label>
        <textarea
          {...register("long_description")}
          rows={5}
          className="w-full rounded-lg border border-gray-300 p-2.5 dark:border-gray-600 dark:bg-gray-700"
          placeholder="Provide a detailed description of the role..."
        />
        {errors.long_description && (
          <p className="text-sm text-red-600">
            {errors.long_description.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Requirements (one per line)
        </label>
        <textarea
          {...register("requirements")}
          rows={5}
          className="w-full rounded-lg border border-gray-300 p-2.5 dark:border-gray-600 dark:bg-gray-700"
          placeholder="- 3+ years of experience&#10;- Bachelor's degree&#10;- Strong communication skills"
        />
        {errors.requirements && (
          <p className="text-sm text-red-600">{errors.requirements.message}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Minimum Salary
          </label>
          <input
            type="number"
            {...register("min_salary", { valueAsNumber: true })}
            className="w-full rounded-lg border border-gray-300 p-2.5 dark:border-gray-600 dark:bg-gray-700"
            placeholder="0"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Maximum Salary
          </label>
          <input
            type="number"
            {...register("max_salary", { valueAsNumber: true })}
            className="w-full rounded-lg border border-gray-300 p-2.5 dark:border-gray-600 dark:bg-gray-700"
            placeholder="0"
          />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
          {isSubmitting ? "Creating..." : "Create Job"}
        </Button>
      </div>
    </form>
  );
}
