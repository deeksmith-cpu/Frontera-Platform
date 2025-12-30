"use client";

import { OnboardingFormData, SUCCESS_METRICS_OPTIONS, SuccessMetric } from "@/types/database";

interface SuccessCriteriaStepProps {
  formData: OnboardingFormData;
  updateFormData: (updates: Partial<OnboardingFormData>) => void;
}

export default function SuccessCriteriaStep({
  formData,
  updateFormData,
}: SuccessCriteriaStepProps) {
  const toggleMetric = (metric: SuccessMetric) => {
    const current = formData.successMetrics;
    if (current.includes(metric)) {
      updateFormData({
        successMetrics: current.filter((m) => m !== metric),
      });
    } else {
      updateFormData({
        successMetrics: [...current, metric],
      });
    }
  };

  const getMetricIcon = (metric: SuccessMetric) => {
    switch (metric) {
      case "metrics_evidence":
        return (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      case "outcomes":
        return (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        );
      case "revenue":
        return (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "client_growth":
        return (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Success Criteria</h2>
        <p className="text-gray-600">
          Define how you&apos;ll measure the success of your transformation journey.
        </p>
      </div>

      {/* Success Metrics Multi-Select */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-700">
          Key Success Metrics <span className="text-red-500">*</span>
        </label>
        <p className="text-sm text-gray-500">
          Select all that apply. What evidence will demonstrate transformation success?
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SUCCESS_METRICS_OPTIONS.map((option) => {
            const isSelected = formData.successMetrics.includes(option.value);
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => toggleMetric(option.value)}
                className={`relative p-5 rounded-xl border-2 text-left transition-all ${
                  isSelected
                    ? "border-teal-electric bg-gradient-to-br from-teal-electric/5 to-cyan-50 shadow-lg shadow-teal-electric/10"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                {/* Checkbox */}
                <div
                  className={`absolute top-4 right-4 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                    isSelected
                      ? "border-teal-electric bg-teal-electric"
                      : "border-gray-300"
                  }`}
                >
                  {isSelected && (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>

                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all ${
                    isSelected
                      ? "bg-teal-electric/10 text-teal-electric"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {getMetricIcon(option.value)}
                </div>

                {/* Content */}
                <h3
                  className={`font-semibold mb-1 transition-colors ${
                    isSelected ? "text-indigo-deep" : "text-gray-900"
                  }`}
                >
                  {option.label}
                </h3>
                <p className="text-sm text-gray-600">{option.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Target Outcomes */}
      <div className="space-y-2">
        <label
          htmlFor="targetOutcomes"
          className="block text-sm font-semibold text-gray-700"
        >
          Target Outcomes <span className="text-red-500">*</span>
        </label>
        <p className="text-sm text-gray-500">
          Describe the specific outcomes you want to achieve. Be as concrete as possible.
        </p>
        <textarea
          id="targetOutcomes"
          value={formData.targetOutcomes}
          onChange={(e) => updateFormData({ targetOutcomes: e.target.value })}
          placeholder="Example: Reduce time-to-market by 40%, increase team velocity by 25%, achieve 90% employee adoption of new processes..."
          rows={4}
          className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:border-teal-electric focus:ring-2 focus:ring-teal-electric/20 transition-all outline-none resize-none"
        />
      </div>

      {/* Timeline Expectations */}
      <div className="space-y-2">
        <label
          htmlFor="timelineExpectations"
          className="block text-sm font-semibold text-gray-700"
        >
          Timeline Expectations{" "}
          <span className="font-normal text-gray-400">(Optional)</span>
        </label>
        <textarea
          id="timelineExpectations"
          value={formData.timelineExpectations}
          onChange={(e) => updateFormData({ timelineExpectations: e.target.value })}
          placeholder="Any specific milestones, deadlines, or timing considerations we should know about?"
          rows={3}
          className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:border-teal-electric focus:ring-2 focus:ring-teal-electric/20 transition-all outline-none resize-none"
        />
      </div>

      {/* Final Step Note */}
      <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <svg
              className="w-5 h-5 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm text-green-800">
              <strong>You&apos;re almost done!</strong> After submitting, our team will review your
              information and reach out within 24 hours to schedule a discovery call.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
