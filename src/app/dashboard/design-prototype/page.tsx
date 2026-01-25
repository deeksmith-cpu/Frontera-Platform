import Link from 'next/link';

export default function DesignPrototypePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Header */}
      <header className="bg-white border-b-2 border-slate-200 px-8 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-900 mb-1">Bold Design System Prototype</h1>
            <p className="text-sm text-slate-600">Preview of Linear + Stripe + Amplitude inspired design</p>
          </div>
          <Link
            href="/dashboard"
            className="px-4 py-2 border-2 border-slate-300 rounded-xl text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-8 space-y-12">

        {/* Section 1: Phase Colors */}
        <section>
          <h2 className="text-4xl font-bold text-slate-900 mb-6">Phase Colors</h2>
          <p className="text-lg text-slate-600 mb-8">Bold, distinctive colors for each phase of the journey</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Discovery */}
            <div className="bg-white rounded-2xl border-3 border-emerald-400 p-8 shadow-xl shadow-emerald-500/20 hover:-translate-y-1 transition-all">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/30">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Discovery</h3>
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 mb-3">Context Setting</p>
              <p className="text-sm text-slate-600">Vibrant Emerald (#10B981)</p>
            </div>

            {/* Landscape */}
            <div className="bg-white rounded-2xl border-3 border-amber-400 p-8 shadow-xl shadow-amber-500/20 hover:-translate-y-1 transition-all">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center mb-4 shadow-lg shadow-amber-500/30">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Landscape</h3>
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-600 mb-3">Terrain Mapping</p>
              <p className="text-sm text-slate-600">Bold Amber (#F59E0B)</p>
            </div>

            {/* Synthesis */}
            <div className="bg-white rounded-2xl border-3 border-purple-400 p-8 shadow-xl shadow-purple-500/20 hover:-translate-y-1 transition-all">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center mb-4 shadow-lg shadow-purple-500/30">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Synthesis</h3>
              <p className="text-xs font-semibold uppercase tracking-wider text-purple-600 mb-3">Strategy Formation</p>
              <p className="text-sm text-slate-600">Rich Purple (#9333EA)</p>
            </div>

            {/* Strategic Bets */}
            <div className="bg-white rounded-2xl border-3 border-cyan-400 p-8 shadow-xl shadow-cyan-500/20 hover:-translate-y-1 transition-all">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/30">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Strategic Bets</h3>
              <p className="text-xs font-semibold uppercase tracking-wider text-cyan-600 mb-3">Route Planning</p>
              <p className="text-sm text-slate-600">Strong Cyan (#06B6D4)</p>
            </div>
          </div>
        </section>

        {/* Section 2: Typography Hierarchy */}
        <section className="bg-white rounded-3xl border-2 border-slate-200 p-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">Typography Hierarchy</h2>
          <p className="text-lg text-slate-600 mb-8">Variable weights (300-900) create strong visual distinction</p>

          <div className="space-y-6">
            <div>
              <h1 className="text-5xl font-black text-slate-900 mb-2">Hero Heading (48px, Weight 900)</h1>
              <p className="text-sm text-slate-500 font-mono">text-5xl font-black</p>
            </div>
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-2">Phase Title (36px, Weight 700)</h2>
              <p className="text-sm text-slate-500 font-mono">text-4xl font-bold</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-slate-900 mb-2">Section Heading (30px, Weight 700)</h3>
              <p className="text-sm text-slate-500 font-mono">text-3xl font-bold</p>
            </div>
            <div>
              <h4 className="text-2xl font-semibold text-slate-900 mb-2">Subsection (24px, Weight 600)</h4>
              <p className="text-sm text-slate-500 font-mono">text-2xl font-semibold</p>
            </div>
            <div>
              <p className="text-lg font-normal text-slate-700 mb-2">Body Large (18px, Weight 400) - For important descriptions and key messages that need emphasis without being headings.</p>
              <p className="text-sm text-slate-500 font-mono">text-lg font-normal</p>
            </div>
            <div>
              <p className="text-base font-normal text-slate-700 mb-2">Body Text (16px, Weight 400) - Standard body text for paragraphs, descriptions, and general content throughout the interface.</p>
              <p className="text-sm text-slate-500 font-mono">text-base font-normal</p>
            </div>
          </div>
        </section>

        {/* Section 3: Progress Stepper */}
        <section>
          <h2 className="text-4xl font-bold text-slate-900 mb-6">Progress Stepper</h2>
          <p className="text-lg text-slate-600 mb-8">Bold phase colors with larger circles and colored shadows</p>

          <div className="bg-white rounded-3xl border-2 border-slate-200 p-12">
            <div className="flex items-center justify-between max-w-5xl mx-auto">
              {/* Step 1 - Completed */}
              <div className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30 mb-3">
                    <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <div className="text-base font-bold text-slate-900">Discovery</div>
                    <div className="text-xs uppercase tracking-wider font-semibold text-emerald-600 mt-1">Context Setting</div>
                  </div>
                </div>
                <div className="h-1 flex-1 mx-4 bg-gradient-to-r from-emerald-500 to-amber-500" />
              </div>

              {/* Step 2 - Current */}
              <div className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-xl shadow-amber-500/40 scale-110 mb-3">
                    <span className="text-white font-black text-xl">2</span>
                  </div>
                  <div className="text-center">
                    <div className="text-base font-bold text-slate-900">Landscape</div>
                    <div className="text-xs uppercase tracking-wider font-bold text-amber-600 mt-1">Terrain Mapping</div>
                    <div className="mt-2 flex items-center justify-center gap-1 text-[10px] uppercase tracking-wide text-cyan-600 font-semibold">
                      <span className="w-2 h-2 rounded-full bg-cyan-600 animate-pulse" />
                      You Are Here
                    </div>
                  </div>
                </div>
                <div className="h-1 flex-1 mx-4 bg-slate-200" />
              </div>

              {/* Step 3 - Future */}
              <div className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className="w-14 h-14 rounded-full bg-slate-200 flex items-center justify-center mb-3">
                    <span className="text-slate-500 font-bold text-xl">3</span>
                  </div>
                  <div className="text-center">
                    <div className="text-base font-semibold text-slate-500">Synthesis</div>
                    <div className="text-xs uppercase tracking-wider font-medium text-slate-400 mt-1">Strategy Formation</div>
                  </div>
                </div>
                <div className="h-1 flex-1 mx-4 bg-slate-200" />
              </div>

              {/* Step 4 - Future */}
              <div className="flex flex-col items-center flex-1">
                <div className="w-14 h-14 rounded-full bg-slate-200 flex items-center justify-center mb-3">
                  <span className="text-slate-500 font-bold text-xl">4</span>
                </div>
                <div className="text-center">
                  <div className="text-base font-semibold text-slate-500">Strategic Bets</div>
                  <div className="text-xs uppercase tracking-wider font-medium text-slate-400 mt-1">Route Planning</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Buttons & CTAs */}
        <section>
          <h2 className="text-4xl font-bold text-slate-900 mb-6">Buttons & CTAs</h2>
          <p className="text-lg text-slate-600 mb-8">Bold gradients with colored shadows and strong hover states</p>

          <div className="bg-white rounded-3xl border-2 border-slate-200 p-12 space-y-8">
            {/* Primary Buttons */}
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Primary CTAs</h3>
              <div className="flex flex-wrap gap-4">
                <button className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl font-bold text-base shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all">
                  Primary Action
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>

                <button className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all">
                  Begin Discovery
                </button>

                <button className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-bold shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:-translate-y-0.5 transition-all">
                  View Synthesis
                </button>
              </div>
            </div>

            {/* Secondary Buttons */}
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Secondary Actions</h3>
              <div className="flex flex-wrap gap-4">
                <button className="px-6 py-3 border-2 border-slate-300 rounded-xl text-slate-700 font-semibold hover:bg-slate-50 hover:border-indigo-300 transition-colors">
                  Secondary Action
                </button>

                <button className="px-6 py-3 border-2 border-emerald-300 rounded-xl text-emerald-700 font-semibold hover:bg-emerald-50 hover:border-emerald-400 transition-colors">
                  Save Progress
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Badges & Status Indicators */}
        <section>
          <h2 className="text-4xl font-bold text-slate-900 mb-6">Badges & Status Indicators</h2>
          <p className="text-lg text-slate-600 mb-8">Bold colors with animations and gradients</p>

          <div className="bg-white rounded-3xl border-2 border-slate-200 p-12">
            <div className="flex flex-wrap gap-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-full font-bold text-sm shadow-lg shadow-emerald-500/30">
                <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                Active: Discovery
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-full font-bold text-sm border-2 border-amber-400">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-600 animate-pulse" />
                In Progress
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-full font-bold text-sm shadow-lg shadow-green-500/30">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Completed
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-200 text-slate-600 rounded-full font-semibold text-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                Unexplored
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full font-bold text-sm border-2 border-purple-400">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Strategic Priority
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: Territory Cards Preview */}
        <section>
          <h2 className="text-4xl font-bold text-slate-900 mb-6">Territory Cards</h2>
          <p className="text-lg text-slate-600 mb-8">Bold borders, gradients, and hover states</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Company Territory */}
            <div className="group relative bg-white rounded-2xl border-3 border-indigo-400 p-8 transition-all hover:border-indigo-500 hover:shadow-2xl hover:shadow-indigo-500/20 hover:-translate-y-1 cursor-pointer">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/30">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Company Territory</h3>
              <p className="text-base text-slate-600 mb-4">Explore organizational capabilities, resources, and product portfolio.</p>

              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Mapped
                </span>
              </div>
            </div>

            {/* Customer Territory */}
            <div className="group relative bg-white rounded-2xl border-3 border-amber-400 p-8 transition-all hover:border-amber-500 hover:shadow-2xl hover:shadow-amber-500/20 hover:-translate-y-1 cursor-pointer">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center mb-4 shadow-lg shadow-amber-500/30">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Customer Territory</h3>
              <p className="text-base text-slate-600 mb-4">Investigate customer needs, behaviors, and market segments.</p>

              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-100 text-amber-700 rounded-full text-xs font-bold uppercase">
                  <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />
                  In Progress
                </span>
              </div>
            </div>

            {/* Market Context Territory */}
            <div className="group relative bg-white rounded-2xl border-3 border-slate-300 p-8 transition-all hover:border-slate-400 hover:shadow-2xl hover:shadow-slate-500/10 hover:-translate-y-1 cursor-pointer">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-400 to-slate-500 flex items-center justify-center mb-4 shadow-lg shadow-slate-500/20">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Market Context</h3>
              <p className="text-base text-slate-600 mb-4">Analyze competitive landscape, forces, and market dynamics.</p>

              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-200 text-slate-600 rounded-full text-xs font-bold uppercase">
                  Unexplored
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 7: AI Streaming Preview */}
        <section>
          <h2 className="text-4xl font-bold text-slate-900 mb-6">AI Streaming States</h2>
          <p className="text-lg text-slate-600 mb-8">Real-time feedback with bold visual indicators</p>

          <div className="space-y-6">
            {/* Thinking State */}
            <div className="bg-white rounded-3xl border-2 border-slate-200 p-8">
              <h3 className="text-lg font-bold text-slate-900 mb-4">1. Thinking Indicator</h3>
              <div className="flex items-start gap-3 bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 border border-slate-200">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-indigo-600 to-cyan-600 animate-pulse" />
                      <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-indigo-600 to-cyan-600 animate-pulse" style={{ animationDelay: '0.2s' }} />
                      <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-indigo-600 to-cyan-600 animate-pulse" style={{ animationDelay: '0.4s' }} />
                    </div>
                    <span className="text-sm font-bold uppercase tracking-wider text-indigo-600">
                      Thinking...
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Streaming State */}
            <div className="bg-white rounded-3xl border-2 border-slate-200 p-8">
              <h3 className="text-lg font-bold text-slate-900 mb-4">2. Streaming Response</h3>
              <div className="flex items-start gap-3 bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 border-2 border-indigo-200">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">Frontera Coach</div>
                  <div className="text-base text-slate-900 leading-relaxed">
                    Great question. I&apos;d recommend starting with the Market Segmentation research area, as it
                    <span className="inline-block w-0.5 h-5 bg-gradient-to-b from-indigo-600 to-cyan-600 animate-pulse ml-1 align-text-bottom" />
                  </div>
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-200">
                    <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border-2 border-red-300 rounded-lg text-red-700 font-semibold hover:bg-red-50 hover:border-red-400 transition-all text-sm">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <rect x="6" y="6" width="8" height="8" rx="1" />
                      </svg>
                      Stop
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* Footer */}
      <footer className="bg-white border-t-2 border-slate-200 mt-16 px-8 py-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-slate-600">
            Bold Design System Prototype v1.0 • Inspired by Linear + Stripe + Amplitude
          </p>
        </div>
      </footer>
    </div>
  );
}
