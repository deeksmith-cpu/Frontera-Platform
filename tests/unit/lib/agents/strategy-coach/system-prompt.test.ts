import { describe, it, expect, beforeEach } from 'vitest';
import {
  buildSystemPrompt,
  generateOpeningMessage,
} from '@/lib/agents/strategy-coach/system-prompt';
import { initializeFrameworkState, type FrameworkState } from '@/lib/agents/strategy-coach/framework-state';
import type { ClientContext } from '@/lib/agents/strategy-coach/client-context';

describe('System Prompt', () => {
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

  let baseState: FrameworkState;

  beforeEach(() => {
    baseState = initializeFrameworkState();
  });

  describe('buildSystemPrompt', () => {
    it('should include core identity section', () => {
      const context = createTestContext();
      const prompt = buildSystemPrompt(context, baseState);

      expect(prompt).toContain('# Frontera Strategy Coach');
      expect(prompt).toContain('You are the Frontera Strategy Coach');
      expect(prompt).toContain('## Your Role');
      expect(prompt).toContain('## What You Are NOT');
    });

    it('should include client context section', () => {
      const context = createTestContext();
      const prompt = buildSystemPrompt(context, baseState);

      expect(prompt).toContain('## Your Client: Acme Corp');
      expect(prompt).toContain('Industry: Technology');
      expect(prompt).toContain('Tier: enterprise');
    });

    it('should include research playbook methodology', () => {
      const context = createTestContext();
      const prompt = buildSystemPrompt(context, baseState);

      expect(prompt).toContain('## Your Methodology: Product Strategy Research Playbook');
      expect(prompt).toContain('### Pillar 1: Macro Market Forces');
      expect(prompt).toContain('### Pillar 2: Customer Research');
      expect(prompt).toContain('### Pillar 3: Colleague Research');
      expect(prompt).toContain('### Cross-Pillar Synthesis');
    });

    it('should include strategic flow canvas section', () => {
      const context = createTestContext();
      const prompt = buildSystemPrompt(context, baseState);

      expect(prompt).toContain('## Strategic Flow Canvas');
      expect(prompt).toContain('### Section 1: Market Reality');
      expect(prompt).toContain('### Section 2: Customer Insights');
      expect(prompt).toContain('### Section 3: Organizational Context');
      expect(prompt).toContain('### Section 4: Strategic Synthesis');
      expect(prompt).toContain('### Section 5: Strategic Context for Teams');
    });

    it('should include strategic bets format', () => {
      const context = createTestContext();
      const prompt = buildSystemPrompt(context, baseState);

      expect(prompt).toContain('## Strategic Bets Format');
      expect(prompt).toContain('**We believe**');
      expect(prompt).toContain('**Which means**');
      expect(prompt).toContain('**So we will explore**');
      expect(prompt).toContain('**Success looks like**');
    });

    it('should include tone guidelines', () => {
      const context = createTestContext();
      const prompt = buildSystemPrompt(context, baseState);

      expect(prompt).toContain('## Your Tone & Voice');
      expect(prompt).toContain('Confident but not arrogant');
      expect(prompt).toContain('Futuristic but practical');
    });

    it('should include response guidelines', () => {
      const context = createTestContext();
      const prompt = buildSystemPrompt(context, baseState);

      expect(prompt).toContain('## Response Guidelines');
      expect(prompt).toContain('### Structure');
      expect(prompt).toContain('### Coaching Approach');
      expect(prompt).toContain('### When to Suggest Documents');
      expect(prompt).toContain('### Adaptive Workflow');
    });

    it('should include current coaching state section', () => {
      const context = createTestContext();
      const prompt = buildSystemPrompt(context, baseState);

      expect(prompt).toContain('## Current Coaching State');
      expect(prompt).toContain('Current Phase: Initial Discovery');
      expect(prompt).toContain('### Suggested Next Focus');
    });

    it('should include progress summary in coaching state', () => {
      const context = createTestContext();
      baseState.researchPillars.macroMarket.started = true;
      baseState.researchPillars.macroMarket.completed = true;
      const prompt = buildSystemPrompt(context, baseState);

      expect(prompt).toContain('Macro Market Forces: Complete');
      expect(prompt).toContain('Customer Research: Not Started');
    });

    it('should include suggested next focus based on state', () => {
      const context = createTestContext();
      const prompt = buildSystemPrompt(context, baseState);

      expect(prompt).toContain('Start with exploring Macro Market Forces');
    });

    describe('industry guidance', () => {
      it('should include financial services guidance for banking', () => {
        const context = createTestContext({ industry: 'Banking' });
        const prompt = buildSystemPrompt(context, baseState);

        expect(prompt).toContain('## Industry Context: Financial Services');
        expect(prompt).toContain('Regulatory complexity');
        expect(prompt).toContain('Legacy systems');
      });

      it('should include financial services guidance for insurance', () => {
        const context = createTestContext({ industry: 'Insurance' });
        const prompt = buildSystemPrompt(context, baseState);

        expect(prompt).toContain('## Industry Context: Financial Services');
      });

      it('should include financial services guidance for financial services', () => {
        const context = createTestContext({ industry: 'Financial Services' });
        const prompt = buildSystemPrompt(context, baseState);

        expect(prompt).toContain('## Industry Context: Financial Services');
      });

      it('should include healthcare guidance for health industry', () => {
        const context = createTestContext({ industry: 'Healthcare' });
        const prompt = buildSystemPrompt(context, baseState);

        expect(prompt).toContain('## Industry Context: Healthcare');
        expect(prompt).toContain('Patient outcomes');
        expect(prompt).toContain('Clinical evidence');
      });

      it('should include healthcare guidance for pharma', () => {
        const context = createTestContext({ industry: 'Pharmaceutical' });
        const prompt = buildSystemPrompt(context, baseState);

        expect(prompt).toContain('## Industry Context: Healthcare');
      });

      it('should include technology guidance for software', () => {
        const context = createTestContext({ industry: 'Software' });
        const prompt = buildSystemPrompt(context, baseState);

        expect(prompt).toContain('## Industry Context: Technology');
        expect(prompt).toContain('Pace of change');
        expect(prompt).toContain('Platform dynamics');
      });

      it('should include technology guidance for SaaS', () => {
        const context = createTestContext({ industry: 'SaaS' });
        const prompt = buildSystemPrompt(context, baseState);

        expect(prompt).toContain('## Industry Context: Technology');
      });

      it('should include retail guidance for e-commerce', () => {
        const context = createTestContext({ industry: 'E-commerce' });
        const prompt = buildSystemPrompt(context, baseState);

        expect(prompt).toContain('## Industry Context: Retail & E-commerce');
        expect(prompt).toContain('Customer experience');
        expect(prompt).toContain('Omnichannel');
      });

      it('should include retail guidance for consumer goods', () => {
        const context = createTestContext({ industry: 'Consumer Products' });
        const prompt = buildSystemPrompt(context, baseState);

        expect(prompt).toContain('## Industry Context: Retail & E-commerce');
      });

      it('should include generic industry guidance for unknown industries', () => {
        const context = createTestContext({ industry: 'Aerospace' });
        const prompt = buildSystemPrompt(context, baseState);

        expect(prompt).toContain('## Industry Context: Aerospace');
        expect(prompt).toContain('Apply industry-specific knowledge');
      });

      it('should not include industry section when industry is null', () => {
        const context = createTestContext({ industry: null });
        const prompt = buildSystemPrompt(context, baseState);

        expect(prompt).not.toContain('## Industry Context');
      });
    });

    describe('strategic focus guidance', () => {
      it('should include strategy to execution guidance', () => {
        const context = createTestContext({ strategicFocus: 'strategy_to_execution' });
        const prompt = buildSystemPrompt(context, baseState);

        expect(prompt).toContain('## Strategic Focus: Strategy to Execution');
        expect(prompt).toContain('Alignment mechanisms');
        expect(prompt).toContain('Communication cadences');
      });

      it('should include product model guidance', () => {
        const context = createTestContext({ strategicFocus: 'product_model' });
        const prompt = buildSystemPrompt(context, baseState);

        expect(prompt).toContain('## Strategic Focus: Product Model Implementation');
        expect(prompt).toContain('Product thinking');
        expect(prompt).toContain('Team structures');
      });

      it('should include team empowerment guidance', () => {
        const context = createTestContext({ strategicFocus: 'team_empowerment' });
        const prompt = buildSystemPrompt(context, baseState);

        expect(prompt).toContain('## Strategic Focus: Team Empowerment');
        expect(prompt).toContain('Context not control');
        expect(prompt).toContain('Distributed leadership');
      });

      it('should include mixed approach guidance', () => {
        const context = createTestContext({ strategicFocus: 'mixed' });
        const prompt = buildSystemPrompt(context, baseState);

        expect(prompt).toContain('## Strategic Focus: Comprehensive Transformation');
        expect(prompt).toContain('Prioritize');
        expect(prompt).toContain('Sequence');
      });

      it('should not include strategic focus guidance for other', () => {
        const context = createTestContext({ strategicFocus: 'other' });
        const prompt = buildSystemPrompt(context, baseState);

        // Should not have a specific guidance section for 'other'
        expect(prompt).not.toContain('## Strategic Focus: Other');
      });

      it('should not include strategic focus guidance when null', () => {
        const context = createTestContext({ strategicFocus: null });
        const prompt = buildSystemPrompt(context, baseState);

        expect(prompt).not.toContain('## Strategic Focus:');
      });
    });

    describe('transform recovery guidance', () => {
      it('should include transform recovery guidance when previousAttempts exists', () => {
        const context = createTestContext({ previousAttempts: 'Failed transformation in 2020' });
        const prompt = buildSystemPrompt(context, baseState);

        expect(prompt).toContain('## Transform Recovery Awareness');
        expect(prompt).toContain('Acknowledge history');
        expect(prompt).toContain('Address skepticism');
      });

      it('should not include transform recovery guidance when previousAttempts is null', () => {
        const context = createTestContext({ previousAttempts: null });
        const prompt = buildSystemPrompt(context, baseState);

        expect(prompt).not.toContain('## Transform Recovery Awareness');
      });
    });
  });

  describe('generateOpeningMessage', () => {
    describe('new conversation', () => {
      it('should generate welcome message with user name', () => {
        const context = createTestContext();
        const message = generateOpeningMessage(context, baseState, 'John', false);

        expect(message).toContain('Welcome, John');
        expect(message).toContain("I'm your Strategy Coach from Frontera");
      });

      it('should use "there" when no user name provided', () => {
        const context = createTestContext();
        const message = generateOpeningMessage(context, baseState, undefined, false);

        expect(message).toContain('Welcome, there');
      });

      it('should include company name', () => {
        const context = createTestContext({ companyName: 'TechCorp' });
        const message = generateOpeningMessage(context, baseState, 'Jane', false);

        expect(message).toContain('guide TechCorp through');
      });

      it('should include strategic focus description', () => {
        const context = createTestContext({
          strategicFocusDescription: 'bridging the gap between strategic vision and operational reality',
        });
        const message = generateOpeningMessage(context, baseState, 'Jane', false);

        expect(message).toContain('your focus is on bridging the gap between strategic vision and operational reality');
      });

      it('should include pain points summary', () => {
        const context = createTestContext({ painPoints: 'Teams are siloed and disconnected' });
        const message = generateOpeningMessage(context, baseState, 'Jane', false);

        expect(message).toContain('challenges around teams are siloed and disconnected');
      });

      it('should use default pain points when null', () => {
        const context = createTestContext({ painPoints: null });
        const message = generateOpeningMessage(context, baseState, 'Jane', false);

        expect(message).toContain('improving product transformation outcomes');
      });

      it('should include target outcomes summary', () => {
        const context = createTestContext({ targetOutcomes: 'Increase velocity by 40%' });
        const message = generateOpeningMessage(context, baseState, 'Jane', false);

        expect(message).toContain("you're targeting increase velocity by 40%");
      });

      it('should use default outcomes when null', () => {
        const context = createTestContext({ targetOutcomes: null });
        const message = generateOpeningMessage(context, baseState, 'Jane', false);

        expect(message).toContain('achieving sustainable product-led growth');
      });

      it('should end with opening question about competitive dynamics', () => {
        const context = createTestContext({ companyName: 'InnovateCo' });
        const message = generateOpeningMessage(context, baseState, 'Jane', false);

        expect(message).toContain('**What competitive dynamics or market shifts');
        expect(message).toContain('InnovateCo right now?**');
      });

      it('should truncate long pain points for opening', () => {
        const longPainPoint =
          'This is an extremely long pain point description that goes on and on for many sentences. It keeps describing various challenges in great detail.';
        const context = createTestContext({ painPoints: longPainPoint });
        const message = generateOpeningMessage(context, baseState, 'Jane', false);

        // Should be truncated - first sentence or up to ~80 chars
        expect(message).not.toContain(longPainPoint);
        expect(message).toContain('challenges around');
      });
    });

    describe('resuming conversation', () => {
      it('should generate welcome back message when resuming', () => {
        const context = createTestContext();
        baseState.totalMessageCount = 5;
        const message = generateOpeningMessage(context, baseState, 'John', true);

        expect(message).toContain('Welcome back, John');
        expect(message).toContain("I've reviewed our previous discussion");
      });

      it('should include company name in resume message', () => {
        const context = createTestContext({ companyName: 'MegaCorp' });
        baseState.totalMessageCount = 3;
        const message = generateOpeningMessage(context, baseState, 'John', true);

        expect(message).toContain("MegaCorp's transformation journey");
      });

      it('should show 0% progress when no pillars completed', () => {
        const context = createTestContext();
        baseState.totalMessageCount = 2;
        const message = generateOpeningMessage(context, baseState, 'John', true);

        // Progress message should not appear for 0%
        expect(message).not.toContain('research phase');
      });

      it('should show 33% progress when one pillar completed', () => {
        const context = createTestContext();
        baseState.totalMessageCount = 5;
        baseState.researchPillars.macroMarket.completed = true;
        const message = generateOpeningMessage(context, baseState, 'John', true);

        expect(message).toContain("You've made good progress through the research phase (33% complete)");
      });

      it('should show 67% progress when two pillars completed', () => {
        const context = createTestContext();
        baseState.totalMessageCount = 10;
        baseState.researchPillars.macroMarket.completed = true;
        baseState.researchPillars.customer.completed = true;
        const message = generateOpeningMessage(context, baseState, 'John', true);

        expect(message).toContain('67% complete');
      });

      it('should show 100% progress when all pillars completed', () => {
        const context = createTestContext();
        baseState.totalMessageCount = 15;
        baseState.researchPillars.macroMarket.completed = true;
        baseState.researchPillars.customer.completed = true;
        baseState.researchPillars.colleague.completed = true;
        const message = generateOpeningMessage(context, baseState, 'John', true);

        expect(message).toContain('100% complete');
      });

      it('should include suggested next focus', () => {
        const context = createTestContext();
        baseState.totalMessageCount = 5;
        baseState.researchPillars.macroMarket.started = true;
        baseState.researchPillars.macroMarket.completed = true;
        const message = generateOpeningMessage(context, baseState, 'John', true);

        expect(message).toContain('Customer Research');
      });

      it('should ask where to pick up', () => {
        const context = createTestContext();
        baseState.totalMessageCount = 3;
        const message = generateOpeningMessage(context, baseState, 'John', true);

        expect(message).toContain('Where would you like to pick up?');
      });

      it('should not be resume mode when isResuming is false even with messages', () => {
        const context = createTestContext();
        baseState.totalMessageCount = 10;
        const message = generateOpeningMessage(context, baseState, 'John', false);

        // Should be new conversation message, not resume
        expect(message).toContain("I'm your Strategy Coach from Frontera");
        expect(message).not.toContain('Welcome back');
      });

      it('should treat as new conversation when isResuming but no messages', () => {
        const context = createTestContext();
        baseState.totalMessageCount = 0;
        const message = generateOpeningMessage(context, baseState, 'John', true);

        // Should be new conversation message since there are no messages
        expect(message).toContain("I'm your Strategy Coach from Frontera");
        expect(message).not.toContain('Welcome back');
      });
    });
  });
});
