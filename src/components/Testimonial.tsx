export default function Testimonial() {
  return (
    <section id="testimonial" className="bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#06b6d4]">Case Study</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Real Results, Not Transformation Theatre
          </h2>
        </div>

        <div className="mx-auto mt-16 max-w-4xl">
          {/* Main testimonial card */}
          <div className="relative rounded-3xl bg-gradient-to-br from-slate-50 to-slate-100 p-8 lg:p-12">
            {/* Quote mark */}
            <div className="absolute -top-4 left-10 text-8xl font-serif text-[#06b6d4]/20">&ldquo;</div>

            <div className="relative">
              {/* Company logo placeholder */}
              <div className="mb-8 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#1e3a8a] text-white font-bold text-xl">
                  A
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Aberdeen</div>
                  <div className="text-sm text-slate-500">UK Wealth & Investment Platform</div>
                </div>
              </div>

              {/* Quote - actual quote from strategy document */}
              <blockquote className="text-xl leading-relaxed text-slate-700 lg:text-2xl lg:leading-relaxed">
                &ldquo;Frontera helped us do what the big consultancies never could —{" "}
                <span className="font-semibold text-[#1e3a8a]">translate strategy into action, and outcomes into culture</span>.
                We now coach capability, not compliance.&rdquo;
              </blockquote>

              {/* Attribution */}
              <div className="mt-8 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#1e3a8a] to-[#06b6d4]" />
                <div>
                  <div className="font-semibold text-slate-900">Chief Product & Technology Officer</div>
                  <div className="text-sm text-slate-600">Aberdeen</div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-2 gap-6 lg:grid-cols-4">
            <div className="rounded-2xl bg-slate-50 p-6 text-center">
              <div className="text-3xl font-bold text-[#1e3a8a]">6 mo</div>
              <div className="mt-1 text-sm text-slate-600">Time to Value</div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-6 text-center">
              <div className="text-3xl font-bold text-[#1e3a8a]">Company-wide</div>
              <div className="mt-1 text-sm text-slate-600">Product Strategy Launched</div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-6 text-center">
              <div className="text-3xl font-bold text-[#1e3a8a]">North Star</div>
              <div className="mt-1 text-sm text-slate-600">Metrics Across Verticals</div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-6 text-center">
              <div className="text-3xl font-bold text-[#1e3a8a]">OKR</div>
              <div className="mt-1 text-sm text-slate-600">Alignment to Team Level</div>
            </div>
          </div>

          {/* What Aberdeen achieved */}
          <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">What Aberdeen Achieved with Frontera</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <svg className="h-5 w-5 shrink-0 text-[#06b6d4] mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <span className="text-slate-600">Replaced static product transformation program with living, adaptive system</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="h-5 w-5 shrink-0 text-[#06b6d4] mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <span className="text-slate-600">Launched new company-level product strategy in months, not years</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="h-5 w-5 shrink-0 text-[#06b6d4] mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <span className="text-slate-600">Defined North Star metrics across all verticals</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="h-5 w-5 shrink-0 text-[#06b6d4] mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <span className="text-slate-600">Embedded OKR alignment from executive to team level</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
