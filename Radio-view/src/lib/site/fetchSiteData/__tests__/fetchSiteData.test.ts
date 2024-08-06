import mockAxios from "@/mocks/axios";

import fetchSiteData from "../fetchSiteData";

test("UT-057", async () => {
  const { data, error } = await fetchSiteData({
    axios: mockAxios,

    token: "123123",
    limit: 5,
    offset: 0,
  });

  expect(data).toBeDefined();
  expect(data!.total).toBe(5);
  expect(error).toBeUndefined();

  console.log("No errors were found and the sites was fetched successfully");
});
