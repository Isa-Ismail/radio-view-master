const mockStudies = [
  {
    study_date: "2023-12-07",
    study_time: "181831.000",
    study_orthanc_id_2: "e2427f3f-fa415889-a347b1bc-8c406388-0d0be286",
    institution_name: "ITTEFAQ 3D CT SCAN KOHAT",
    series: [
      {
        series_description: " Head 4.0",
        modality: "CT",
        protocol_name: "Brain S&S   1 mm",
        body_part_examined: "HEAD",
        series_orthanc_id: "eab1e27b-28ba-40e2-a986-b7c977bd3822",
        series_orthanc_id_2: "43b904e1-3f5823ef-a80ac08f-94ac8c79-63bfd3b7",
        instances: [
          {
            detected: "not-detected",
            index_in_series: 22,
            instance_orthanc_id: "c7ee6086-c697017a-b0c16e22-0b97932f-7ea8bfc8",
            is_ai_reviewed: false,
            is_clinician_reviewed: false,
          },
          {
            detected: "not-detected",
            index_in_series: 9,
            instance_orthanc_id: "15ad1a24-b6b9b228-cd6443ca-a18f9d46-43db6d52",
            is_ai_reviewed: false,
            is_clinician_reviewed: false,
          },
        ],
      },
    ],
    patient: {
      patient_name: "JUMA GUL",
      patient_birth_date: null,
      patient_sex: "Male",
      created_at: "2023-12-12T11:31:58.421377+00:00",
      patient_orthanc_id: "9acc70c0-d338-4064-bc3c-1a2c2f3d2ee5",
      hsai_site_to_patient_mappings: [
        {
          site: {
            site_id: "8b576878-e502-4d29-b899-e2f27aff47a0",
            site_name: "Holy Family Hospital",
            site_alias: "HFH",
            site_address: "J329+WJ2, Tipu Rd, Chamanzar Colony, Rawalpindi, Punjab 46000",
            hsai_site_to_system_mappings: [
              {
                hsai_system: {
                  system_full_name: "Rawalpindi Medical University",
                  system_address: ".",
                  system_alias: "RMU",
                  system_guid: "16000f89-f692-4a8f-8e83-2c8c92ca0822",
                },
              },
            ],
          },
        },
      ],
    },
  },
];

export default mockStudies;
