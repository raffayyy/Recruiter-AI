import React from 'react';
import { User, Bell, Lock, Palette } from 'lucide-react';
import { ProfileSettings } from './ProfileSettings';
import { NotificationSettings } from './NotificationSettings';
import { PrivacySettings } from './PrivacySettings';
import { AppearanceSettings } from './AppearanceSettings';

const tabs = [
  { id: 'profile', label: 'Profile', icon: User, component: ProfileSettings },
  { id: 'notifications', label: 'Notifications', icon: Bell, component: NotificationSettings },
  { id: 'privacy', label: 'Privacy & Security', icon: Lock, component: PrivacySettings },
  { id: 'appearance', label: 'Appearance', icon: Palette, component: AppearanceSettings },
];

export function SettingsTabs() {
  const [activeTab, setActiveTab] = React.useState(tabs[0].id);

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || tabs[0].component;

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-300'
              }`}
            >
              <tab.icon className="h-5 w-5" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-6">
        <ActiveComponent />
      </div>
    </div>
  );
}