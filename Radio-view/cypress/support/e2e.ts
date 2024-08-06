// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands";

beforeEach(() => {
  Cypress.on("uncaught:exception", (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false;
  });
  cy.intercept(
    {
      method: "POST",
      url: "**/login",
    },
    (req) => {
      const { username } = JSON.parse(req.body);
      console.log("----USERNAME----", username);
      if (username.includes("super")) {
        req.reply({
          fixture: "login.json",
        });
      } else if (username.includes("system")) {
        req.reply({
          fixture: "login-system-admin.json",
        });
      } else if (username.includes("site")) {
        req.reply({
          fixture: "login-site-admin.json",
        });
      }
    }
  ).as("login-request");
  cy.intercept(
    {
      method: "GET",
      path: "**/getdetails",
      headers: {
        Authorization: "Bearer super",
      },
    },
    {
      fixture: "login.json",
    }
  );
  cy.intercept(
    {
      method: "GET",
      path: "**/getdetails",
      headers: {
        Authorization: "Bearer system",
      },
    },
    {
      fixture: "login-system-admin.json",
    }
  );

  cy.intercept(
    {
      method: "GET",
      path: "**/getdetails",
      headers: {
        Authorization: "Bearer site",
      },
    },
    {
      fixture: "login-site-admin.json",
    }
  );

  cy.intercept("GET", "**/dashboard", {
    fixture: "dashboard.json",
  });
  cy.intercept("GET", "**/dashboard/graph**", {
    fixture: "graph.json",
  });
  cy.intercept("GET", "**/rotate-refresh-token", {
    body: {
      token: "newToken",
      refreshToken: "newRefreshToken",
    },
  });
  cy.intercept("POST", "**/check-password-update", {
    body: {
      "password-update": "false",
    },
  });
  cy.intercept("GET", "**/api/data/activities**", {
    fixture: "activities.json",
  });
  cy.intercept("GET", "**/api/data/app-version**", {
    fixture: "app-version.json",
  });

  cy.intercept("GET", "**/api/data/system**", (req) => {
    const url = new URL(req.url);
    const query = url.searchParams;
    const all = query.get("all");
    if (all === "true") {
      req.reply({
        fixture: "systems-all.json",
      });
    } else {
      req.reply({
        fixture: "systems.json",
      });
    }
  });

  // Site Start
  cy.intercept("POST", "**/api/data/site**", {
    body: {
      data: "Site created",
    },
  });
  cy.intercept("PUT", "**/api/data/site**", {
    body: {
      data: "Site updated",
    },
  });
  cy.intercept("DELETE", "**/api/data/site**", {
    body: {
      data: "Site deleted",
    },
  });

  cy.intercept("GET", "**/api/data/site?**", (req) => {
    const url = new URL(req.url);
    const query = url.searchParams;
    const system_ids = query.get("system_ids");
    if (system_ids) {
      req.reply({
        fixture: "demo-sites.json",
      });
    } else {
      req.reply({
        fixture: "sites.json",
      });
    }
  });
  cy.intercept("GET", "**/api/data/site/**", {
    fixture: "single-site.json",
  });
  // Site End

  // Clinician Start
  cy.intercept("GET", "**/api/data/clinician?**", {
    fixture: "clinicians.json",
  });
  cy.intercept("POST", "**/api/data/clinician**", {
    body: {
      data: "Clinician created",
    },
  });
  cy.intercept("PUT", "**/api/data/clinician**", {
    body: {
      data: "Clinician updated",
    },
  });
  cy.intercept("DELETE", "**/api/data/clinician**", {
    body: {
      data: "Clinician deleted",
    },
  });

  cy.intercept("GET", "**/api/data/clinician/**", {
    fixture: "single-clinician.json",
  });
  // Clinician End

  cy.intercept("GET", "**/api/data/site-machine-logs?**", {
    fixture: "site-machine-logs.json",
  });

  cy.intercept("GET", "**/api/data/studies?**", {
    fixture: "studies.json",
  });

  // System Start
  cy.intercept("GET", "**/api/data/system?**", {
    fixture: "systems.json",
  });
  cy.intercept("GET", "**/api/data/system/**", {
    fixture: "single-system.json",
  });
  cy.intercept("POST", "**/api/data/system**", {
    body: {
      data: "System created",
    },
  });
  cy.intercept("PUT", "**/api/data/system**", {
    body: {
      data: "System updated",
    },
  });
  cy.intercept("DELETE", "**/api/data/system**", {
    body: {
      data: "System deleted",
    },
  });
  // System End
});
