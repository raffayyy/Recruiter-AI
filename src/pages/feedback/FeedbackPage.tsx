import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { getApplicationFeedback } from '../../services/api/recruiter_endpoints';
import { apiRequest, MethodMap } from '../../services/api/request';
import { ThumbsUp, ThumbsDown, Star, MessageCircle, Check, X, Plus, Minus, AlertTriangle, Eye } from 'lucide-react';

interface FeedbackData {
  application_id: number;
  job_details: {
    job_id: number;
    title: string;
    company_name: string;
  };
  candidate_details: {
    candidate_id: number;
    name: string;
    email: string;
  };
  interview_details: {
    interview_id: number;
    date_completed: string;
    conversation_log: Array<{
      role: string;
      message: string;
    }>;
    tab_switch_count: number | null;
    face_violation_count: number | null;
  };
  evaluation: {
    evaluation_id: number;
    evaluation_score: number;
    strengths: string;
    weaknesses: string;
    ai_feedback: string;
    feedback_for_candidate: string;
    sentiment_analysis: {
      sentiment: string;
      explanation: string;
    };
    technical_knowledge: {
      rating: string;
      explanation: string;
    };
    created_at: string;
  };
  has_interview: boolean;
  has_evaluation: boolean;
  status: string;
}

export default function FeedbackPage() {
  const { applicationId } = useParams<{ applicationId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [feedbackData, setFeedbackData] = React.useState<FeedbackData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [expandStrengths, setExpandStrengths] = useState(false);
  const [expandWeaknesses, setExpandWeaknesses] = useState(false);
  const [expandConversation, setExpandConversation] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  React.useEffect(() => {
    // Redirect if user is not a recruiter
    if (user?.role !== 'recruiter') {
      navigate('/dashboard');
      return;
    }

    const fetchFeedbackData = async () => {
      if (!applicationId) return;

      try {
        setIsLoading(true);
        const response = await getApplicationFeedback(applicationId);
        setFeedbackData(response);
      } catch (err) {
        console.error('Failed to fetch feedback:', err);
        setError('Failed to load feedback data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeedbackData();
  }, [applicationId, user?.role]);
  
  const handleStatusUpdate = async (newStatus: 'Accepted' | 'Rejected') => {
    if (!applicationId || !feedbackData) return;
    
    try {
      setSubmitting(true);
      
      await apiRequest(MethodMap.POST, `/recruiter/application/${applicationId}/final-result`, {
        result: newStatus.toLowerCase()
      });
      
      setFeedbackSuccess(true);
      setFeedbackData({
        ...feedbackData,
        status: newStatus
      });
      
      setTimeout(() => {
        setFeedbackSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Failed to update application status:', err);
      setError('Failed to update application status. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      case 'neutral': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getRatingColor = (rating: string) => {
    switch (rating?.toLowerCase()) {
      case 'high': return 'text-green-600';
      case 'moderate': return 'text-yellow-600';
      case 'low': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-screen items-center justify-center">
          <LoadingSpinner />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !feedbackData) {
    return (
      <DashboardLayout>
        <div className="rounded-md bg-red-50 p-4 text-red-700">
          {error || 'No feedback data available'}
        </div>
      </DashboardLayout>
    );
  }

  const { evaluation, candidate_details, job_details, interview_details } = feedbackData;
  const formattedDate = interview_details?.date_completed 
    ? new Date(interview_details.date_completed).toLocaleDateString()
    : 'Not completed';

  const isApplicationDecided = feedbackData.status === 'Accepted' || feedbackData.status === 'Rejected';

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-5xl space-y-6">
        {feedbackSuccess && (
          <div className="rounded-md bg-green-50 p-4 text-green-700 flex items-center">
            <Check className="mr-2 h-5 w-5" />
            Application status updated successfully!
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Interview Feedback</h1>
            <p className="text-gray-600">
              Feedback for {candidate_details?.name || 'Candidate'}'s interview for {job_details?.title || 'Position'} position
            </p>
          </div>
          
          {isApplicationDecided ? (
            <div className={`px-4 py-2 rounded-full font-medium ${
              feedbackData.status === 'Accepted' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {feedbackData.status}
            </div>
          ) : (
            <div className="space-x-2">
              <Button 
                variant="primary"
                onClick={() => handleStatusUpdate('Accepted')}
                disabled={submitting}
                className="bg-green-600 hover:bg-green-700"
              >
                <ThumbsUp className="mr-2 h-4 w-4" />
                Accept Candidate
              </Button>
              <Button 
                variant="danger"
                onClick={() => handleStatusUpdate('Rejected')}
                disabled={submitting}
                className="bg-red-600 hover:bg-red-700"
              >
                <ThumbsDown className="mr-2 h-4 w-4" />
                Reject Candidate
              </Button>
            </div>
          )}
        </div>

        <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Candidate & Job Information</h2>
            <div className="mt-2 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Candidate Name</p>
                <p>{candidate_details?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p>{candidate_details?.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Job Title</p>
                <p>{job_details?.title || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Company</p>
                <p>{job_details?.company_name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Interview Date</p>
                <p>{formattedDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className={`font-medium ${
                  feedbackData.status === 'Accepted' ? 'text-green-600' : 
                  feedbackData.status === 'Rejected' ? 'text-red-600' : 'text-blue-600'
                }`}>
                  {feedbackData?.status || 'Unknown'}
                </p>
              </div>
            </div>
          </div>

          {interview_details && (
            <div className="mb-4 border-t pt-4">
              <h2 className="text-xl font-semibold">Interview Monitoring</h2>
              <div className="mt-4 grid grid-cols-2 gap-4">
                {interview_details.tab_switch_count !== null && (
                  <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                    <div className="flex items-center">
                      <AlertTriangle className={`h-5 w-5 mr-2 ${interview_details.tab_switch_count > 0 ? 'text-yellow-500' : 'text-green-500'}`} />
                      <p className="text-sm text-gray-500">Tab Switch Count</p>
                    </div>
                    <p className="mt-1 text-lg font-medium">{interview_details.tab_switch_count}</p>
                  </div>
                )}
                
                {interview_details.face_violation_count !== null && (
                  <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                    <div className="flex items-center">
                      <Eye className={`h-5 w-5 mr-2 ${interview_details.face_violation_count > 0 ? 'text-yellow-500' : 'text-green-500'}`} />
                      <p className="text-sm text-gray-500">Face Violation Count</p>
                    </div>
                    <p className="mt-1 text-lg font-medium">{interview_details.face_violation_count}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {interview_details?.conversation_log && interview_details.conversation_log.length > 0 && (
            <div className="mb-4 border-t pt-4">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setExpandConversation(!expandConversation)}
              >
                <h2 className="text-xl font-semibold">Interview Conversation</h2>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  {expandConversation ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </Button>
              </div>
              
              <div className={`mt-4 transition-all duration-300 ease-in-out overflow-hidden ${
                expandConversation ? 'max-h-[800px]' : 'max-h-24'
              }`}>
                <div className="space-y-4">
                  {interview_details.conversation_log.map((message, index) => (
                    <div 
                      key={index} 
                      className={`p-3 rounded-lg ${
                        message.role === 'interviewer' 
                          ? 'bg-blue-50 dark:bg-blue-900/30' 
                          : 'bg-gray-50 dark:bg-gray-700'
                      }`}
                    >
                      <p className="text-xs font-medium mb-1 text-gray-500">
                        {message.role === 'interviewer' ? 'Interviewer' : 'Candidate'}
                      </p>
                      <p>{message.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="mb-4 border-t pt-4">
            <h2 className="text-xl font-semibold">Evaluation Summary</h2>
            <div className="mt-4">
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">Evaluation Score</p>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star}
                        className={`h-5 w-5 ${
                          (evaluation?.evaluation_score || 0) / 20 >= star
                            ? 'text-yellow-500 fill-yellow-500'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="mt-1 flex items-center">
                  <div className="h-2.5 w-full rounded-full bg-gray-200">
                    <div
                      className="h-2.5 rounded-full bg-blue-600"
                      style={{ width: `${evaluation?.evaluation_score || 0}%` }}
                    ></div>
                  </div>
                  <span className="ml-2 text-sm font-medium">{evaluation?.evaluation_score || 0}%</span>
                </div>
              </div>
              
              <div className="mb-4">
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setExpandStrengths(!expandStrengths)}
                >
                  <p className="text-sm text-gray-500">Strengths</p>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-8 w-8 p-0"
                  >
                    {expandStrengths ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </Button>
                </div>
                <div className={`mt-1 transition-all duration-300 ease-in-out overflow-hidden ${
                  expandStrengths ? 'max-h-96' : 'max-h-24'
                }`}>
                  <p className="text-sm">{evaluation?.strengths || 'None specified'}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setExpandWeaknesses(!expandWeaknesses)}
                >
                  <p className="text-sm text-gray-500">Weaknesses</p>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-8 w-8 p-0"
                  >
                    {expandWeaknesses ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </Button>
                </div>
                <div className={`mt-1 transition-all duration-300 ease-in-out overflow-hidden ${
                  expandWeaknesses ? 'max-h-96' : 'max-h-24'
                }`}>
                  <p className="text-sm">{evaluation?.weaknesses || 'None specified'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4 border-t pt-4">
            <h2 className="text-xl font-semibold">AI Analysis</h2>
            <div className="mt-4">
              <div className="mb-4">
                <p className="text-sm text-gray-500">AI Feedback</p>
                <p className="mt-1">{evaluation?.ai_feedback || 'No AI feedback available'}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                  <p className="text-sm text-gray-500">Sentiment Analysis</p>
                  <p className={`mt-1 font-medium ${getSentimentColor(evaluation?.sentiment_analysis?.sentiment || '')}`}>
                    {evaluation?.sentiment_analysis?.sentiment || 'N/A'}
                  </p>
                  <p className="mt-1 text-sm">{evaluation?.sentiment_analysis?.explanation || 'No explanation available'}</p>
                </div>
                
                <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                  <p className="text-sm text-gray-500">Technical Knowledge</p>
                  <p className={`mt-1 font-medium ${getRatingColor(evaluation?.technical_knowledge?.rating || '')}`}>
                    {evaluation?.technical_knowledge?.rating || 'N/A'}
                  </p>
                  <p className="mt-1 text-sm">{evaluation?.technical_knowledge?.explanation || 'No explanation available'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h2 className="text-xl font-semibold">Feedback for Candidate</h2>
            <p className="mt-2">{evaluation?.feedback_for_candidate || 'No feedback available for the candidate'}</p>
          </div>
        </div>


        <div className="flex justify-end space-x-4">
          <Button 
            variant="primary" 
            onClick={() => navigate('/dashboard')}
          >
            Return to Dashboard
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}