import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  initializeFrameworkState,
  calculateProgress,
  getProgressSummary,
  updateFrameworkState,
  suggestNextFocus,
  type FrameworkState,
  type PillarProgress,
} from '@/lib/agents/strategy-coach/framework-state';

describe('Framework State Management', () => {
  // Helper to create a pillar with specific state
  const createPillar = (started: boolean, completed: boolean, insights: string[] = []): PillarProgress => ({
    started,
    completed,
    insights,
  });

  describe('initializeFrameworkState', () => {
    it('should create a fresh framework state with version 1', () => {
      const state = initializeFrameworkState();
      expect(state.version).toBe(1);
    });

    it('should start in discovery phase', () => {
      const state = initializeFrameworkState();
      expect(state.currentPhase).toBe('discovery');
    });

    it('should initialize session count to 1', () => {
      const state = initializeFrameworkState();
      expect(state.sessionCount).toBe(1);
    });

    it('should initialize message count to 0', () => {
      const state = initializeFrameworkState();
      expect(state.totalMessageCount).toBe(0);
    });

    it('should have empty strategic bets array', () => {
      const state = initializeFrameworkState();
      expect(state.strategicBets).toHaveLength(0);
      expect(state.strategicBets).toEqual([]);
    });

    it('should have empty key insights array', () => {
      const state = initializeFrameworkState();
      expect(state.keyInsights).toHaveLength(0);
      expect(state.keyInsights).toEqual([]);
    });

    it('should initialize all research pillars as not started', () => {
      const state = initializeFrameworkState();

      expect(state.researchPillars.macroMarket.started).toBe(false);
      expect(state.researchPillars.macroMarket.completed).toBe(false);
      expect(state.researchPillars.macroMarket.insights).toEqual([]);

      expect(state.researchPillars.customer.started).toBe(false);
      expect(state.researchPillars.customer.completed).toBe(false);
      expect(state.researchPillars.customer.insights).toEqual([]);

      expect(state.researchPillars.colleague.started).toBe(false);
      expect(state.researchPillars.colleague.completed).toBe(false);
      expect(state.researchPillars.colleague.insights).toEqual([]);
    });

    it('should initialize all canvas sections as incomplete', () => {
      const state = initializeFrameworkState();

      expect(state.canvasProgress.marketReality).toBe(false);
      expect(state.canvasProgress.customerInsights).toBe(false);
      expect(state.canvasProgress.organizationalContext).toBe(false);
      expect(state.canvasProgress.strategicSynthesis).toBe(false);
      expect(state.canvasProgress.teamContext).toBe(false);
    });

    it('should set lastActivityAt to a valid ISO timestamp', () => {
      const before = new Date().toISOString();
      const state = initializeFrameworkState();
      const after = new Date().toISOString();

      expect(state.lastActivityAt).toBeDefined();
      expect(new Date(state.lastActivityAt).getTime()).toBeGreaterThanOrEqual(new Date(before).getTime());
      expect(new Date(state.lastActivityAt).getTime()).toBeLessThanOrEqual(new Date(after).getTime());
    });
  });

  describe('calculateProgress', () => {
    let baseState: FrameworkState;

    beforeEach(() => {
      baseState = initializeFrameworkState();
    });

    describe('initial state', () => {
      it('should return 0% for all metrics on initial state', () => {
        const progress = calculateProgress(baseState);

        expect(progress.overall).toBe(0);
        expect(progress.researchProgress).toBe(0);
        expect(progress.canvasProgress).toBe(0);
      });
    });

    describe('research progress', () => {
      it('should calculate 17% research progress when one pillar started (0.5/3)', () => {
        baseState.researchPillars.macroMarket.started = true;
        const progress = calculateProgress(baseState);

        expect(progress.researchProgress).toBe(17); // Math.round(0.5/3 * 100)
      });

      it('should calculate 33% research progress when one pillar completed (1/3)', () => {
        baseState.researchPillars.macroMarket.completed = true;
        const progress = calculateProgress(baseState);

        expect(progress.researchProgress).toBe(33); // Math.round(1/3 * 100)
      });

      it('should calculate 50% research progress when one completed and one started', () => {
        baseState.researchPillars.macroMarket.completed = true;
        baseState.researchPillars.customer.started = true;
        const progress = calculateProgress(baseState);

        expect(progress.researchProgress).toBe(50); // Math.round(1.5/3 * 100)
      });

      it('should calculate 67% research progress when two pillars completed', () => {
        baseState.researchPillars.macroMarket.completed = true;
        baseState.researchPillars.customer.completed = true;
        const progress = calculateProgress(baseState);

        expect(progress.researchProgress).toBe(67); // Math.round(2/3 * 100)
      });

      it('should calculate 100% research progress when all three pillars completed', () => {
        baseState.researchPillars.macroMarket.completed = true;
        baseState.researchPillars.customer.completed = true;
        baseState.researchPillars.colleague.completed = true;
        const progress = calculateProgress(baseState);

        expect(progress.researchProgress).toBe(100);
      });
    });

    describe('canvas progress', () => {
      it('should calculate 20% canvas progress when one section complete (1/5)', () => {
        baseState.canvasProgress.marketReality = true;
        const progress = calculateProgress(baseState);

        expect(progress.canvasProgress).toBe(20);
      });

      it('should calculate 40% canvas progress when two sections complete', () => {
        baseState.canvasProgress.marketReality = true;
        baseState.canvasProgress.customerInsights = true;
        const progress = calculateProgress(baseState);

        expect(progress.canvasProgress).toBe(40);
      });

      it('should calculate 100% canvas progress when all sections complete', () => {
        baseState.canvasProgress.marketReality = true;
        baseState.canvasProgress.customerInsights = true;
        baseState.canvasProgress.organizationalContext = true;
        baseState.canvasProgress.strategicSynthesis = true;
        baseState.canvasProgress.teamContext = true;
        const progress = calculateProgress(baseState);

        expect(progress.canvasProgress).toBe(100);
      });
    });

    describe('overall progress', () => {
      it('should calculate overall as 50% research + 50% canvas', () => {
        // 100% research, 0% canvas = 50% overall
        baseState.researchPillars.macroMarket.completed = true;
        baseState.researchPillars.customer.completed = true;
        baseState.researchPillars.colleague.completed = true;
        const progress = calculateProgress(baseState);

        expect(progress.overall).toBe(50);
      });

      it('should calculate 100% overall when everything complete', () => {
        // Complete all research pillars
        baseState.researchPillars.macroMarket.completed = true;
        baseState.researchPillars.customer.completed = true;
        baseState.researchPillars.colleague.completed = true;
        // Complete all canvas sections
        baseState.canvasProgress.marketReality = true;
        baseState.canvasProgress.customerInsights = true;
        baseState.canvasProgress.organizationalContext = true;
        baseState.canvasProgress.strategicSynthesis = true;
        baseState.canvasProgress.teamContext = true;

        const progress = calculateProgress(baseState);

        expect(progress.overall).toBe(100);
      });

      it('should round progress values correctly', () => {
        // One pillar started = 16.67% research = 8.33% overall
        baseState.researchPillars.macroMarket.started = true;
        const progress = calculateProgress(baseState);

        expect(progress.researchProgress).toBe(17);
        expect(progress.overall).toBe(8); // Math.round(8.33)
      });
    });
  });

  describe('getProgressSummary', () => {
    let baseState: FrameworkState;

    beforeEach(() => {
      baseState = initializeFrameworkState();
    });

    it('should include current phase description', () => {
      const summary = getProgressSummary(baseState);
      expect(summary).toContain('Current Phase: Initial Discovery');
    });

    it('should show discovery phase description correctly', () => {
      baseState.currentPhase = 'discovery';
      const summary = getProgressSummary(baseState);
      expect(summary).toContain('understanding context and goals');
    });

    it('should show research phase description correctly', () => {
      baseState.currentPhase = 'research';
      const summary = getProgressSummary(baseState);
      expect(summary).toContain('Strategic Research');
      expect(summary).toContain('exploring market, customer, and colleague insights');
    });

    it('should show synthesis phase description correctly', () => {
      baseState.currentPhase = 'synthesis';
      const summary = getProgressSummary(baseState);
      expect(summary).toContain('Strategic Synthesis');
      expect(summary).toContain('Where to Play and How to Win');
    });

    it('should show planning phase description correctly', () => {
      baseState.currentPhase = 'planning';
      const summary = getProgressSummary(baseState);
      expect(summary).toContain('Action Planning');
    });

    it('should include research pillar status', () => {
      const summary = getProgressSummary(baseState);
      expect(summary).toContain('Macro Market Forces: Not Started');
      expect(summary).toContain('Customer Research: Not Started');
      expect(summary).toContain('Colleague Research: Not Started');
    });

    it('should show In Progress for started pillars', () => {
      baseState.researchPillars.macroMarket.started = true;
      const summary = getProgressSummary(baseState);
      expect(summary).toContain('Macro Market Forces: In Progress');
    });

    it('should show Complete for completed pillars', () => {
      baseState.researchPillars.macroMarket.completed = true;
      const summary = getProgressSummary(baseState);
      expect(summary).toContain('Macro Market Forces: Complete');
    });

    it('should include canvas progress when progress > 0', () => {
      baseState.canvasProgress.marketReality = true;
      const summary = getProgressSummary(baseState);
      expect(summary).toContain('Strategic Flow Canvas:');
      expect(summary).toContain('Market Reality: Complete');
    });

    it('should not include canvas section if progress is 0', () => {
      const summary = getProgressSummary(baseState);
      expect(summary).not.toContain('Strategic Flow Canvas:');
    });

    it('should include strategic bets count when bets exist', () => {
      baseState.strategicBets = [
        {
          id: 'bet_1',
          belief: 'Test belief',
          implication: 'Test implication',
          exploration: 'Test exploration',
          successMetric: 'Test metric',
          createdAt: new Date().toISOString(),
        },
      ];
      const summary = getProgressSummary(baseState);
      expect(summary).toContain('Strategic Bets Captured: 1');
    });

    it('should include key insights count when insights exist', () => {
      baseState.keyInsights = ['Insight 1', 'Insight 2'];
      const summary = getProgressSummary(baseState);
      expect(summary).toContain('Key Insights Captured: 2');
    });

    it('should include overall progress percentage', () => {
      const summary = getProgressSummary(baseState);
      expect(summary).toContain('Overall Progress: 0%');
    });
  });

  describe('updateFrameworkState', () => {
    let baseState: FrameworkState;

    beforeEach(() => {
      baseState = initializeFrameworkState();
    });

    it('should return a new state object (immutability)', () => {
      const newState = updateFrameworkState(baseState, {});
      expect(newState).not.toBe(baseState);
    });

    it('should not modify the original state', () => {
      const originalPhase = baseState.currentPhase;
      updateFrameworkState(baseState, { currentPhase: 'research' });
      expect(baseState.currentPhase).toBe(originalPhase);
    });

    it('should update current phase', () => {
      const newState = updateFrameworkState(baseState, { currentPhase: 'research' });
      expect(newState.currentPhase).toBe('research');
    });

    it('should mark pillar as started and set lastExploredAt', () => {
      const newState = updateFrameworkState(baseState, { pillarStarted: 'macroMarket' });

      expect(newState.researchPillars.macroMarket.started).toBe(true);
      expect(newState.researchPillars.macroMarket.lastExploredAt).toBeDefined();
    });

    it('should mark pillar as completed and set lastExploredAt', () => {
      const newState = updateFrameworkState(baseState, { pillarCompleted: 'customer' });

      expect(newState.researchPillars.customer.completed).toBe(true);
      expect(newState.researchPillars.customer.lastExploredAt).toBeDefined();
    });

    it('should add pillar insight to the correct pillar', () => {
      const insight = 'Key competitive insight discovered';
      const newState = updateFrameworkState(baseState, {
        pillarInsight: { pillar: 'macroMarket', insight },
      });

      expect(newState.researchPillars.macroMarket.insights).toContain(insight);
      expect(newState.researchPillars.macroMarket.insights).toHaveLength(1);
    });

    it('should append multiple insights to the same pillar', () => {
      let state = updateFrameworkState(baseState, {
        pillarInsight: { pillar: 'customer', insight: 'Insight 1' },
      });
      state = updateFrameworkState(state, {
        pillarInsight: { pillar: 'customer', insight: 'Insight 2' },
      });

      expect(state.researchPillars.customer.insights).toHaveLength(2);
      expect(state.researchPillars.customer.insights).toContain('Insight 1');
      expect(state.researchPillars.customer.insights).toContain('Insight 2');
    });

    it('should mark canvas section as complete', () => {
      const newState = updateFrameworkState(baseState, { canvasSection: 'marketReality' });
      expect(newState.canvasProgress.marketReality).toBe(true);
    });

    it('should add strategic bet with generated id and timestamp', () => {
      const bet = {
        belief: 'Enterprise customers need embedded coaching',
        implication: 'Opportunity for AI-powered transformation support',
        exploration: 'Build modular coaching platform',
        successMetric: '50% faster capability uplift',
        pillarSource: 'customer' as const,
      };

      const newState = updateFrameworkState(baseState, { strategicBet: bet });

      expect(newState.strategicBets).toHaveLength(1);
      expect(newState.strategicBets[0].id).toBeDefined();
      expect(newState.strategicBets[0].createdAt).toBeDefined();
      expect(newState.strategicBets[0].belief).toBe(bet.belief);
      expect(newState.strategicBets[0].implication).toBe(bet.implication);
      expect(newState.strategicBets[0].exploration).toBe(bet.exploration);
      expect(newState.strategicBets[0].successMetric).toBe(bet.successMetric);
      expect(newState.strategicBets[0].pillarSource).toBe('customer');
    });

    it('should add key insight', () => {
      const insight = 'Critical market trend identified';
      const newState = updateFrameworkState(baseState, { keyInsight: insight });

      expect(newState.keyInsights).toContain(insight);
      expect(newState.keyInsights).toHaveLength(1);
    });

    it('should increment message count when incrementMessages is true', () => {
      expect(baseState.totalMessageCount).toBe(0);
      const newState = updateFrameworkState(baseState, { incrementMessages: true });
      expect(newState.totalMessageCount).toBe(1);
    });

    it('should update lastActivityAt on any update', () => {
      const originalTime = baseState.lastActivityAt;
      // Small delay to ensure timestamp changes
      const newState = updateFrameworkState(baseState, { currentPhase: 'research' });
      expect(newState.lastActivityAt).toBeDefined();
      expect(new Date(newState.lastActivityAt).getTime()).toBeGreaterThanOrEqual(
        new Date(originalTime).getTime()
      );
    });

    it('should handle multiple updates at once', () => {
      const newState = updateFrameworkState(baseState, {
        currentPhase: 'research',
        pillarStarted: 'macroMarket',
        keyInsight: 'Important discovery',
        incrementMessages: true,
      });

      expect(newState.currentPhase).toBe('research');
      expect(newState.researchPillars.macroMarket.started).toBe(true);
      expect(newState.keyInsights).toContain('Important discovery');
      expect(newState.totalMessageCount).toBe(1);
    });
  });

  describe('suggestNextFocus', () => {
    let baseState: FrameworkState;

    beforeEach(() => {
      baseState = initializeFrameworkState();
    });

    it('should suggest macro market when nothing started', () => {
      const suggestion = suggestNextFocus(baseState);
      expect(suggestion).toContain('Macro Market Forces');
      expect(suggestion).toContain('competitive landscape');
    });

    it('should suggest continuing macro market when started but not complete', () => {
      baseState.researchPillars.macroMarket.started = true;
      const suggestion = suggestNextFocus(baseState);
      expect(suggestion).toContain('Continue exploring Macro Market Forces');
    });

    it('should suggest customer research after macro market complete', () => {
      baseState.researchPillars.macroMarket.completed = true;
      const suggestion = suggestNextFocus(baseState);
      expect(suggestion).toContain('Customer Research');
      expect(suggestion).toContain('segmentation');
      expect(suggestion).toContain('jobs-to-be-done');
    });

    it('should suggest continuing customer research when started', () => {
      baseState.researchPillars.macroMarket.completed = true;
      baseState.researchPillars.customer.started = true;
      const suggestion = suggestNextFocus(baseState);
      expect(suggestion).toContain('Continue Customer Research');
    });

    it('should suggest colleague research after customer complete', () => {
      baseState.researchPillars.macroMarket.completed = true;
      baseState.researchPillars.customer.completed = true;
      const suggestion = suggestNextFocus(baseState);
      expect(suggestion).toContain('Colleague Research');
      expect(suggestion).toContain('leadership');
    });

    it('should suggest continuing colleague research when started', () => {
      baseState.researchPillars.macroMarket.completed = true;
      baseState.researchPillars.customer.completed = true;
      baseState.researchPillars.colleague.started = true;
      const suggestion = suggestNextFocus(baseState);
      expect(suggestion).toContain('Complete Colleague Research');
    });

    it('should suggest synthesis when all pillars complete', () => {
      baseState.researchPillars.macroMarket.completed = true;
      baseState.researchPillars.customer.completed = true;
      baseState.researchPillars.colleague.completed = true;
      const suggestion = suggestNextFocus(baseState);
      expect(suggestion).toContain('All research pillars complete');
      expect(suggestion).toContain('synthesize');
      expect(suggestion).toContain('Where to Play');
    });

    it('should suggest market reality canvas section first in synthesis phase', () => {
      baseState.researchPillars.macroMarket.completed = true;
      baseState.researchPillars.customer.completed = true;
      baseState.researchPillars.colleague.completed = true;
      baseState.canvasProgress.strategicSynthesis = true; // Skip to avoid synthesis suggestion
      baseState.currentPhase = 'synthesis';
      const suggestion = suggestNextFocus(baseState);
      expect(suggestion).toContain('Market Reality');
    });

    it('should suggest customer insights canvas section after market reality', () => {
      baseState.currentPhase = 'synthesis';
      baseState.canvasProgress.marketReality = true;
      const suggestion = suggestNextFocus(baseState);
      expect(suggestion).toContain('Customer Insights');
    });

    it('should suggest organizational context after customer insights', () => {
      baseState.currentPhase = 'synthesis';
      baseState.canvasProgress.marketReality = true;
      baseState.canvasProgress.customerInsights = true;
      const suggestion = suggestNextFocus(baseState);
      expect(suggestion).toContain('Organizational Context');
    });

    it('should suggest strategic synthesis after organizational context', () => {
      baseState.currentPhase = 'synthesis';
      baseState.canvasProgress.marketReality = true;
      baseState.canvasProgress.customerInsights = true;
      baseState.canvasProgress.organizationalContext = true;
      const suggestion = suggestNextFocus(baseState);
      expect(suggestion).toContain('Strategic Synthesis');
      expect(suggestion).toContain('Where to Play and How to Win');
    });

    it('should suggest team context as last canvas section', () => {
      baseState.currentPhase = 'planning';
      baseState.canvasProgress.marketReality = true;
      baseState.canvasProgress.customerInsights = true;
      baseState.canvasProgress.organizationalContext = true;
      baseState.canvasProgress.strategicSynthesis = true;
      const suggestion = suggestNextFocus(baseState);
      expect(suggestion).toContain('Team Context');
    });

    it('should suggest review when everything complete', () => {
      baseState.currentPhase = 'planning';
      baseState.researchPillars.macroMarket.completed = true;
      baseState.researchPillars.customer.completed = true;
      baseState.researchPillars.colleague.completed = true;
      baseState.canvasProgress.marketReality = true;
      baseState.canvasProgress.customerInsights = true;
      baseState.canvasProgress.organizationalContext = true;
      baseState.canvasProgress.strategicSynthesis = true;
      baseState.canvasProgress.teamContext = true;
      const suggestion = suggestNextFocus(baseState);
      expect(suggestion).toContain('Review and refine');
    });
  });
});
