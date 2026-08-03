import { useState } from 'react';

import type { OnboardingProfile } from '@/types/onboarding';

const initialProfile: OnboardingProfile = {
  injuries: [],
  equipment: [],
  goals: [],
};

export function useOnboardingProfile() {
  const [profile, setProfile] = useState<OnboardingProfile>(initialProfile);

  const updateProfile = (changes: Partial<OnboardingProfile>) => {
    setProfile((current) => ({
      ...current,
      ...changes,
    }));
  };

  return {
    profile,
    updateProfile,
  };
}
