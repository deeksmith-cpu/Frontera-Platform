@podcast @leadership-playbook
Feature: Leadership Playbook Generator - Personal Development from Expert Patterns
  As a product leader using Frontera's Strategy Coach
  I want a personalized leadership development playbook based on my strategic context
  So that I can develop the skills needed to execute my strategy effectively

  Background:
    Given I am logged in as an organization member
    And leadership themes have been configured from 301 podcast transcripts
    And I have an active coaching conversation

  @smoke
  Scenario: Playbook locked before Research completion
    Given I am in the Discovery phase
    When I navigate to "/dashboard/leadership-playbook"
    Then I should see a locked state
    And I should see a message explaining the playbook unlocks after Research
    And I should see my current phase progress

  Scenario: Playbook available after Research completion
    Given I have completed the Research phase with at least 4 mapped areas
    When I navigate to "/dashboard/leadership-playbook"
    Then I should see the playbook generation page
    And I should see a "Generate My Playbook" button

  @smoke
  Scenario: Generate a personalized leadership playbook
    Given I have completed the Research phase
    And my organization's strategic challenges include "team alignment"
    When I click "Generate My Playbook"
    Then the playbook should generate within 30 seconds
    And I should see 3 to 5 leadership themes
    And the themes should be relevant to my strategic context

  Scenario: View leadership theme details
    Given I have a generated leadership playbook
    When I expand the theme "Team Alignment & Feedback Culture"
    Then I should see a "Why This Matters For You" explanation
    And I should see at least 2 expert quotes with speaker attribution
    And I should see at least 2 actionable practices
    And I should see recommended listening references

  Scenario: Expert quotes include speaker context
    Given I have a generated leadership playbook
    When I view expert quotes for a theme
    Then each quote should show the speaker's name
    And each quote should show the speaker's company and role
    And each quote should include surrounding context for the quote

  Scenario: Actionable practices have clear frequency
    Given I have a generated leadership playbook
    When I view actionable practices for a theme
    Then each practice should have a title and description
    And each practice should specify a frequency such as "weekly" or "daily"
    And practices should be concrete and immediately actionable

  Scenario: View "Why These Themes?" explanation
    Given I have a generated leadership playbook
    When I scroll to the "Why These Themes?" section
    Then I should see an explanation of how themes were selected
    And it should reference my strategic challenges and research findings
    And it should explain the connection between leadership and strategy execution

  Scenario: Export playbook as PDF
    Given I have a generated leadership playbook
    When I click the "Export as PDF" button
    Then a PDF should be generated and downloaded
    And the PDF should include a branded cover page
    And the PDF should contain all themes with quotes and practices
    And the PDF should use Frontera brand colors and typography

  Scenario: Regenerate playbook with updated context
    Given I have a generated leadership playbook
    And I have completed additional coaching conversations
    When I click "Regenerate Playbook"
    Then a new playbook should be generated
    And it may contain different or updated themes based on new context
    And the previous playbook should still be viewable

  Scenario: Dashboard shows Leadership Playbook link
    Given I have completed the Research phase
    When I navigate to "/dashboard"
    Then I should see a "Leadership Playbook" card or link
    And it should indicate whether a playbook has been generated

  Scenario: Playbook themes match user industry
    Given my organization is in the "Healthcare" industry
    And I have completed the Research phase
    When I generate a leadership playbook
    Then the themes should consider healthcare-specific leadership challenges
    And expert quotes should prioritize industry-relevant advice where available

  Scenario: Recommended listening links to episodes
    Given I have a generated leadership playbook
    When I view recommended listening for a theme
    Then each recommendation should show episode title and speaker
    And each recommendation should indicate the relevant topic
