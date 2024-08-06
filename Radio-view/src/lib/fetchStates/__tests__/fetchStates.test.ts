import mockAxios from "@/mocks/axios";
import fetchStates from "../fetchStates";
// Test to check if the function fetchStates returns the correct data
test("UT-040", async () => {
  const data = await fetchStates("country", mockAxios);
  expect(data.length).toBeGreaterThan(0);
  console.log("Succesfully fetched states");
  // console.log("UT-39");
});
