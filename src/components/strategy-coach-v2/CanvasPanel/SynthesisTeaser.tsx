'use client';

export function SynthesisTeaser() {
  return (
    <section className="synthesis-teaser mb-16">
      <div className="section-header mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-[#1a1f3a]/10 flex items-center justify-center text-slate-500 font-bold text-sm">
            3
          </div>
          <h3 className="text-3xl font-bold text-slate-900">Synthesis</h3>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full">
            Coming Next
          </span>
        </div>
        <p className="text-base text-slate-500 ml-[52px] leading-relaxed">
          Cross-pillar insights and strategic opportunities will emerge here
        </p>
      </div>

      <div className="group relative bg-white border border-slate-100 rounded-2xl p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-[#fbbf24]/40 overflow-hidden">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1f3a]/5 via-[#fbbf24]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative z-10 flex items-start gap-6">
          {/* Icon */}
          <div className="w-16 h-16 rounded-xl bg-[#1a1f3a]/10 flex items-center justify-center text-[#1a1f3a] flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="8" cy="16" r="4" stroke="currentColor" strokeWidth="2" />
              <circle cx="24" cy="10" r="4" stroke="currentColor" strokeWidth="2" />
              <circle cx="24" cy="22" r="4" stroke="currentColor" strokeWidth="2" />
              <path d="M12 16H20M20 13L23 10M20 19L23 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>

          {/* Content */}
          <div className="flex-1">
            <h4 className="text-xl font-bold text-slate-900 mb-3">
              Strategic Synthesis Awaits
            </h4>
            <p className="text-sm text-slate-500 leading-relaxed mb-6">
              Once you&apos;ve mapped your strategic terrain across Company, Customer, and Competitor pillars,
              we&apos;ll synthesize cross-pillar insights to identify strategic opportunities and validated problems.
            </p>

            <div className="grid grid-cols-3 gap-4 mb-5">
              <div className="synthesis-preview-item bg-white border border-slate-100 rounded-xl p-4 transition-all duration-300 hover:border-[#fbbf24]/40 hover:shadow-md">
                <div className="w-10 h-10 rounded-lg bg-[#fbbf24]/10 flex items-center justify-center text-[#fbbf24] mb-2.5">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 4L17 8V14L10 18L3 14V8L10 4Z" stroke="currentColor" strokeWidth="2" />
                    <circle cx="10" cy="11" r="2.5" fill="currentColor" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-slate-700">Market Opportunities</span>
              </div>

              <div className="synthesis-preview-item bg-white border border-slate-100 rounded-xl p-4 transition-all duration-300 hover:border-[#1a1f3a]/30 hover:shadow-md">
                <div className="w-10 h-10 rounded-lg bg-[#1a1f3a]/10 flex items-center justify-center text-[#1a1f3a] mb-2.5">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4 10L8 14L16 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-slate-700">Validated Problems</span>
              </div>

              <div className="synthesis-preview-item bg-white border border-slate-100 rounded-xl p-4 transition-all duration-300 hover:border-emerald-200 hover:shadow-md">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center text-emerald-600 mb-2.5">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 3V10M10 10L13 7M10 10L7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M4 15H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-slate-700">Org Readiness</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 text-sm text-slate-400">
              <div className="w-1.5 h-1.5 rounded-full bg-[#fbbf24]" />
              <span>Complete at least 2 pillars to unlock synthesis</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
