import axios from "@/mocks/axios";
import fetchSiteMachineLogs from "../fetchSiteMachineLogs";

/// Test to check if the function fetchActiSvities can be filtered by api_call
test("UT-044", async () => {
  const { data } = await fetchSiteMachineLogs({
    axios: axios,
    token: "",
    filter: {
      siteName: "site1",
    },
  });
  const haveOnlySite1 =
    data!.filter((siteMachineLog) => siteMachineLog.site_name !== "site1").length === 0;
  expect(haveOnlySite1).toBe(true);

  console.log("Succesfully fetched logs for only site1");
});
