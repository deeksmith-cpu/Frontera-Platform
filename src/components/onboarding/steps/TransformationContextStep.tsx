"use client";

import { OnboardingFormData } from "@/types/database";

interface TransformationContextStepProps {
  formData: OnboardingFormData;
  updateFormData: (updates: Partial<OnboardingFormData>) => void;
}

const PAIN_POINT_PROMPTS = [
  "Siloed teams struggling to collaborate",
  "Slow time-to-market for new features",
  "Difficulty measuring progress and impact",
  "Resistance to change within the organization",
  "Lack of clear strategic direction",
];

const PREVIOUS_ATTEMPT_PROMPTS = [
  "Agile transformation initiatives",
  "Restructuring or reorganization",
  "New tool or platform implementations",
  "External consulting engagements",
  "Training and upskilling programs",
];

export default function TransformationContextStep({
  formData,
  updateFormData,
}: TransformationContextStepProps) {
  const addPainPointPrompt = (prompt: string) => {
    const current = formData.painPoints.trim();
    const newValue = current ? `${current}\n• ${prompt}` : `• ${prompt}`;
    updateFormData({ painPoints: newValue });
  };

  const addPreviousAttemptPrompt = (prompt: string) => {
    const current = formData.previousAttempts.trim();
    const newValue = current ? `${current}\n• ${prompt}` : `• ${prompt}`;
    updateFormData({ previousAttempts: newValue });
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Transformation Context</h2>
        <p className="text-gray-600">
          Help us understand your current challenges and past experiences to design the most
          effective approach.
        </p>
      </div>

      {/* Pain Points */}
      <div className="space-y-3">
        <label
          htmlFor="painPoints"
          className="block text-sm font-semibold text-gray-700"
        >
          Current Pain Points <span className="text-red-500">*</span>
        </label>
        <p className="text-sm text-gray-500">
          What challenges is your organization facing that prompted this transformation?
        </p>

        {/* Quick Add Prompts */}
        <div className="flex flex-wrap gap-2 mb-3">
          {PAIN_POINT_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => addPainPointPrompt(prompt)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-xs font-medium hover:bg-indigo-deep/10 hover:text-indigo-deep transition-colors"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {prompt}
            </button>
          ))}
        </div>

        <textarea
          id="painPoints"
          value={formData.painPoints}
          onChange={(e) => updateFormData({ painPoints: e.target.value })}
          placeholder="Describe the key challenges and friction points your organization is experiencing..."
          rows={5}
          className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:border-teal-electric focus:ring-2 focus:ring-teal-electric/20 transition-all outline-none resize-none"
        />
      </div>

      {/* Previous Attempts */}
      <div className="space-y-3">
        <label
          htmlFor="previousAttempts"
          className="block text-sm font-semibold text-gray-700"
        >
          Previous Transformation Attempts <span className="text-red-500">*</span>
        </label>
        <p className="text-sm text-gray-500">
          What approaches have you tried before? What worked and what didn&apos;t?
        </p>

        {/* Quick Add Prompts */}
        <div className="flex flex-wrap gap-2 mb-3">
          {PREVIOUS_ATTEMPT_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => addPreviousAttemptPrompt(prompt)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-xs font-medium hover:bg-indigo-deep/10 hover:text-indigo-deep transition-colors"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {prompt}
            </button>
          ))}
        </div>

        <textarea
          id="previousAttempts"
          value={formData.previousAttempts}
          onChange={(e) => updateFormData({ previousAttempts: e.target.value })}
          placeholder="Share your experiences with previous transformation efforts, including successes and lessons learned..."
          rows={5}
          className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:border-teal-electric focus:ring-2 focus:ring-teal-electric/20 transition-all outline-none resize-none"
        />
      </div>

      {/* Additional Context (Optional) */}
      <div className="space-y-2">
        <label
          htmlFor="additionalContext"
          className="block text-sm font-semibold text-gray-700"
        >
          Additional Context{" "}
          <span className="font-normal text-gray-400">(Optional)</span>
        </label>
        <textarea
          id="additionalContext"
          value={formData.additionalContext}
          onChange={(e) => updateFormData({ additionalContext: e.target.value })}
          placeholder="Any other information that would help us understand your situation better..."
          rows={3}
          className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:border-teal-electric focus:ring-2 focus:ring-teal-electric/20 transition-all outline-none resize-none"
        />
      </div>

      {/* Privacy Note */}
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
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-700">
              <strong>Your information is confidential.</strong> Everything you share is protected
              under our NDA and used solely to customize your transformation strategy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
