// src/pages/interview/InterviewCompletePage.tsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Clock } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export default function InterviewCompletePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { autoSubmitted, applicationId } = location.state || {};
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 p-6 text-white">
      <div className="w-full max-w-md rounded-lg bg-gray-800 p-8 shadow-lg">
        <div className="mb-6 flex flex-col items-center justify-center">
          <div className="mb-4 rounded-full bg-green-600 p-3">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold">Interview Completed</h1>
          
          {autoSubmitted && (
            <div className="mt-4 flex items-center justify-center rounded-lg bg-blue-900/50 p-3 text-sm">
              <Clock className="mr-2 h-5 w-5 text-blue-400" />
              <span>The interview was automatically submitted as the time limit was reached.</span>
            </div>
          )}
        </div>
        
        <p className="mb-6 text-center text-gray-300">
          Thank you for completing the interview. Your responses have been recorded and will be reviewed.
        </p>
        
        <div className="space-y-4">
          <Button 
            className="w-full"
            onClick={() => navigate('/dashboard')}
          >
            Return to Dashboard
          </Button>
          
          <Button 
            variant="outline"
            className="w-full"
            onClick={() => navigate(`/application/${applicationId}`)}
          >
            View Application
          </Button>
        </div>
      </div>
    </div>
  );
}