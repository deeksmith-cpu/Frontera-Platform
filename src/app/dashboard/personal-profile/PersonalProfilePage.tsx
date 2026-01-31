'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProfileConversation } from '@/components/product-strategy-agent/PersonalProfile/ProfileConversation';
import { ProfileSummary } from '@/components/product-strategy-agent/PersonalProfile/ProfileSummary';
import type { PersonalProfileData } from '@/types/database';

interface PersonalProfilePageProps {
  conversationId: string;
  status: string;
  profileData: unknown;
  userName?: string;
}

export function PersonalProfilePage({ conversationId, status, profileData, userName }: PersonalProfilePageProps) {
  const router = useRouter();
  const [profile, setProfile] = useState<PersonalProfileData | null>(
    profileData as PersonalProfileData | null
  );
  const [isCompleted, setIsCompleted] = useState(status === 'completed' && !!profileData);

  const handleProfileComplete = (newProfile: PersonalProfileData) => {
    setProfile(newProfile);
    setIsCompleted(true);
  };

  const handleSkip = () => {
    router.push('/dashboard');
  };

  const handleRedo = () => {
    setIsCompleted(false);
    setProfile(null);
    // Navigate to force re-creation of conversation
    router.refresh();
  };

  if (isCompleted && profile) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8">
        <ProfileSummary profile={profile} onRedo={handleRedo} />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8 h-[calc(100vh-80px)]">
      <ProfileConversation
        conversationId={conversationId}
        onProfileComplete={handleProfileComplete}
        onSkip={handleSkip}
      />
    </div>
  );
}
