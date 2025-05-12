import React from 'react';
import { RatingInput } from './RatingInput';
import { SkillInput } from '../profile/SkillInput';
import { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';

interface FeedbackFormValues {
  rating: number;
  technicalScore: number;
  communicationScore: number;
  culturalFitScore: number;
  strengths: string[];
  areasForImprovement: string[];
  comments: string;
  recommendation: string;
}

interface FeedbackFormFieldsProps {
  values: FeedbackFormValues;
  errors: FieldErrors<FeedbackFormValues>;
  register: UseFormRegister<FeedbackFormValues>;
  setValue: UseFormSetValue<FeedbackFormValues>;
  watch: UseFormWatch<FeedbackFormValues>;
}

export function FeedbackFormFields({ errors, register, setValue, watch }: FeedbackFormFieldsProps) {
  return (
    <div className="space-y-6">
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
          skills={watch('strengths')}
          onChange={(newStrengths) => setValue('strengths', newStrengths)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Areas for Improvement</label>
        <SkillInput
          skills={watch('areasForImprovement')}
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
  );
}