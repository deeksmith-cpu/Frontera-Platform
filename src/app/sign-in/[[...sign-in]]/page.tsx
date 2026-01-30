import { Suspense } from "react";
import Link from "next/link";
import SignInForm from "@/components/auth/SignInForm";
import Logo from "@/components/Logo";

export default function SignInPage() {
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
                <div className="w-8 h-8 border-4 border-[#1a1f3a] border-t-transparent rounded-full animate-spin" />
              </div>
            }
          >
            <SignInForm />
          </Suspense>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-6 text-center">
        <p className="text-sm text-gray-500">
          Protected by Frontera Security
        </p>
      </footer>
    </div>
  );
}
