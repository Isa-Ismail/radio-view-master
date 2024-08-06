import mockAxios from "@/mocks/axios";
import { fetchDashboardData } from "../fetchDashboardData";

test("UT-045", async () => {
  const { data, error } = await fetchDashboardData({
    axios: mockAxios,
    token: "",
  });
  expect(error).toBeUndefined();
  expect(data?.clincians).toBeDefined();
  expect(data?.sites).toBeDefined();
  expect(data?.studies).toBeDefined();
  expect(data?.systems).toBeDefined();
  expect(data?.patients).toBeDefined();

  console.log("No errors found in fetchDashboardData and data is successfully fetched");
});
