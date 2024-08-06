import mockAxios from "@/mocks/axios";
import fetchSystemById from "../fetchSystemById";
/// This test verifies that the function fetchSystemById returns data successfully.
test("UT-048", async () => {
  const { data, error } = await fetchSystemById({
    axios: mockAxios,
    token: "",
    id: "cc20a7ed-44a0-497d-aa34-aee485c07352",
  });

  expect(error).toBeUndefined();
  expect(data).toBeDefined();
  expect(data?.hsaiGuid).toBe("cc20a7ed-44a0-497d-aa34-aee485c07352");

  console.log("No errors found in fetchSystemById and data is successfully fetched");
});
