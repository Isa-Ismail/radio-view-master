/**
 * This test case is to verify that Site Machine Logs is accessible to super admin
 * 1. Login to the app using super admin
 * 2. Navigate to the site machine logs page
 * 3. Verify the site machine logs page
 */
it("IT-040", () => {
  cy.logStartAndEnd(() => {
    cy.loginAndNavigateToSiteMachineLogsPage("Super");
  });
});

/**
 * This test case is to verify that Site Machine Logs is not accessible to system admin
 * 1. Login to the app using system admin
 * 2. Try to navigate to the site machine logs page
 * 3. Verify the system admin is not able to access the site machine logs page
 */

it("IT-041", () => {
  cy.logStartAndEnd(() => {
    cy.loginAndNavigateToSiteMachineLogsPage("System");
  });
});

/**
 * This test case is to verify that Site Machine Logs is not accessible to site admin
 * 1. Login to the app using site admin
 * 2. Try to navigate to the site machine logs page
 * 3. Verify the site admin is not able to access the site machine logs page
 */
it("IT-042", () => {
  cy.logStartAndEnd(() => {
    cy.loginAndNavigateToSiteMachineLogsPage("Site");
  });
});
