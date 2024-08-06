import {
  generateRandomClinicianFirstName,
  generateRandomClinicianLastName,
  generateRandomContactPhone,
  generateRandomDOB,
  generateRandomEmail,
} from "../../../src/utils/random";
describe("Super Admin", () => {
  /**
   * This test case is to verify clinician can be added by super admin
   * 1. Login to the app using super admin credentials
   * 2. Navigate to the clinician page
   * 3. Click on the "Add Clinician" button
   * 4. Fill in the clinician details
   * 5. Click on the "Submit" button
   * 6. Verify the clinician is added successfully
   * 7. Log the result
   *
   */
  it("IT-025", () => {
    cy.logStartAndEnd(() => {
      cy.loginAndNavigateToClinicianPage();
      cy.get("button").contains("Add Clinician").click();
      cy.url().should("include", "/clinicians/add");
      cy.logWithIdentification('Navigated to the "Add Clinician" page');
      const firstName = generateRandomClinicianFirstName();
      const lastName = generateRandomClinicianLastName();
      const email = generateRandomEmail();
      const phone = generateRandomContactPhone();
      const dob = generateRandomDOB();

      cy.get("input[name='first_name']").type(firstName);
      cy.get("input[name='last_name']").type(lastName);
      cy.get("input[name='email']").type(email);
      cy.get("input[name='phone']").type(phone);
      cy.selectFromAutocomplete("#gender-select", "Male");
      cy.get(".w-full input").type(dob);

      cy.selectFromAutocomplete("#system-select", "Demo");
      cy.selectFromAutocomplete("#site-select");
      cy.get("button[type='submit']").click();
      cy.url().should("not.include", "/clinicians/add");
      cy.logWithIdentification(
        "Clinician added successfully and navigated back to the clinician page"
      );
    });
  });

  /**
   * This test case is to verify clinician can be edited by super admin
   * 1. Login to the app using super admin credentials
   * 2. Navigate to the clinician page
   * 3. Click on the "Edit" button of the clinician
   * 4. Edit the clinician details
   * 5. Click on the "Submit" button
   * 6. Verify the clinician is edited successfully
   * 7. Log the result
   */
  it("IT-026", () => {
    cy.logStartAndEnd(() => {
      cy.loginAndNavigateToClinicianPage();
      const tr = cy.get("table").contains("Integration Test Clinician").parent().parent();
      tr.should("exist");
      const editButton = tr.find("#edit-0");
      editButton.click();
      cy.url().should("include", "/clinicians/edit");
      cy.logWithIdentification("Navigated to the edit clinician page");
      let clinicianName = generateRandomClinicianLastName(true);
      cy.get("input[name='last_name']").clear().type(clinicianName);
      cy.get("button[type='submit']").click();
      cy.url().should("not.include", "/clinicians/edit");

      cy.logWithIdentification(
        "Clinician edited successfully and navigated back to the clinician page"
      );
    });
  });
  /**
   * This test case is to verify clinician can be deleted by super admin
   * 1. Login to the app using super admin credentials
   * 2. Navigate to the clinician page
   * 3. Click on the "Delete" button of the clinician
   * 4. Confirm the deletion
   * 5. Verify the clinician is deleted successfully
   * 6. Log the result
   */
  it("IT-27", () => {
    cy.logStartAndEnd(() => {
      cy.loginAndNavigateToClinicianPage();
      const tr = cy.get("table").contains("Integration Test Clinician").parent().parent();
      tr.should("exist");
      const deleteButton = tr.find("#delete-0");
      deleteButton.click();
      cy.get("button").contains("Confirm").click();
      tr.should("not.exist");
      cy.logWithIdentification("Clinician deleted successfully");
    });
  });
});

describe("System Admin", () => {
  /**
   * This test case is to verify clinician can be added by system admin
   * 1. Login to the app using system admin credentials
   * 2. Navigate to the clinician page
   * 3. Click on the "Add Clinician" button
   * 4. Fill in the clinician details
   * 5. Click on the "Submit" button
   * 6. Verify the clinician is added successfully
   * 7. Log the result
   */
  it("IT-028", () => {
    cy.logStartAndEnd(() => {
      cy.loginAndNavigateToClinicianPage("System");
      cy.get("button").contains("Add Clinician").click();
      cy.url().should("include", "/clinicians/add");
      cy.logWithIdentification('Navigated to the "Add Clinician" page');
      const firstName = generateRandomClinicianFirstName();
      const lastName = generateRandomClinicianLastName();
      const email = generateRandomEmail();
      const phone = generateRandomContactPhone();
      const dob = generateRandomDOB();

      cy.get("input[name='first_name']").type(firstName);
      cy.get("input[name='last_name']").type(lastName);
      cy.get("input[name='email']").type(email);
      cy.get("input[name='phone']").type(phone);
      cy.selectFromAutocomplete("#gender-select", "Male");
      cy.get(".w-full input").type(dob);

      cy.selectFromAutocomplete("#site-select");
      cy.get("button[type='submit']").click();
      cy.url().should("not.include", "/clinicians/add");

      cy.logWithIdentification(
        "Clinician added successfully and navigated back to the clinician page"
      );
    });
  });

  /**
   * This test case is to verify clinician can be edited by system admin
   * 1. Login to the app using system admin credentials
   * 2. Navigate to the clinician page
   * 3. Click on the "Edit" button of the clinician
   * 4. Edit the clinician details
   * 5. Click on the "Submit" button
   * 6. Verify the clinician is edited successfully
   * 7. Log the result
   */
  it("IT-029", () => {
    cy.logStartAndEnd(() => {
      cy.loginAndNavigateToClinicianPage("System");
      const tr = cy.get("table").contains("Integration Test Clinician").parent().parent();
      tr.should("exist");
      const editButton = tr.find("#edit-0");
      editButton.click();
      cy.url().should("include", "/clinicians/edit");
      cy.logWithIdentification("Navigated to the edit clinician page");
      let clinicianName = generateRandomClinicianLastName(true);
      cy.get("input[name='last_name']").clear().type(clinicianName);
      cy.get("button[type='submit']").click();
      cy.url().should("not.include", "/clinicians/edit");
      cy.logWithIdentification(
        "Clinician edited successfully and navigated back to the clinician page"
      );
    });
  });

  /**
   * This test case is to verify clinician can be deleted by system admin
   * 1. Login to the app using system admin credentials
   * 2. Navigate to the clinician page
   * 3. Click on the "Delete" button of the clinician
   * 4. Confirm the deletion
   * 5. Verify the clinician is deleted successfully
   * 6. Log the result
   */
  it("IT-030", () => {
    cy.logStartAndEnd(() => {
      cy.loginAndNavigateToClinicianPage("System");
      const tr = cy.get("table").contains("Integration Test Clinician").parent().parent();
      tr.should("exist");
      const deleteButton = tr.find("#delete-0");
      deleteButton.click();
      cy.get("button").contains("Confirm").click();
      tr.should("not.exist");
      cy.logWithIdentification("Clinician deleted successfully");
    });
  });
});

describe("Site Admin", () => {
  /**
   * This test case is to verify clinician can be added by site admin
   * 1. Login to the app using site admin credentials
   * 2. Navigate to the clinician page
   * 3. Click on the "Add Clinician" button
   * 4. Fill in the clinician details
   * 5. Click on the "Submit" button
   * 6. Verify the clinician is added successfully
   * 7. Log the result
   */
  it("IT-031", () => {
    cy.logStartAndEnd(() => {
      cy.loginAndNavigateToClinicianPage("Site");
      cy.get("button").contains("Add Clinician").click();
      cy.url().should("include", "/clinicians/add");
      cy.logWithIdentification('Navigated to the "Add Clinician" page');
      const firstName = generateRandomClinicianFirstName();
      const lastName = generateRandomClinicianLastName();
      const email = generateRandomEmail();
      const phone = generateRandomContactPhone();
      const dob = generateRandomDOB();

      cy.get("input[name='first_name']").type(firstName);
      cy.get("input[name='last_name']").type(lastName);
      cy.get("input[name='email']").type(email);
      cy.get("input[name='phone']").type(phone);
      cy.selectFromAutocomplete("#gender-select", "Male");
      cy.get(".w-full input").type(dob);
      cy.get("button[type='submit']").click();
      cy.url().should("not.include", "/clinicians/add");

      cy.logWithIdentification(
        "Clinician added successfully and navigated back to the clinician page"
      );
    });
  });

  /**
   * This test case is to verify clinician can be edited by site admin
   * 1. Login to the app using site admin credentials
   * 2. Navigate to the clinician page
   * 3. Click on the "Edit" button of the clinician
   * 4. Edit the clinician details
   * 5. Click on the "Submit" button
   * 6. Verify the clinician is edited successfully
   * 7. Log the result
   */
  it("IT-032", () => {
    cy.logStartAndEnd(() => {
      cy.loginAndNavigateToClinicianPage("Site");
      const tr = cy.get("table").contains("Integration Test Clinician").parent().parent();
      tr.should("exist");
      const editButton = tr.find("#edit-0");
      editButton.click();
      cy.url().should("include", "/clinicians/edit");
      cy.logWithIdentification("Navigated to the edit clinician page");
      let clinicianName = generateRandomClinicianLastName(true);
      cy.get("input[name='last_name']").clear().type(clinicianName);
      cy.get("button[type='submit']").click();
      cy.url().should("not.include", "/clinicians/edit");
      cy.logWithIdentification(
        "Clinician edited successfully and navigated back to the clinician page"
      );
    });
  });

  /**
   * This test case is to verify clinician can be deleted by site admin
   * 1. Login to the app using system admin credentials
   * 2. Navigate to the clinician page
   * 3. Click on the "Delete" button of the clinician
   * 4. Confirm the deletion
   * 5. Verify the clinician is deleted successfully
   * 6. Log the result
   */
  it("IT-033", () => {
    cy.logStartAndEnd(() => {
      cy.loginAndNavigateToClinicianPage("Site");
      const tr = cy.get("table").contains("Integration Test Clinician").parent().parent();
      tr.should("exist");
      const deleteButton = tr.find("#delete-0");
      deleteButton.click();
      cy.get("button").contains("Confirm").click();
      tr.should("not.exist");
      //tel.meet/gae-gnth-pvr?pin=8960645564857
      cy.logWithIdentification("Clinician deleted successfully");
    });
  });
});
