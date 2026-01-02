@strategy-coach @messaging
Feature: Strategy Coach Messaging
  As a product leader
  I want to send and receive messages with the AI coach
  So that I can get strategic guidance through conversation

  Background:
    Given I am logged in as an organization member
    And I have an active coaching conversation
    And I am on the conversation page

  @smoke
  Scenario: Send a message to the coach
    When I type "What should I focus on for my product strategy?"
    And I click the send button
    Then my message should appear in the chat
    And I should see a streaming indicator
    And I should receive a response from the coach

  Scenario: Send message using Enter key
    When I type "Tell me about market research"
    And I press Enter
    Then my message should appear in the chat
    And I should receive a response from the coach

  Scenario: Add new line using Shift+Enter
    When I type "First line"
    And I press Shift+Enter
    And I type "Second line"
    Then the input should contain both lines
    And the message should not be sent

  Scenario: Input is disabled while streaming
    When I send a message "Explain the research pillars"
    Then the input field should be disabled
    And the send button should show a loading state
    When the response is complete
    Then the input field should be enabled
    And the send button should be ready

  Scenario: Message count updates after sending
    Given there are 5 messages in the conversation
    When I send a message "New question"
    And the response is complete
    Then the message count should show "7 messages"

  Scenario: Clear input after sending
    When I type "My question here"
    And I click the send button
    Then the input field should be empty

  Scenario: Cannot send empty message
    Given the input field is empty
    Then the send button should be disabled
    When I type "   "
    Then the send button should be disabled

  Scenario: View message timestamps
    When I view a message in the chat
    Then I should see a relative timestamp like "Just now" or "5m ago"

  Scenario: Auto-scroll to new messages
    Given there are many messages in the conversation
    When I receive a new message from the coach
    Then the chat should scroll to show the new message
