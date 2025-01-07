import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock } from 'lucide-react';
import { Button } from '../ui/Button';
import { InputField } from '../forms/InputField';

const passwordSchema = z.object({
  currentPassword: z.string().min(6, 'Current password is required'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type PasswordFormData = z.infer<typeof passwordSchema>;

interface ChangePasswordFormProps {
  onSubmit: (data: PasswordFormData) => Promise<void>;
  onCancel: () => void;
}

export function ChangePasswordForm({ onSubmit, onCancel }: ChangePasswordFormProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <InputField
        label="Current Password"
        type="password"
        icon={Lock}
        {...register('currentPassword')}
        error={errors.currentPassword?.message}
      />

      <InputField
        label="New Password"
        type="password"
        icon={Lock}
        {...register('newPassword')}
        error={errors.newPassword?.message}
      />

      <InputField
        label="Confirm New Password"
        type="password"
        icon={Lock}
        {...register('confirmPassword')}
        error={errors.confirmPassword?.message}
      />

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          isLoading={isSubmitting}
        >
          Update Password
        </Button>
      </div>
    </form>
  );
}