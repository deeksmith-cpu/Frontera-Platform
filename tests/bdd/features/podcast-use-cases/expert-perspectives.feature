@podcast @expert-perspectives
Feature: Expert Perspectives - Contextual Podcast Citations
  As a product leader using Frontera's Strategy Coach
  I want the coach to surface relevant expert perspectives from podcast transcripts
  So that my strategic decisions are grounded in real practitioner experience

  Background:
    Given I am logged in as an organization member
    And expert knowledge has been ingested from 301 podcast transcripts
    And I have an active coaching conversation

  @smoke
  Scenario: Expert citations appear during Research phase
    Given I am in the Research phase
    And I am exploring the "Customer" territory "Unmet Needs & Pain Points" area
    When I ask the coach "How should I approach identifying unmet customer needs?"
    Then the coach response should contain at least 1 expert citation
    And the citation should use the format "[Expert:Speaker — Topic]"
    And the cited expert should be relevant to customer research

  Scenario: Expert citations are clickable and expandable
    Given I am in the Research phase
    And the coach has responded with an expert citation "[Expert:Georgiana Laudi — Customer-Led Growth]"
    When I click on the expert citation
    Then I should see the full quote from the transcript
    And I should see the speaker name and company
    And I should see the source transcript reference

  Scenario: Coach limits expert citations per response
    Given I am in the Research phase
    When I ask a broad question about competitive positioning
    Then the coach response should contain no more than 3 expert citations
    And each citation should be contextually relevant to the question

  Scenario: Expert citations appear in Synthesis evidence trails
    Given I am in the Synthesis phase
    And strategic opportunities have been generated
    When I view an opportunity's evidence trail
    Then I should see expert citations alongside territory research citations
    And expert evidence should be visually distinguished from user research evidence

  Scenario: Expert Sources panel is visible during Research
    Given I am in the Research phase
    When I look at the Canvas panel
    Then I should see an "Expert Sources" tab
    When I click the "Expert Sources" tab
    Then I should see experts grouped by relevance to my strategy
    And each expert card should show name, company, and citation count

  Scenario: Expert Sources panel is visible during Synthesis
    Given I am in the Synthesis phase
    When I look at the Canvas panel
    Then I should see an "Expert Sources" tab
    And the panel should show which experts informed each opportunity

  Scenario: Filter experts by speaker
    Given I am viewing the Expert Sources panel
    When I filter by speaker "Nan Yu"
    Then I should see only quotes from Nan Yu
    And each quote should show the topic context

  Scenario: Filter experts by topic
    Given I am viewing the Expert Sources panel
    When I filter by topic "product-led growth"
    Then I should see experts relevant to product-led growth
    And results should include Hila Qu and Georgiana Laudi

  Scenario: No expert citations in Discovery phase
    Given I am in the Discovery phase
    When I ask the coach a question about strategy
    Then the coach response should not contain any expert citations
    And the coach may mention that expert perspectives unlock in Research

  Scenario: No expert citations in Strategic Bets phase
    Given I am in the Strategic Bets phase
    When I ask the coach to help formulate a bet
    Then the coach response should not contain expert citations in the format "[Expert:...]"

  Scenario: Empty state when no relevant experts found
    Given I am in the Research phase
    And I am exploring a highly niche topic with no expert coverage
    When I ask the coach about this niche topic
    Then the coach should respond with methodology-based guidance only
    And no irrelevant expert citations should be forced into the response

  Scenario: Expert citation relevance to territory
    Given I am in the Research phase
    And I am exploring the "Company" territory "Core Capabilities" area
    When I ask about organizational capabilities
    Then expert citations should reference speakers who discuss capabilities
    And citations should not reference unrelated topics like pricing or hiring
