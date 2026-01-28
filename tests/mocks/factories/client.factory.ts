import type { Client, ClientOnboarding, ClientTier, StrategicFocus, CoachingPreferences } from '@/types/database';
import type { PersonaId } from '@/lib/agents/strategy-coach/personas';

// Counter for unique IDs
let clientIdCounter = 1;
let onboardingIdCounter = 1;

// Create a mock client record
export const createMockClient = (overrides: Partial<Client> = {}): Client => {
  const id = `client_test_${clientIdCounter++}`;
  return {
    id,
    clerk_org_id: 'org_test456',
    company_name: 'Test Company',
    slug: 'test-company',
    industry: 'Technology',
    company_size: '201-500 employees',
    strategic_focus: 'product_model',
    pain_points: 'Siloed teams, slow delivery, lack of product thinking',
    target_outcomes: 'Faster time-to-market, improved team autonomy',
    branding: {},
    settings: {
      timezone: 'Europe/London',
      language: 'en',
      features: {},
    },
    tier: 'standard' as ClientTier,
    coaching_preferences: {} as CoachingPreferences,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    onboarding_id: null,
    ...overrides,
  };
};

// Create a mock client onboarding record
export const createMockClientOnboarding = (
  overrides: Partial<ClientOnboarding> = {}
): ClientOnboarding => {
  const id = `onboarding_test_${onboardingIdCounter++}`;
  return {
    id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    company_name: 'Test Company',
    industry: 'Technology',
    company_size: '201-500 employees',
    strategic_focus: 'product_model' as StrategicFocus,
    pain_points: 'Siloed teams, slow delivery cycles',
    previous_attempts: 'Tried Agile transformation twice with limited success',
    additional_context: 'Looking for sustainable change',
    success_metrics: ['metrics_evidence', 'outcomes'],
    target_outcomes: 'Achieve 40% faster time-to-market',
    timeline_expectations: '6-12 months',
    status: 'submitted',
    current_step: 4,
    ...overrides,
  };
};

// Create mock client context (as returned by loadClientContext)
export const createMockClientContext = (overrides: Partial<{
  companyName: string;
  industry: string | null;
  companySize: string | null;
  tier: ClientTier;
  strategicFocus: StrategicFocus | null;
  strategicFocusDescription: string;
  painPoints: string | null;
  previousAttempts: string | null;
  targetOutcomes: string | null;
  additionalContext: string | null;
  successMetrics: string[];
  timelineExpectations: string | null;
  persona: PersonaId | undefined;
  clerkOrgId: string;
  clientId: string;
}> = {}) => ({
  companyName: 'Test Company',
  industry: 'Technology',
  companySize: '201-500 employees',
  tier: 'standard' as ClientTier,
  strategicFocus: 'product_model' as StrategicFocus,
  strategicFocusDescription: 'transforming into a product-centric operating model',
  painPoints: 'Siloed teams, slow delivery, lack of product thinking',
  previousAttempts: 'Tried Agile transformation twice',
  targetOutcomes: 'Faster time-to-market, improved team autonomy',
  additionalContext: null,
  successMetrics: ['metrics_evidence', 'outcomes'],
  timelineExpectations: '6-12 months',
  persona: undefined,
  clerkOrgId: 'org_test456',
  clientId: 'client_test_1',
  ...overrides,
});

// Reset factory counters (useful in beforeEach)
export const resetClientFactories = () => {
  clientIdCounter = 1;
  onboardingIdCounter = 1;
};
