import mockAxios from "@/mocks/axios";

import deleteSite from "../deleteSite";

test("UT-055", async () => {
  const { data, error } = await deleteSite({
    axios: mockAxios,
    data: [
      {
        email: "example@g.com",
        hsaiGuid: "123123",
        profile_id: "123123",
        siteId: "123123",
        systems: ["123123"],
      },
    ],
  });

  expect(data).toBeDefined();
  expect(error).toBeUndefined();

  console.log("No errors were found and Site was deleted successfully");
});
