/**
 * This test case is to verify that Activity Logs is accessible to super admin
 * 1. Login to the app using super admin
 * 2. Navigate to the activity logs page
 * 3. Verify the activity logs page
 */
it("IT-037", () => {
  cy.logStartAndEnd(() => {
    cy.loginAndNavigateToActivityLogsPage("Super");
  });
});

/**
 * This test case is to verify that Activity Logs is not accessible to system admin
 * 1. Login to the app using system admin
 * 2. Try to navigate to the activity logs page
 * 3. Verify the system admin is not able to access the activity logs page
 */

it("IT-038", () => {
  cy.logStartAndEnd(() => {
    cy.loginAndNavigateToActivityLogsPage("System");
  });
});

/**
 * This test case is to verify that Activity Logs is not accessible to site admin
 * 1. Login to the app using site admin
 * 2. Try to navigate to the activity logs page
 * 3. Verify the site admin is not able to access the activity logs page
 */
it("IT-039", () => {
  cy.logStartAndEnd(() => {
    cy.loginAndNavigateToActivityLogsPage("Site");
  });
});
