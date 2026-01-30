import Link from "next/link";

export default function CTA() {
  return (
    <section id="cta" className="relative overflow-hidden bg-gradient-to-br from-[#1a1f3a] via-[#2d3561] to-[#0f172a] py-24 lg:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -right-20 h-80 w-80 rounded-full bg-[#fbbf24]/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-60 w-60 rounded-full bg-[#fbbf24]/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Ready to Transform Your{" "}
            <span className="bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] bg-clip-text text-transparent">
              Product Organisation?
            </span>
          </h2>
          <p className="mt-6 text-lg leading-8 text-slate-300">
            Complete our quick onboarding to get started. Tell us about your organisation 
            and goals, and we&apos;ll create a personalised transformation roadmap.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-lg">
          <div className="rounded-2xl bg-white/10 backdrop-blur-sm p-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] mb-6">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            
            <h3 className="text-xl font-semibold text-white mb-2">
              Start Your Journey
            </h3>
            <p className="text-slate-300 mb-8">
              Takes less than 5 minutes to complete
            </p>

            <Link
              href="/onboarding"
              className="inline-flex items-center justify-center gap-2 w-full rounded-full bg-[#fbbf24] py-4 text-base font-semibold text-slate-900 shadow-lg shadow-[#fbbf24]/25 transition-all duration-200 hover:bg-[#f59e0b] hover:shadow-xl"
            >
              Get in Contact
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>

            <p className="mt-4 text-center text-xs text-slate-400">
              No commitment required. We&apos;ll never share your information.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
