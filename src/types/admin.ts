import type { PersonalProfileData } from './database';

export interface UserProfileSummary {
  userId: string;
  orgId: string;
  conversationId: string;
  firstName: string;
  lastName: string;
  email: string;
  imageUrl: string;
  companyName: string;
  industry: string | null;
  completedAt: string;
  role: string;
  primaryGoal: string;
}

export interface CoachReflection {
  summary: string;
  keyDrivers: string[];
  workingStyleInsights: string[];
  coachingRecommendations: string[];
  generatedAt: string;
  modelUsed: string;
}

export interface UserProfileDetail {
  userId: string;
  orgId: string;
  conversationId: string;
  firstName: string;
  lastName: string;
  email: string;
  imageUrl: string;
  companyName: string;
  industry: string | null;
  profileData: PersonalProfileData;
  completedAt: string;
  coachReflection: CoachReflection | null;
}
