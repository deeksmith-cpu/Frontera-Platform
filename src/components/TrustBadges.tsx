export default function TrustBadges() {
  const partners = [
    { name: "Atlassian", logo: "A" },
    { name: "ServiceNow", logo: "S" },
    { name: "Linear", logo: "L" },
  ];

  const certifications = [
    { name: "SOC 2", description: "Type II Certified" },
    { name: "GDPR", description: "Compliant" },
    { name: "ISO 27001", description: "Certified" },
  ];

  return (
    <section className="bg-white py-16 border-t border-slate-100">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Strategic Partners */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-8">
            Strategic Technology Partners
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-16">
            {partners.map((partner) => (
              <div
                key={partner.name}
                className="flex items-center gap-3 px-6 py-3 rounded-lg bg-slate-50 border border-slate-100"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1a1f3a] text-white font-bold">
                  {partner.logo}
                </div>
                <span className="text-lg font-semibold text-slate-700">{partner.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Security & Compliance */}
        <div className="text-center pt-12 border-t border-slate-100">
          <p className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-8">
            Enterprise Security & Compliance
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 lg:gap-12">
            {certifications.map((cert) => (
              <div
                key={cert.name}
                className="flex items-center gap-3"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50 border border-green-200">
                  <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-slate-900">{cert.name}</div>
                  <div className="text-sm text-slate-500">{cert.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enterprise ready message */}
        <div className="mt-12 text-center">
          <p className="text-sm text-slate-500">
            SSO Support • Advanced Security • Enterprise SLAs • Dedicated Success Manager
          </p>
        </div>
      </div>
    </section>
  );
}
