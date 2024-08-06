import mockAxios from "@/mocks/axios";
import fetchSiteMachineLogs from "../fetchSiteMachineLogs";

test("UT-043", async () => {
  const { data } = await fetchSiteMachineLogs({
    axios: mockAxios,
    token: "",
  });
  expect(data!.length).toBeGreaterThan(0);
  console.log("Succesfully fetched site machine logs");
});
