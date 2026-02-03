@podcast @case-study-engine
Feature: Case Study Engine - Interactive Strategy Playbooks
  As a product leader using Frontera's Strategy Coach
  I want to explore real-world case studies from proven leaders
  So that I can learn from practitioners who navigated similar strategic decisions

  Background:
    Given I am logged in as an organization member
    And case studies have been extracted from 301 podcast transcripts
    And I have an active coaching conversation

  @smoke
  Scenario: View Case Library in Canvas panel
    Given I am in the Research phase
    When I look at the Canvas panel
    Then I should see a "Case Library" tab
    When I click the "Case Library" tab
    Then I should see case study cards
    And each card should show title, speaker, company, and challenge type

  Scenario: Browse case studies sorted by relevance
    Given I am in the Research phase
    And my organization is in the "Technology" industry
    When I open the Case Library
    Then case studies should be sorted by relevance to my context
    And technology-related cases should appear first

  Scenario: Filter cases by industry
    Given I am viewing the Case Library
    When I filter by industry "Technology"
    Then I should only see cases tagged with "Technology"
    And the result count should update

  Scenario: Filter cases by company stage
    Given I am viewing the Case Library
    When I filter by company stage "Growth"
    Then I should only see cases from growth-stage companies
    And results should include cases like "Mixpanel's Portfolio Refocus"

  Scenario: Filter cases by challenge type
    Given I am viewing the Case Library
    When I filter by challenge type "Product-Market Fit"
    Then I should see cases about finding or maintaining PMF
    And results should include "Notion's 3-Year Pivot"

  Scenario: View full case study details
    Given I am viewing the Case Library
    When I click on the case "Mixpanel's Portfolio Refocus"
    Then I should see the "Context" section
    And I should see the "Decision Point" section
    And I should see the "What They Did" section
    And I should see the "Outcome" section
    And I should see the "Lessons Learned" section
    And I should see a "View Full Excerpt" link

  Scenario: View full transcript excerpt
    Given I am viewing the case study "Mixpanel's Portfolio Refocus"
    When I click "View Full Excerpt"
    Then I should see the original transcript passage
    And the passage should include the speaker attribution

  Scenario: Coach proactively suggests relevant case
    Given I am in the Research phase
    And I am discussing product portfolio prioritization with the coach
    When the coach identifies a relevant case study
    Then the coach should suggest the case naturally in conversation
    And the suggestion should follow the format "Your situation mirrors..."
    And the suggestion should include the case title and speaker

  Scenario: Coach does not over-suggest cases
    Given I am in the Research phase
    And the coach has suggested a case study in the last 4 messages
    When I send another message
    Then the coach should not suggest another case study
    And the coach should continue with standard coaching guidance

  Scenario: Explore a coach-suggested case
    Given the coach has suggested the case "Gamma's Profitable AI Growth"
    When I respond "Yes, I'd like to explore that case"
    Then the coach should present the full case structure
    And the coach should facilitate discussion connecting the case to my situation

  Scenario: Cases cited in Synthesis evidence trails
    Given I am in the Synthesis phase
    And strategic opportunities have been generated
    When I view an opportunity's evidence trail
    Then I should see case study citations using format "[Case:Title — Speaker]"
    And case citations should be visually distinct from research citations

  Scenario: Search cases by keyword
    Given I am viewing the Case Library
    When I search for "speed"
    Then I should see cases mentioning speed or velocity
    And results should include Linear's case study

  Scenario: Empty state when no matching cases
    Given I am viewing the Case Library
    When I filter by a combination that yields no results
    Then I should see a message "No case studies match your filters"
    And I should see a suggestion to broaden the filter criteria

  Scenario: Case Library available in all phases
    Given I am in the "Discovery" phase
    When I look at the Canvas panel
    Then I should see the "Case Library" tab
    When I navigate to the "Synthesis" phase
    Then I should still see the "Case Library" tab
