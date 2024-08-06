import mockAxios from "@/mocks/axios";
import deleteClinician from "../deleteClinician";

test("UT-061", async () => {
  const { data, error } = await deleteClinician({
    axios: mockAxios,
    data: jest.mocked<{ hsai_guid: string; profile_id: string; email: string }[]>(
      {} as { hsai_guid: string; profile_id: string; email: string }[]
    ),
  });

  expect(error).toBeUndefined();
  expect(data).toBeDefined();

  console.log("No errors were and the clinicians was deleted successfully");
});
