import Image from 'next/image';

const STRATEGIC_COACHES = [
  {
    name: 'Marcus',
    title: 'The Strategic Navigator',
    tagline: "Let's look at the evidence. What does the market actually tell us?",
    avatar: '/avatars/coaches/marcus.png',
    color: { accent: '#6366f1', glow: 'rgba(99,102,241,0.3)', bg: 'rgba(99,102,241,0.08)', border: 'rgba(99,102,241,0.25)' },
    bestFor: ['Market-led growth', 'Competitive positioning', 'Go-to-market strategy'],
    personality: 'Direct. Analytical. Evidence-driven.',
    description: 'Marcus approaches every conversation with competitive intelligence and strategic clarity. With a background advising Fortune 500 companies on positioning and growth, he believes data drives decisions — not assumptions.',
    beliefs: ['Data over assumptions', 'Defensible advantage', 'Quick, evidence-based pivots'],
    style: 'Challenges your thinking with "What data supports this?" and always ties insights to measurable outcomes.',
  },
  {
    name: 'Elena',
    title: 'The Capability Builder',
    tagline: "You already have more capability than you realise. Let's unlock it together.",
    avatar: '/avatars/coaches/elena.png',
    color: { accent: '#10b981', glow: 'rgba(16,185,129,0.3)', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.25)' },
    bestFor: ['Team empowerment', 'Capability development', 'Cultural change'],
    personality: 'Warm. Empowering. Reflective.',
    description: 'Elena believes transformation happens through people, not frameworks. Her background spans organisational psychology and product leadership — building high-performing teams from struggling groups.',
    beliefs: ['People are the strategy', 'Sustainable change from within', 'Psychological safety enables breakthroughs'],
    style: 'Asks reflective questions, celebrates progress, and connects every strategic move to the humans who will execute it.',
  },
  {
    name: 'Fin',
    title: 'The Transformation Pragmatist',
    tagline: "You've been here before. This time, let's make it stick.",
    avatar: '/avatars/coaches/fin.png',
    color: { accent: '#f59e0b', glow: 'rgba(245,158,11,0.3)', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.25)' },
    bestFor: ['Turnaround situations', 'Post-failure recovery', 'Milestone-driven progress'],
    personality: 'Pragmatic. Empathetic. Action-oriented.',
    description: 'Fin understands transformation fatigue because he\'s lived it. His experience includes turning around failed initiatives, balancing empathy with directness, and building momentum from small wins.',
    beliefs: ['Quick wins build momentum', 'Progress over perfection', 'Stakeholder confidence is earned through delivery'],
    style: 'Asks "What can we do this week?" — celebrates progress, learns from setbacks, and never oversells.',
  },
];

const SPARRING_PARTNERS = [
  {
    name: 'Priya',
    title: 'The Growth Architect',
    tagline: "Growth is a system, not a series of hacks. Let's map your loops.",
    avatar: '/avatars/coaches/priya.png',
    color: { accent: '#06b6d4', glow: 'rgba(6,182,212,0.3)', bg: 'rgba(6,182,212,0.08)', border: 'rgba(6,182,212,0.25)' },
    bestFor: ['Product-led growth', 'Activation & retention', 'Growth experiments'],
    personality: 'Systematic. Metrics-literate. Constructively impatient.',
    description: 'Priya thinks in funnels, loops, and leverage points. She\'s built self-serve acquisition engines, optimised activation flows, and designed expansion revenue motions from scratch at companies scaling from early traction to dominance.',
    inspiredBy: ['Hila Qu', 'Elena Verna', 'Brian Balfour', 'Casey Winters'],
    beliefs: ['Growth loops over hacks', 'The customer journey IS the product', 'Metrics without segmentation are lies'],
    style: 'Challenges vanity metrics with "That\'s a trailing indicator. What\'s the leading signal?" — and always pushes for experiment velocity.',
  },
  {
    name: 'Hana',
    title: 'The Product Purist',
    tagline: "What is the core job this product does? Strip everything else.",
    avatar: '/avatars/coaches/hana.png',
    color: { accent: '#8b5cf6', glow: 'rgba(139,92,246,0.3)', bg: 'rgba(139,92,246,0.08)', border: 'rgba(139,92,246,0.25)' },
    bestFor: ['Product craft', 'Speed & focus', 'Opinionated design'],
    personality: 'Concise. Craft-obsessed. Opinionated.',
    description: 'Hana believes great products win through craft, speed, and opinionated design — not feature checklists or committee-driven roadmaps. She builds tools that power users love, where quality is the competitive moat.',
    inspiredBy: ['Nan Yu (Linear)', 'Rahul Vohra (Superhuman)', 'Jason Fried (Basecamp)'],
    beliefs: ['Speed is a feature', 'Say no to most things', 'Taste matters — every pixel communicates values'],
    style: 'States clear preferences and defends them. "I would not build that. Here\'s why." Allergic to bloat and feature creep.',
  },
  {
    name: 'Kofi',
    title: 'The Scale Navigator',
    tagline: "What got you here won't get you there. Let's navigate the next stage.",
    avatar: '/avatars/coaches/kofi.png',
    color: { accent: '#f43f5e', glow: 'rgba(244,63,94,0.3)', bg: 'rgba(244,63,94,0.08)', border: 'rgba(244,63,94,0.25)' },
    bestFor: ['Scaling organizations', 'Org design', 'Portfolio management'],
    personality: 'Pragmatic. Organizationally aware. Portfolio-minded.',
    description: 'Kofi has lived through the messy, exhilarating process of scaling organizations from hundreds to thousands of people while keeping the product and culture from breaking. He knows that organizational design IS product strategy.',
    inspiredBy: ['Boz (Meta CTO)', 'Claire Hughes Johnson (ex-Stripe)', 'Camille Fournier'],
    beliefs: ['Org design IS product strategy', 'Culture requires active investment', 'Decision speed degrades with headcount unless you fight it'],
    style: 'Direct about trade-offs: "You cannot have both. Which matters more right now?" Frames choices as portfolio allocation problems.',
  },
];

export default function CoachesLaunchPage() {
  return (
    <div className="min-h-screen bg-[#0d1117] text-white overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=JetBrains+Mono:wght@400;500&display=swap');

        .font-display { font-family: 'Instrument Serif', Georgia, serif; }
        .font-body { font-family: 'DM Sans', system-ui, sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideFromLeft {
          from { opacity: 0; transform: translateX(-60px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes expandLine {
          from { width: 0; }
          to { width: 100%; }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        .animate-fade-up { animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .animate-fade-in { animation: fadeIn 0.6s ease-out both; }
        .animate-slide-left { animation: slideFromLeft 0.7s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .animate-expand { animation: expandLine 1s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .animate-pulse-glow { animation: pulseGlow 3s ease-in-out infinite; }
        .animate-float { animation: float 4s ease-in-out infinite; }

        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
        .delay-400 { animation-delay: 400ms; }
        .delay-500 { animation-delay: 500ms; }
        .delay-600 { animation-delay: 600ms; }
        .delay-700 { animation-delay: 700ms; }
        .delay-800 { animation-delay: 800ms; }
        .delay-1000 { animation-delay: 1000ms; }

        .coach-card {
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .coach-card:hover {
          transform: translateY(-6px) scale(1.01);
        }
        .coach-card:hover .coach-glow {
          opacity: 1 !important;
        }
        .coach-card:hover .coach-avatar {
          transform: scale(1.08);
        }

        .grain-overlay {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 100;
          opacity: 0.025;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
        }

        .topographic-bg {
          background-image: url("data:image/svg+xml,%3Csvg width='600' height='600' viewBox='0 0 600 600' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23fbbf24' stroke-width='0.6' opacity='0.04'%3E%3Cellipse cx='300' cy='300' rx='280' ry='200'/%3E%3Cellipse cx='300' cy='300' rx='240' ry='170'/%3E%3Cellipse cx='300' cy='300' rx='200' ry='140'/%3E%3Cellipse cx='300' cy='300' rx='160' ry='110'/%3E%3Cellipse cx='300' cy='300' rx='120' ry='80'/%3E%3Cellipse cx='300' cy='300' rx='80' ry='50'/%3E%3Cellipse cx='300' cy='300' rx='40' ry='25'/%3E%3C/g%3E%3C/svg%3E");
          background-size: 800px;
        }
      `}</style>

      <div className="grain-overlay" />

      {/* ================================================================== */}
      {/* HERO SECTION */}
      {/* ================================================================== */}
      <section className="relative min-h-screen flex flex-col justify-center items-center px-6 py-24 topographic-bg">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-[#fbbf24]/5 blur-[120px] animate-pulse-glow" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-[#06b6d4]/5 blur-[120px] animate-pulse-glow delay-1000" />
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#fbbf24]/20 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative max-w-5xl mx-auto text-center">
          {/* Eyebrow */}
          <div className="animate-fade-up">
            <span className="font-mono text-xs tracking-[0.3em] uppercase text-[#fbbf24]/70 border border-[#fbbf24]/20 px-4 py-2 rounded-full inline-block">
              Introducing
            </span>
          </div>

          {/* Main title */}
          <h1 className="font-display text-[clamp(3rem,8vw,7rem)] leading-[0.9] mt-8 mb-6 animate-fade-up delay-200">
            <span className="block text-white/90">Your Strategy</span>
            <span className="block italic text-[#fbbf24]">Coaching Team</span>
          </h1>

          {/* Divider line */}
          <div className="flex justify-center mb-8 animate-fade-in delay-400">
            <div className="h-px w-32 bg-gradient-to-r from-transparent via-[#fbbf24] to-transparent animate-expand delay-600" />
          </div>

          {/* Subtitle */}
          <p className="font-body text-lg md:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed animate-fade-up delay-500">
            Six world-class AI coaching personas — each with distinct expertise,
            personality, and strategic philosophy. Choose the voice that matches
            your challenge.
          </p>

          {/* Stats row */}
          <div className="flex items-center justify-center gap-12 mt-16 animate-fade-up delay-700">
            <div className="text-center">
              <div className="font-display text-4xl text-[#fbbf24]">3</div>
              <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/30 mt-1">Strategic Coaches</div>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div className="text-center">
              <div className="font-display text-4xl text-[#06b6d4]">3</div>
              <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/30 mt-1">Expert Sparring Partners</div>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div className="text-center">
              <div className="font-display text-4xl text-white/80">6</div>
              <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/30 mt-1">Distinct Perspectives</div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float delay-1000">
            <div className="w-5 h-8 border border-white/20 rounded-full flex items-start justify-center pt-1.5">
              <div className="w-1 h-2 bg-[#fbbf24]/50 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* STRATEGIC COACHES SECTION */}
      {/* ================================================================== */}
      <section className="relative px-6 py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d1117] via-[#111827] to-[#0d1117]" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

        <div className="relative max-w-6xl mx-auto">
          {/* Section header */}
          <div className="mb-20">
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#fbbf24]/50">01 / Strategic Coaches</span>
            <h2 className="font-display text-5xl md:text-6xl mt-4 text-white/90">
              The <span className="italic text-[#fbbf24]">Originals</span>
            </h2>
            <p className="font-body text-white/40 mt-4 max-w-xl text-lg leading-relaxed">
              Three distinct coaching philosophies for your strategic journey.
              Each brings a fundamentally different lens to your product transformation.
            </p>
          </div>

          {/* Coach cards */}
          <div className="grid gap-8">
            {STRATEGIC_COACHES.map((coach, idx) => (
              <div
                key={coach.name}
                className="coach-card relative group rounded-2xl border overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${coach.color.bg} 0%, rgba(13,17,23,0.95) 60%)`,
                  borderColor: coach.color.border,
                }}
              >
                {/* Hover glow */}
                <div
                  className="coach-glow absolute -inset-1 rounded-2xl opacity-0 transition-opacity duration-700 blur-xl -z-10"
                  style={{ background: coach.color.glow }}
                />

                <div className="relative p-8 md:p-10 flex flex-col md:flex-row gap-8 md:gap-12 items-start">
                  {/* Avatar column */}
                  <div className="flex-shrink-0 flex flex-col items-center gap-4">
                    <div
                      className="coach-avatar relative w-28 h-28 rounded-2xl overflow-hidden transition-transform duration-500"
                      style={{ boxShadow: `0 0 0 2px ${coach.color.accent}` }}
                    >
                      <Image
                        src={coach.avatar}
                        alt={coach.name}
                        width={112}
                        height={112}
                        className="w-full h-full object-cover"
                      />
                      {/* Accent dot */}
                      <div
                        className="absolute bottom-1.5 right-1.5 w-3.5 h-3.5 rounded-full border-2 border-[#0d1117]"
                        style={{ background: coach.color.accent }}
                      />
                    </div>
                    {/* Number badge */}
                    <span className="font-mono text-[10px] tracking-[0.2em] text-white/20">
                      0{idx + 1}
                    </span>
                  </div>

                  {/* Content column */}
                  <div className="flex-1 min-w-0">
                    {/* Name & title */}
                    <div className="mb-4">
                      <h3 className="font-display text-3xl md:text-4xl text-white/90">
                        {coach.name}
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span
                          className="font-mono text-xs tracking-wide"
                          style={{ color: coach.color.accent }}
                        >
                          {coach.title}
                        </span>
                      </div>
                    </div>

                    {/* Personality badge */}
                    <div
                      className="inline-block px-3 py-1 rounded-full text-xs font-body font-medium mb-5 border"
                      style={{
                        color: coach.color.accent,
                        borderColor: coach.color.border,
                        background: coach.color.bg,
                      }}
                    >
                      {coach.personality}
                    </div>

                    {/* Description */}
                    <p className="font-body text-white/45 leading-relaxed mb-6 max-w-2xl">
                      {coach.description}
                    </p>

                    {/* Tagline / quote */}
                    <blockquote className="border-l-2 pl-4 mb-6" style={{ borderColor: coach.color.accent }}>
                      <p className="font-display text-lg italic text-white/60">
                        &ldquo;{coach.tagline}&rdquo;
                      </p>
                    </blockquote>

                    {/* Beliefs & Style */}
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/25 block mb-3">Core Beliefs</span>
                        <div className="space-y-2">
                          {coach.beliefs.map((belief) => (
                            <div key={belief} className="flex items-start gap-2">
                              <div className="w-1 h-1 rounded-full mt-2 flex-shrink-0" style={{ background: coach.color.accent }} />
                              <span className="font-body text-sm text-white/40">{belief}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/25 block mb-3">Coaching Style</span>
                        <p className="font-body text-sm text-white/40 leading-relaxed">{coach.style}</p>
                      </div>
                    </div>

                    {/* Best for tags */}
                    <div className="flex flex-wrap gap-2">
                      {coach.bestFor.map((item) => (
                        <span
                          key={item}
                          className="font-mono text-[10px] tracking-wider uppercase px-3 py-1.5 rounded-lg border text-white/30"
                          style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* DIVIDER */}
      {/* ================================================================== */}
      <section className="relative py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#fbbf24]/20" />
            <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-[#fbbf24]/40">New Category</span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#fbbf24]/20" />
          </div>
          <h2 className="font-display text-4xl md:text-5xl text-white/80">
            Built from <span className="italic text-[#06b6d4]">301 podcast transcripts</span>
          </h2>
          <p className="font-body text-white/35 mt-4 max-w-xl mx-auto leading-relaxed">
            We studied the world&apos;s best product leaders — their frameworks, their instincts,
            their hard-won lessons — and distilled them into three expert sparring partners.
          </p>
        </div>
      </section>

      {/* ================================================================== */}
      {/* EXPERT SPARRING PARTNERS SECTION */}
      {/* ================================================================== */}
      <section className="relative px-6 py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d1117] via-[#0c1525] to-[#0d1117]" />

        <div className="relative max-w-6xl mx-auto">
          {/* Section header */}
          <div className="mb-20">
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#06b6d4]/50">02 / Expert Sparring Partners</span>
            <h2 className="font-display text-5xl md:text-6xl mt-4 text-white/90">
              The <span className="italic text-[#06b6d4]">Specialists</span>
            </h2>
            <p className="font-body text-white/40 mt-4 max-w-xl text-lg leading-relaxed">
              Deep domain expertise synthesised from the world&apos;s leading product thinkers.
              Each persona channels the collective wisdom of industry pioneers.
            </p>
          </div>

          {/* Sparring Partner cards */}
          <div className="grid gap-8">
            {SPARRING_PARTNERS.map((coach, idx) => (
              <div
                key={coach.name}
                className="coach-card relative group rounded-2xl border overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${coach.color.bg} 0%, rgba(13,17,23,0.95) 60%)`,
                  borderColor: coach.color.border,
                }}
              >
                {/* Hover glow */}
                <div
                  className="coach-glow absolute -inset-1 rounded-2xl opacity-0 transition-opacity duration-700 blur-xl -z-10"
                  style={{ background: coach.color.glow }}
                />

                <div className="relative p-8 md:p-10 flex flex-col md:flex-row gap-8 md:gap-12 items-start">
                  {/* Avatar column */}
                  <div className="flex-shrink-0 flex flex-col items-center gap-4">
                    <div
                      className="coach-avatar relative w-28 h-28 rounded-2xl overflow-hidden transition-transform duration-500"
                      style={{ boxShadow: `0 0 0 2px ${coach.color.accent}` }}
                    >
                      <Image
                        src={coach.avatar}
                        alt={coach.name}
                        width={112}
                        height={112}
                        className="w-full h-full object-cover"
                      />
                      <div
                        className="absolute bottom-1.5 right-1.5 w-3.5 h-3.5 rounded-full border-2 border-[#0d1117]"
                        style={{ background: coach.color.accent }}
                      />
                    </div>
                    <span className="font-mono text-[10px] tracking-[0.2em] text-white/20">
                      0{idx + 4}
                    </span>
                  </div>

                  {/* Content column */}
                  <div className="flex-1 min-w-0">
                    {/* Name & title */}
                    <div className="mb-4">
                      <h3 className="font-display text-3xl md:text-4xl text-white/90">
                        {coach.name}
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span
                          className="font-mono text-xs tracking-wide"
                          style={{ color: coach.color.accent }}
                        >
                          {coach.title}
                        </span>
                      </div>
                    </div>

                    {/* Personality badge */}
                    <div
                      className="inline-block px-3 py-1 rounded-full text-xs font-body font-medium mb-5 border"
                      style={{
                        color: coach.color.accent,
                        borderColor: coach.color.border,
                        background: coach.color.bg,
                      }}
                    >
                      {coach.personality}
                    </div>

                    {/* Description */}
                    <p className="font-body text-white/45 leading-relaxed mb-6 max-w-2xl">
                      {coach.description}
                    </p>

                    {/* Tagline / quote */}
                    <blockquote className="border-l-2 pl-4 mb-6" style={{ borderColor: coach.color.accent }}>
                      <p className="font-display text-lg italic text-white/60">
                        &ldquo;{coach.tagline}&rdquo;
                      </p>
                    </blockquote>

                    {/* Inspired by + Beliefs + Style */}
                    <div className="grid md:grid-cols-3 gap-6 mb-6">
                      <div>
                        <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/25 block mb-3">Inspired By</span>
                        <div className="space-y-1.5">
                          {coach.inspiredBy.map((person) => (
                            <div key={person} className="font-body text-sm text-white/40 flex items-center gap-2">
                              <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: coach.color.accent }} />
                              {person}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/25 block mb-3">Core Beliefs</span>
                        <div className="space-y-2">
                          {coach.beliefs.map((belief) => (
                            <div key={belief} className="flex items-start gap-2">
                              <div className="w-1 h-1 rounded-full mt-2 flex-shrink-0" style={{ background: coach.color.accent }} />
                              <span className="font-body text-sm text-white/40">{belief}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/25 block mb-3">Coaching Style</span>
                        <p className="font-body text-sm text-white/40 leading-relaxed">{coach.style}</p>
                      </div>
                    </div>

                    {/* Best for tags */}
                    <div className="flex flex-wrap gap-2">
                      {coach.bestFor.map((item) => (
                        <span
                          key={item}
                          className="font-mono text-[10px] tracking-wider uppercase px-3 py-1.5 rounded-lg border text-white/30"
                          style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* CTA SECTION */}
      {/* ================================================================== */}
      <section className="relative px-6 py-32 topographic-bg">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#fbbf24]/3 blur-[200px]" />
        </div>

        <div className="relative max-w-3xl mx-auto text-center">
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#fbbf24]/50 block mb-6">
            Ready to Begin?
          </span>
          <h2 className="font-display text-5xl md:text-6xl text-white/90 mb-6">
            Choose your <span className="italic text-[#fbbf24]">coach</span>
          </h2>
          <p className="font-body text-white/40 text-lg leading-relaxed mb-12 max-w-lg mx-auto">
            Start your strategic coaching journey with the persona that matches your challenge,
            your style, and your ambition.
          </p>

          {/* Coach avatar row */}
          <div className="flex items-center justify-center gap-3 mb-12">
            {[...STRATEGIC_COACHES, ...SPARRING_PARTNERS].map((coach, idx) => (
              <div
                key={coach.name}
                className="w-12 h-12 rounded-xl overflow-hidden transition-all duration-300 hover:scale-125 cursor-pointer"
                style={{
                  boxShadow: `0 0 0 2px ${coach.color.accent}`,
                  animationDelay: `${idx * 100}ms`,
                }}
                title={`${coach.name} — ${coach.title}`}
              >
                <Image
                  src={coach.avatar}
                  alt={coach.name}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          <a
            href="/dashboard/product-strategy-agent"
            className="inline-flex items-center gap-3 px-10 py-4 rounded-xl bg-[#fbbf24] text-[#0d1117] font-body font-semibold text-sm tracking-wide transition-all duration-300 hover:bg-[#f59e0b] hover:scale-105 hover:shadow-lg hover:shadow-[#fbbf24]/20"
          >
            Start Your Strategy Journey
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>

          {/* Footer */}
          <div className="mt-24 pt-8 border-t border-white/5">
            <div className="flex items-center justify-center gap-3">
              <Image
                src="/frontera-logo-F.jpg"
                alt="Frontera"
                width={28}
                height={28}
                className="rounded-lg"
              />
              <span className="font-body text-sm text-white/25">
                Frontera Product Strategy Coach
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
