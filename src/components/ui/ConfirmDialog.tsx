import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from './Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
        <div className="flex items-center gap-4">
          <div className={`rounded-full p-2 ${
            variant === 'danger' 
              ? 'bg-red-100 text-red-600'
              : variant === 'warning'
              ? 'bg-yellow-100 text-yellow-600'
              : 'bg-blue-100 text-blue-600'
          }`}>
            <AlertTriangle className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>

        <p className="mt-4 text-gray-600 dark:text-gray-400">{message}</p>

        <div className="mt-6 flex justify-end gap-4">
          <Button variant="outline" onClick={onClose}>
            {cancelText}
          </Button>
          <Button
            variant={variant === 'danger' ? 'danger' : 'primary'}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}