import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/Button';
import { RatingInput } from './RatingInput';
import { SkillInput } from '../profile/SkillInput';
import { FeedbackFormData } from '../../types/feedback';

const feedbackSchema = z.object({
  rating: z.number().min(1).max(5),
  technicalScore: z.number().min(1).max(5),
  communicationScore: z.number().min(1).max(5),
  culturalFitScore: z.number().min(1).max(5),
  comments: z.string().min(50, 'Please provide detailed feedback (min 50 characters)'),
  strengths: z.array(z.string()).min(1, 'Please identify at least one strength'),
  areasForImprovement: z.array(z.string()),
  recommendation: z.enum(['Strong Yes', 'Yes', 'Maybe', 'No']),
});

interface FeedbackFormProps {
  onSubmit: (data: FeedbackFormData) => Promise<void>;
  isSubmitting?: boolean;
}

export function FeedbackForm({ onSubmit, isSubmitting }: FeedbackFormProps) {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      rating: 0,
      technicalScore: 0,
      communicationScore: 0,
      culturalFitScore: 0,
      strengths: [],
      areasForImprovement: [],
    },
  });

  const strengths = watch('strengths');
  const areasForImprovement = watch('areasForImprovement');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Overall Rating</label>
          <RatingInput
            value={watch('rating')}
            onChange={(value) => setValue('rating', value)}
          />
          {errors.rating && (
            <p className="mt-1 text-sm text-red-600">{errors.rating.message}</p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Technical Skills</label>
            <RatingInput
              value={watch('technicalScore')}
              onChange={(value) => setValue('technicalScore', value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Communication</label>
            <RatingInput
              value={watch('communicationScore')}
              onChange={(value) => setValue('communicationScore', value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Cultural Fit</label>
            <RatingInput
              value={watch('culturalFitScore')}
              onChange={(value) => setValue('culturalFitScore', value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Strengths</label>
          <SkillInput
            skills={strengths}
            onChange={(newStrengths) => setValue('strengths', newStrengths)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Areas for Improvement</label>
          <SkillInput
            skills={areasForImprovement}
            onChange={(newAreas) => setValue('areasForImprovement', newAreas)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Detailed Feedback</label>
          <textarea
            {...register('comments')}
            rows={4}
            className="mt-1 w-full rounded-md border border-gray-300 p-2"
            placeholder="Provide detailed feedback about the candidate's performance..."
          />
          {errors.comments && (
            <p className="mt-1 text-sm text-red-600">{errors.comments.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Recommendation</label>
          <select
            {...register('recommendation')}
            className="mt-1 w-full rounded-md border border-gray-300 p-2"
          >
            <option value="">Select a recommendation</option>
            <option value="Strong Yes">Strong Yes</option>
            <option value="Yes">Yes</option>
            <option value="Maybe">Maybe</option>
            <option value="No">No</option>
          </select>
          {errors.recommendation && (
            <p className="mt-1 text-sm text-red-600">{errors.recommendation.message}</p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Submitting Feedback...' : 'Submit Feedback'}
      </Button>
    </form>
  );
}