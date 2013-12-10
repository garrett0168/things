@javascript
Feature:  Find some things
        
    As a user
    I want to find things close by

Background:
    Given the following things:
    | name   | longitude | latitude |
    | thing1 | -77.000   | 40.000   |
    | thing2 | -75.990   | 39.010   |
    | thing3 | -75.991   | 39.010   |

Scenario: As a user, I can search for things
    When I visit the home page
    Then I fill in "Longitude" with "-76.000"
    And I fill in "Latitude" with "39.000"
    And I fill in "Search radius (meters)" with "2000"
    And I click "Search"

    Then I should see "2" things near me:
    | Name   | Longitude/Latitude |
    | thing2 | -75.990 / 39.010   |
    | thing3 | -75.991 / 39.010   |
