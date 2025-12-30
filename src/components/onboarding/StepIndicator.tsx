"use client";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  onStepClick: (step: number) => void;
}

const STEP_LABELS = [
  { title: "Company Basics", subtitle: "Tell us about your organization" },
  { title: "Strategic Focus", subtitle: "Define your transformation goals" },
  { title: "Context", subtitle: "Share your current challenges" },
  { title: "Success Criteria", subtitle: "Set your success metrics" },
];

export default function StepIndicator({
  currentStep,
  totalSteps,
  onStepClick,
}: StepIndicatorProps) {
  return (
    <div className="mb-8 sm:mb-12">
      {/* Desktop View */}
      <div className="hidden sm:block">
        <div className="flex items-center justify-between relative">
          {/* Progress Line Background */}
          <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200 z-0" />

          {/* Progress Line Fill */}
          <div
            className="absolute top-6 left-0 h-0.5 bg-gradient-to-r from-indigo-deep to-teal-electric z-0 transition-all duration-500"
            style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          />

          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => {
            const isCompleted = step < currentStep;
            const isCurrent = step === currentStep;
            const isAccessible = step <= currentStep;

            return (
              <button
                key={step}
                onClick={() => onStepClick(step)}
                disabled={!isAccessible}
                className={`relative z-10 flex flex-col items-center group ${
                  isAccessible ? "cursor-pointer" : "cursor-not-allowed"
                }`}
              >
                {/* Step Circle */}
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-lg transition-all duration-300 ${
                    isCompleted
                      ? "bg-gradient-to-br from-indigo-deep to-indigo-darker text-white shadow-lg shadow-indigo-deep/30"
                      : isCurrent
                      ? "bg-white border-2 border-teal-electric text-teal-electric shadow-lg shadow-teal-electric/20"
                      : "bg-white border-2 border-gray-200 text-gray-400"
                  } ${isAccessible && !isCurrent ? "group-hover:border-indigo-deep/50" : ""}`}
                >
                  {isCompleted ? (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step
                  )}
                </div>

                {/* Step Label */}
                <div className="mt-3 text-center">
                  <p
                    className={`font-semibold text-sm transition-colors ${
                      isCurrent ? "text-indigo-deep" : isCompleted ? "text-gray-700" : "text-gray-400"
                    }`}
                  >
                    {STEP_LABELS[step - 1].title}
                  </p>
                  <p
                    className={`text-xs mt-0.5 transition-colors ${
                      isCurrent ? "text-gray-600" : "text-gray-400"
                    }`}
                  >
                    {STEP_LABELS[step - 1].subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile View */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-600">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-sm font-semibold text-indigo-deep">
            {STEP_LABELS[currentStep - 1].title}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-deep to-teal-electric transition-all duration-500 rounded-full"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>

        {/* Step Dots */}
        <div className="flex justify-between mt-2">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
            <button
              key={step}
              onClick={() => onStepClick(step)}
              disabled={step > currentStep}
              className={`w-3 h-3 rounded-full transition-all ${
                step < currentStep
                  ? "bg-indigo-deep"
                  : step === currentStep
                  ? "bg-teal-electric"
                  : "bg-gray-300"
              } ${step <= currentStep ? "cursor-pointer" : "cursor-not-allowed"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
