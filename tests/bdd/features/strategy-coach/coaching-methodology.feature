@strategy-coach @methodology
Feature: Strategy Coach Methodology
  As a product leader
  I want the coach to follow the Product Strategy Research Playbook
  So that I receive structured and effective strategic guidance

  Background:
    Given I am logged in as an organization member
    And I have started a new coaching conversation

  Scenario: Coach starts with discovery phase
    Then the conversation should be in the "discovery" phase
    And the coach should ask about my organization context
    And the coach should explore my strategic challenges

  Scenario: Coach guides through research pillars
    Given I have completed the discovery phase
    Then the conversation should move to the "research" phase
    And the coach should introduce the three research pillars:
      | Pillar       | Focus                    |
      | Macro Market | Industry trends          |
      | Customer     | User needs and behaviors |
      | Colleague    | Internal capabilities    |

  Scenario: Coach helps with macro market research
    Given I am in the research phase
    When I discuss macro market topics
    Then the coach should ask about:
      | Topic              |
      | Industry trends    |
      | Competitive forces |
      | Market dynamics    |
      | Technology shifts  |

  Scenario: Coach helps with customer research
    Given I am in the research phase
    When I discuss customer research
    Then the coach should ask about:
      | Topic                |
      | Customer segments    |
      | User pain points     |
      | Jobs to be done      |
      | Buying behaviors     |

  Scenario: Coach helps with colleague research
    Given I am in the research phase
    When I discuss colleague research
    Then the coach should ask about:
      | Topic                  |
      | Team capabilities      |
      | Organizational culture |
      | Internal processes     |
      | Resource constraints   |

  Scenario: Coach guides to synthesis phase
    Given I have completed research on all three pillars
    Then the conversation should move to the "synthesis" phase
    And the coach should help synthesize insights
    And the coach should help formulate strategic bets

  Scenario: Coach helps create strategic bets
    Given I am in the synthesis phase
    When I work on strategic bets
    Then the coach should guide me through the format:
      | Element        | Description                    |
      | If we          | Action or investment           |
      | We will        | Expected capability            |
      | Which enables  | Customer or business outcome   |
      | Leading to     | Strategic impact               |

  Scenario: Coach guides to planning phase
    Given I have formulated strategic bets
    Then the conversation should move to the "planning" phase
    And the coach should help create action plans
    And the coach should discuss implementation priorities

  Scenario: Phase indicator shows current phase
    Given the conversation is in the "research" phase
    When I view the conversation in the list
    Then I should see the phase badge showing "Research"
