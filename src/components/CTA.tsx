"use client";

import { useState } from "react";

export default function CTA() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    teamSize: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would submit to an API
    console.log("Demo request:", formData);
    setSubmitted(true);
  };

  return (
    <section id="cta" className="relative overflow-hidden bg-gradient-to-br from-[#1e3a8a] via-[#1e2a5e] to-[#0f172a] py-24 lg:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -right-20 h-80 w-80 rounded-full bg-[#06b6d4]/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-60 w-60 rounded-full bg-[#06b6d4]/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Ready to Transform Your{" "}
            <span className="bg-gradient-to-r from-[#06b6d4] to-[#22d3ee] bg-clip-text text-transparent">
              Product Organisation?
            </span>
          </h2>
          <p className="mt-6 text-lg leading-8 text-slate-300">
            Book a personalised demo and see how Frontera can accelerate your transformation.
            Our team will show you exactly how AI coaching works for your context.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-lg">
          {submitted ? (
            <div className="rounded-2xl bg-white/10 backdrop-blur-sm p-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#06b6d4]">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-white">Thank You!</h3>
              <p className="mt-2 text-slate-300">
                We&apos;ll be in touch within 24 hours to schedule your demo.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="rounded-2xl bg-white/10 backdrop-blur-sm p-8">
              <div className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    className="w-full rounded-lg border-0 bg-white/10 px-4 py-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-[#06b6d4] transition-all"
                    placeholder="Jane Smith"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                    Work Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    className="w-full rounded-lg border-0 bg-white/10 px-4 py-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-[#06b6d4] transition-all"
                    placeholder="jane@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-white mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    required
                    className="w-full rounded-lg border-0 bg-white/10 px-4 py-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-[#06b6d4] transition-all"
                    placeholder="Acme Corp"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>

                <div>
                  <label htmlFor="teamSize" className="block text-sm font-medium text-white mb-2">
                    Team Size
                  </label>
                  <select
                    id="teamSize"
                    required
                    className="w-full rounded-lg border-0 bg-white/10 px-4 py-3 text-white focus:ring-2 focus:ring-[#06b6d4] transition-all"
                    value={formData.teamSize}
                    onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                  >
                    <option value="" className="text-slate-900">Select team size</option>
                    <option value="1-50" className="text-slate-900">1-50 people</option>
                    <option value="51-200" className="text-slate-900">51-200 people</option>
                    <option value="201-500" className="text-slate-900">201-500 people</option>
                    <option value="501-1000" className="text-slate-900">501-1000 people</option>
                    <option value="1000+" className="text-slate-900">1000+ people</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="mt-8 w-full rounded-full bg-[#06b6d4] py-4 text-base font-semibold text-white shadow-lg shadow-[#06b6d4]/25 transition-all duration-200 hover:bg-[#22d3ee] hover:shadow-xl"
              >
                Book a Demo
              </button>

              <p className="mt-4 text-center text-xs text-slate-400">
                No commitment required. We&apos;ll never share your information.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
