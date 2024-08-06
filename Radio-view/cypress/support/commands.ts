type AdminType = "Super" | "System" | "Site";
function formatDate(date: number) {
  let d = new Date(date);
  let year = d.getFullYear();
  let month = (d.getMonth() + 1).toString().padStart(2, "0"); // Months start from 0
  let day = d.getDate().toString().padStart(2, "0");

  let hour = d.getHours();
  let meridian = hour >= 12 ? "PM" : "AM";
  hour = hour % 12;
  hour = hour ? hour : 12; // Convert hour '0' to '12'

  let formattedMinutes = d.getMinutes().toString().padStart(2, "0");
  let formattedSeconds = d.getSeconds().toString().padStart(2, "0");
  let formattedHour = hour.toString().padStart(2, "0");

  return `${year}-${month}-${day} ${formattedHour}:${formattedMinutes}:${formattedSeconds} ${meridian}`;
}

Cypress.Commands.add("login", (adminType = "Super") => {
  let username: string;
  let password: string;

  if (adminType === "Super") {
    username = "superadmin@aineurocare.com";
    password = "Test123@";
  }
  if (adminType === "System") {
    username = "systemadmin@aineurocare.com";
    password = "Test123@";
  }
  if (adminType === "Site") {
    username = "siteadmin@aineurocare.com";
    password = "Test123@";
  }
  cy.visit("http://localhost:8000/signin");
  cy.get('input[name="username"]').type(username);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.wait("@login-request");
  cy.url().should("include", "/dashboard");
  cy.get("#dashboard-cards").should("be.visible");
  cy.logWithIdentification(
    `${adminType} Admin logged in successfully and navigated to the dashboard`
  );
  cy.get('svg[data-testid="LogoutIcon"]').parent().as("logoutButton");
  if (adminType === "Super") {
    cy.get('a[href="/dashboard"]').as("dashboardLink").should("exist");
    cy.get('a[href="/systems"]').as("systemsLink").should("exist");
    cy.get('a[href="/sites"]').as("sitesLink").should("exist");
    cy.get('a[href="/clinicians"]').as("cliniciansLink").should("exist");
    cy.get('a[href="/studies"]').as("studiesLink").should("exist");
    cy.get('a[href="/site-machine-logs"]').as("siteMachineLogsLink").should("exist");
    cy.get('a[href="/activities"]').as("activityLogsLink").should("exist");
    cy.get('a[href="/app-version"]').as("appVersionLink").should("exist");
    cy.logWithIdentification('Navigation links are displayed for "Super" admin');
  } else if (adminType === "System") {
    cy.get('a[href="/dashboard"]').as("dashboardLink").should("exist");
    cy.get('a[href="/systems"]').should("not.exist");
    cy.get('a[href="/sites"]').as("sitesLink").should("exist");
    cy.get('a[href="/clinicians"]').as("cliniciansLink").should("exist");
    cy.get('a[href="/studies"]').as("studiesLink").should("exist");
    cy.get('a[href="/site-machine-logs"]').should("not.exist");
    cy.get('a[href="/activities"]').should("not.exist");
    cy.get('a[href="/app-version"]').should("not.exist");
    cy.logWithIdentification('Navigation links are displayed for "System" admin');
  } else if (adminType === "Site") {
    cy.get('a[href="/dashboard"]').as("dashboardLink").should("exist");
    cy.get('a[href="/systems"]').should("not.exist");
    cy.get('a[href="/sites"]').should("not.exist");
    cy.get('a[href="/clinicians"]').as("cliniciansLink").should("exist");
    cy.get('a[href="/studies"]').as("studiesLink").should("exist");
    cy.get('a[href="/site-machine-logs"]').should("not.exist");
    cy.get('a[href="/activities"]').should("not.exist");
    cy.get('a[href="/app-version"]').should("not.exist");
    cy.logWithIdentification('Navigation links are displayed for "Site" admin');
  }

  //   });
});

Cypress.Commands.add("logStartAndEnd", (fn) => {
  let now = formatDate(Date.now());
  cy.logWithIdentification(`Test started at ${now}`);
  fn();
  now = formatDate(Date.now());
  cy.logWithIdentification(`Test ended at ${now}`);
});

Cypress.Commands.add("logWithIdentification", (message) => {
  let name = Cypress.currentTest.title;
  console.log(`[${name}]: ${message}`);
});

Cypress.Commands.add("loginAndNavigateToSystemPage", (adminType = "Super") => {
  cy.login(adminType);
  cy.get("#systems-dashboard-card-value").then((el) => {
    const systemLength = parseInt(el.text());
    cy.get("@systemsLink").click();
    cy.url().should("include", "/systems");
    if (systemLength > 0) {
      cy.get('[data-testid="MuiDataTableBodyCell-0-0"]').should("be.visible");
      cy.logWithIdentification('Navigated to the "System" page and systems are displayed');
    } else {
      cy.logWithIdentification('Navigated to the "System" page and no systems are displayed');
    }
  });
});

Cypress.Commands.add("loginAndNavigateToSitePage", (adminType = "Super") => {
  cy.login(adminType);
  cy.get("#sites-dashboard-card-value").then((el) => {
    const siteLength = parseInt(el.text());
    cy.get("@sitesLink").click();
    cy.url().should("include", "/sites");
    if (siteLength > 0) {
      cy.get('[data-testid="MuiDataTableBodyCell-0-0"]').should("be.visible");
      cy.logWithIdentification('Navigated to the "Site" page and sites are displayed');
    } else {
      cy.logWithIdentification('Navigated to the "Site" page and no sites are displayed');
    }
  });
});

Cypress.Commands.add("loginAndNavigateToClinicianPage", (adminType = "Super") => {
  cy.login(adminType);
  cy.get("#clinicians-dashboard-card-value").then((el) => {
    const clinicianLength = parseInt(el.text());
    cy.get("@cliniciansLink").click();

    cy.url().should("include", "/clinicians");
    if (clinicianLength > 0) {
      cy.get('[data-testid="MuiDataTableBodyCell-0-0"]').should("be.visible");

      cy.logWithIdentification('Navigated to the "Clinician" page and clinicians are displayed');
    } else {
      cy.logWithIdentification('Navigated to the "Clinician" page and no clinicians are displayed');
    }
  });
});

Cypress.Commands.add("loginAndNavigateToStudyPage", (adminType = "Super") => {
  cy.login(adminType);
  cy.get("#studies-dashboard-card-value").then((el) => {
    const studyLength = parseInt(el.text());
    cy.get("@studiesLink").click();
    cy.url().should("include", "/studies");
    if (studyLength > 0) {
      cy.get('[data-testid="MuiDataTableBodyCell-0-0"]').should("be.visible");

      cy.logWithIdentification('Navigated to the "Study" page and studies are displayed');
    } else {
      cy.logWithIdentification('Navigated to the "Study" page and no studies are displayed');
    }
  });
});

Cypress.Commands.add("loginAndNavigateToActivityLogsPage", (adminType = "Super") => {
  cy.login(adminType);
  if (adminType !== "Super") {
    cy.get("a[href='/activities']").should("not.exist");

    cy.logWithIdentification(`Activity Logs page not found for ${adminType} admin`);
    return;
  }
  cy.get("@activityLogsLink").click();
  cy.url().should("include", "/activities");
  cy.get('[data-testid="MuiDataTableBodyCell-0-0"]').should("be.visible");
  cy.logWithIdentification('Navigated to the "Activity Logs" page');
});

Cypress.Commands.add("loginAndNavigateToSiteMachineLogsPage", (adminType = "Super") => {
  cy.login(adminType);
  if (adminType !== "Super") {
    cy.get("a[href='/site-machine-logs']").should("not.exist");
    cy.logWithIdentification(`Site Machine Logs page not found for ${adminType} admin`);
    return;
  }
  cy.get("@siteMachineLogsLink").click();
  cy.url().should("include", "/site-machine-logs");
  cy.get('[data-testid="MuiDataTableBodyCell-0-0"]').should("be.visible");
  cy.logWithIdentification('Navigated to the "Site Machine Logs" page');
});

Cypress.Commands.add("loginAndNavigateToAppVersionPage", (adminType = "Super") => {
  cy.login(adminType);
  if (adminType !== "Super") {
    cy.get("a[href='/app-version']").should("not.exist");

    cy.logWithIdentification(`App Version page not found for ${adminType} admin`);
    return;
  }
  cy.get("@appVersionLink").click();
  cy.url().should("include", "/app-version");
  cy.get('[data-testid="MuiDataTableBodyCell-0-0"]').should("be.visible");
  cy.logWithIdentification('Navigated to the "App Version" page');
});

Cypress.Commands.add("selectFromAutocomplete", (selector, value) => {
  let autoComplete = cy.get(selector).click();
  if (value) {
    autoComplete.type(value);
    cy.contains("li", value).should("be.visible").click();
  } else {
    cy.get("li").first().click();
  }
});

declare namespace Cypress {
  interface Chainable {
    /**
     * Command to login to the app
     * @param username
     * @param password
     * @returns Chainable
     */
    login(adminType?: AdminType): Chainable;
    /**
     * Command to log the time taken for a test to run
     * @param fn
     */
    logStartAndEnd(fn: () => void): Chainable;
    /**
     * Command to console log with test name
     * @param message
     * @returns Chainable
     */
    logWithIdentification(message: string): Chainable;

    /**
     * Command to login and navigate to the system page
     * @returns Chainable
     * */
    loginAndNavigateToSystemPage(adminType?: AdminType): Chainable;

    /**
     * Command to login and navigate to the site page
     * @returns Chainable
     * */
    loginAndNavigateToSitePage(adminType?: AdminType): Chainable;

    /**
     * Command to login and navigate to the clinician page
     * @returns Chainable
     * */
    loginAndNavigateToClinicianPage(adminType?: AdminType): Chainable;

    /**
     * Command to login and navigate to the study page
     * @returns Chainable
     * */
    loginAndNavigateToStudyPage(adminType?: AdminType): Chainable;

    /**
     * Command to login and navigate to the activity logs page
     * @returns Chainable
     * */
    loginAndNavigateToActivityLogsPage(adminType?: AdminType): Chainable;

    /**
     * Command to login and navigate to the site machine logs page
     * @returns Chainable
     * */
    loginAndNavigateToSiteMachineLogsPage(adminType?: AdminType): Chainable;

    /**
     * Command to login and navigate to the app version page
     * @returns Chainable
     * */
    loginAndNavigateToAppVersionPage(adminType?: AdminType): Chainable;

    /**
     * Command to select an option from an autocomplete field
     * @param selector - the selector of the autocomplete field
     * @param value - the value to select can be undefined in which case the first option is selected
     * */
    selectFromAutocomplete(selector: string, value?: string): Chainable;
  }
}
