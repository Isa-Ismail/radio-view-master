import { AddEditSystemFormType } from "@/app/systems/components/add_edit_form";
import mockAxios from "@/mocks/axios";
import addEditSystemData from "../addEditSystemData";
/// This test verifies that the function addEditSystemData works as expected when adding.
test("UT-049", async () => {
  const { data, error } = await addEditSystemData({
    axios: mockAxios,
    systemData: jest.mocked<AddEditSystemFormType>({} as AddEditSystemFormType),
  });

  expect(data).toBe("System added successfully");
  expect(error).toBeUndefined();

  console.log("No errors found and System added successfully");
});

/// This test verifies that the function addEditSystemData works as expected when updating.
test("UT-050", async () => {
  const { data, error } = await addEditSystemData({
    axios: mockAxios,
    systemData: jest.mocked<AddEditSystemFormType>({
      system_id: "fd53a3e8-62af-4f59-a8c5-f5ca7513b4d0",
      profile_id: "345e4567-e89b-12d3-a456-426614174004",
    } as AddEditSystemFormType),
  });
  expect(data).toBe("System updated successfully");
  expect(error).toBeUndefined();

  console.log("No errors found and System updated successfully");
});
