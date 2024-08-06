import axios from "@/mocks/axios";
import { ActivitySource, WebActivityApiCall } from "@/models/activities";
import fetchActivities from "../fetchActivities";

/// Test to check if the function fetchActivities can be filtered by api_call
test("UT-042", async () => {
  const { data } = await fetchActivities({
    axios: axios,
    source: ActivitySource.web,
    token: "",
    webApiCall: WebActivityApiCall.login,
  });
  const haveOnlyLoginActivities =
    data!.filter((activity) => activity.apiCall !== WebActivityApiCall.login).length === 0;
  expect(haveOnlyLoginActivities).toBe(true);

  console.log("Succesfully fetched only login Activities");
});
