import type { Conversation, ConversationMessage, AgentType } from '@/types/database';

// Counter for unique IDs
let conversationIdCounter = 1;
let messageIdCounter = 1;

// Framework state type (matching the agent's FrameworkState)
export interface MockFrameworkState {
  version: number;
  currentPhase: 'discovery' | 'research' | 'synthesis' | 'planning';
  researchPillars: {
    macroMarket: { started: boolean; completed: boolean; insights: string[]; lastExploredAt?: string };
    customer: { started: boolean; completed: boolean; insights: string[]; lastExploredAt?: string };
    colleague: { started: boolean; completed: boolean; insights: string[]; lastExploredAt?: string };
  };
  canvasProgress: {
    marketReality: boolean;
    customerInsights: boolean;
    organizationalContext: boolean;
    strategicSynthesis: boolean;
    teamContext: boolean;
  };
  strategicBets: Array<{
    id: string;
    belief: string;
    implication: string;
    exploration: string;
    successMetric: string;
    createdAt: string;
    pillarSource?: 'macro' | 'customer' | 'colleague' | 'synthesis';
  }>;
  keyInsights: string[];
  sessionCount: number;
  totalMessageCount: number;
  lastActivityAt: string;
}

// Create initial framework state
export const createMockFrameworkState = (
  overrides: Partial<MockFrameworkState> = {}
): MockFrameworkState => ({
  version: 1,
  currentPhase: 'discovery',
  researchPillars: {
    macroMarket: { started: false, completed: false, insights: [] },
    customer: { started: false, completed: false, insights: [] },
    colleague: { started: false, completed: false, insights: [] },
  },
  canvasProgress: {
    marketReality: false,
    customerInsights: false,
    organizationalContext: false,
    strategicSynthesis: false,
    teamContext: false,
  },
  strategicBets: [],
  keyInsights: [],
  sessionCount: 1,
  totalMessageCount: 0,
  lastActivityAt: new Date().toISOString(),
  ...overrides,
});

// Create framework state with progress
export const createMockFrameworkStateWithProgress = (
  progress: 'none' | 'started' | 'partial' | 'complete' = 'none'
): MockFrameworkState => {
  switch (progress) {
    case 'started':
      return createMockFrameworkState({
        currentPhase: 'research',
        researchPillars: {
          macroMarket: { started: true, completed: false, insights: ['Initial market insight'] },
          customer: { started: false, completed: false, insights: [] },
          colleague: { started: false, completed: false, insights: [] },
        },
        totalMessageCount: 4,
      });
    case 'partial':
      return createMockFrameworkState({
        currentPhase: 'research',
        researchPillars: {
          macroMarket: { started: true, completed: true, insights: ['Market insight 1', 'Market insight 2'] },
          customer: { started: true, completed: false, insights: ['Customer insight'] },
          colleague: { started: false, completed: false, insights: [] },
        },
        totalMessageCount: 10,
      });
    case 'complete':
      return createMockFrameworkState({
        currentPhase: 'synthesis',
        researchPillars: {
          macroMarket: { started: true, completed: true, insights: ['Market insight 1', 'Market insight 2'] },
          customer: { started: true, completed: true, insights: ['Customer insight 1', 'Customer insight 2'] },
          colleague: { started: true, completed: true, insights: ['Colleague insight'] },
        },
        canvasProgress: {
          marketReality: true,
          customerInsights: true,
          organizationalContext: false,
          strategicSynthesis: false,
          teamContext: false,
        },
        strategicBets: [
          {
            id: 'bet_1',
            belief: 'Enterprise customers need embedded coaching',
            implication: 'Opportunity for AI-powered transformation support',
            exploration: 'Build modular coaching platform',
            successMetric: '50% faster capability uplift',
            createdAt: new Date().toISOString(),
            pillarSource: 'customer',
          },
        ],
        totalMessageCount: 20,
      });
    default:
      return createMockFrameworkState();
  }
};

// Create a mock conversation
export const createMockConversation = (
  overrides: Partial<Conversation> = {}
): Conversation => {
  const id = `conv_test_${conversationIdCounter++}`;
  return {
    id,
    clerk_org_id: 'org_test456',
    clerk_user_id: 'user_test123',
    title: 'Test Strategy Session',
    agent_type: 'strategy_coach' as AgentType,
    framework_state: createMockFrameworkState() as unknown as Record<string, unknown>,
    context_summary: null,
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    last_message_at: new Date().toISOString(),
    ...overrides,
  };
};

// Create a mock conversation message
export const createMockMessage = (
  overrides: Partial<ConversationMessage> = {}
): ConversationMessage => {
  const id = `msg_test_${messageIdCounter++}`;
  return {
    id,
    conversation_id: 'conv_test_1',
    clerk_org_id: 'org_test456',
    role: 'user',
    content: 'Test message content',
    metadata: {},
    token_count: 10,
    created_at: new Date().toISOString(),
    ...overrides,
  };
};

// Create a mock conversation with messages
export const createMockConversationWithMessages = (
  messageCount: number = 3,
  conversationOverrides: Partial<Conversation> = {}
): { conversation: Conversation; messages: ConversationMessage[] } => {
  const conversation = createMockConversation(conversationOverrides);
  const messages: ConversationMessage[] = [];

  for (let i = 0; i < messageCount; i++) {
    const isUser = i % 2 === 0;
    messages.push(
      createMockMessage({
        conversation_id: conversation.id,
        role: isUser ? 'user' : 'assistant',
        content: isUser
          ? `User message ${Math.floor(i / 2) + 1}`
          : `Assistant response ${Math.floor(i / 2) + 1}`,
        created_at: new Date(Date.now() - (messageCount - i) * 60000).toISOString(),
      })
    );
  }

  return { conversation, messages };
};

// Create an opening message
export const createMockOpeningMessage = (
  conversationId: string = 'conv_test_1',
  companyName: string = 'Test Company'
): ConversationMessage => {
  return createMockMessage({
    conversation_id: conversationId,
    role: 'assistant',
    content: `Welcome! I'm your Strategy Coach from Frontera, here to guide ${companyName} through your product strategy transformation.\n\nI've reviewed your organization's profile and understand your focus is on transforming into a product-centric operating model.\n\n**What competitive dynamics or market shifts are making product transformation urgent for ${companyName} right now?**`,
    metadata: { type: 'opening' },
  });
};

// Reset factory counters
export const resetConversationFactories = () => {
  conversationIdCounter = 1;
  messageIdCounter = 1;
};
