import mockAxios from "@/mocks/axios";
import fetchClinicianById from "../fetchClinicianById";

test("UT-062", async () => {
  const { data, error } = await fetchClinicianById({
    axios: mockAxios,
    id: "id1",
    token: "asdsad",
  });
  expect(error).toBeUndefined();
  expect(data).toBeDefined();
  expect(data?.hsaiGuid).toEqual("id1");

  console.log("No errors were and the clinician was fetched successfully");
});
