import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#1e3a8a] via-[#1e2a5e] to-[#0f172a] pt-32 pb-20 lg:pt-40 lg:pb-32">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-[#06b6d4]/10 blur-3xl" />
        <div className="absolute top-1/2 -left-20 h-60 w-60 rounded-full bg-[#06b6d4]/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-40 w-40 rounded-full bg-[#22d3ee]/10 blur-2xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#06b6d4]/30 bg-[#06b6d4]/10 px-4 py-1.5">
            <span className="h-2 w-2 rounded-full bg-[#06b6d4] animate-pulse" />
            <span className="text-sm font-medium text-[#22d3ee]">AI-Powered Product Strategy</span>
          </div>

          {/* Main headline */}
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Product Model Transformations{" "}
            <span className="block mt-2 bg-gradient-to-r from-[#06b6d4] to-[#22d3ee] bg-clip-text text-transparent">
              Are Failing Enterprises
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
            70% of enterprise transformations fail to deliver expected value.
            Frontera&apos;s AI coaching platform gives your teams the strategic guidance
            they need to build products that drive real business outcomes.
          </p>

          {/* Stats row */}
          <div className="mt-12 grid grid-cols-3 gap-8 border-t border-white/10 pt-10 sm:gap-12">
            <div>
              <div className="text-3xl font-bold text-[#06b6d4] sm:text-4xl">70%</div>
              <div className="mt-1 text-sm text-slate-400">Transformations Fail</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#06b6d4] sm:text-4xl">£2.3M</div>
              <div className="mt-1 text-sm text-slate-400">Average Cost Overrun</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#06b6d4] sm:text-4xl">18mo</div>
              <div className="mt-1 text-sm text-slate-400">Typical Delay</div>
            </div>
          </div>

          {/* CTAs */}
          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
            <Link
              href="#cta"
              className="inline-flex items-center justify-center rounded-full bg-[#06b6d4] px-8 py-4 text-base font-semibold text-white shadow-lg shadow-[#06b6d4]/25 transition-all duration-200 hover:bg-[#22d3ee] hover:shadow-xl hover:shadow-[#06b6d4]/30"
            >
              Book a Demo
              <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <Link
              href="#solution"
              className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/10"
            >
              See How It Works
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
