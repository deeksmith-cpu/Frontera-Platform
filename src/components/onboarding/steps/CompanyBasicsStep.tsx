"use client";

import { OnboardingFormData, INDUSTRIES, COMPANY_SIZES } from "@/types/database";

interface CompanyBasicsStepProps {
  formData: OnboardingFormData;
  updateFormData: (updates: Partial<OnboardingFormData>) => void;
}

export default function CompanyBasicsStep({
  formData,
  updateFormData,
}: CompanyBasicsStepProps) {
  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Company Basics</h2>
        <p className="text-gray-600">
          Let&apos;s start with some fundamental information about your organization.
        </p>
      </div>

      {/* Company Name */}
      <div className="space-y-2">
        <label
          htmlFor="companyName"
          className="block text-sm font-semibold text-gray-700"
        >
          Company Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="companyName"
          value={formData.companyName}
          onChange={(e) => updateFormData({ companyName: e.target.value })}
          placeholder="Enter your company name"
          className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:border-teal-electric focus:ring-2 focus:ring-teal-electric/20 transition-all outline-none"
        />
      </div>

      {/* Industry */}
      <div className="space-y-2">
        <label
          htmlFor="industry"
          className="block text-sm font-semibold text-gray-700"
        >
          Industry <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <select
            id="industry"
            value={formData.industry}
            onChange={(e) => updateFormData({ industry: e.target.value })}
            className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-900 focus:border-teal-electric focus:ring-2 focus:ring-teal-electric/20 transition-all outline-none appearance-none cursor-pointer"
          >
            <option value="" disabled>
              Select your industry
            </option>
            {INDUSTRIES.map((industry) => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Company Size */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-700">
          Company Size <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {COMPANY_SIZES.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => updateFormData({ companySize: size })}
              className={`px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                formData.companySize === size
                  ? "border-teal-electric bg-teal-electric/5 text-teal-electric"
                  : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Info Box */}
      <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-deep/5 to-teal-electric/5 border border-indigo-deep/10">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <svg
              className="w-5 h-5 text-indigo-deep"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-700">
              This information helps us understand your organization&apos;s scale and industry
              context, allowing us to recommend the most relevant transformation strategies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
