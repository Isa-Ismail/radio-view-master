import mockAxios from "@/mocks/axios";

import fetchSiteById from "../fetchSiteById";

test("UT-056", async () => {
  const { data, error } = await fetchSiteById({
    axios: mockAxios,
    siteId: "site_1",
    token: "123123",
  });

  expect(data).toBeDefined();
  expect(data!.siteId).toBe("site_1");
  expect(error).toBeUndefined();

  console.log("No errors were found and the Site was fetched successfully");
});
