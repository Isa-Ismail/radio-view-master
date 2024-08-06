/**
 * This test case is to verify that App Version is accessible to super admin
 * 1. Login to the app using super admin
 * 2. Navigate to the app version page
 * 3. Verify the app version page
 */
it("IT-043", () => {
  cy.logStartAndEnd(() => {
    cy.loginAndNavigateToAppVersionPage("Super");
  });
});

/**
 * This test case is to verify that App Version is not accessible to system admin
 * 1. Login to the app using system admin
 * 2. Try to navigate to the app version page
 * 3. Verify the system admin is not able to access the app version page
 */

it("IT-044", () => {
  cy.logStartAndEnd(() => {
    cy.loginAndNavigateToAppVersionPage("System");
  });
});

/**
 * This test case is to verify that App Version is not accessible to site admin
 * 1. Login to the app using site admin
 * 2. Try to navigate to the app version page
 * 3. Verify the site admin is not able to access the app version page
 */
it("IT-045", () => {
  cy.logStartAndEnd(() => {
    cy.loginAndNavigateToAppVersionPage("Site");
  });
});
