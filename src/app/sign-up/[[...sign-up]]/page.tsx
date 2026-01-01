import { Suspense } from "react";
import Link from "next/link";
import SignUpForm from "@/components/auth/SignUpForm";
import Logo from "@/components/Logo";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-cyan-50">
      {/* Header */}
      <header className="py-6 px-6">
        <Link href="/" className="inline-block">
          <Logo variant="dark" />
        </Link>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <Suspense
            fallback={
              <div className="flex items-center justify-center p-10">
                <div className="w-8 h-8 border-4 border-[#1e3a8a] border-t-transparent rounded-full animate-spin" />
              </div>
            }
          >
            <SignUpForm />
          </Suspense>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-6 text-center">
        <p className="text-sm text-gray-500">
          By creating an account, you agree to our{" "}
          <Link href="/terms" className="text-[#1e3a8a] hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-[#1e3a8a] hover:underline">
            Privacy Policy
          </Link>
        </p>
      </footer>
    </div>
  );
}
