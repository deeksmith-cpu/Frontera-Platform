"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSignUp, useSignIn } from "@clerk/nextjs";

export default function AcceptInvitationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signUp, isLoaded: signUpLoaded } = useSignUp();
  const { signIn, isLoaded: signInLoaded } = useSignIn();

  useEffect(() => {
    const ticket = searchParams.get("__clerk_ticket");

    if (!ticket) {
      router.push("/sign-in");
      return;
    }

    // Store ticket and redirect to sign-up
    if (typeof window !== "undefined") {
      sessionStorage.setItem("clerk_invitation_ticket", ticket);
    }

    router.push(`/sign-up?__clerk_ticket=${ticket}`);
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-cyan-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[#1e3a8a] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Processing invitation...</p>
      </div>
    </div>
  );
}
