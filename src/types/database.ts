export type StrategicFocus =
  | "strategy_to_execution"
  | "product_model"
  | "team_empowerment"
  | "mixed"
  | "other";

export type SuccessMetric =
  | "metrics_evidence"
  | "outcomes"
  | "revenue"
  | "client_growth";

export interface ClientOnboarding {
  id: string;
  created_at: string;
  updated_at: string;

  // Step 1: Company Basics
  company_name: string;
  industry: string;
  company_size: string;

  // Step 2: Strategic Focus
  strategic_focus: StrategicFocus;
  strategic_focus_other?: string;

  // Step 3: Transformation Context
  pain_points: string;
  previous_attempts: string;
  additional_context?: string;

  // Step 4: Success Criteria
  success_metrics: SuccessMetric[];
  target_outcomes: string;
  timeline_expectations?: string;

  // Status
  status: "draft" | "submitted" | "reviewed";
  current_step: number;
}

export interface Database {
  public: {
    Tables: {
      client_onboarding: {
        Row: ClientOnboarding;
        Insert: Omit<ClientOnboarding, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<ClientOnboarding, "id" | "created_at">>;
      };
    };
  };
}

// Form data type for the wizard
export interface OnboardingFormData {
  // Step 1
  companyName: string;
  industry: string;
  companySize: string;

  // Step 2
  strategicFocus: StrategicFocus | "";
  strategicFocusOther: string;

  // Step 3
  painPoints: string;
  previousAttempts: string;
  additionalContext: string;

  // Step 4
  successMetrics: SuccessMetric[];
  targetOutcomes: string;
  timelineExpectations: string;
}

export const INITIAL_FORM_DATA: OnboardingFormData = {
  companyName: "",
  industry: "",
  companySize: "",
  strategicFocus: "",
  strategicFocusOther: "",
  painPoints: "",
  previousAttempts: "",
  additionalContext: "",
  successMetrics: [],
  targetOutcomes: "",
  timelineExpectations: "",
};

export const INDUSTRIES = [
  "Technology",
  "Financial Services",
  "Healthcare",
  "Manufacturing",
  "Retail & E-commerce",
  "Professional Services",
  "Energy & Utilities",
  "Media & Entertainment",
  "Telecommunications",
  "Government & Public Sector",
  "Other",
] as const;

export const COMPANY_SIZES = [
  "1-50 employees",
  "51-200 employees",
  "201-500 employees",
  "501-1000 employees",
  "1001-5000 employees",
  "5000+ employees",
] as const;

export const STRATEGIC_FOCUS_OPTIONS: { value: StrategicFocus; label: string; description: string }[] = [
  {
    value: "strategy_to_execution",
    label: "Strategy to Execution Insight",
    description: "Bridge the gap between strategic vision and operational reality",
  },
  {
    value: "product_model",
    label: "Product Model Implementation",
    description: "Transform into a product-centric operating model",
  },
  {
    value: "team_empowerment",
    label: "Team Empowerment",
    description: "Enable autonomous, high-performing teams",
  },
  {
    value: "mixed",
    label: "Mixed Approach",
    description: "Combine multiple focus areas for comprehensive transformation",
  },
  {
    value: "other",
    label: "Other",
    description: "Custom transformation focus",
  },
];

export const SUCCESS_METRICS_OPTIONS: { value: SuccessMetric; label: string; description: string }[] = [
  {
    value: "metrics_evidence",
    label: "Metrics & Evidence",
    description: "Data-driven proof of transformation impact",
  },
  {
    value: "outcomes",
    label: "Business Outcomes",
    description: "Tangible improvements in business performance",
  },
  {
    value: "revenue",
    label: "Revenue Impact",
    description: "Direct contribution to top-line growth",
  },
  {
    value: "client_growth",
    label: "Client Growth",
    description: "Expansion of client base and retention",
  },
];
