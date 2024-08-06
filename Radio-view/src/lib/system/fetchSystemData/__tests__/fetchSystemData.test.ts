import mockAxios from "@/mocks/axios";
import fetchSystemData from "../fetchSystemData";
/// This test verifies that the function fetchSystemData returns data successfully.
test("UT-047", async () => {
  const { data, error } = await fetchSystemData({
    axios: mockAxios,
    token: "",
    filter: {
      alias: "alias",
      email: "email",
      name: "name",
    },
    limit: 5,
    offset: 0,
  });

  expect(error).toBeUndefined();
  expect(data).toBeDefined();
  expect(data?.total).toBeGreaterThan(0);
  expect(data?.data).toBeDefined();

  console.log("No errors found in fetchSystemData and data is successfully fetched");
});
