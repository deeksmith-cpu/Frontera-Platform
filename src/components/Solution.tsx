export default function Solution() {
  const agents = [
    {
      name: "Company & Product Strategy Agent",
      description: "Built from product experts with global expertise, this agent helps executive teams research, frame, and write product strategies that align to vision and value.",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
        </svg>
      ),
    },
    {
      name: "North Star & OKR Agent",
      description: "Drawing from and enhancing the best methods to define measurable customer and business outcomes that power strategic flywheels and real business impact.",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
      ),
    },
    {
      name: "Team Mission & OKR House Agent",
      description: "Inspired by leading product-led companies globally, this agent coaches product teams to define meaningful customer missions, align to strategy, and build outcome-first delivery.",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
        </svg>
      ),
    },
    {
      name: "Competency Framework Agent",
      description: "Using the latest in product development methods and tooling, this module enables domain leads to define, train, and evolve capability in Product, Engineering, Design, Data, and Delivery.",
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
          <p className="text-sm font-semibold uppercase tracking-wider text-[#06b6d4]">The Platform</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Product Model Coaching with Agents That Work for You
          </h2>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            Frontera is more than a framework, more than a concept — it&apos;s a tailored coaching platform,
            personalised to your customers, markets and business outcomes. Every component is modular,
            intelligent, and interconnected — forming an end-to-end product operating model from strategy to execution.
          </p>
        </div>

        {/* AI Agents Grid */}
        <div className="mx-auto mt-16 max-w-5xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {agents.map((agent, index) => (
              <div
                key={index}
                className="relative flex gap-5 rounded-2xl border border-slate-100 bg-slate-50/50 p-8 transition-all duration-300 hover:bg-white hover:shadow-lg hover:border-[#06b6d4]/20"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#1e3a8a] to-[#06b6d4] text-white shadow-lg shadow-[#1e3a8a]/20">
                  {agent.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{agent.name}</h3>
                  <p className="mt-2 text-base leading-7 text-slate-600">{agent.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* How it works */}
          <div className="mt-20 rounded-3xl bg-gradient-to-br from-[#1e3a8a] to-[#1e2a5e] p-8 lg:p-12">
            <h3 className="text-center text-2xl font-bold text-white sm:text-3xl">How Frontera Works</h3>
            <p className="text-center text-slate-300 mt-2 max-w-2xl mx-auto">
              Expert-led, AI-powered coaching that embeds in your flow of work
            </p>
            <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#06b6d4] text-xl font-bold text-white">
                  1
                </div>
                <h4 className="mt-5 text-lg font-semibold text-white">Configure Your Context</h4>
                <p className="mt-2 text-sm text-slate-300">
                  Define your transformation goals, team structures, and strategic priorities. Tailored to your strategy, customers and outcomes.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#06b6d4] text-xl font-bold text-white">
                  2
                </div>
                <h4 className="mt-5 text-lg font-semibold text-white">Teams Get Coached</h4>
                <p className="mt-2 text-sm text-slate-300">
                  AI agents provide real-time guidance on product decisions. Human and digital coaching blended for maximum impact.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#06b6d4] text-xl font-bold text-white">
                  3
                </div>
                <h4 className="mt-5 text-lg font-semibold text-white">Measure Outcomes</h4>
                <p className="mt-2 text-sm text-slate-300">
                  Leadership gets visibility into transformation maturity. Measured by outcomes, not activity.
                </p>
              </div>
            </div>
          </div>

          {/* Key differentiators */}
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="text-center p-6">
              <div className="mx-auto h-12 w-12 rounded-full bg-[#06b6d4]/10 flex items-center justify-center">
                <svg className="h-6 w-6 text-[#06b6d4]" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
              </div>
              <h4 className="mt-4 font-semibold text-slate-900">AI-Powered</h4>
              <p className="mt-2 text-sm text-slate-600">Generative and agentic AI that adapts to your context in real time</p>
            </div>
            <div className="text-center p-6">
              <div className="mx-auto h-12 w-12 rounded-full bg-[#06b6d4]/10 flex items-center justify-center">
                <svg className="h-6 w-6 text-[#06b6d4]" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <h4 className="mt-4 font-semibold text-slate-900">Practitioner-Built</h4>
              <p className="mt-2 text-sm text-slate-600">Created by real product leaders who&apos;ve built products, not theorists</p>
            </div>
            <div className="text-center p-6">
              <div className="mx-auto h-12 w-12 rounded-full bg-[#06b6d4]/10 flex items-center justify-center">
                <svg className="h-6 w-6 text-[#06b6d4]" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
                </svg>
              </div>
              <h4 className="mt-4 font-semibold text-slate-900">Embedded in Flow</h4>
              <p className="mt-2 text-sm text-slate-600">Works where your teams work, not in separate workshops</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
