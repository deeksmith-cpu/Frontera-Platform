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

export type OnboardingStatus =
  | "draft"
  | "submitted"
  | "approved"
  | "rejected"
  | "provisioned";

export type InvitationStatus =
  | "sent"
  | "accepted"
  | "expired"
  | "revoked";

// Agent types for conversations
export type AgentType = "strategy_coach" | "product_coach" | "team_coach" | "general" | "profiling";

// Personal Profile data from coaching intake conversation
export interface PersonalProfileData {
  role: {
    title: string;
    department: string;
    yearsInRole: string;
    teamSize: string;
    reportingTo: string;
  };
  objectives: {
    primaryGoal: string;
    secondaryGoals: string[];
    timeHorizon: string;
    successMetrics: string[];
  };
  leadershipStyle: {
    selfDescribed: string;
    decisionMaking: string;
    communicationPreference: string;
    conflictApproach: string;
  };
  experience: {
    industryBackground: string;
    strategicExperience: string;
    biggestChallenge: string;
    priorCoaching: string;
  };
  workingStyle: {
    preferredPace: string;
    detailVsBigPicture: string;
    feedbackPreference: string;
    learningStyle: string;
  };
  coachingApproach?: {
    recommendedPersona: string;
    reasoning: string;
    userConfirmed: boolean;
  };
}

export type ProfilingStatus = 'not_started' | 'in_progress' | 'completed';

export interface ProfilingFrameworkState {
  status: ProfilingStatus;
  currentDimension: number;
  dimensionsCompleted: string[];
  profileData: PersonalProfileData | null;
  completedAt: string | null;
}

// Output types for strategic documents
export type OutputType =
  | "strategy_document"
  | "roadmap"
  | "okr_framework"
  | "team_charter"
  | "transformation_plan"
  | "assessment_report"
  | "custom";

// Client tier levels
export type ClientTier = "pilot" | "standard" | "enterprise";

// Client record (linked to Clerk Organization)
// Coaching persona preferences structure
export interface CoachingPreferences {
  persona?: 'marcus' | 'elena' | 'richard' | 'growth-architect' | 'product-purist' | 'scale-navigator';
  selected_at?: string;
  auto_recommended?: boolean;
}

// Case Study record (UC3 - Case Study Engine)
export interface CaseStudyRecord {
  id: string;
  title: string;
  source_transcript: string;
  speaker_name: string;
  speaker_company: string;
  speaker_role: string | null;
  context: string;
  decision_point: string;
  action_taken: string;
  outcome: string;
  lessons_learned: string;
  full_excerpt: string | null;
  topic_tags: string[];
  industry_tags: string[];
  company_stage_tags: string[];
  challenge_type_tags: string[];
  phase_relevance: string[];
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  clerk_org_id: string;
  company_name: string;
  slug: string;
  industry: string | null;
  company_size: string | null;
  strategic_focus: string | null;
  pain_points: string | null;
  previous_attempts: string | null;
  target_outcomes: string | null;
  branding: Record<string, unknown>;
  settings: {
    timezone: string;
    language: string;
    features: Record<string, boolean>;
  };
  tier: ClientTier;
  coaching_preferences: CoachingPreferences;
  created_at: string;
  updated_at: string;
  onboarding_id: string | null;
}

// Conversation record (agent chat history)
export interface Conversation {
  id: string;
  clerk_org_id: string;
  clerk_user_id: string;
  title: string | null;
  agent_type: AgentType;
  framework_state: Record<string, unknown>;
  context_summary: string | null;
  status: "active" | "archived" | "completed";
  session_name: string | null;
  current_phase: "discovery" | "research" | "synthesis" | "bets" | null;
  created_at: string;
  updated_at: string;
  last_message_at: string;
}

// Conversation message record
export interface ConversationMessage {
  id: string;
  conversation_id: string;
  clerk_org_id: string;
  role: "user" | "assistant" | "system";
  content: string;
  metadata: Record<string, unknown>;
  token_count: number | null;
  created_at: string;
}

// Strategic output record (generated documents)
export interface StrategicOutput {
  id: string;
  clerk_org_id: string;
  clerk_user_id: string;
  conversation_id: string | null;
  title: string;
  output_type: OutputType;
  content: Record<string, unknown>;
  content_markdown: string | null;
  version: number;
  parent_id: string | null;
  status: "draft" | "review" | "approved" | "archived";
  created_at: string;
  updated_at: string;
}

// Client onboarding record (public lead gen)
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
  status: OnboardingStatus;
  current_step: number;

  // Admin workflow fields
  reviewed_by?: string;
  reviewed_at?: string;
  review_notes?: string;
  invitation_status?: InvitationStatus;
  invitation_sent_at?: string;
  invitation_email?: string;
  provisioned_org_id?: string;
}

// Phase progress tracking for Product Strategy Agent
export interface PhaseProgress {
  id: string;
  conversation_id: string;
  phase: "discovery" | "research" | "synthesis" | "bets";
  status: "pending" | "in_progress" | "completed";
  progress_pct: number;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

// Uploaded materials for Discovery phase
export interface UploadedMaterial {
  id: string;
  conversation_id: string;
  filename: string;
  file_type: string;
  file_url: string | null;
  file_size: number | null;
  extracted_context: Record<string, unknown>;
  processing_status: "pending" | "processing" | "completed" | "failed";
  uploaded_at: string;
  processed_at: string | null;
}

// Territory insights for 3Cs Research
export interface TerritoryInsight {
  id: string;
  conversation_id: string;
  territory: "company" | "customer" | "competitor";
  research_area: string;
  responses: Record<string, unknown>;
  confidence: Record<string, "data" | "experience" | "guess"> | null;
  status: "unexplored" | "in_progress" | "mapped";
  updated_at: string;
  created_at: string;
}

// Synthesis outputs (opportunities, insights, strategic bets)
// Updated for PRD v2.2 - Playing to Win structured synthesis
export interface SynthesisOutput {
  id: string;
  conversation_id: string;

  // Legacy fields (kept for backwards compatibility, now nullable)
  output_type?: "opportunity" | "insight" | "strategic_bet" | null;
  title?: string | null;
  description?: string | null;
  evidence?: Array<Record<string, unknown>> | null;
  confidence_level?: "low" | "medium" | "high" | null;
  hypothesis?: string | null;
  success_criteria?: Array<Record<string, unknown>> | null;

  // New structured synthesis fields (PRD v2.2)
  synthesis_content?: string | null;  // Executive narrative summary
  synthesis_type?: "ai_generated" | "user_edited" | null;
  executive_summary?: string | null;

  // Structured data arrays (JSONB)
  opportunities?: Array<Record<string, unknown>> | null;  // StrategicOpportunity[]
  tensions?: Array<Record<string, unknown>> | null;       // StrategicTension[]
  ptw_cascades?: Array<Record<string, unknown>> | null;   // PTWCascade[]
  recommendations?: string[] | null;

  // Metadata
  metadata?: {
    model_used?: string;
    territories_included?: string[];
    research_areas_count?: number;
    confidence_level?: "low" | "medium" | "high";
    generated_at?: string;
  } | null;

  // User modification tracking
  user_edited?: boolean;
  edited_at?: string | null;

  created_at: string;
  updated_at: string;
}

// Expert Knowledge (UC1: Expert Perspectives from 301 podcast transcripts)
export interface ExpertKnowledgeChunk {
  id: string;
  transcript_filename: string;
  speaker_name: string;
  speaker_company: string;
  speaker_role: string;
  chunk_text: string;
  chunk_index: number;
  topic_tags: string[];
  industry_tags: string[];
  phase_relevance: string[];
  territory_relevance: string[];
  created_at: string;
}

export interface ExpertCitationRecord {
  id: string;
  conversation_id: string;
  chunk_id: string;
  message_id: string | null;
  synthesis_output_id: string | null;
  citation_context: string;
  created_at: string;
}

// Strategic Thesis (Phase 4 - Strategic Bets)
export interface StrategicThesisRow {
  id: string;
  conversation_id: string;
  title: string;
  description: string;
  opportunity_id: string;
  ptw_winning_aspiration: string | null;
  ptw_where_to_play: string | null;
  ptw_how_to_win: string | null;
  dhm_delight: string | null;
  dhm_hard_to_copy: string | null;
  dhm_margin_enhancing: string | null;
  thesis_type: 'offensive' | 'defensive' | 'capability';
  time_horizon: '90d' | '6m' | '12m' | '18m' | null;
  created_at: string;
  updated_at: string;
}

// Strategy Document (Phase 4 - Strategic Bets final deliverable)
export interface StrategyDocumentRow {
  id: string;
  conversation_id: string;
  selected_bet_ids: string[];
  document_content: Record<string, unknown>; // StrategyDocumentContent from bets.ts
  generated_at: string;
  exported_at: string | null;
  created_at: string;
  updated_at: string;
}

// Strategic Bet (Phase 4 - Strategic Bets)
export interface StrategicBetRow {
  id: string;
  conversation_id: string;
  strategic_thesis_id: string | null;
  job_to_be_done: string;
  belief: string;
  bet: string;
  success_metric: string;
  kill_criteria: string | null;
  kill_date: string | null;
  status: 'draft' | 'proposed' | 'accepted' | 'prioritized';
  opportunity_id: string;
  evidence_links: Array<Record<string, unknown>>;
  assumption_being_tested: string | null;
  ptw_where_to_play: string | null;
  ptw_how_to_win: string | null;
  expected_impact: number | null;
  certainty_of_impact: number | null;
  clarity_of_levers: number | null;
  uniqueness_of_levers: number | null;
  overall_score: number | null;
  priority_level: 'high' | 'medium' | 'low' | null;
  confidence: 'low' | 'medium' | 'high' | null;
  time_horizon: '90d' | '6m' | '12m' | '18m' | null;
  risks: Record<string, unknown>;
  depends_on: string[];
  agent_generated: boolean;
  agent_reasoning: string | null;
  user_modified: boolean;
  created_at: string;
  updated_at: string;
}

// Strategic Maturity Assessment
export interface StrategicAssessment {
  id: string;
  clerk_user_id: string;
  clerk_org_id: string;
  responses: Record<string, unknown>;
  dimension_scores: Record<string, unknown>;
  archetype: string;
  strengths: string[];
  growth_areas: string[];
  overall_maturity: number;
  created_at: string;
  updated_at: string;
}

// Strategic Artefact (Phase 5 - Activation)
export interface StrategicArtefact {
  id: string;
  conversation_id: string;
  clerk_org_id: string;
  artefact_type: 'team_brief' | 'guardrails' | 'okr_cascade' | 'decision_framework' | 'stakeholder_pack' | 'evidence_summary';
  title: string;
  content: Record<string, unknown>;
  audience: string | null;
  share_token: string | null;
  is_living: boolean;
  source_bet_id: string | null;
  created_at: string;
  updated_at: string;
}

// Strategy Signal (Phase 6 - Living Strategy)
export interface StrategySignal {
  id: string;
  conversation_id: string;
  clerk_org_id: string;
  signal_type: 'competitor' | 'customer' | 'market' | 'internal';
  title: string;
  description: string;
  impact_assessment: string | null;
  linked_assumption_ids: string[];
  created_at: string;
  updated_at: string;
}

// Strategy Version (Phase 6 - Living Strategy)
export interface StrategyVersion {
  id: string;
  conversation_id: string;
  clerk_org_id: string;
  version_number: number;
  snapshot: Record<string, unknown>;
  change_narrative: string | null;
  trigger: 'phase_completion' | 'manual' | 'signal_triggered' | 'review';
  created_at: string;
}

// Assumption Register (Living Strategy)
export interface AssumptionRecord {
  id: string;
  conversation_id: string;
  clerk_org_id: string;
  assumption_text: string;
  source: string;
  status: 'untested' | 'validated' | 'invalidated';
  evidence: string | null;
  linked_bet_ids: string[];
  linked_signal_ids: string[];
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      client_onboarding: {
        Row: ClientOnboarding;
        Insert: Omit<ClientOnboarding, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<ClientOnboarding, "id" | "created_at">>;
      };
      clients: {
        Row: Client;
        Insert: Omit<Client, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Client, "id" | "created_at">>;
      };
      conversations: {
        Row: Conversation;
        Insert: Omit<Conversation, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Conversation, "id" | "created_at">>;
      };
      conversation_messages: {
        Row: ConversationMessage;
        Insert: Omit<ConversationMessage, "id" | "created_at">;
        Update: never; // Messages are immutable
      };
      strategic_outputs: {
        Row: StrategicOutput;
        Insert: Omit<StrategicOutput, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<StrategicOutput, "id" | "created_at">>;
      };
      phase_progress: {
        Row: PhaseProgress;
        Insert: Omit<PhaseProgress, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<PhaseProgress, "id" | "created_at">>;
      };
      uploaded_materials: {
        Row: UploadedMaterial;
        Insert: Omit<UploadedMaterial, "id" | "uploaded_at">;
        Update: Partial<Omit<UploadedMaterial, "id" | "uploaded_at">>;
      };
      territory_insights: {
        Row: TerritoryInsight;
        Insert: Omit<TerritoryInsight, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<TerritoryInsight, "id" | "created_at">>;
      };
      synthesis_outputs: {
        Row: SynthesisOutput;
        Insert: Omit<SynthesisOutput, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<SynthesisOutput, "id" | "created_at">>;
      };
      strategic_theses: {
        Row: StrategicThesisRow;
        Insert: Omit<StrategicThesisRow, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<StrategicThesisRow, 'id' | 'created_at'>>;
      };
      strategic_bets: {
        Row: StrategicBetRow;
        Insert: Omit<StrategicBetRow, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<StrategicBetRow, 'id' | 'created_at'>>;
      };
      strategy_documents: {
        Row: StrategyDocumentRow;
        Insert: Omit<StrategyDocumentRow, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<StrategyDocumentRow, 'id' | 'created_at'>>;
      };
      strategic_assessments: {
        Row: StrategicAssessment;
        Insert: Omit<StrategicAssessment, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<StrategicAssessment, 'id' | 'created_at'>>;
      };
      strategic_artefacts: {
        Row: StrategicArtefact;
        Insert: Omit<StrategicArtefact, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<StrategicArtefact, 'id' | 'created_at'>>;
      };
      strategy_signals: {
        Row: StrategySignal;
        Insert: Omit<StrategySignal, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<StrategySignal, 'id' | 'created_at'>>;
      };
      strategy_versions: {
        Row: StrategyVersion;
        Insert: Omit<StrategyVersion, 'id' | 'created_at'>;
        Update: Partial<Omit<StrategyVersion, 'id' | 'created_at'>>;
      };
      assumption_register: {
        Row: AssumptionRecord;
        Insert: Omit<AssumptionRecord, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<AssumptionRecord, 'id' | 'created_at'>>;
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
  strategicFocus: StrategicFocus | '';
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
  companyName: '',
  industry: '',
  companySize: '',
  strategicFocus: '',
  strategicFocusOther: '',
  painPoints: '',
  previousAttempts: '',
  additionalContext: '',
  successMetrics: [],
  targetOutcomes: '',
  timelineExpectations: '',
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
