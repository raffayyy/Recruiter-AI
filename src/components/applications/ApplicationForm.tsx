import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/Button';
import { InputField } from '../forms/InputField';
import { ApplicationFormData } from '../../types/application';

const applicationSchema = z.object({
  coverLetter: z.string()
    .min(100, 'Cover letter must be at least 100 characters')
    .max(2000, 'Cover letter must not exceed 2000 characters'),
  resume: z.instanceof(File).optional(),
});

interface ApplicationFormProps {
  onSubmit: (data: ApplicationFormData) => Promise<void>;
  isSubmitting?: boolean;
}

export function ApplicationForm({ onSubmit, isSubmitting }: ApplicationFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Cover Letter
        </label>
        <textarea
          {...register('coverLetter')}
          rows={6}
          className="w-full rounded-md border border-gray-300 p-2"
          placeholder="Why are you interested in this position?"
        />
        {errors.coverLetter && (
          <p className="text-sm text-red-600">{errors.coverLetter.message}</p>
        )}
      </div>

      <InputField
        type="file"
        label="Resume (PDF)"
        accept=".pdf"
        {...register('resume')}
        error={errors.resume?.message}
      />

      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Application'}
      </Button>
    </form>
  );
}