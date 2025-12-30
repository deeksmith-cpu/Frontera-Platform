import { Metadata } from "next";
import OnboardingWizard from "@/components/onboarding/OnboardingWizard";

export const metadata: Metadata = {
  title: "Client Onboarding | Frontera",
  description: "Complete your onboarding to begin your transformation journey with Frontera.",
};

export default function OnboardingPage() {
  return <OnboardingWizard />;
}
