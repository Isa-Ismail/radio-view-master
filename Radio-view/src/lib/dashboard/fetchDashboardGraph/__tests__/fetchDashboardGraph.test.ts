import mockAxios from "@/mocks/axios";
import { fetchDashboardGraph } from "../fetchDashboardGraph";

test("UT-046", async () => {
  const { data, error } = await fetchDashboardGraph({
    axios: mockAxios,
    token: "",
    year: 2024,
    id: "123",
  });
  expect(error).toBeUndefined();
  expect(data?.length).toBeGreaterThan(0);

  console.log("No errors found in fetchDashboardData and graph data is successfully fetched");
});
