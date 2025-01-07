import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Plus, ClipboardList } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function DashboardActions() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="flex gap-4">
      {user?.role === 'recruiter' ? (
        <>
          <Button onClick={() => navigate('/jobs/create')} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Post New Job
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate('/applications')}
            className="flex items-center gap-2"
          >
            <ClipboardList className="h-4 w-4" />
            View Applications
          </Button>
        </>
      ) : (
        <Button 
          onClick={() => navigate('/applications')}
          className="flex items-center gap-2"
        >
          <ClipboardList className="h-4 w-4" />
          My Applications
        </Button>
      )}
    </div>
  );
}