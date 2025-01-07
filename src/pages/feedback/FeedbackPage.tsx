import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { FeedbackFormFields } from '../../components/feedback/FeedbackFormFields';
import { InterviewMinutes } from '../../components/feedback/InterviewMinutes';
import { AIFeedback } from '../../components/feedback/AIFeedback';
import { Button } from '../../components/ui/Button';
import { useFeedbackSubmission } from '../../hooks/useFeedbackSubmission';
import { useInterviewData } from '../../hooks/useInterviewData';

const feedbackSchema = z.object({
  rating: z.number().min(1, 'Rating is required').max(5),
  technicalScore: z.number().min(1, 'Technical score is required').max(5),
  communicationScore: z.number().min(1, 'Communication score is required').max(5),
  culturalFitScore: z.number().min(1, 'Cultural fit score is required').max(5),
  comments: z.string().min(50, 'Please provide detailed feedback (min 50 characters)'),
  strengths: z.array(z.string()).min(1, 'Please identify at least one strength'),
  areasForImprovement: z.array(z.string()),
  recommendation: z.enum(['Strong Yes', 'Yes', 'Maybe', 'No'], {
    required_error: 'Please select a recommendation',
  }),
  status: z.enum(['Accepted', 'Rejected', 'Pending'], {
    required_error: 'Please select a decision',
  }),
});

type FeedbackFormData = z.infer<typeof feedbackSchema>;

export default function FeedbackPage() {
  const { applicationId } = useParams<{ applicationId: string }>();
  const navigate = useNavigate();
  const { submitFeedback, isSubmitting, error } = useFeedbackSubmission();
  const { minutes, aiFeedback, isLoading } = useInterviewData(applicationId);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      rating: 0,
      technicalScore: 0,
      communicationScore: 0,
      culturalFitScore: 0,
      strengths: [],
      areasForImprovement: [],
      status: 'Pending',
    },
  });

  const onSubmit = async (data: FeedbackFormData) => {
    if (!applicationId) return;
    
    try {
      await submitFeedback(applicationId, data);
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to submit feedback:', err);
    }
  };

  if (!applicationId) {
    return <div>Application ID is required</div>;
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Review Interview</h1>
          <p className="text-gray-600">
            Review the interview recording and provide your feedback
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <InterviewMinutes minutes={minutes} />
            <AIFeedback analysis={aiFeedback} />
          </div>

          <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <FeedbackFormFields
                values={watch()}
                errors={errors}
                register={register}
                setValue={setValue}
                watch={watch}
              />

              <div className="space-y-4">
                <h3 className="font-medium">Final Decision</h3>
                <div className="flex gap-4">
                  <Button
                    type="submit"
                    onClick={() => setValue('status', 'Accepted')}
                    variant={watch('status') === 'Accepted' ? 'primary' : 'outline'}
                    className={watch('status') === 'Accepted' ? 'bg-green-600' : ''}
                  >
                    Accept Candidate
                  </Button>
                  <Button
                    type="submit"
                    onClick={() => setValue('status', 'Rejected')}
                    variant={watch('status') === 'Rejected' ? 'primary' : 'outline'}
                    className={watch('status') === 'Rejected' ? 'bg-red-600' : ''}
                  >
                    Reject Candidate
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}