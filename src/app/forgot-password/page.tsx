"use client";

import { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";

export default function ForgotPasswordPage() {
  const { signIn, isLoaded } = useSignIn();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [step, setStep] = useState<"email" | "code" | "newPassword">("email");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !signIn) return;

    setIsLoading(true);
    setError(null);

    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });
      setSuccessMessage(`We've sent a password reset code to ${email}`);
      setStep("code");
    } catch (err: unknown) {
      const error = err as { errors?: Array<{ message: string; longMessage?: string }> };
      setError(error.errors?.[0]?.longMessage || error.errors?.[0]?.message || "Failed to send reset code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !signIn) return;

    setIsLoading(true);
    setError(null);

    try {
      await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
      });
      setStep("newPassword");
      setSuccessMessage(null);
    } catch (err: unknown) {
      const error = err as { errors?: Array<{ message: string; longMessage?: string }> };
      setError(error.errors?.[0]?.longMessage || error.errors?.[0]?.message || "Invalid code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !signIn) return;

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await signIn.resetPassword({
        password: newPassword,
      });
      setSuccessMessage("Password reset successfully! Redirecting to sign in...");
      setTimeout(() => {
        window.location.href = "/sign-in";
      }, 2000);
    } catch (err: unknown) {
      const error = err as { errors?: Array<{ message: string; longMessage?: string }> };
      setError(error.errors?.[0]?.longMessage || error.errors?.[0]?.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <Image
              src="/frontera-logo-F.jpg"
              alt="Frontera"
              width={64}
              height={64}
              className="mx-auto rounded-xl shadow-lg"
            />
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden p-6 sm:p-10">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {step === "email" && "Reset your password"}
              {step === "code" && "Enter verification code"}
              {step === "newPassword" && "Set new password"}
            </h1>
            <p className="text-gray-600">
              {step === "email" && "Enter your email and we'll send you a reset code"}
              {step === "code" && "Check your email for the verification code"}
              {step === "newPassword" && "Choose a strong password for your account"}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
              {successMessage}
            </div>
          )}

          {/* Step 1: Email */}
          {step === "email" && (
            <form onSubmit={handleSendCode} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john.smith@company.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:border-[#fbbf24] focus:ring-2 focus:ring-[#fbbf24]/20 transition-all outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={!email || isLoading || !isLoaded}
                className={`w-full py-3.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                  email && !isLoading && isLoaded
                    ? "bg-[#1a1f3a] text-white hover:bg-[#2d3561] shadow-lg shadow-[#1a1f3a]/25"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                {isLoading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Reset Code"
                )}
              </button>
            </form>
          )}

          {/* Step 2: Verification Code */}
          {step === "code" && (
            <form onSubmit={handleVerifyCode} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="Enter 6-digit code"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:border-[#fbbf24] focus:ring-2 focus:ring-[#fbbf24]/20 transition-all outline-none text-center text-2xl tracking-widest font-mono"
                  maxLength={6}
                  autoFocus
                  required
                />
              </div>

              <button
                type="submit"
                disabled={code.length !== 6 || isLoading}
                className={`w-full py-3.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                  code.length === 6 && !isLoading
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
                  "Verify Code"
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep("email");
                  setCode("");
                  setError(null);
                  setSuccessMessage(null);
                }}
                className="w-full text-sm text-gray-500 hover:text-gray-700"
              >
                Back to email
              </button>
            </form>
          )}

          {/* Step 3: New Password */}
          {step === "newPassword" && (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:border-[#fbbf24] focus:ring-2 focus:ring-[#fbbf24]/20 transition-all outline-none"
                  required
                  minLength={8}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:border-[#fbbf24] focus:ring-2 focus:ring-[#fbbf24]/20 transition-all outline-none"
                  required
                  minLength={8}
                />
              </div>

              <button
                type="submit"
                disabled={!newPassword || !confirmPassword || isLoading}
                className={`w-full py-3.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                  newPassword && confirmPassword && !isLoading
                    ? "bg-[#1a1f3a] text-white hover:bg-[#2d3561] shadow-lg shadow-[#1a1f3a]/25"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                {isLoading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Resetting...
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-center text-sm text-gray-600">
              Remember your password?{" "}
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
    </div>
  );
}
