/**
 * This test case is to verify that the study page loads the data correctly for super admin
 * 1. Login to the app
 * 2. Navigate to the study page
 * 3. Verify the study page
 */
it("IT-034", () => {
  cy.logStartAndEnd(() => {
    cy.loginAndNavigateToStudyPage();
  });
});

/**
 * This test case is to verify that the study page loads the data correctly for system admin
 * 1. Login to the app
 * 2. Navigate to the study page
 * 3. Verify the study page
 */
it("IT-035", () => {
  cy.logStartAndEnd(() => {
    cy.loginAndNavigateToStudyPage("System");
  });
});

/**
 * This test case is to verify that the study page loads the data correctly for site admin
 * 1. Login to the app
 * 2. Navigate to the study page
 * 3. Verify the study page
 */
it("IT-036", () => {
  cy.logStartAndEnd(() => {
    cy.loginAndNavigateToStudyPage("Site");
  });
});
