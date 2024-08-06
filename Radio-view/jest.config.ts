/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from "jest";

const config: Config = {
  moduleDirectories: ["node_modules", "<rootDir>/"],
  // testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
  testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/", "<rootDir>/cypress/"],
  transform: {
    "^.+\\.(ts|tsx)?$": "ts-jest",
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  testEnvironmentOptions: {
    customExportConditions: [""],
  },
  moduleNameMapper: {
    "^@/app/components/(.*)$": "<rootDir>/src/app/components/$1",
    "@/mocks/(.*)$": "<rootDir>/src/mocks/$1",
    "@/hooks/(.*)$": "<rootDir>/src/hooks/$1",
    "@/utils/(.*)$": "<rootDir>/src/utils/$1",
    "@/models/(.*)$": "<rootDir>/src/models/$1",
  },
};

export default config;
