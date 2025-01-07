import React, { useState } from 'react';
import { Switch } from '../ui/Switch';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { ChangePasswordForm } from './ChangePasswordForm';

export function PrivacySettings() {
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const handlePasswordUpdate = async (data: any) => {
    try {
      // Implement password update logic here
      console.log('Updating password:', data);
      setShowPasswordForm(false);
    } catch (error) {
      console.error('Failed to update password:', error);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <Card.Header>
          <Card.Title>Privacy</Card.Title>
          <Card.Description>Manage your privacy settings</Card.Description>
        </Card.Header>
        <Card.Content className="space-y-4">
          <Switch
            label="Profile Visibility"
            description="Make your profile visible to recruiters"
            defaultChecked
          />
          <Switch
            label="Show Online Status"
            description="Let others see when you're online"
            defaultChecked
          />
          <Switch
            label="Activity Status"
            description="Share your application activity with your network"
          />
        </Card.Content>
      </Card>

      <Card>
        <Card.Header>
          <Card.Title>Security</Card.Title>
          <Card.Description>Manage your account security</Card.Description>
        </Card.Header>
        <Card.Content className="space-y-4">
          {showPasswordForm ? (
            <ChangePasswordForm
              onSubmit={handlePasswordUpdate}
              onCancel={() => setShowPasswordForm(false)}
            />
          ) : (
            <>
              <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <div>
                  <h4 className="font-medium">Two-Factor Authentication</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Button variant="outline">Enable</Button>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <div>
                  <h4 className="font-medium">Change Password</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Update your password regularly to keep your account secure
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowPasswordForm(true)}
                >
                  Update
                </Button>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <div>
                  <h4 className="font-medium">Active Sessions</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Manage devices where you're currently logged in
                  </p>
                </div>
                <Button variant="outline">Manage</Button>
              </div>
            </>
          )}
        </Card.Content>
      </Card>
    </div>
  );
}