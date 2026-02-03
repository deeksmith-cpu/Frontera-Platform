@sparring-partners @personas @uc2
Feature: Strategy Sparring Partners - Expert Persona Coaches
  As a product leader
  I want to select from expert sparring partner personas
  So that I receive coaching grounded in domain-specific expertise

  Background:
    Given I am logged in as an organization member
    And I am on the Strategy Coach page

  @smoke
  Scenario: View all six personas on the selection screen
    When I navigate to the persona selection screen
    Then I should see 6 persona cards
    And I should see the following personas grouped under "Strategic Coaches":
      | Name    | Title                         |
      | Marcus  | The Strategic Navigator       |
      | Elena   | The Capability Builder        |
      | Richard | The Transformation Pragmatist |
    And I should see the following personas grouped under "Expert Sparring Partners":
      | Name             | Title                |
      | Growth Architect | The Growth Architect |
      | Product Purist   | The Product Purist   |
      | Scale Navigator  | The Scale Navigator  |

  @smoke
  Scenario: View inspired-by attribution on sparring partner cards
    When I navigate to the persona selection screen
    Then the "Growth Architect" card should display "Inspired by Hila Qu & Georgiana Laudi"
    And the "Product Purist" card should display "Inspired by Nan Yu & Ivan Zhao"
    And the "Scale Navigator" card should display "Inspired by Boz (Andrew Bosworth) & Cameron Adams"

  Scenario: View expertise domain labels on sparring partner cards
    When I navigate to the persona selection screen
    Then the "Growth Architect" card should display the expertise domain "Product-Led Growth"
    And the "Product Purist" card should display the expertise domain "Product Craft & Speed"
    And the "Scale Navigator" card should display the expertise domain "Scaling Organizations"

  Scenario: Select the Growth Architect sparring partner
    When I navigate to the persona selection screen
    And I click on the "Growth Architect" persona card
    Then the "Growth Architect" card should appear selected
    And my coaching preferences should be updated to "growth-architect"
    And I should see a confirmation that "The Growth Architect" is my active coach

  Scenario: Start a coaching session with the Product Purist
    Given I have selected the "Product Purist" persona
    When I start a new strategy session
    Then I should receive an opening message from the coach
    And the opening message should reflect a concise, craft-focused tone
    And the opening message should reference product focus or core job

  Scenario: Growth Architect uses PLG vocabulary in Discovery phase
    Given I have selected the "Growth Architect" persona
    And I am in a conversation in the "Discovery" phase
    When I send the message "How should we think about our go-to-market strategy?"
    Then the response should contain growth-specific terminology
    And the response should reference at least one of: growth loop, activation, retention, JTBD, funnel, north star metric

  Scenario: Product Purist pushes back on feature bloat in Research phase
    Given I have selected the "Product Purist" persona
    And I am in a conversation in the "Research" phase
    When I send the message "Our customers are requesting 15 new integrations. How should we prioritize?"
    Then the response should challenge the premise of building all integrations
    And the response should reference focus, saying no, or core value proposition

  Scenario: Scale Navigator addresses org design in Synthesis phase
    Given I have selected the "Scale Navigator" persona
    And I am in a conversation in the "Synthesis" phase
    When I send the message "We have identified 8 strategic opportunities. How do we move forward?"
    Then the response should frame the decision as a portfolio allocation problem
    And the response should reference at least one of: portfolio, org design, decision rights, two-way door, time horizon

  Scenario: Switch persona mid-session from Marcus to Growth Architect
    Given I have selected the "Marcus" persona
    And I am in an active conversation with 5 messages
    When I open the persona switcher
    And I select the "Growth Architect" persona
    Then I should see a transition message indicating the persona switch
    And my coaching preferences should be updated to "growth-architect"
    And my previous conversation messages should still be visible
    And subsequent responses should reflect the Growth Architect tone

  Scenario: Previously selected sparring partner is pre-highlighted on return
    Given I have previously selected the "Scale Navigator" persona
    When I navigate to the persona selection screen
    Then the "Scale Navigator" card should appear pre-highlighted
    And I should be able to confirm or change my selection

  Scenario: Existing personas remain functional after sparring partners are added
    Given I have selected the "Marcus" persona
    When I start a new strategy session
    Then I should receive an opening message from the coach
    And the opening message should reflect Marcus direct analytical tone
    And the coaching experience should be identical to before sparring partners were added

  Scenario: Sparring partner phase adaptations change with conversation phase
    Given I have selected the "Growth Architect" persona
    And I am in a conversation in the "Discovery" phase
    When the conversation transitions to the "Research" phase
    Then the coaching guidance should shift to research-specific growth analysis
    And the coach should reference competitor PLG motions or funnel mapping
