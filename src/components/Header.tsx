"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth, UserButton } from "@clerk/nextjs";

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
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#1a1f3a] shadow-md">
        <nav className="mx-auto max-w-7xl py-5 px-10" aria-label="Global">
          <div className="flex items-center justify-between">
            <div className="flex lg:flex-1">
              <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2.5">
                <Image src="/frontera-logo-white.jpg" alt="Frontera" width={140} height={36} className="h-9 w-auto object-contain" />
              </Link>
            </div>
            <div className="h-9 w-32" /> {/* Placeholder to prevent layout shift */}
          </div>
        </nav>
      </header>
    );
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#1a1f3a] shadow-md">
      <nav className="mx-auto max-w-7xl py-5 px-10" aria-label="Global">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex lg:flex-1">
            <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2.5">
              <Image src="/frontera-logo-white.jpg" alt="Frontera" width={140} height={36} className="h-9 w-auto object-contain" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-lg p-2.5 text-white/80 hover:text-white transition-colors duration-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
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
              <Link href="/#problem" className="text-sm font-semibold text-white/70 hover:text-white transition-colors duration-300">
                Why Frontera
              </Link>
              <Link href="/#solution" className="text-sm font-semibold text-white/70 hover:text-white transition-colors duration-300">
                Platform
              </Link>
              <Link href="/#pricing" className="text-sm font-semibold text-white/70 hover:text-white transition-colors duration-300">
                Pricing
              </Link>
              <Link href="/#testimonial" className="text-sm font-semibold text-white/70 hover:text-white transition-colors duration-300">
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
                  className="inline-flex items-center justify-center rounded-lg border border-white/20 bg-transparent px-6 py-2.5 text-sm font-semibold text-white transition-colors duration-300 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#fbbf24] focus:ring-offset-2 focus:ring-offset-[#1a1f3a]"
                >
                  Sign In
                </Link>
                <Link
                  href="/onboarding"
                  className="inline-flex items-center justify-center rounded-lg bg-[#fbbf24] px-6 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition-all duration-300 hover:bg-[#f59e0b] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#fbbf24] focus:ring-offset-2 focus:ring-offset-[#1a1f3a]"
                >
                  Get Started
                </Link>
              </>
            )}

            {isSignedIn && (
              <>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold text-white/70 transition-all duration-300 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#fbbf24] focus:ring-offset-2 focus:ring-offset-[#1a1f3a] active:bg-white/20 active:scale-95"
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/team"
                  className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold text-white/70 transition-all duration-300 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#fbbf24] focus:ring-offset-2 focus:ring-offset-[#1a1f3a] active:bg-white/20 active:scale-95"
                >
                  Team
                </Link>
                <UserButton
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
          <div className="lg:hidden border-t border-white/10">
            <div className="space-y-1 pb-4 pt-2">
              {!isSignedIn && (
                <>
                  <Link
                    href="/#problem"
                    className="block px-3 py-2 text-base font-semibold text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Why Frontera
                  </Link>
                  <Link
                    href="/#solution"
                    className="block px-3 py-2 text-base font-semibold text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Platform
                  </Link>
                  <Link
                    href="/#pricing"
                    className="block px-3 py-2 text-base font-semibold text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Pricing
                  </Link>
                  <Link
                    href="/#testimonial"
                    className="block px-3 py-2 text-base font-semibold text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Case Studies
                  </Link>
                  <Link
                    href="/sign-in"
                    className="block px-3 py-2 text-base font-semibold text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/onboarding"
                    className="block mt-4 text-center rounded-lg bg-[#fbbf24] px-6 py-3 text-base font-semibold text-slate-900 transition-colors duration-300 hover:bg-[#f59e0b]"
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
                    className="block px-3 py-2 text-base font-semibold text-white rounded-lg transition-all duration-300 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#fbbf24] active:bg-white/20"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/dashboard/team"
                    className="block px-3 py-2 text-base font-semibold text-white/70 rounded-lg transition-all duration-300 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#fbbf24] active:bg-white/20"
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
