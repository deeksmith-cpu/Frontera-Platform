@strategy-coach @navigation
Feature: Strategy Coach Navigation
  As a product leader
  I want to navigate between conversations and pages
  So that I can easily access my coaching sessions

  Background:
    Given I am logged in as an organization member

  Scenario: Navigate from dashboard to Strategy Coach
    Given I am on the dashboard
    When I navigate to Strategy Coach
    Then I should be on the Strategy Coach page
    And I should see the breadcrumb showing "Dashboard > Strategy Coach"

  Scenario: Navigate back from conversation to list
    Given I am in a coaching conversation
    When I click the back button
    Then I should be on the Strategy Coach page
    And I should see my previous conversations

  Scenario: Navigate using breadcrumb
    Given I am on the Strategy Coach page
    When I click "Dashboard" in the breadcrumb
    Then I should be on the dashboard page

  Scenario: Conversation persists after navigation
    Given I am in a coaching conversation
    And I have sent some messages
    When I navigate back to the conversation list
    And I open the same conversation
    Then I should see all my previous messages

  @authentication
  Scenario: Redirect to sign-in when not authenticated
    Given I am not logged in
    When I try to access the Strategy Coach page
    Then I should be redirected to the sign-in page

  @authentication
  Scenario: Redirect to dashboard when no organization
    Given I am logged in without an organization
    When I try to access the Strategy Coach page
    Then I should be redirected to the dashboard
