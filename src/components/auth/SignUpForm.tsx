"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSignUp } from "@clerk/nextjs";
import Link from "next/link";
import type { SignUpFormData } from "@/types/auth";

const INITIAL_FORM_DATA: SignUpFormData = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  organizationName: "",
};

function SignUpFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signUp, setActive, isLoaded } = useSignUp();
  const ticket = searchParams.get("__clerk_ticket");
  const isInvitation = !!ticket;

  const [formData, setFormData] = useState<SignUpFormData>(INITIAL_FORM_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  // Pre-fill email from invitation ticket URL if available
  useEffect(() => {
    const email = searchParams.get("email");
    if (email) {
      setFormData((prev) => ({ ...prev, email }));
    }
  }, [searchParams]);

  const updateField = (field: keyof SignUpFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const isFormValid = () => {
    if (isInvitation) {
      // Invited users don't need org name
      return (
        formData.firstName.trim() !== "" &&
        formData.lastName.trim() !== "" &&
        formData.email.trim() !== "" &&
        formData.password.length >= 8 &&
        formData.password === formData.confirmPassword
      );
    }
    return (
      formData.firstName.trim() !== "" &&
      formData.lastName.trim() !== "" &&
      formData.email.trim() !== "" &&
      formData.password.length >= 8 &&
      formData.password === formData.confirmPassword &&
      formData.organizationName.trim() !== ""
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      setIsLoading(false);
      return;
    }

    try {
      if (isInvitation && isLoaded && signUp) {
        // Use Clerk's signUp with invitation ticket
        console.log("[SignUp] Creating account with invitation ticket...");
        const result = await signUp.create({
          firstName: formData.firstName,
          lastName: formData.lastName,
          emailAddress: formData.email,
          password: formData.password,
          ticket: ticket!,
        });

        console.log("[SignUp] Result:", {
          status: result.status,
          missingFields: result.missingFields,
          unverifiedFields: result.unverifiedFields,
          verifications: result.verifications,
          createdSessionId: result.createdSessionId,
        });

        if (result.status === "complete") {
          // Invitation accepted, user joined the org
          console.log("[SignUp] Complete - setting active session...");
          await setActive({ session: result.createdSessionId });
          console.log("[SignUp] Session set, redirecting to dashboard...");
          window.location.href = "/dashboard";
          return;
        } else if (result.status === "missing_requirements") {
          // Check what's actually missing
          console.log("[SignUp] Missing requirements - checking fields...");

          // If email verification is required
          if (result.unverifiedFields?.includes("email_address")) {
            console.log("[SignUp] Email verification required, preparing...");
            await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
            setVerifying(true);
          } else {
            // Other requirements - show specific message
            const missing = [...(result.missingFields || []), ...(result.unverifiedFields || [])];
            console.error("[SignUp] Unexpected missing requirements:", missing);
            setError(`Additional information required: ${missing.join(", ") || "unknown"}. Please contact support.`);
          }
        } else {
          // Log unexpected status for debugging
          console.error("[SignUp] Unexpected status:", result.status, result);
          setError(`Sign-up requires additional steps (status: ${result.status}). Please contact support.`);
        }
      } else {
        // Standard sign-up flow (new org creation)
        const response = await fetch("/api/auth/sign-up", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            firstName: formData.firstName,
            lastName: formData.lastName,
            organizationName: formData.organizationName,
          }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || "Sign-up failed");
        }

        router.push("/sign-in?registered=true");
      }
    } catch (err) {
      const clerkErr = err as { errors?: Array<{ message: string; longMessage?: string }> };
      const message = clerkErr.errors?.[0]?.longMessage ||
                      clerkErr.errors?.[0]?.message ||
                      (err instanceof Error ? err.message : "Sign-up failed");
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !signUp) return;

    setIsLoading(true);
    setError(null);

    try {
      console.log("[SignUp] Verifying email code...");
      const result = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      console.log("[SignUp] Verification result:", {
        status: result.status,
        missingFields: result.missingFields,
        unverifiedFields: result.unverifiedFields,
        createdSessionId: result.createdSessionId,
      });

      if (result.status === "complete") {
        console.log("[SignUp] Verification complete, setting session...");
        await setActive({ session: result.createdSessionId });
        console.log("[SignUp] Session set, redirecting to dashboard...");
        window.location.href = "/dashboard";
        return;
      } else {
        console.error("[SignUp] Verification incomplete:", result);
        setError(`Verification incomplete (status: ${result.status}). Please contact support.`);
      }
    } catch (err) {
      console.error("[SignUp] Verification error:", err);
      const clerkErr = err as { errors?: Array<{ message: string; longMessage?: string }> };
      setError(clerkErr.errors?.[0]?.longMessage || clerkErr.errors?.[0]?.message || "Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Email verification step (for invitations that require it)
  if (verifying) {
    return (
      <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        <div className="p-6 sm:p-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-[#1a1f3a]/10 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-[#1a1f3a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Verify your email
            </h1>
            <p className="text-gray-600">
              We&apos;ve sent a verification code to {formData.email}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleVerifyCode} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Verification Code
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="Enter 6-digit code"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:border-[#fbbf24] focus:ring-2 focus:ring-[#fbbf24]/20 transition-all outline-none text-center text-2xl tracking-widest font-mono"
                autoFocus
                maxLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={verificationCode.length !== 6 || isLoading}
              className={`w-full py-3.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                verificationCode.length === 6 && !isLoading
                  ? "bg-[#1a1f3a] text-white hover:bg-[#2d3561] shadow-lg shadow-[#1a1f3a]/25"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {isLoading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify & Continue"
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
      <div className="p-6 sm:p-10">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {isInvitation ? "Accept your invitation" : "Create your account"}
          </h1>
          <p className="text-gray-600">
            {isInvitation
              ? "Complete your profile to join your team on Frontera"
              : "Start your transformation journey with Frontera"}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => updateField("firstName", e.target.value)}
                placeholder="John"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:border-[#fbbf24] focus:ring-2 focus:ring-[#fbbf24]/20 transition-all outline-none"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => updateField("lastName", e.target.value)}
                placeholder="Smith"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:border-[#fbbf24] focus:ring-2 focus:ring-[#fbbf24]/20 transition-all outline-none"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="john.smith@company.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:border-[#fbbf24] focus:ring-2 focus:ring-[#fbbf24]/20 transition-all outline-none"
              required
            />
          </div>

          {/* Organization Name - only for non-invitation sign-ups */}
          {!isInvitation && (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Organization Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.organizationName}
                onChange={(e) => updateField("organizationName", e.target.value)}
                placeholder="Your company or team name"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:border-[#fbbf24] focus:ring-2 focus:ring-[#fbbf24]/20 transition-all outline-none"
                required
              />
              <p className="text-xs text-gray-500">
                This will be your organization in Frontera
              </p>
            </div>
          )}

          {/* Password fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => updateField("password", e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:border-[#fbbf24] focus:ring-2 focus:ring-[#fbbf24]/20 transition-all outline-none"
                required
                minLength={8}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => updateField("confirmPassword", e.target.value)}
                placeholder="Confirm your password"
                className={`w-full px-4 py-3 rounded-xl border bg-white text-gray-900 placeholder-gray-400 focus:ring-2 transition-all outline-none ${
                  formData.confirmPassword &&
                  formData.password !== formData.confirmPassword
                    ? "border-red-300 focus:border-red-400 focus:ring-red-200"
                    : "border-gray-200 focus:border-[#fbbf24] focus:ring-[#fbbf24]/20"
                }`}
                required
              />
            </div>
          </div>

          {formData.confirmPassword &&
            formData.password !== formData.confirmPassword && (
              <p className="text-sm text-red-600">Passwords do not match</p>
            )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={!isFormValid() || isLoading}
            className={`w-full py-3.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
              isFormValid() && !isLoading
                ? "bg-[#1a1f3a] text-white hover:bg-[#2d3561] shadow-lg shadow-[#1a1f3a]/25"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {isLoading ? (
              <>
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {isInvitation ? "Joining team..." : "Creating account..."}
              </>
            ) : (
              isInvitation ? "Join Team" : "Create Account"
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-100">
          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="text-[#1a1f3a] hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignUpForm() {
  return (
    <Suspense fallback={
      <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        <div className="p-6 sm:p-10 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#1a1f3a] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <SignUpFormInner />
    </Suspense>
  );
}
