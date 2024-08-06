import axios from "@/mocks/axios";
import { ActivitySource } from "@/models/activities";
import fetchActivities from "../fetchActivities";
/// Test to check if the function fetchActivities returns the correct data
test("UT-041", async () => {
  const { data } = await fetchActivities({
    axios: axios,
    source: ActivitySource.web,
    token: "",
  });
  expect(data!.length).toBeGreaterThan(0);

  console.log("Succesfully fetched Activities");
});
