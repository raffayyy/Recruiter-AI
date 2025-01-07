import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { ProfileForm } from '../../components/profile/ProfileForm';
import { useAuth } from '../../contexts/AuthContext';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (data: any) => {
    try {
      await updateProfile(data);
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-2xl font-bold">Edit Profile</h1>
        <div className="rounded-lg bg-white p-6 shadow">
          <ProfileForm user={user} onSubmit={handleSubmit} />
        </div>
      </div>
    </DashboardLayout>
  );
}