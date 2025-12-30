"use client";

import { OnboardingFormData, STRATEGIC_FOCUS_OPTIONS, StrategicFocus } from "@/types/database";

interface StrategicFocusStepProps {
  formData: OnboardingFormData;
  updateFormData: (updates: Partial<OnboardingFormData>) => void;
}

export default function StrategicFocusStep({
  formData,
  updateFormData,
}: StrategicFocusStepProps) {
  const handleFocusSelect = (focus: StrategicFocus) => {
    updateFormData({
      strategicFocus: focus,
      strategicFocusOther: focus !== "other" ? "" : formData.strategicFocusOther,
    });
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Strategic Focus</h2>
        <p className="text-gray-600">
          What transformation approach best aligns with your organization&apos;s goals?
        </p>
      </div>

      {/* Focus Options */}
      <div className="space-y-4">
        {STRATEGIC_FOCUS_OPTIONS.map((option) => {
          const isSelected = formData.strategicFocus === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => handleFocusSelect(option.value)}
              className={`w-full text-left p-5 rounded-xl border-2 transition-all group ${
                isSelected
                  ? "border-teal-electric bg-gradient-to-br from-teal-electric/5 to-cyan-50 shadow-lg shadow-teal-electric/10"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Radio Circle */}
                <div
                  className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5 transition-all ${
                    isSelected
                      ? "border-teal-electric bg-teal-electric"
                      : "border-gray-300 group-hover:border-gray-400"
                  }`}
                >
                  {isSelected && (
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3
                    className={`font-semibold text-lg mb-1 transition-colors ${
                      isSelected ? "text-indigo-deep" : "text-gray-900"
                    }`}
                  >
                    {option.label}
                  </h3>
                  <p className="text-gray-600 text-sm">{option.description}</p>
                </div>

                {/* Icon */}
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                    isSelected
                      ? "bg-teal-electric/10 text-teal-electric"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {option.value === "strategy_to_execution" && (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  )}
                  {option.value === "product_model" && (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  )}
                  {option.value === "team_empowerment" && (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  )}
                  {option.value === "mixed" && (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                    </svg>
                  )}
                  {option.value === "other" && (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Other Focus Text Field */}
      {formData.strategicFocus === "other" && (
        <div className="space-y-2 animate-fade-in-up">
          <label
            htmlFor="strategicFocusOther"
            className="block text-sm font-semibold text-gray-700"
          >
            Describe your strategic focus <span className="text-red-500">*</span>
          </label>
          <textarea
            id="strategicFocusOther"
            value={formData.strategicFocusOther}
            onChange={(e) => updateFormData({ strategicFocusOther: e.target.value })}
            placeholder="Tell us about your unique transformation goals and strategic priorities..."
            rows={4}
            className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:border-teal-electric focus:ring-2 focus:ring-teal-electric/20 transition-all outline-none resize-none"
          />
        </div>
      )}

      {/* Context Box */}
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
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-700">
              <strong>Pro tip:</strong> Most successful transformations combine multiple focus
              areas. If you&apos;re unsure, select &quot;Mixed Approach&quot; and we&apos;ll help you
              identify the right balance during our discovery process.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
