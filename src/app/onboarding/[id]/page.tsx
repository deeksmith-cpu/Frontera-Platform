import { Metadata } from "next";
import OnboardingWizard from "@/components/onboarding/OnboardingWizard";

export const metadata: Metadata = {
  title: "Edit Onboarding | Frontera",
  description: "Edit your onboarding information.",
};

interface EditOnboardingPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditOnboardingPage({ params }: EditOnboardingPageProps) {
  const { id } = await params;
  return <OnboardingWizard existingId={id} />;
}
