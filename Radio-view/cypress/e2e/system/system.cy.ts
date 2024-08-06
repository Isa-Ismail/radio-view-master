import {
  generateRandomAlias,
  generateRandomContactName,
  generateRandomContactPhone,
  generateRandomEmail,
  generateRandomSystemName,
} from "../../../src/utils/random";

/**
 * IT-016: This test case is used to add a new system
 * 1. Login to the app
 * 2. Navigate to the system page
 * 3. Click on the "Add System" button
 * 4. Fill in the system details
 * 5. Click on the "Submit" button
 * 6. Verify the system is added successfully
 * 7. Log the result
 */
it("IT-016", () => {
  cy.logStartAndEnd(() => {
    cy.loginAndNavigateToSystemPage();
    cy.get("button").contains("Add System").click();
    cy.url().should("include", "/systems/add");
    cy.logWithIdentification('Navigated to the "Add System" page');
    let email = generateRandomEmail();
    let systemName = generateRandomSystemName();
    let systemAlias = generateRandomAlias();
    let contactName = generateRandomContactName();
    let phone = generateRandomContactPhone();
    cy.get("input[name='name']").type(systemName);
    cy.get("input[name='alias']").type(systemAlias);
    cy.get("input[name='contact_name']").type(contactName);
    cy.get("input[name='contact_email']").type(email);
    cy.get("input[name='contact_phone']").type(phone);
    cy.get("button[type='submit']").click();
    cy.url().should("not.include", "/systems/add");

    cy.logWithIdentification("System added successfully and navigated back to the system page");
  });
});

/**
 * IT-017: This test case is used to edit a system
 * 1. Login to the app
 * 2. Navigate to the system page
 * 3. Click on the "Edit" button of the system
 * 4. Edit the system details
 * 5. Click on the "Submit" button
 * 6. Verify the system is edited successfully
 * 7. Log the result
 */
it("IT-017", () => {
  cy.logStartAndEnd(() => {
    cy.loginAndNavigateToSystemPage();
    const tr = cy.get("table").contains("Test System Integration test").parent().parent();
    tr.should("exist");
    const editButton = tr.find("#edit-0");
    editButton.click();
    cy.url().should("include", "/systems/edit");
    cy.logWithIdentification("Navigated to the edit system page");
    let systemName = generateRandomSystemName(true);
    cy.get("input[name='name']").clear().type(systemName);
    cy.get("button[type='submit']").click();
    cy.url().should("not.include", "/systems/edit");

    cy.logWithIdentification("System edited successfully and navigated back to the system page");
  });
});

/**
 * IT-018: This test case is used to delete a system
 * 1. Login to the app
 * 2. Navigate to the system page
 * 3. Click on the "Delete" button of the system
 * 4. Confirm the deletion
 * 5. Verify the system is deleted successfully
 * 6. Log the result
 */
it("IT-018", () => {
  cy.logStartAndEnd(() => {
    cy.loginAndNavigateToSystemPage();
    const tr = cy.get("table").contains("Test System Integration test").parent().parent();
    tr.should("exist");
    const deleteButton = tr.find("#delete-0");
    deleteButton.click();
    cy.get("button").contains("Confirm").click();
    tr.should("not.exist");
    cy.logWithIdentification("System deleted successfully");
  });
});
