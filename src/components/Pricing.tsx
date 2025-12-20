import Link from "next/link";

export default function Pricing() {
  const tiers = [
    {
      name: "Foundation",
      price: "£80-120",
      period: "per user/year",
      description: "For teams beginning their product transformation journey.",
      features: [
        "AI Strategy Coach access",
        "Core transformation playbooks",
        "Team progress dashboards",
        "Email support",
        "Up to 50 users",
      ],
      highlighted: false,
      cta: "Start Foundation",
    },
    {
      name: "Transformation",
      price: "£150-200",
      period: "per user/year",
      description: "For organisations scaling product capabilities across multiple teams.",
      features: [
        "Everything in Foundation",
        "Advanced AI coaching modules",
        "Custom playbook configuration",
        "Leadership analytics dashboard",
        "Dedicated success manager",
        "Priority support",
        "Up to 500 users",
      ],
      highlighted: true,
      cta: "Start Transformation",
      badge: "Most Popular",
    },
    {
      name: "Enterprise",
      price: "£300-400",
      period: "per user/year",
      description: "For large-scale transformations requiring full customisation and support.",
      features: [
        "Everything in Transformation",
        "Fully custom AI coaching",
        "Bespoke playbooks & frameworks",
        "Executive briefings",
        "On-site enablement sessions",
        "API access & integrations",
        "SSO & advanced security",
        "Unlimited users",
      ],
      highlighted: false,
      cta: "Contact Sales",
    },
  ];

  return (
    <section id="pricing" className="bg-slate-50 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#06b6d4]">Pricing</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Investment That Delivers ROI
          </h2>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            Transparent pricing designed for enterprise scale. Choose the plan that matches
            your transformation ambitions.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-3">
          {tiers.map((tier, index) => (
            <div
              key={index}
              className={`relative flex flex-col rounded-3xl p-8 ${
                tier.highlighted
                  ? "bg-gradient-to-b from-[#1e3a8a] to-[#1e2a5e] text-white shadow-2xl shadow-[#1e3a8a]/20 scale-105 z-10"
                  : "bg-white border border-slate-200 shadow-sm"
              }`}
            >
              {tier.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center rounded-full bg-[#06b6d4] px-4 py-1 text-sm font-semibold text-white shadow-lg">
                    {tier.badge}
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className={`text-xl font-semibold ${tier.highlighted ? "text-white" : "text-slate-900"}`}>
                  {tier.name}
                </h3>
                <p className={`mt-2 text-sm ${tier.highlighted ? "text-slate-300" : "text-slate-600"}`}>
                  {tier.description}
                </p>
              </div>

              <div className="mb-8">
                <span className={`text-4xl font-bold tracking-tight ${tier.highlighted ? "text-white" : "text-slate-900"}`}>
                  {tier.price}
                </span>
                <span className={`ml-2 text-sm ${tier.highlighted ? "text-slate-300" : "text-slate-500"}`}>
                  {tier.period}
                </span>
              </div>

              <ul className="mb-8 flex-1 space-y-4">
                {tier.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <svg
                      className={`h-5 w-5 shrink-0 ${tier.highlighted ? "text-[#06b6d4]" : "text-[#06b6d4]"}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span className={`text-sm ${tier.highlighted ? "text-slate-200" : "text-slate-600"}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href="#cta"
                className={`block w-full rounded-full py-3 text-center text-sm font-semibold transition-all duration-200 ${
                  tier.highlighted
                    ? "bg-[#06b6d4] text-white hover:bg-[#22d3ee] shadow-lg"
                    : "bg-[#1e3a8a] text-white hover:bg-[#1e2a5e]"
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>

        <p className="mt-12 text-center text-sm text-slate-500">
          All prices exclude VAT. Volume discounts available for 1000+ users.{" "}
          <Link href="#cta" className="font-medium text-[#1e3a8a] hover:text-[#06b6d4]">
            Contact us for a custom quote
          </Link>
        </p>
      </div>
    </section>
  );
}
