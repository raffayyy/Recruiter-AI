import React from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { SettingsTabs } from '../../components/settings/SettingsTabs';

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage your account settings and preferences
          </p>
        </div>
        <SettingsTabs />
      </div>
    </DashboardLayout>
  );
}