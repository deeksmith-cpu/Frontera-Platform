@strategy-coach @conversations
Feature: Strategy Coach Conversations
  As a product leader
  I want to have coaching conversations with an AI strategy coach
  So that I can develop effective product strategies

  Background:
    Given I am logged in as an organization member
    And I am on the Strategy Coach page

  @smoke
  Scenario: View Strategy Coach page
    Then I should see the page title "Strategy Coach"
    And I should see the coaching journey with 4 phases
    And I should see the "Start New Strategy Session" button

  @smoke
  Scenario: View coaching journey phases
    Then I should see the following phases:
      | Phase     | Description       |
      | Discovery | Understand context |
      | Research  | Explore pillars   |
      | Synthesis | Strategic bets    |
      | Planning  | Action plans      |

  Scenario: Start a new conversation
    When I click the "Start New Strategy Session" button
    Then I should be redirected to a new conversation page
    And I should see the chat interface
    And I should receive an opening message from the coach

  Scenario: View empty state when no conversations exist
    Given I have no previous conversations
    Then I should see the empty state message "No coaching sessions yet"
    And I should see the "Start New Strategy Session" button

  Scenario: View list of previous conversations
    Given I have the following conversations:
      | Title              | Phase     | Messages |
      | Q4 Strategy Review | Research  | 15       |
      | Product Roadmap    | Discovery | 5        |
    Then I should see "Previous Sessions" heading
    And I should see 2 conversation cards
    And I should see conversation "Q4 Strategy Review" with phase "Research"
    And I should see conversation "Product Roadmap" with phase "Discovery"

  Scenario: Open an existing conversation
    Given I have a conversation titled "Q4 Strategy Review"
    When I click on the conversation "Q4 Strategy Review"
    Then I should be redirected to that conversation page
    And I should see the conversation title "Q4 Strategy Review"
    And I should see the previous messages
