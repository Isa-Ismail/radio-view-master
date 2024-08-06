import mockAxios from "@/mocks/axios";
import fetchStudies from "../fetchStudies";

test("UT-058", async () => {
  const { data, error } = await fetchStudies({
    axios: mockAxios,
    limit: 10,
    offset: 0,
    token: "asd",
    user: undefined,
  });

  expect(data).toBeDefined();
  expect(data?.total).toBeGreaterThan(0);
  expect(data?.data.length).toBeGreaterThan(0);
  expect(error).toBeUndefined();

  console.log("No errors were found and the studies were fetched successfully");
});
