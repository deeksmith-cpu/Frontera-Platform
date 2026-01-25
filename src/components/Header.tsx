"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth, UserButton } from "@clerk/nextjs";
import Logo from "./Logo";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isSignedIn, isLoaded } = useAuth();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by waiting for client-side mount
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Show nothing until component is mounted and auth is loaded
  if (!mounted || !isLoaded) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-100">
        <nav className="mx-auto max-w-7xl px-6 lg:px-8" aria-label="Global">
          <div className="flex items-center justify-between py-4">
            <div className="flex lg:flex-1">
              <Link href="/" className="-m-1.5 p-1.5">
                <Logo variant="dark" />
              </Link>
            </div>
            <div className="h-9 w-32" /> {/* Placeholder to prevent layout shift */}
          </div>
        </nav>
      </header>
    );
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-100">
      <nav className="mx-auto max-w-7xl px-6 lg:px-8" aria-label="Global">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex lg:flex-1">
            <Link href="/" className="-m-1.5 p-1.5">
              <Logo variant="dark" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-slate-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>

          {/* Desktop nav */}
          {!isSignedIn && (
            <div className="hidden lg:flex lg:gap-x-10">
              <Link href="/#problem" className="text-sm font-medium text-slate-600 hover:text-[#1e3a8a] transition-colors">
                Why Frontera
              </Link>
              <Link href="/#solution" className="text-sm font-medium text-slate-600 hover:text-[#1e3a8a] transition-colors">
                Platform
              </Link>
              <Link href="/#pricing" className="text-sm font-medium text-slate-600 hover:text-[#1e3a8a] transition-colors">
                Pricing
              </Link>
              <Link href="/#testimonial" className="text-sm font-medium text-slate-600 hover:text-[#1e3a8a] transition-colors">
                Case Studies
              </Link>
            </div>
          )}

          {/* CTA + Auth */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:gap-x-4">
            {!isSignedIn && (
              <>
                <Link
                  href="/sign-in"
                  className="text-sm font-medium text-slate-600 hover:text-[#1e3a8a] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/onboarding"
                  className="rounded-full bg-[#1e3a8a] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#1e2a5e] transition-all duration-200 hover:shadow-lg"
                >
                  Get Started
                </Link>
              </>
            )}

            {isSignedIn && (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-slate-600 hover:text-[#1e3a8a] transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/team"
                  className="text-sm font-medium text-slate-600 hover:text-[#1e3a8a] transition-colors"
                >
                  Team
                </Link>
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "h-9 w-9",
                    },
                  }}
                />
              </>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden">
            <div className="space-y-1 pb-4">
              {!isSignedIn && (
                <>
                  <Link
                    href="/#problem"
                    className="block px-3 py-2 text-base font-medium text-slate-600 hover:text-[#1e3a8a] hover:bg-slate-50 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Why Frontera
                  </Link>
                  <Link
                    href="/#solution"
                    className="block px-3 py-2 text-base font-medium text-slate-600 hover:text-[#1e3a8a] hover:bg-slate-50 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Platform
                  </Link>
                  <Link
                    href="/#pricing"
                    className="block px-3 py-2 text-base font-medium text-slate-600 hover:text-[#1e3a8a] hover:bg-slate-50 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Pricing
                  </Link>
                  <Link
                    href="/#testimonial"
                    className="block px-3 py-2 text-base font-medium text-slate-600 hover:text-[#1e3a8a] hover:bg-slate-50 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Case Studies
                  </Link>
                  <Link
                    href="/sign-in"
                    className="block px-3 py-2 text-base font-medium text-slate-600 hover:text-[#1e3a8a] hover:bg-slate-50 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/onboarding"
                    className="block mt-4 text-center rounded-full bg-[#1e3a8a] px-6 py-3 text-base font-semibold text-white"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}

              {isSignedIn && (
                <>
                  <Link
                    href="/dashboard"
                    className="block px-3 py-2 text-base font-medium text-[#1e3a8a] hover:bg-slate-50 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/dashboard/team"
                    className="block px-3 py-2 text-base font-medium text-slate-600 hover:text-[#1e3a8a] hover:bg-slate-50 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Team
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
