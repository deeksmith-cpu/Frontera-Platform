export default function Testimonial() {
  return (
    <section id="testimonial" className="bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#06b6d4]">Case Study</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Trusted by Industry Leaders
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
                  <div className="font-semibold text-slate-900">Aberdeen Group</div>
                  <div className="text-sm text-slate-500">Global Energy & Infrastructure</div>
                </div>
              </div>

              {/* Quote */}
              <blockquote className="text-xl leading-relaxed text-slate-700 lg:text-2xl lg:leading-relaxed">
                &ldquo;Frontera transformed how our teams approach product decisions. Within six months,
                we saw a{" "}
                <span className="font-semibold text-[#1e3a8a]">40% improvement in delivery predictability</span>{" "}
                and significantly reduced our dependency on external consultants. The AI coaching
                gives our people the confidence to make strategic decisions faster.&rdquo;
              </blockquote>

              {/* Attribution */}
              <div className="mt-8 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#1e3a8a] to-[#06b6d4]" />
                <div>
                  <div className="font-semibold text-slate-900">Sarah Mitchell</div>
                  <div className="text-sm text-slate-600">Chief Product Officer, Aberdeen Group</div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-2 gap-6 lg:grid-cols-4">
            <div className="rounded-2xl bg-slate-50 p-6 text-center">
              <div className="text-3xl font-bold text-[#1e3a8a]">40%</div>
              <div className="mt-1 text-sm text-slate-600">Delivery Improvement</div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-6 text-center">
              <div className="text-3xl font-bold text-[#1e3a8a]">£1.2M</div>
              <div className="mt-1 text-sm text-slate-600">Consulting Savings</div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-6 text-center">
              <div className="text-3xl font-bold text-[#1e3a8a]">850+</div>
              <div className="mt-1 text-sm text-slate-600">Team Members Coached</div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-6 text-center">
              <div className="text-3xl font-bold text-[#1e3a8a]">6 mo</div>
              <div className="mt-1 text-sm text-slate-600">Time to Value</div>
            </div>
          </div>

          {/* Trust badges */}
          <div className="mt-16 text-center">
            <p className="text-sm font-medium text-slate-500 mb-6">Trusted by enterprises worldwide</p>
            <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-12 opacity-60">
              {["TechCorp", "GlobalBank", "HealthFirst", "RetailMax", "EnergyPlus"].map((company) => (
                <div key={company} className="text-lg font-semibold text-slate-400">
                  {company}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
