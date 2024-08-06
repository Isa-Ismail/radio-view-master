import mockAxios from "@/mocks/axios";
import fetchCities from "../fetchCities";
// Test to check if the function fetchCities returns the correct data
test("UT-039", async () => {
  const data = await fetchCities("country", "state", mockAxios);
  expect(data.length).toBeGreaterThan(0);

  console.log("Succesfully fetched cities");
});
