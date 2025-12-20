export default function Solution() {
  const features = [
    {
      title: "AI Strategy Coach",
      description: "On-demand guidance that helps teams make better product decisions, aligned with your transformation goals.",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
        </svg>
      ),
    },
    {
      title: "Transformation Playbooks",
      description: "Proven frameworks and templates adapted from successful enterprise transformations, customised to your context.",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
        </svg>
      ),
    },
    {
      title: "Progress Analytics",
      description: "Real-time visibility into transformation maturity across teams, with actionable insights for leadership.",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      ),
    },
    {
      title: "Skills Development",
      description: "Structured learning paths that build lasting product capabilities within your organisation.",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
        </svg>
      ),
    },
  ];

  return (
    <section id="solution" className="bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#06b6d4]">The Solution</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            AI-Powered Product Strategy at Scale
          </h2>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            Frontera delivers expert product strategy guidance to every team, every day—without
            the cost and constraints of traditional consulting.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-5xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {features.map((feature, index) => (
              <div
                key={index}
                className="relative flex gap-5 rounded-2xl border border-slate-100 bg-slate-50/50 p-8 transition-all duration-300 hover:bg-white hover:shadow-lg hover:border-[#06b6d4]/20"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#1e3a8a] to-[#06b6d4] text-white shadow-lg shadow-[#1e3a8a]/20">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
                  <p className="mt-2 text-base leading-7 text-slate-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* How it works */}
          <div className="mt-20 rounded-3xl bg-gradient-to-br from-[#1e3a8a] to-[#1e2a5e] p-8 lg:p-12">
            <h3 className="text-center text-2xl font-bold text-white sm:text-3xl">How Frontera Works</h3>
            <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#06b6d4] text-xl font-bold text-white">
                  1
                </div>
                <h4 className="mt-5 text-lg font-semibold text-white">Configure Your Context</h4>
                <p className="mt-2 text-sm text-slate-300">
                  Define your transformation goals, team structures, and strategic priorities.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#06b6d4] text-xl font-bold text-white">
                  2
                </div>
                <h4 className="mt-5 text-lg font-semibold text-white">Teams Get Coached</h4>
                <p className="mt-2 text-sm text-slate-300">
                  AI coach provides real-time guidance on product decisions, aligned to your strategy.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#06b6d4] text-xl font-bold text-white">
                  3
                </div>
                <h4 className="mt-5 text-lg font-semibold text-white">Track & Improve</h4>
                <p className="mt-2 text-sm text-slate-300">
                  Leadership gets visibility into progress with actionable insights.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
