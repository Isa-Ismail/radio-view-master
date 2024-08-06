import { AddEditClinicianFormType } from "@/app/clinicians/components/form";
import mockAxios from "@/mocks/axios";
import addEditClinician from "../../addEditClinician/addEditClinician";

test("UT-059", async () => {
  const { data, error } = await addEditClinician({
    axios: mockAxios,
    clinicianData: jest.mocked<AddEditClinicianFormType>({} as AddEditClinicianFormType),
  });
  expect(error).toBeUndefined();
  expect(data).toBe("Clinician added successfully");

  console.log("No errors were and the clinician was added successfully");
});

test("UT-060", async () => {
  const { data, error } = await addEditClinician({
    axios: mockAxios,
    clinicianData: jest.mocked<AddEditClinicianFormType>({
      hsai_guid: "test",
    } as AddEditClinicianFormType),
  });
  expect(error).toBeUndefined();
  expect(data).toBe("Clinician updated successfully");

  console.log("No errors were and the clinician was updated successfully");
});
