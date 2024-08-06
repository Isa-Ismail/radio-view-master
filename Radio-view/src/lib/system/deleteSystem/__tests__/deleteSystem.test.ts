import mockAxios from "@/mocks/axios";
import deleteSystem from "../deleteSystem";

/// This test case verifies that the function deleteSystem works as expected.
test("UT-052", async () => {
  const { data, error } = await deleteSystem({
    axios: mockAxios,
    data: [
      {
        hsaiGuid: "fd53a3e8-62af-4f59-a8c5-f5ca7513b4d0",
        email: "contact005@domain.com",
        profileId: "345e4567-e89b-12d3-a456-426614174004",
        systemGuid: "517ca128-d2fa-4795-aa3a-07f54f9ac398",
      },
    ],
  });
  expect(error).toBeUndefined();
  expect(data).toBeDefined();
});
