"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSignIn, useUser } from "@clerk/nextjs";
import Link from "next/link";
import type { SignInFormData } from "@/types/auth";

const INITIAL_FORM_DATA: SignInFormData = {
  email: "",
  password: "",
};

type VerificationStep = "credentials" | "second_factor";

export default function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, setActive, isLoaded } = useSignIn();
  const { isSignedIn, isLoaded: userLoaded } = useUser();
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState<SignInFormData>(INITIAL_FORM_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // 2FA state
  const [verificationStep, setVerificationStep] = useState<VerificationStep>("credentials");
  const [verificationCode, setVerificationCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);

  // Prevent hydration mismatch by waiting for client-side mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect if already signed in - only after mount
  useEffect(() => {
    if (mounted && userLoaded && isSignedIn) {
      // Use replace instead of push to avoid back button issues
      router.replace("/dashboard");
    }
  }, [mounted, userLoaded, isSignedIn, router]);

  useEffect(() => {
    if (mounted && searchParams.get("registered") === "true") {
      setShowSuccess(true);
    }
  }, [mounted, searchParams]);

  const handleOAuthSignIn = async (provider: "oauth_google" | "oauth_microsoft" | "oauth_apple") => {
    if (!isLoaded || !signIn) return;

    setOauthLoading(provider);
    setError(null);

    try {
      await signIn.authenticateWithRedirect({
        strategy: provider,
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/dashboard",
      });
    } catch (err: unknown) {
      const error = err as { errors?: Array<{ message: string }> };
      setError(error.errors?.[0]?.message || "OAuth sign-in failed");
      setOauthLoading(null);
    }
  };

  const updateField = (field: keyof SignInFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const isFormValid = () => {
    return formData.email.trim() !== "" && formData.password.length >= 1;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoaded || !signIn) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn.create({
        identifier: formData.email,
        password: formData.password,
      });

      console.log("Sign-in result:", {
        status: result.status,
        firstFactorVerification: result.firstFactorVerification,
        secondFactorVerification: result.secondFactorVerification,
        identifier: result.identifier,
        supportedFirstFactors: result.supportedFirstFactors,
        supportedSecondFactors: result.supportedSecondFactors,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/dashboard");
      } else if (result.status === "needs_first_factor") {
        // Password was wrong or first factor verification needed
        const factors = result.supportedFirstFactors?.map(f => f.strategy).join(", ");
        setError(`First factor verification needed. Available methods: ${factors || "none"}`);
      } else if (result.status === "needs_second_factor") {
        // 2FA is enabled - transition to verification step
        console.log("Second factor required, supported methods:", result.supportedSecondFactors);
        setVerificationStep("second_factor");
        setError(null);
      } else if (result.status === "needs_identifier") {
        setError("Please enter your email address");
      } else if (result.status === "needs_new_password") {
        setError("Password reset required. Please use the 'Forgot password?' link.");
      } else {
        // Unknown status
        setError(`Verification required (status: ${result.status}). Please check your Clerk dashboard settings.`);
      }
    } catch (err: unknown) {
      console.error("Sign-in error:", err);
      const error = err as { errors?: Array<{ code?: string; message: string; longMessage?: string }> };
      const firstError = error.errors?.[0];

      // Provide more specific error messages based on error code
      if (firstError?.code === "form_password_incorrect") {
        setError("Incorrect password. Please try again.");
      } else if (firstError?.code === "form_identifier_not_found") {
        setError("No account found with this email. Please sign up first.");
      } else if (firstError?.code === "session_exists") {
        setError("You're already signed in. Redirecting...");
        router.push("/dashboard");
      } else {
        const message = firstError?.longMessage ||
                       firstError?.message ||
                       "Sign-in failed. Please try again.";
        setError(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Send email verification code for 2FA
  const handleSendEmailCode = async () => {
    if (!signIn) return;

    setSendingCode(true);
    setError(null);

    try {
      // Prepare the second factor with email code
      const result = await signIn.prepareSecondFactor({
        strategy: "email_code",
      });

      console.log("Email code prepared:", result);
      setCodeSent(true);
      setError(null);
    } catch (err: unknown) {
      console.error("Error sending email code:", err);
      const error = err as { errors?: Array<{ message: string; longMessage?: string }> };
      setError(error.errors?.[0]?.longMessage || error.errors?.[0]?.message || "Failed to send verification code");
    } finally {
      setSendingCode(false);
    }
  };

  // Verify the 2FA code
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!signIn || !verificationCode) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn.attemptSecondFactor({
        strategy: "email_code",
        code: verificationCode,
      });

      console.log("Second factor verification result:", result);

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/dashboard");
      } else {
        setError(`Verification incomplete (status: ${result.status})`);
      }
    } catch (err: unknown) {
      console.error("Error verifying code:", err);
      const error = err as { errors?: Array<{ code?: string; message: string; longMessage?: string }> };
      const firstError = error.errors?.[0];

      if (firstError?.code === "form_code_incorrect") {
        setError("Incorrect verification code. Please try again.");
      } else {
        setError(firstError?.longMessage || firstError?.message || "Verification failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Go back to credentials step
  const handleBackToCredentials = () => {
    setVerificationStep("credentials");
    setVerificationCode("");
    setCodeSent(false);
    setError(null);
  };

  const isReady = mounted && isLoaded && userLoaded;

  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
      {/* Loading state */}
      {!isReady && (
        <div className="p-6 sm:p-10 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#1a1f3a] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      )}

      {/* Main form - hidden until ready */}
      <div className={`p-6 sm:p-10 ${!isReady ? 'hidden' : ''}`}>
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back
          </h1>
          <p className="text-gray-600">
            Sign in to continue your transformation journey
          </p>
        </div>

        {showSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
            Account created successfully! Please sign in.
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Second Factor Verification UI */}
        {verificationStep === "second_factor" && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#1a1f3a]/10 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-[#1a1f3a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Two-Factor Authentication
              </h2>
              <p className="text-gray-600 text-sm">
                {codeSent
                  ? `We've sent a verification code to ${formData.email}`
                  : "Click below to receive a verification code via email"
                }
              </p>
            </div>

            {!codeSent ? (
              <button
                type="button"
                onClick={handleSendEmailCode}
                disabled={sendingCode}
                className="w-full py-3.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 bg-[#1a1f3a] text-white hover:bg-[#2d3561] shadow-lg shadow-[#1a1f3a]/25 disabled:opacity-50"
              >
                {sendingCode ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending code...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Send Verification Code
                  </>
                )}
              </button>
            ) : (
              <form onSubmit={handleVerifyCode} className="space-y-4">
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
                    "Verify & Sign In"
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleSendEmailCode}
                  disabled={sendingCode}
                  className="w-full text-sm text-[#1a1f3a] hover:underline disabled:opacity-50"
                >
                  {sendingCode ? "Sending..." : "Resend code"}
                </button>
              </form>
            )}

            <button
              type="button"
              onClick={handleBackToCredentials}
              className="w-full text-sm text-gray-500 hover:text-gray-700"
            >
              ← Back to sign in
            </button>
          </div>
        )}

        {/* Credentials Form - only show when not in 2FA step */}
        {verificationStep === "credentials" && (
          <>
        {/* OAuth Providers */}
        <div className="space-y-3 mb-6">
          <button
            type="button"
            onClick={() => handleOAuthSignIn("oauth_google")}
            disabled={!!oauthLoading || !isLoaded}
            className="w-full py-3 px-4 rounded-xl border border-gray-200 bg-white text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {oauthLoading === "oauth_google" ? (
              <span className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            )}
            Continue with Google
          </button>

          <button
            type="button"
            onClick={() => handleOAuthSignIn("oauth_microsoft")}
            disabled={!!oauthLoading || !isLoaded}
            className="w-full py-3 px-4 rounded-xl border border-gray-200 bg-white text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {oauthLoading === "oauth_microsoft" ? (
              <span className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 23 23">
                <path fill="#f35325" d="M1 1h10v10H1z" />
                <path fill="#81bc06" d="M12 1h10v10H12z" />
                <path fill="#05a6f0" d="M1 12h10v10H1z" />
                <path fill="#ffba08" d="M12 12h10v10H12z" />
              </svg>
            )}
            Continue with Microsoft
          </button>
        </div>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">or continue with email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Email Address
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

          {/* Password */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-gray-700">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-[#1a1f3a] hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => updateField("password", e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:border-[#fbbf24] focus:ring-2 focus:ring-[#fbbf24]/20 transition-all outline-none"
              required
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={!isFormValid() || isLoading || !isLoaded}
            className={`w-full py-3.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
              isFormValid() && !isLoading && isLoaded
                ? "bg-[#1a1f3a] text-white hover:bg-[#2d3561] shadow-lg shadow-[#1a1f3a]/25"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {isLoading ? (
              <>
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-100">
          <p className="text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link
              href="/sign-up"
              className="text-[#1a1f3a] hover:underline font-medium"
            >
              Create one
            </Link>
          </p>
        </div>
          </>
        )}
      </div>
    </div>
  );
}
