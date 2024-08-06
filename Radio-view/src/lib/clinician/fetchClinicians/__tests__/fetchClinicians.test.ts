import mockAxios from "@/mocks/axios";
import fetchClinician from "../fetchClinicians";

test("UT-063", async () => {
  const { error, data } = await fetchClinician({
    axios: mockAxios,
    limit: 5,
    token: "",
    offset: 0,
  });

  expect(error).toBeUndefined();
  expect(data).toBeDefined();
  expect(data?.total).toBeGreaterThan(0);
  expect(data?.data.length).toBe(5);

  console.log("No error was found and clinicians were fetched successfully");
});
