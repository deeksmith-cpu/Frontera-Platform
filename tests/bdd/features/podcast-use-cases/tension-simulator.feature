@podcast @tension-simulator
Feature: Strategic Tension Simulator - Expert Debate Mode
  As a product leader using Frontera's Strategy Coach
  I want to explore opposing expert perspectives on strategic tensions
  So that I can make informed tradeoff decisions grounded in real practitioner experience

  Background:
    Given I am logged in as an organization member
    And the tension map has been configured with 20+ expert positions from 301 podcast transcripts
    And I have an active coaching conversation in the Synthesis phase
    And strategic tensions have been identified

  @smoke
  Scenario: Coach offers Debate Mode on a strategic tension
    Given the Synthesis has identified a tension about "Focus vs. Expand"
    When I view the tension in the Canvas panel
    Then I should see an option to "Explore Expert Debate"
    And the tension card should indicate that opposing expert perspectives are available

  Scenario: View two expert positions in Debate Mode
    Given I have entered Debate Mode for the tension "PLG vs. Sales-Led GTM"
    Then I should see Position A from Hila Qu arguing for product-led growth
    And I should see Position B from Jen Abel arguing for founder-led sales
    And each position should include the expert's name and company
    And each position should include a supporting quote from the transcript
    And the two positions should be visually distinct

  Scenario: See own research evidence alongside expert positions
    Given I have entered Debate Mode for a tension
    And I have relevant research in my territory insights
    When I view the debate
    Then I should see a section labeled "Your Research Evidence"
    And it should show relevant data from my territory research
    And it should be positioned between the two expert positions

  Scenario: Select a position in the debate
    Given I am viewing a debate between two expert positions
    When I select Position A as aligning with my context
    And I provide reasoning "Our product has strong self-serve adoption already"
    Then my choice should be recorded
    And the coach should acknowledge my decision
    And the coach should explain how this choice shapes the strategy forward

  Scenario: Provide a nuanced response instead of picking a side
    Given I am viewing a debate between two expert positions
    When I select "Nuanced - elements of both"
    And I explain "We need PLG for SMB but sales-led for enterprise"
    Then my nuanced position should be recorded
    And the coach should help me articulate how both approaches coexist

  Scenario: Debate choice influences Strategic Bets
    Given I have resolved a debate choosing "Focus on core product"
    When I progress to the Strategic Bets phase
    Then the coach should frame bets through the lens of my debate choices
    And bets should reference the "Focus" decision as strategic context

  Scenario: Decline Debate Mode
    Given the coach has offered Debate Mode on a tension
    When I decline and choose "Skip debate"
    Then the tension should remain in its standard format
    And I should be able to resolve it through normal coaching conversation
    And I should be able to enter Debate Mode later if I change my mind

  Scenario: View Debate History
    Given I have completed 2 debates during this Synthesis
    When I look at the Synthesis section in the Canvas
    Then I should see a "Debate History" section
    And it should show 2 completed debates
    And each should display the tension, my choice, and my reasoning

  Scenario: Revisit a past debate decision
    Given I have a completed debate on "Speed vs. Quality"
    When I click on that debate in Debate History
    Then I should see the full debate with both positions
    And I should see my previous choice highlighted
    And I should have the option to "Reconsider Decision"

  Scenario: Multiple tensions with debates
    Given the Synthesis has identified 3 strategic tensions
    And 2 of them have expert debate mappings
    When I view the tensions list
    Then 2 tensions should show the "Explore Expert Debate" option
    And 1 tension should show standard resolution only

  Scenario: Debate Mode not available outside Synthesis
    Given I am in the Research phase
    When I interact with the coach
    Then Debate Mode should not be offered
    And no debate-related UI should appear in the Canvas
