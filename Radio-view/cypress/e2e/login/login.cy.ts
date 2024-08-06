/**
 * This test case verifies that super admin is able to login to the app
 * 1. Login to the app
 * 2. Verify the login
 */
it("IT-046", () => {
  cy.logStartAndEnd(() => {
    cy.login("Super");
  });
});

/**
 * This test case verifies that system admin is able to login to the app
 * 1. Login to the app
 * 2. Verify the login
 */
it("IT-047", () => {
  cy.logStartAndEnd(() => {
    cy.login("System");
  });
});

/**
 * This test case verifies that site admin is able to login to the app
 * 1. Login to the app
 * 2. Verify the login
 */
it("IT-048", () => {
  cy.logStartAndEnd(() => {
    cy.login("Site");
  });
});
