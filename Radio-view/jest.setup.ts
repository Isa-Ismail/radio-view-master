// import "@testing-library/jest-dom/extend-expect";
// import formatDate from "@/utils/format_date_for_test";
import "whatwg-fetch";
import { server } from "./src/mocks/server";
import formatDate from "./src/utils/format_date_for_test";

beforeAll(() => server.listen());
afterEach(() => {
  const name = expect.getState().currentTestName;
  const now = formatDate(Date.now());
  console.log(`${name} ended at ${now}`);
});
beforeEach(() => {
  const name = expect.getState().currentTestName;
  const now = formatDate(Date.now());

  console.log(`${name} started at ${now}`);
  server.resetHandlers();
});
afterAll(() => server.close());
