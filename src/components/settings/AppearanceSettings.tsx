import React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export function AppearanceSettings() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { id: 'light', name: 'Light', icon: Sun },
    { id: 'dark', name: 'Dark', icon: Moon },
    { id: 'system', name: 'System', icon: Monitor },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Theme</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Select your preferred color theme
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {themes.map(({ id, name, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTheme(id as 'light' | 'dark' | 'system')}
              className={`flex items-center gap-2 rounded-lg border p-4 transition-colors ${
                theme === id
                  ? 'border-blue-500 bg-blue-50 text-blue-600 dark:border-blue-400 dark:bg-blue-900/50 dark:text-blue-400'
                  : 'border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}