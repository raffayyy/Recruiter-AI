import React from 'react';
import { Info } from 'lucide-react';
import { Button } from '../ui/Button';

interface DemoAccountsProps {
  onFill: (role: 'candidate' | 'recruiter') => void;
}

export function DemoAccounts({ onFill }: DemoAccountsProps) {
  return (
    <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/30">
      <div className="flex items-center gap-2">
        <Info className="h-5 w-5 text-blue-500" />
        <h3 className="font-medium text-blue-900 dark:text-blue-100">Demo Accounts</h3>
      </div>
      <div className="mt-2 space-y-2 text-sm">
        <div>
          <p className="text-blue-800 dark:text-blue-200">Recruiter:</p>
          <code className="text-blue-700 dark:text-blue-300">recruiter@demo.com / demo123</code>
          <Button
            variant="ghost"
            size="sm"
            className="ml-2"
            onClick={() => onFill('recruiter')}
          >
            Fill
          </Button>
        </div>
        <div>
          <p className="text-blue-800 dark:text-blue-200">Candidate:</p>
          <code className="text-blue-700 dark:text-blue-300">candidate@demo.com / demo123</code>
          <Button
            variant="ghost"
            size="sm"
            className="ml-2"
            onClick={() => onFill('candidate')}
          >
            Fill
          </Button>
        </div>
      </div>
    </div>
  );
}