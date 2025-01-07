import React from 'react';
import { Switch } from '../ui/Switch';

export function NotificationSettings() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Email Notifications</h3>
        <div className="space-y-4">
          <Switch
            label="Application Updates"
            description="Receive emails about your job application status"
            defaultChecked
          />
          <Switch
            label="Interview Reminders"
            description="Get notified about upcoming interviews"
            defaultChecked
          />
          <Switch
            label="New Job Matches"
            description="Receive notifications about new jobs matching your profile"
            defaultChecked
          />
          <Switch
            label="Platform Updates"
            description="Stay informed about new features and updates"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Push Notifications</h3>
        <div className="space-y-4">
          <Switch
            label="Real-time Messages"
            description="Get notified when you receive new messages"
            defaultChecked
          />
          <Switch
            label="Application Activity"
            description="Notifications about application views and status changes"
            defaultChecked
          />
        </div>
      </div>
    </div>
  );
}