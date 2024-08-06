import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  viewportHeight: 1080,
  viewportWidth: 1920,
  taskTimeout: 100000,
  execTimeout: 100000,
  defaultCommandTimeout: 100000,
  requestTimeout: 100000,
  pageLoadTimeout: 100000,
});
