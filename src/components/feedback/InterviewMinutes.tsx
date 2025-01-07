import React from 'react';
import { Clock, MessageSquare } from 'lucide-react';
import { formatDate } from '../../lib/date';

interface InterviewMinute {
  timestamp: string;
  speaker: 'candidate' | 'interviewer';
  text: string;
}

interface InterviewMinutesProps {
  minutes: InterviewMinute[];
}

export function InterviewMinutes({ minutes }: InterviewMinutesProps) {
  return (
    <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <h3 className="font-medium">Interview Minutes</h3>
      <div className="space-y-4">
        {minutes.map((minute, index) => (
          <div
            key={index}
            className={`flex gap-4 ${
              minute.speaker === 'candidate' ? 'flex-row-reverse' : ''
            }`}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
              <MessageSquare className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </div>
            <div className={`flex-1 space-y-1 ${
              minute.speaker === 'candidate' ? 'text-right' : ''
            }`}>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Clock className="h-4 w-4" />
                <span>{formatDate(minute.timestamp)}</span>
              </div>
              <p className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
                {minute.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}