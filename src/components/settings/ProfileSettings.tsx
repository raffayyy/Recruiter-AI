import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/Button';
import { InputField } from '../forms/InputField';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../ui/Card';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().max(500, 'Bio must not exceed 500 characters').optional(),
  // Recruiter-specific fields
  company_name: z.string().optional(),
  industry: z.string().optional(),
  company_size: z.string().optional(),
  company_website: z.string().url().optional(),
  // Candidate-specific fields
  current_job_title: z.string().optional(),
  years_of_experience: z.number().optional(),
  skills: z.array(z.string()).optional(),
  preferred_job_types: z.array(z.string()).optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export function ProfileSettings() {
  const { user, updateProfile } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      // Add other default values based on user data
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await updateProfile(data);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <Card.Header>
          <Card.Title>Basic Information</Card.Title>
          <Card.Description>Update your personal information</Card.Description>
        </Card.Header>
        <Card.Content className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <InputField
              label="Full Name"
              {...register('name')}
              error={errors.name?.message}
            />
            <InputField
              label="Email"
              type="email"
              {...register('email')}
              error={errors.email?.message}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <InputField
              label="Phone"
              type="tel"
              {...register('phone')}
              error={errors.phone?.message}
            />
            <InputField
              label="Location"
              {...register('location')}
              error={errors.location?.message}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Bio
            </label>
            <textarea
              {...register('bio')}
              rows={4}
              className="mt-1 w-full rounded-lg border border-gray-300 p-2 dark:border-gray-700 dark:bg-gray-800"
            />
            {errors.bio && (
              <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>
            )}
          </div>
        </Card.Content>
      </Card>

      {user?.role === 'recruiter' ? (
        <Card>
          <Card.Header>
            <Card.Title>Company Information</Card.Title>
            <Card.Description>Tell us about your organization</Card.Description>
          </Card.Header>
          <Card.Content className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <InputField
                label="Company Name"
                {...register('company_name')}
                error={errors.company_name?.message}
              />
              <InputField
                label="Industry"
                {...register('industry')}
                error={errors.industry?.message}
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <InputField
                label="Company Size"
                {...register('company_size')}
                error={errors.company_size?.message}
              />
              <InputField
                label="Company Website"
                type="url"
                {...register('company_website')}
                error={errors.company_website?.message}
              />
            </div>
          </Card.Content>
        </Card>
      ) : (
        <Card>
          <Card.Header>
            <Card.Title>Professional Information</Card.Title>
            <Card.Description>Share your experience and preferences</Card.Description>
          </Card.Header>
          <Card.Content className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <InputField
                label="Current Job Title"
                {...register('current_job_title')}
                error={errors.current_job_title?.message}
              />
              <InputField
                label="Years of Experience"
                type="number"
                {...register('years_of_experience', { valueAsNumber: true })}
                error={errors.years_of_experience?.message}
              />
            </div>
          </Card.Content>
        </Card>
      )}

      <div className="flex justify-end">
        <Button type="submit" isLoading={isSubmitting}>
          Save Changes
        </Button>
      </div>
    </form>
  );
}