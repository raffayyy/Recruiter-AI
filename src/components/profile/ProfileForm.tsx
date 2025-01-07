import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Upload } from 'lucide-react';
import { Button } from '../ui/Button';
import { InputField } from '../forms/InputField';
import { SkillInput } from './SkillInput';
import { EducationForm } from './EducationForm';
import { User } from '../../types/auth';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ['application/pdf'];

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  yearsOfExperience: z.number().min(0, 'Experience cannot be negative'),
  skills: z.array(z.string()),
  education: z.array(z.object({
    degree: z.string().min(2, 'Degree is required'),
    field: z.string().min(2, 'Field of study is required'),
    institution: z.string().min(2, 'Institution is required'),
    graduationYear: z.number().min(1900).max(new Date().getFullYear() + 5),
  })),
  resume: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => !file || file.size <= MAX_FILE_SIZE,
      'Max file size is 5MB.'
    )
    .refine(
      (file) => !file || ACCEPTED_FILE_TYPES.includes(file.type),
      'Only PDF files are accepted.'
    ),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  user: User;
  onSubmit: (data: ProfileFormData) => Promise<void>;
}

export function ProfileForm({ user, onSubmit }: ProfileFormProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, watch } = 
    useForm<ProfileFormData>({
      resolver: zodResolver(profileSchema),
      defaultValues: {
        name: user.name,
        email: user.email,
        yearsOfExperience: user.yearsOfExperience || 0,
        skills: user.skills || [],
        education: user.education || [],
      },
    });

  // Show warning if no resume is uploaded
  const showResumeWarning = user.role === 'candidate' && !user.resumeUrl;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* ... existing form fields ... */}

      {user.role === 'candidate' && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Resume
          </label>
          {showResumeWarning && (
            <div className="rounded-lg bg-yellow-50 p-4 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200">
              Please upload your resume to apply for jobs
            </div>
          )}
          <div className="flex items-center gap-4">
            {user.resumeUrl && (
              <a
                href={user.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline dark:text-blue-400"
              >
                View Current Resume
              </a>
            )}
            <input
              type="file"
              accept=".pdf"
              {...register('resume')}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
            />
          </div>
          {errors.resume && (
            <p className="text-sm text-red-600">{errors.resume.message}</p>
          )}
        </div>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Saving...' : 'Save Profile'}
      </Button>
    </form>
  );
}