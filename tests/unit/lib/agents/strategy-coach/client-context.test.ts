import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  loadClientContext,
  formatClientContextForPrompt,
  getClientSummary,
  type ClientContext,
} from '@/lib/agents/strategy-coach/client-context';

// Mock Supabase
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(),
        })),
      })),
    })),
  })),
}));

import { createClient } from '@supabase/supabase-js';

describe('Client Context', () => {
  // Helper to create a valid ClientContext
  const createTestContext = (overrides: Partial<ClientContext> = {}): ClientContext => ({
    companyName: 'Acme Corp',
    industry: 'Technology',
    companySize: '201-500 employees',
    tier: 'enterprise',
    strategicFocus: 'product_model',
    strategicFocusDescription: 'transforming into a product-centric operating model',
    painPoints: 'Struggling to align product teams with business strategy',
    previousAttempts: 'Tried agile transformation in 2022, partial success',
    targetOutcomes: 'Achieve 40% faster time-to-market',
    additionalContext: 'Recently acquired two smaller companies',
    successMetrics: ['metrics_evidence', 'outcomes'],
    timelineExpectations: '12-18 months',
    clerkOrgId: 'org_test123',
    clientId: 'client_abc',
    ...overrides,
  });

  describe('loadClientContext', () => {
    beforeEach(() => {
      vi.clearAllMocks();
      // Setup environment variables
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key';
    });

    it('should throw error when Supabase URL is missing', async () => {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;

      await expect(loadClientContext('org_test')).rejects.toThrow(
        'Missing Supabase configuration'
      );
    });

    it('should throw error when Supabase service role key is missing', async () => {
      delete process.env.SUPABASE_SERVICE_ROLE_KEY;

      await expect(loadClientContext('org_test')).rejects.toThrow(
        'Missing Supabase configuration'
      );
    });

    it('should return null when client is not found', async () => {
      const mockSingle = vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'Not found' },
      });

      const mockEq = vi.fn(() => ({ single: mockSingle }));
      const mockSelect = vi.fn(() => ({ eq: mockEq }));
      const mockFrom = vi.fn(() => ({ select: mockSelect }));

      vi.mocked(createClient).mockReturnValue({
        from: mockFrom,
      } as ReturnType<typeof createClient>);

      const result = await loadClientContext('org_nonexistent');

      expect(result).toBeNull();
      expect(mockFrom).toHaveBeenCalledWith('clients');
      expect(mockEq).toHaveBeenCalledWith('clerk_org_id', 'org_nonexistent');
    });

    it('should load client without onboarding when onboarding_id is null', async () => {
      const mockClientData = {
        id: 'client_123',
        clerk_org_id: 'org_test',
        company_name: 'Test Company',
        industry: 'Technology',
        company_size: '51-200 employees',
        tier: 'standard',
        strategic_focus: 'strategy_to_execution',
        pain_points: 'Execution gaps',
        target_outcomes: 'Better alignment',
        onboarding_id: null,
      };

      const mockSingle = vi.fn().mockResolvedValue({
        data: mockClientData,
        error: null,
      });

      const mockEq = vi.fn(() => ({ single: mockSingle }));
      const mockSelect = vi.fn(() => ({ eq: mockEq }));
      const mockFrom = vi.fn(() => ({ select: mockSelect }));

      vi.mocked(createClient).mockReturnValue({
        from: mockFrom,
      } as ReturnType<typeof createClient>);

      const result = await loadClientContext('org_test');

      expect(result).not.toBeNull();
      expect(result?.companyName).toBe('Test Company');
      expect(result?.industry).toBe('Technology');
      expect(result?.tier).toBe('standard');
      expect(result?.strategicFocus).toBe('strategy_to_execution');
      // No onboarding data fetched
      expect(mockFrom).toHaveBeenCalledTimes(1);
      expect(mockFrom).toHaveBeenCalledWith('clients');
    });

    it('should load client with onboarding data when onboarding_id exists', async () => {
      const mockClientData = {
        id: 'client_123',
        clerk_org_id: 'org_test',
        company_name: 'Test Company',
        industry: null, // Will fall back to onboarding
        company_size: null,
        tier: 'pilot',
        strategic_focus: null,
        pain_points: null,
        target_outcomes: null,
        onboarding_id: 'onboard_456',
      };

      const mockOnboardingData = {
        id: 'onboard_456',
        industry: 'Financial Services',
        company_size: '1001-5000 employees',
        strategic_focus: 'team_empowerment',
        pain_points: 'Teams lack autonomy',
        previous_attempts: 'Several past initiatives',
        target_outcomes: 'Empowered teams',
        additional_context: 'Regulated industry',
        success_metrics: ['revenue', 'client_growth'],
        timeline_expectations: '6-12 months',
      };

      let callCount = 0;
      const mockSingle = vi.fn().mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return Promise.resolve({ data: mockClientData, error: null });
        }
        return Promise.resolve({ data: mockOnboardingData, error: null });
      });

      const mockEq = vi.fn(() => ({ single: mockSingle }));
      const mockSelect = vi.fn(() => ({ eq: mockEq }));
      const mockFrom = vi.fn(() => ({ select: mockSelect }));

      vi.mocked(createClient).mockReturnValue({
        from: mockFrom,
      } as ReturnType<typeof createClient>);

      const result = await loadClientContext('org_test');

      expect(result).not.toBeNull();
      expect(result?.companyName).toBe('Test Company');
      // Should fall back to onboarding data
      expect(result?.industry).toBe('Financial Services');
      expect(result?.companySize).toBe('1001-5000 employees');
      expect(result?.strategicFocus).toBe('team_empowerment');
      expect(result?.painPoints).toBe('Teams lack autonomy');
      expect(result?.previousAttempts).toBe('Several past initiatives');
      expect(result?.additionalContext).toBe('Regulated industry');
      expect(result?.successMetrics).toEqual(['revenue', 'client_growth']);
      expect(result?.timelineExpectations).toBe('6-12 months');

      // Should have fetched both tables
      expect(mockFrom).toHaveBeenCalledWith('clients');
      expect(mockFrom).toHaveBeenCalledWith('client_onboarding');
    });

    it('should prefer client data over onboarding data when both exist', async () => {
      const mockClientData = {
        id: 'client_123',
        clerk_org_id: 'org_test',
        company_name: 'Client Company Name',
        industry: 'Technology', // Client has this
        company_size: '201-500 employees',
        tier: 'enterprise',
        strategic_focus: 'product_model', // Client has this
        pain_points: 'Client pain points', // Client has this
        target_outcomes: 'Client outcomes', // Client has this
        onboarding_id: 'onboard_456',
      };

      const mockOnboardingData = {
        id: 'onboard_456',
        industry: 'Healthcare', // Should be overridden
        company_size: '51-200 employees', // Should be overridden
        strategic_focus: 'mixed', // Should be overridden
        pain_points: 'Onboarding pain points', // Should be overridden
        previous_attempts: 'Only in onboarding', // Only exists here
        target_outcomes: 'Onboarding outcomes',
        additional_context: 'Onboarding context',
        success_metrics: ['outcomes'],
        timeline_expectations: '24 months',
      };

      let callCount = 0;
      const mockSingle = vi.fn().mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return Promise.resolve({ data: mockClientData, error: null });
        }
        return Promise.resolve({ data: mockOnboardingData, error: null });
      });

      const mockEq = vi.fn(() => ({ single: mockSingle }));
      const mockSelect = vi.fn(() => ({ eq: mockEq }));
      const mockFrom = vi.fn(() => ({ select: mockSelect }));

      vi.mocked(createClient).mockReturnValue({
        from: mockFrom,
      } as ReturnType<typeof createClient>);

      const result = await loadClientContext('org_test');

      // Client data takes precedence
      expect(result?.industry).toBe('Technology');
      expect(result?.companySize).toBe('201-500 employees');
      expect(result?.strategicFocus).toBe('product_model');
      expect(result?.painPoints).toBe('Client pain points');
      expect(result?.targetOutcomes).toBe('Client outcomes');

      // Onboarding-only fields still come through
      expect(result?.previousAttempts).toBe('Only in onboarding');
      expect(result?.additionalContext).toBe('Onboarding context');
    });
  });

  describe('formatClientContextForPrompt', () => {
    it('should include company name as header', () => {
      const context = createTestContext();
      const formatted = formatClientContextForPrompt(context);

      expect(formatted).toContain('## Your Client: Acme Corp');
    });

    it('should include industry when present', () => {
      const context = createTestContext({ industry: 'Healthcare' });
      const formatted = formatClientContextForPrompt(context);

      expect(formatted).toContain('Industry: Healthcare');
    });

    it('should include company size when present', () => {
      const context = createTestContext({ companySize: '1001-5000 employees' });
      const formatted = formatClientContextForPrompt(context);

      expect(formatted).toContain('Size: 1001-5000 employees');
    });

    it('should always include tier', () => {
      const context = createTestContext({ tier: 'pilot' });
      const formatted = formatClientContextForPrompt(context);

      expect(formatted).toContain('Tier: pilot');
    });

    it('should include strategic focus section when present', () => {
      const context = createTestContext({
        strategicFocus: 'product_model',
        strategicFocusDescription: 'transforming into a product-centric operating model',
      });
      const formatted = formatClientContextForPrompt(context);

      expect(formatted).toContain('### Strategic Focus');
      expect(formatted).toContain('Their primary focus is transforming into a product-centric operating model.');
    });

    it('should not include strategic focus section when null', () => {
      const context = createTestContext({ strategicFocus: null });
      const formatted = formatClientContextForPrompt(context);

      expect(formatted).not.toContain('### Strategic Focus');
    });

    it('should include pain points when present', () => {
      const context = createTestContext({ painPoints: 'Teams are siloed' });
      const formatted = formatClientContextForPrompt(context);

      expect(formatted).toContain('### Key Challenges');
      expect(formatted).toContain('Teams are siloed');
    });

    it('should not include pain points section when null', () => {
      const context = createTestContext({ painPoints: null });
      const formatted = formatClientContextForPrompt(context);

      expect(formatted).not.toContain('### Key Challenges');
    });

    it('should include previous attempts when present', () => {
      const context = createTestContext({ previousAttempts: 'Agile transformation in 2021' });
      const formatted = formatClientContextForPrompt(context);

      expect(formatted).toContain('### Previous Transformation Attempts');
      expect(formatted).toContain('Agile transformation in 2021');
    });

    it('should include target outcomes when present', () => {
      const context = createTestContext({ targetOutcomes: 'Reduce time-to-market by 50%' });
      const formatted = formatClientContextForPrompt(context);

      expect(formatted).toContain('### Target Outcomes');
      expect(formatted).toContain('Reduce time-to-market by 50%');
    });

    it('should include success metrics when array is not empty', () => {
      const context = createTestContext({ successMetrics: ['revenue', 'outcomes'] });
      const formatted = formatClientContextForPrompt(context);

      expect(formatted).toContain('### Success Metrics');
      expect(formatted).toContain('They measure success through: revenue, outcomes');
    });

    it('should not include success metrics section when array is empty', () => {
      const context = createTestContext({ successMetrics: [] });
      const formatted = formatClientContextForPrompt(context);

      expect(formatted).not.toContain('### Success Metrics');
    });

    it('should include timeline expectations when present', () => {
      const context = createTestContext({ timelineExpectations: '18-24 months' });
      const formatted = formatClientContextForPrompt(context);

      expect(formatted).toContain('### Timeline Expectations');
      expect(formatted).toContain('18-24 months');
    });

    it('should include additional context when present', () => {
      const context = createTestContext({ additionalContext: 'Recently went public' });
      const formatted = formatClientContextForPrompt(context);

      expect(formatted).toContain('### Additional Context');
      expect(formatted).toContain('Recently went public');
    });

    it('should format minimal context correctly', () => {
      const context = createTestContext({
        industry: null,
        companySize: null,
        strategicFocus: null,
        painPoints: null,
        previousAttempts: null,
        targetOutcomes: null,
        additionalContext: null,
        successMetrics: [],
        timelineExpectations: null,
      });
      const formatted = formatClientContextForPrompt(context);

      // Should still have company name and tier
      expect(formatted).toContain('## Your Client: Acme Corp');
      expect(formatted).toContain('Tier: enterprise');

      // Should not have optional sections
      expect(formatted).not.toContain('### Strategic Focus');
      expect(formatted).not.toContain('### Key Challenges');
      expect(formatted).not.toContain('### Previous Transformation Attempts');
      expect(formatted).not.toContain('### Target Outcomes');
      expect(formatted).not.toContain('### Success Metrics');
      expect(formatted).not.toContain('### Timeline Expectations');
      expect(formatted).not.toContain('### Additional Context');
    });
  });

  describe('getClientSummary', () => {
    it('should return pain points summary when present', () => {
      const context = createTestContext({ painPoints: 'Short pain point' });
      const summary = getClientSummary(context);

      expect(summary.painPointsSummary).toBe('Short pain point');
    });

    it('should truncate long pain points to 100 characters', () => {
      const longPainPoints = 'A'.repeat(150);
      const context = createTestContext({ painPoints: longPainPoints });
      const summary = getClientSummary(context);

      expect(summary.painPointsSummary.length).toBe(100);
      expect(summary.painPointsSummary.endsWith('...')).toBe(true);
    });

    it('should return default pain points summary when null', () => {
      const context = createTestContext({ painPoints: null });
      const summary = getClientSummary(context);

      expect(summary.painPointsSummary).toBe('improving product transformation outcomes');
    });

    it('should return outcomes summary when present', () => {
      const context = createTestContext({ targetOutcomes: 'Increase NPS by 20 points' });
      const summary = getClientSummary(context);

      expect(summary.outcomesSummary).toBe('Increase NPS by 20 points');
    });

    it('should truncate long outcomes to 100 characters', () => {
      const longOutcomes = 'B'.repeat(150);
      const context = createTestContext({ targetOutcomes: longOutcomes });
      const summary = getClientSummary(context);

      expect(summary.outcomesSummary.length).toBe(100);
      expect(summary.outcomesSummary.endsWith('...')).toBe(true);
    });

    it('should return default outcomes summary when null', () => {
      const context = createTestContext({ targetOutcomes: null });
      const summary = getClientSummary(context);

      expect(summary.outcomesSummary).toBe('achieving sustainable product-led growth');
    });

    it('should return strategic focus description', () => {
      const context = createTestContext({
        strategicFocusDescription: 'bridging the gap between strategic vision and operational reality',
      });
      const summary = getClientSummary(context);

      expect(summary.focusSummary).toBe('bridging the gap between strategic vision and operational reality');
    });

    it('should handle exactly 100 character text without truncation', () => {
      const exactlyHundred = 'X'.repeat(100);
      const context = createTestContext({ painPoints: exactlyHundred });
      const summary = getClientSummary(context);

      expect(summary.painPointsSummary.length).toBe(100);
      expect(summary.painPointsSummary.endsWith('...')).toBe(false);
    });

    it('should handle exactly 97 characters plus ellipsis correctly', () => {
      const text101 = 'Y'.repeat(101);
      const context = createTestContext({ painPoints: text101 });
      const summary = getClientSummary(context);

      // 97 chars + "..." = 100
      expect(summary.painPointsSummary.length).toBe(100);
      expect(summary.painPointsSummary).toBe('Y'.repeat(97) + '...');
    });
  });
});
