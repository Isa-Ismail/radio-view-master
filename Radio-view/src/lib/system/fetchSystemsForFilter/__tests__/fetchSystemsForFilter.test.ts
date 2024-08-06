import mockAxios from "@/mocks/axios";
import fetchSystemsForFilter from "../fetchSystemsForFilter";

test("UT-051", async () => {
  const { data, error } = await fetchSystemsForFilter({
    axios: mockAxios,
    token: "token",
  });

  expect(data).toBeDefined();
  expect(data!.length).toBeGreaterThan(0);
  expect(error).toBeUndefined();

  console.log("No errors found and Systems fetched successfully");
});
