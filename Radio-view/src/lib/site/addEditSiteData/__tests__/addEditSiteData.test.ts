import { AddEditSiteFormType } from "@/app/sites/components/form";
import mockAxios from "@/mocks/axios";
import addEditSiteData from "../addEditSiteData";
/// This test case verifies that the site was added successfully
test("UT-053", async () => {
  const { data, error } = await addEditSiteData({
    siteData: jest.mocked<AddEditSiteFormType>({} as AddEditSiteFormType),
    axios: mockAxios,
  });

  expect(data).toBe("Site added successfully");
  expect(error).toBeUndefined();

  console.log("No errors were found and Site was added successfully");
});

test("UT-054", async () => {
  const { data, error } = await addEditSiteData({
    siteData: jest.mocked<AddEditSiteFormType>({
      hsaiGuid: "213213",
      profile_id: "12312312",
      site_id: "21312321312",
    } as AddEditSiteFormType),
    axios: mockAxios,
  });

  expect(data).toBe("Site updated successfully");
  expect(error).toBeUndefined();

  console.log("No errors were found and Site was updated successfully");
});
