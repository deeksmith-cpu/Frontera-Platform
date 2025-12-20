"use client";

import { useState } from "react";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Who is Frontera designed for?",
      answer: "Frontera is designed for large enterprises ready to modernise how they build products — from digital-native scale-ups to legacy corporates struggling to adopt a product mindset. It supports leaders, teams, and domain specialists across Product, Engineering, Design, Data, and Delivery.",
    },
    {
      question: "How is this different from traditional consulting?",
      answer: "Unlike static decks or 'one-and-done' workshops, Frontera is embedded, modular, intelligent, and coach-led. It supports real-time strategy execution, competency uplift, and product thinking that sticks — measured by outcomes, not activity. We work in the flow of product delivery, not in separate workshops.",
    },
    {
      question: "How is it delivered?",
      answer: "Via a modern digital platform with integrated AI agents, reusable frameworks, interactive training content, and human coaching — all tailored to learning style, maturity, and role. Coaching can be delivered in person, virtually, or through digital modules.",
    },
    {
      question: "What does it cost?",
      answer: "Frontera is delivered as a modular subscription, starting from £80–£400 per user annually depending on the selected capability tiers (Foundation, Transformation, Enterprise). Volume discounts are available for 1000+ users.",
    },
    {
      question: "Does it replace our existing tool stack?",
      answer: "No. At Frontera we design our products and partnerships to enhance your product tool chain. We are strategic partners with Atlassian, ServiceNow, Linear, and others. Frontera helps you transform the effectiveness of your product development tool chain, not replace it.",
    },
    {
      question: "How quickly can we see results?",
      answer: "Aberdeen launched a new company-level product strategy, defined North Star metrics across verticals, and embedded OKR alignment down to the team level — all within six months. Results vary based on organisation size and readiness, but our embedded approach is designed for rapid time-to-value.",
    },
    {
      question: "What security and compliance standards do you meet?",
      answer: "Frontera is built for enterprise requirements with SSO support, SOC 2 compliance, GDPR compliance, and advanced security features. We can provide detailed security documentation during the procurement process.",
    },
  ];

  return (
    <section id="faq" className="bg-slate-50 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#06b6d4]">FAQ</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Questions Enterprise Leaders Ask
          </h2>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            Get answers to common questions about Frontera&apos;s approach, delivery, and investment.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-3xl">
          <div className="divide-y divide-slate-200">
            {faqs.map((faq, index) => (
              <div key={index} className="py-6">
                <button
                  className="flex w-full items-start justify-between text-left"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                >
                  <span className="text-lg font-semibold text-slate-900 pr-8">{faq.question}</span>
                  <span className="ml-6 flex h-7 items-center shrink-0">
                    <svg
                      className={`h-6 w-6 text-[#06b6d4] transition-transform duration-200 ${
                        openIndex === index ? "rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </span>
                </button>
                {openIndex === index && (
                  <div className="mt-4 pr-12">
                    <p className="text-base leading-7 text-slate-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
