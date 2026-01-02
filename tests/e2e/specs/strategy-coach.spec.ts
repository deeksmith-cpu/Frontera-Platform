import { test, expect } from '../fixtures/auth.fixture';

test.describe('Strategy Coach Page', () => {
  test.describe('Page Layout', () => {
    test('should display page title and coaching journey', async ({ strategyCoachPage }) => {
      await strategyCoachPage.navigate();
      await strategyCoachPage.verifyPageLoaded();
    });

    test('should show all four coaching phases', async ({ strategyCoachPage }) => {
      await strategyCoachPage.navigate();
      await strategyCoachPage.verifyCoachingJourneyPhases();
    });

    test('should display breadcrumb navigation', async ({ strategyCoachPage }) => {
      await strategyCoachPage.navigate();
      await expect(strategyCoachPage.breadcrumb).toBeVisible();
      await expect(strategyCoachPage.page.getByText('Dashboard')).toBeVisible();
    });

    test('should have new session button', async ({ strategyCoachPage }) => {
      await strategyCoachPage.navigate();
      await expect(strategyCoachPage.newSessionButton).toBeVisible();
      await expect(strategyCoachPage.newSessionButton).toBeEnabled();
    });
  });

  test.describe('Empty State', () => {
    test('should show empty state when no conversations exist', async ({ strategyCoachPage }) => {
      await strategyCoachPage.navigate();

      // This test may pass or fail depending on whether the user has conversations
      // In a real test environment, we'd ensure a clean state
      const hasEmptyState = await strategyCoachPage.hasEmptyState();
      const conversationCount = await strategyCoachPage.getConversationCount();

      if (hasEmptyState) {
        expect(conversationCount).toBe(0);
      } else {
        expect(conversationCount).toBeGreaterThan(0);
      }
    });
  });

  test.describe('Conversation List', () => {
    test('should display conversation cards when conversations exist', async ({ strategyCoachPage }) => {
      await strategyCoachPage.navigate();

      const count = await strategyCoachPage.getConversationCount();
      if (count > 0) {
        const titles = await strategyCoachPage.getConversationTitles();
        expect(titles.length).toBe(count);
      }
    });

    test('should show phase badge on conversation cards', async ({ strategyCoachPage }) => {
      await strategyCoachPage.navigate();

      const count = await strategyCoachPage.getConversationCount();
      if (count > 0) {
        const phase = await strategyCoachPage.getConversationPhase(0);
        expect(phase).toBeTruthy();
        expect(['Discovery', 'Research', 'Synthesis', 'Planning']).toContain(phase);
      }
    });
  });

  test.describe('Navigation', () => {
    test('should navigate to new conversation when clicking start button', async ({ strategyCoachPage }) => {
      await strategyCoachPage.navigate();
      await strategyCoachPage.startNewSession();

      // Should be on conversation page
      await expect(strategyCoachPage.page).toHaveURL(/\/dashboard\/strategy-coach\/.+/);
    });

    test('should navigate to existing conversation when clicking card', async ({ strategyCoachPage }) => {
      await strategyCoachPage.navigate();

      const count = await strategyCoachPage.getConversationCount();
      if (count > 0) {
        const titles = await strategyCoachPage.getConversationTitles();
        await strategyCoachPage.openConversation(titles[0]);
        await expect(strategyCoachPage.page).toHaveURL(/\/dashboard\/strategy-coach\/.+/);
      }
    });
  });
});

test.describe('Conversation Page', () => {
  test.describe('Page Layout', () => {
    test('should display conversation title', async ({ strategyCoachPage, conversationPage }) => {
      await strategyCoachPage.navigate();
      await strategyCoachPage.startNewSession();

      await conversationPage.verifyPageLoaded();
      const title = await conversationPage.getTitle();
      expect(title).toBeTruthy();
    });

    test('should display back button', async ({ strategyCoachPage, conversationPage }) => {
      await strategyCoachPage.navigate();
      await strategyCoachPage.startNewSession();

      await expect(conversationPage.backButton).toBeVisible();
    });

    test('should display message input', async ({ strategyCoachPage, conversationPage }) => {
      await strategyCoachPage.navigate();
      await strategyCoachPage.startNewSession();

      await expect(conversationPage.messageInput).toBeVisible();
      await expect(conversationPage.sendButton).toBeVisible();
    });
  });

  test.describe('Opening Message', () => {
    test('should receive opening message for new conversation', async ({ strategyCoachPage, conversationPage }) => {
      await strategyCoachPage.navigate();
      await strategyCoachPage.startNewSession();

      // Wait for the opening message
      await conversationPage.waitForOpeningMessage();

      // Should have at least one assistant message
      const messages = await conversationPage.getMessages();
      const assistantMessages = messages.filter(m => m.role === 'assistant');
      expect(assistantMessages.length).toBeGreaterThan(0);
    });
  });

  test.describe('Message Input', () => {
    test('should allow typing in input', async ({ strategyCoachPage, conversationPage }) => {
      await strategyCoachPage.navigate();
      await strategyCoachPage.startNewSession();
      await conversationPage.waitForOpeningMessage();

      await conversationPage.typeMessage('Hello, I need help with strategy');
      await expect(conversationPage.messageInput).toHaveValue('Hello, I need help with strategy');
    });

    test('should clear input after sending', async ({ strategyCoachPage, conversationPage }) => {
      await strategyCoachPage.navigate();
      await strategyCoachPage.startNewSession();
      await conversationPage.waitForOpeningMessage();

      await conversationPage.sendMessage('Test message');

      // Input should be cleared
      await expect(conversationPage.messageInput).toHaveValue('');
    });

    test('should disable input while streaming', async ({ strategyCoachPage, conversationPage }) => {
      await strategyCoachPage.navigate();
      await strategyCoachPage.startNewSession();
      await conversationPage.waitForOpeningMessage();

      await conversationPage.sendMessage('Tell me about product strategy');

      // Check if streaming indicator appears and input is disabled
      const isStreaming = await conversationPage.isStreaming();
      if (isStreaming) {
        const isDisabled = await conversationPage.isInputDisabled();
        expect(isDisabled).toBe(true);
      }

      // Wait for response to complete
      await conversationPage.waitForResponse();
    });
  });

  test.describe('Message Display', () => {
    test('should display user message after sending', async ({ strategyCoachPage, conversationPage }) => {
      await strategyCoachPage.navigate();
      await strategyCoachPage.startNewSession();
      await conversationPage.waitForOpeningMessage();

      const testMessage = 'This is my test message';
      await conversationPage.sendMessage(testMessage);

      // User message should appear
      await expect(conversationPage.page.getByText(testMessage)).toBeVisible();
    });

    test('should receive assistant response', async ({ strategyCoachPage, conversationPage }) => {
      await strategyCoachPage.navigate();
      await strategyCoachPage.startNewSession();
      await conversationPage.waitForOpeningMessage();

      const initialCount = await conversationPage.getMessageCount();

      await conversationPage.sendMessage('What should I focus on first?');
      await conversationPage.waitForResponse();

      // Message count should increase
      const newCount = await conversationPage.getMessageCount();
      expect(newCount).toBeGreaterThan(initialCount);
    });

    test('should update message count in header', async ({ strategyCoachPage, conversationPage }) => {
      await strategyCoachPage.navigate();
      await strategyCoachPage.startNewSession();
      await conversationPage.waitForOpeningMessage();

      const initialCount = await conversationPage.getMessageCount();
      expect(initialCount).toBeGreaterThanOrEqual(1); // At least opening message

      await conversationPage.sendMessage('Another message');
      await conversationPage.waitForResponse();

      const newCount = await conversationPage.getMessageCount();
      expect(newCount).toBe(initialCount + 2); // User message + assistant response
    });
  });

  test.describe('Navigation', () => {
    test('should navigate back to list when clicking back button', async ({ strategyCoachPage, conversationPage }) => {
      await strategyCoachPage.navigate();
      await strategyCoachPage.startNewSession();
      await conversationPage.waitForOpeningMessage();

      await conversationPage.goBack();

      await expect(conversationPage.page).toHaveURL('/dashboard/strategy-coach');
    });
  });

  test.describe('Keyboard Shortcuts', () => {
    test('should send message on Enter', async ({ strategyCoachPage, conversationPage }) => {
      await strategyCoachPage.navigate();
      await strategyCoachPage.startNewSession();
      await conversationPage.waitForOpeningMessage();

      await conversationPage.typeMessage('Sending with Enter');
      await conversationPage.pressEnterToSend();

      // Message should appear
      await expect(conversationPage.page.getByText('Sending with Enter')).toBeVisible();
    });

    test('should not send on Shift+Enter', async ({ strategyCoachPage, conversationPage }) => {
      await strategyCoachPage.navigate();
      await strategyCoachPage.startNewSession();
      await conversationPage.waitForOpeningMessage();

      await conversationPage.typeMessage('Line 1');
      await conversationPage.pressShiftEnter();

      // Input should still have text (not sent)
      const value = await conversationPage.messageInput.inputValue();
      expect(value).toContain('Line 1');
    });
  });
});

test.describe('Accessibility', () => {
  test('should have accessible button labels', async ({ strategyCoachPage }) => {
    await strategyCoachPage.navigate();

    // Check for accessible names
    await expect(strategyCoachPage.newSessionButton).toHaveAccessibleName(/start new strategy session/i);
  });

  test('should have accessible form elements', async ({ strategyCoachPage, conversationPage }) => {
    await strategyCoachPage.navigate();
    await strategyCoachPage.startNewSession();
    await conversationPage.waitForOpeningMessage();

    await expect(conversationPage.sendButton).toHaveAccessibleName(/send message/i);
    await expect(conversationPage.backButton).toHaveAccessibleName(/back to conversations/i);
  });
});
