import React from 'react';

interface SwitchProps {
  label: string;
  description?: string;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
}

export function Switch({ label, description, defaultChecked, onChange }: SwitchProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700">
      <div>
        <h4 className="font-medium">{label}</h4>
        {description && (
          <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
        )}
      </div>
      <label className="relative inline-flex cursor-pointer items-center">
        <input
          type="checkbox"
          className="peer sr-only"
          defaultChecked={defaultChecked}
          onChange={(e) => onChange?.(e.target.checked)}
        />
        <div className="h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
      </label>
    </div>
  );
}