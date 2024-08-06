import {
  generateRandomAddress,
  generateRandomAlias,
  generateRandomContactName,
  generateRandomContactPhone,
  generateRandomEmail,
  generateRandomSiteName,
} from "../../../src/utils/random";
describe("Super Admin", () => {
  /**
   * This test case is to verify site can be added by super admin
   * 1. Login to the app using super admin credentials
   * 2. Navigate to the site page
   * 3. Click on the "Add Site" button
   * 4. Fill in the site details
   * 5. Click on the "Submit" button
   * 6. Verify the site is added successfully
   * 7. Log the result
   *
   */
  it("IT-019", () => {
    cy.logStartAndEnd(() => {
      cy.loginAndNavigateToSitePage();
      cy.get("button").contains("Add Site").click();
      cy.url().should("include", "/sites/add");
      cy.logWithIdentification('Navigated to the "Add Site" page');
      let siteName = generateRandomSiteName();
      let siteAlias = generateRandomAlias();
      let contactName = generateRandomContactName();
      let email = generateRandomEmail();
      let phone = generateRandomContactPhone();
      let address = generateRandomAddress();

      cy.logWithIdentification(`Site Name: ${siteName}`);
      cy.get("input[name='name']").type(siteName);
      cy.get("input[name='alias']").type(siteAlias);
      cy.selectFromAutocomplete("#system-autocomplete");
      cy.get("input[name='address']").type(address);
      cy.selectFromAutocomplete("#site_country", "United States");
      cy.selectFromAutocomplete("#site_state", "California");
      cy.selectFromAutocomplete("#site_city", "Los Angeles");
      cy.get("input[name='contact_name']").type(contactName);
      cy.get("input[name='contact_email']").type(email);
      cy.get("input[name='contact_phone']").type(phone);
      cy.get("button[type='submit']").click();
      cy.url().should("not.include", "/sites/add");
    });
  });

  /**
   * This test case is to verify site can be edited by super admin
   * 1. Login to the app using super admin credentials
   * 2. Navigate to the site page
   * 3. Click on the "Edit" button of the site
   * 4. Edit the site details
   * 5. Click on the "Submit" button
   * 6. Verify the site is edited successfully
   * 7. Log the result
   */
  it("IT-020", () => {
    cy.logStartAndEnd(() => {
      cy.loginAndNavigateToSitePage();
      const tr = cy.get("table").contains("Test Site Integration test").parent().parent();
      tr.should("exist");
      const editButton = tr.find("#edit-0");
      editButton.click();
      cy.url().should("include", "/sites/edit");
      cy.logWithIdentification("Navigated to the edit site page");
      let siteName = generateRandomSiteName(true);
      cy.get("input[name='name']").clear().type(siteName);
      cy.get("button[type='submit']").click();
      cy.url().should("not.include", "/sites/edit");

      cy.logWithIdentification("Site edited successfully and navigated back to the site page");
    });
  });
  /**
   * This test case is to verify site can be deleted by super admin
   * 1. Login to the app using super admin credentials
   * 2. Navigate to the site page
   * 3. Click on the "Delete" button of the site
   * 4. Confirm the deletion
   * 5. Verify the site is deleted successfully
   * 6. Log the result
   */
  it("IT-21", () => {
    cy.logStartAndEnd(() => {
      cy.loginAndNavigateToSitePage();
      const tr = cy.get("table").contains("Test Site Integration test").parent().parent();
      tr.should("exist");
      const deleteButton = tr.find("#delete-0");
      deleteButton.click();
      cy.get("button").contains("Confirm").click();
      tr.should("not.exist");
      cy.logWithIdentification("Site deleted successfully");
    });
  });
});

describe("System Admin", () => {
  /**
   * This test case is to verify site can be added by system admin
   * 1. Login to the app using system admin credentials
   * 2. Navigate to the site page
   * 3. Click on the "Add Site" button
   * 4. Fill in the site details
   * 5. Click on the "Submit" button
   * 6. Verify the site is added successfully
   * 7. Log the result
   */
  it("IT-022", () => {
    cy.logStartAndEnd(() => {
      cy.loginAndNavigateToSitePage("System");
      cy.get("button").contains("Add Site").click();
      cy.url().should("include", "/sites/add");
      cy.logWithIdentification('Navigated to the "Add Site" page');
      let siteName = generateRandomSiteName();
      let siteAlias = generateRandomAlias();
      let contactName = generateRandomContactName();
      let email = generateRandomEmail();
      let phone = generateRandomContactPhone();
      let address = generateRandomAddress();

      cy.logWithIdentification(`Site Name: ${siteName}`);
      cy.get("input[name='name']").type(siteName);
      cy.get("input[name='alias']").type(siteAlias);

      cy.get("input[name='address']").type(address);
      cy.selectFromAutocomplete("#site_country", "United States");
      cy.selectFromAutocomplete("#site_state", "California");
      cy.selectFromAutocomplete("#site_city", "Los Angeles");
      cy.get("input[name='contact_name']").type(contactName);
      cy.get("input[name='contact_email']").type(email);
      cy.get("input[name='contact_phone']").type(phone);
      cy.get("button[type='submit']").click();
      cy.url().should("not.include", "/sites/add");
    });
  });

  /**
   * This test case is to verify site can be edited by system admin
   * 1. Login to the app using system admin credentials
   * 2. Navigate to the site page
   * 3. Click on the "Edit" button of the site
   * 4. Edit the site details
   * 5. Click on the "Submit" button
   * 6. Verify the site is edited successfully
   * 7. Log the result
   */
  it("IT-023", () => {
    cy.logStartAndEnd(() => {
      cy.loginAndNavigateToSitePage("System");
      const tr = cy.get("table").contains("Test Site Integration test").parent().parent();
      tr.should("exist");
      const editButton = tr.find("#edit-0");
      editButton.click();
      cy.url().should("include", "/sites/edit");
      cy.logWithIdentification("Navigated to the edit site page");
      let siteName = generateRandomSiteName(true);
      cy.get("input[name='name']").clear().type(siteName);
      cy.get("button[type='submit']").click();
      cy.url().should("not.include", "/sites/edit");

      cy.logWithIdentification("Site edited successfully and navigated back to the site page");
    });
  });

  /**
   * This test case is to verify site can be deleted by system admin
   * 1. Login to the app using system admin credentials
   * 2. Navigate to the site page
   * 3. Click on the "Delete" button of the site
   * 4. Confirm the deletion
   * 5. Verify the site is deleted successfully
   * 6. Log the result
   */
  it("IT-024", () => {
    cy.logStartAndEnd(() => {
      cy.loginAndNavigateToSitePage("System");
      const tr = cy.get("table").contains("Test Site Integration test").parent().parent();
      tr.should("exist");
      const deleteButton = tr.find("#delete-0");
      deleteButton.click();
      cy.get("button").contains("Confirm").click();
      tr.should("not.exist");
      cy.logWithIdentification("Site deleted successfully");
    });
  });
});
