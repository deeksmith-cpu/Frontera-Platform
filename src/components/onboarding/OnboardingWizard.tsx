"use client";

import { useState, useEffect } from "react";
import posthog from "posthog-js";
import { supabase } from "@/lib/supabase";
import {
  OnboardingFormData,
  INITIAL_FORM_DATA,
  StrategicFocus,
  SuccessMetric,
  ClientOnboarding,
} from "@/types/database";
import StepIndicator from "./StepIndicator";
import CompanyBasicsStep from "./steps/CompanyBasicsStep";
import StrategicFocusStep from "./steps/StrategicFocusStep";
import TransformationContextStep from "./steps/TransformationContextStep";
import SuccessCriteriaStep from "./steps/SuccessCriteriaStep";
import SuccessScreen from "./SuccessScreen";

interface OnboardingWizardProps {
  existingId?: string;
}

export default function OnboardingWizard({ existingId }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingFormData>(INITIAL_FORM_DATA);
  const [recordId, setRecordId] = useState<string | null>(existingId || null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const TOTAL_STEPS = 4;

  // Track onboarding start
  useEffect(() => {
    posthog.capture('onboarding_started', { existing_id: existingId || null });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Load existing data if editing
  useEffect(() => {
    if (existingId) {
      loadExistingData(existingId);
    }
  }, [existingId]);

  const loadExistingData = async (id: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("client_onboarding")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      if (data) {
        const record = data as unknown as ClientOnboarding;
        setFormData({
          companyName: record.company_name,
          industry: record.industry,
          companySize: record.company_size,
          strategicFocus: record.strategic_focus as StrategicFocus,
          strategicFocusOther: record.strategic_focus_other || "",
          painPoints: record.pain_points,
          previousAttempts: record.previous_attempts,
          additionalContext: record.additional_context || "",
          successMetrics: record.success_metrics as SuccessMetric[],
          targetOutcomes: record.target_outcomes,
          timelineExpectations: record.timeline_expectations || "",
        });
        setCurrentStep(record.current_step);
        if (record.status === "submitted") {
          setIsSubmitted(true);
        }
      }
    } catch (err) {
      setError("Failed to load existing data");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const saveProgress = async (step: number, submit = false) => {
    setIsSaving(true);
    setError(null);

    const payload = {
      company_name: formData.companyName,
      industry: formData.industry,
      company_size: formData.companySize,
      strategic_focus: formData.strategicFocus || "other",
      strategic_focus_other: formData.strategicFocusOther || null,
      pain_points: formData.painPoints,
      previous_attempts: formData.previousAttempts,
      additional_context: formData.additionalContext || null,
      success_metrics: formData.successMetrics,
      target_outcomes: formData.targetOutcomes,
      timeline_expectations: formData.timelineExpectations || null,
      current_step: step,
      status: submit ? "submitted" : "draft",
    };

    try {
      if (recordId) {
        // Update existing record
        const { error } = await supabase
          .from("client_onboarding")
          .update(payload)
          .eq("id", recordId);

        if (error) throw error;
      } else {
        // Create new record
        const { data, error } = await supabase
          .from("client_onboarding")
          .insert(payload)
          .select("id")
          .single();

        if (error) throw error;
        if (data) setRecordId((data as { id: string }).id);
      }

      if (submit) {
        setIsSubmitted(true);
        posthog.capture('onboarding_submitted', {
          company_name: formData.companyName,
          industry: formData.industry,
          company_size: formData.companySize,
          strategic_focus: formData.strategicFocus,
          steps_completed: step,
        });
      }
    } catch (err) {
      setError("Failed to save progress. Please try again.");
      console.error(err);
      posthog.capture('onboarding_error', { step, submit, error: String(err) });
    } finally {
      setIsSaving(false);
    }
  };

  const updateFormData = (updates: Partial<OnboardingFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleNext = async () => {
    if (currentStep < TOTAL_STEPS) {
      posthog.capture('onboarding_step_completed', {
        step: currentStep,
        step_name: ['company_basics', 'strategic_focus', 'transformation_context', 'success_criteria'][currentStep - 1],
      });
      await saveProgress(currentStep + 1);
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleStepClick = (step: number) => {
    if (step <= currentStep || isStepAccessible(step)) {
      setCurrentStep(step);
    }
  };

  const isStepAccessible = (step: number): boolean => {
    // Allow going back to any previous step
    if (step < currentStep) return true;
    // Allow going forward only if current step is valid
    return isCurrentStepValid();
  };

  const isCurrentStepValid = (): boolean => {
    switch (currentStep) {
      case 1:
        return !!(formData.companyName && formData.industry && formData.companySize);
      case 2:
        return !!(formData.strategicFocus && (formData.strategicFocus !== "other" || formData.strategicFocusOther));
      case 3:
        return !!(formData.painPoints && formData.previousAttempts);
      case 4:
        return !!(formData.successMetrics.length > 0 && formData.targetOutcomes);
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    await saveProgress(TOTAL_STEPS, true);
  };

  const handleFastTrackSubmit = async () => {
    // Submit immediately with whatever data has been filled in
    await saveProgress(currentStep, true);
  };

  const handleEdit = () => {
    setIsSubmitted(false);
    setCurrentStep(1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-deep border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your progress...</p>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return <SuccessScreen onEdit={handleEdit} recordId={recordId} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-deep/5 border border-indigo-deep/10 mb-4">
            <span className="w-2 h-2 rounded-full bg-teal-electric animate-pulse" />
            <span className="text-sm font-medium text-indigo-deep">Client Onboarding</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Welcome to Frontera
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Help us understand your organization so we can tailor your transformation journey
          </p>
        </div>

        {/* Progress Indicator */}
        <StepIndicator
          currentStep={currentStep}
          totalSteps={TOTAL_STEPS}
          onStepClick={handleStepClick}
        />

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          <div className="p-6 sm:p-10">
            {/* Step Content */}
            {currentStep === 1 && (
              <CompanyBasicsStep
                formData={formData}
                updateFormData={updateFormData}
              />
            )}
            {currentStep === 2 && (
              <StrategicFocusStep
                formData={formData}
                updateFormData={updateFormData}
              />
            )}
            {currentStep === 3 && (
              <TransformationContextStep
                formData={formData}
                updateFormData={updateFormData}
              />
            )}
            {currentStep === 4 && (
              <SuccessCriteriaStep
                formData={formData}
                updateFormData={updateFormData}
              />
            )}
          </div>

          {/* Navigation */}
          <div className="px-6 sm:px-10 py-6 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                currentStep === 1
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              Back
            </button>

            <div className="flex items-center gap-3">
              {isSaving && (
                <span className="text-sm text-gray-500 flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                  Saving...
                </span>
              )}

              {currentStep < TOTAL_STEPS ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!isCurrentStepValid() || isSaving}
                  className={`px-8 py-3 rounded-xl font-semibold transition-all ${
                    isCurrentStepValid() && !isSaving
                      ? "bg-indigo-deep text-white hover:bg-indigo-darker shadow-lg shadow-indigo-deep/25"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Continue
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!isCurrentStepValid() || isSaving}
                  className={`px-8 py-3 rounded-xl font-semibold transition-all ${
                    isCurrentStepValid() && !isSaving
                      ? "bg-[#fbbf24] text-slate-900 hover:opacity-90 shadow-lg shadow-[#fbbf24]/25"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Submit Application
                </button>
              )}
            </div>
          </div>

          {/* Fast Track Option */}
          <div className="px-6 sm:px-10 py-5 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200">
              <p className="text-sm text-gray-500 text-center sm:text-left">
                We would love to hear more about your context, but if you want to skip filling in the details and talk to us, we are happy to do that.
              </p>
              <button
                type="button"
                onClick={handleFastTrackSubmit}
                disabled={isSaving}
                className="flex-shrink-0 px-5 py-2 rounded-lg text-sm font-medium text-gray-600 bg-white hover:bg-gray-100 border border-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Skip &amp; Submit
              </button>
            </div>
          </div>
        </div>

        {/* Auto-save indicator */}
        {recordId && (
          <p className="text-center text-sm text-gray-500 mt-6">
            Your progress is automatically saved
          </p>
        )}
      </div>
    </div>
  );
}
