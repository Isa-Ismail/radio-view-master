const mockClinicians = [
  {
    hsai_guid: "id1",
    hsai_id: 304,
    created_at: "2024-01-18T07:49:19.711034+00:00",
    role: "Clinician",
    user: "user1@example.com",
    hsai_user_to_profile_mappings: [
      {
        hsai_user_profile: {
          email: "user1@example.com",
          first_name: "FirstName1",
          last_name: "LastName1",
          gender: "Male",
          date_of_birth: "2003-01-22",
          created_at: "2024-01-18T07:49:19.747833+00:00",
          phone: "+000000000001",
          practice_address: "Address1",
          practice_name: "PracticeName1",
          profile_id: "profileid1",
          profile_type: "Personal",
          updated_at: "2024-04-24T11:05:19.335515+00:00",
        },
      },
    ],
    hsai_site_to_user_mappings: [
      {
        hsai_site: {
          site_address: "SiteAddress1",
          site_alias: "Alias1",
          site_id: "siteid1",
          site_name: "SiteName1",
          hsai_site_to_system_mappings: [
            { hsai_system: { system_full_name: "SystemName1" } },
            { hsai_system: { system_full_name: "SystemName2" } },
          ],
        },
      },
    ],
    hsai_system_user_mappings: [
      {
        hsai_system: {
          system_address: "SystemAddress1",
          system_alias: "SystemAlias1",
          system_guid: "systemguid1",
          system_full_name: "SystemName1",
        },
      },
    ],
  },
  {
    hsai_guid: "id2",
    hsai_id: 289,
    created_at: "2024-01-01T06:12:47.070985+00:00",
    role: "Clinician",
    user: "user2@example.com",
    hsai_user_to_profile_mappings: [
      {
        hsai_user_profile: {
          email: "user2@example.com",
          first_name: "FirstName2",
          last_name: "LastName2",
          gender: "Male",
          date_of_birth: "2002-07-26",
          created_at: "2024-01-01T06:12:47.180097+00:00",
          phone: "+000000000002",
          practice_address: "Address2",
          practice_name: "PracticeName2",
          profile_id: "profileid2",
          profile_type: "Personal",
          updated_at: "2024-04-03T06:58:45.941984+00:00",
        },
      },
    ],
    hsai_site_to_user_mappings: [
      {
        hsai_site: {
          site_address: "SiteAddress2",
          site_alias: "Alias2",
          site_id: "siteid2",
          site_name: "SiteName2",
          hsai_site_to_system_mappings: [
            { hsai_system: { system_full_name: "SystemName3" } },
            { hsai_system: { system_full_name: "SystemName4" } },
          ],
        },
      },
      {
        hsai_site: {
          site_address: "SiteAddress3",
          site_alias: "Alias3",
          site_id: "siteid3",
          site_name: "SiteName3",
          hsai_site_to_system_mappings: [
            {
              hsai_system: { system_full_name: "SystemName5" },
            },
          ],
        },
      },
    ],
    hsai_system_user_mappings: [
      {
        hsai_system: {
          system_address: "SystemAddress2",
          system_alias: "SystemAlias2",
          system_guid: "systemguid2",
          system_full_name: "SystemName3",
        },
      },
      {
        hsai_system: {
          system_address: "SystemAddress3",
          system_alias: "SystemAlias3",
          system_guid: "systemguid3",
          system_full_name: "SystemName4",
        },
      },
    ],
  },
  {
    hsai_guid: "id3",
    hsai_id: 106,
    created_at: "2023-11-03T11:45:05.897898+00:00",
    role: "Clinician",
    user: "user3@example.com",
    hsai_user_to_profile_mappings: [
      {
        hsai_user_profile: {
          email: "user3@example.com",
          first_name: "FirstName3",
          last_name: "LastName3",
          gender: "Female",
          date_of_birth: "1993-09-05",
          created_at: "2023-11-03T11:45:05.97226+00:00",
          phone: "+000000000003",
          practice_address: "Address3",
          practice_name: "PracticeName3",
          profile_id: "profileid3",
          profile_type: "Personal",
          updated_at: "2023-11-03T12:45:06.187364+00:00",
        },
      },
    ],
    hsai_site_to_user_mappings: [
      {
        hsai_site: {
          site_address: "SiteAddress4",
          site_alias: "Alias4",
          site_id: "siteid4",
          site_name: "SiteName4",
          hsai_site_to_system_mappings: [{ hsai_system: { system_full_name: "SystemName6" } }],
        },
      },
    ],
    hsai_system_user_mappings: [
      {
        hsai_system: {
          system_address: "SystemAddress4",
          system_alias: "SystemAlias4",
          system_guid: "systemguid4",
          system_full_name: "SystemName6",
        },
      },
    ],
  },
  {
    hsai_guid: "id4",
    hsai_id: 94,
    created_at: "2023-10-11T09:19:21.361671+00:00",
    role: "Clinician",
    user: "user4@example.com",
    hsai_user_to_profile_mappings: [
      {
        hsai_user_profile: {
          email: "user4@example.com",
          first_name: "FirstName4",
          last_name: "LastName4",
          gender: "Male",
          date_of_birth: "1990-05-02",
          created_at: "2023-10-11T09:19:21.45111+00:00",
          phone: "+000000000004",
          practice_address: "Address4",
          practice_name: "PracticeName4",
          profile_id: "profileid4",
          profile_type: "Personal",
          updated_at: "2024-04-03T07:00:59.725488+00:00",
        },
      },
    ],
    hsai_site_to_user_mappings: [
      {
        hsai_site: {
          site_address: "SiteAddress5",
          site_alias: "Alias5",
          site_id: "siteid5",
          site_name: "SiteName5",
          hsai_site_to_system_mappings: [{ hsai_system: { system_full_name: "SystemName7" } }],
        },
      },
      {
        hsai_site: {
          site_address: "SiteAddress6",
          site_alias: "Alias6",
          site_id: "siteid6",
          site_name: "SiteName6",
          hsai_site_to_system_mappings: [{ hsai_system: { system_full_name: "SystemName8" } }],
        },
      },
    ],
    hsai_system_user_mappings: [
      {
        hsai_system: {
          system_address: "SystemAddress5",
          system_alias: "SystemAlias5",
          system_guid: "systemguid5",
          system_full_name: "SystemName7",
        },
      },
      {
        hsai_system: {
          system_address: "SystemAddress6",
          system_alias: "SystemAlias6",
          system_guid: "systemguid6",
          system_full_name: "SystemName8",
        },
      },
    ],
  },
  {
    hsai_guid: "id5",
    hsai_id: 93,
    created_at: "2023-10-11T09:14:05.078277+00:00",
    role: "Clinician",
    user: "user5@example.com",
    hsai_user_to_profile_mappings: [
      {
        hsai_user_profile: {
          email: "user5@example.com",
          first_name: "FirstName5",
          last_name: "LastName5",
          gender: "Male",
          date_of_birth: "1990-05-02",
          created_at: "2023-10-11T09:14:05.164862+00:00",
          phone: "+000000000005",
          practice_address: "Address5",
          practice_name: "PracticeName5",
          profile_id: "profileid5",
          profile_type: "Personal",
          updated_at: "2023-10-11T10:14:05.320447+00:00",
        },
      },
    ],
    hsai_site_to_user_mappings: [
      {
        hsai_site: {
          site_address: "SiteAddress7",
          site_alias: "Alias7",
          site_id: "siteid7",
          site_name: "SiteName7",
          hsai_site_to_system_mappings: [{ hsai_system: { system_full_name: "SystemName9" } }],
        },
      },
    ],
    hsai_system_user_mappings: [
      {
        hsai_system: {
          system_address: "SystemAddress7",
          system_alias: "SystemAlias7",
          system_guid: "systemguid7",
          system_full_name: "SystemName9",
        },
      },
    ],
  },

  {
    hsai_guid: "id6",
    hsai_id: 78,
    created_at: "2023-10-03T14:26:06.317851+00:00",
    role: "Clinician",
    user: "user6@example.com",
    hsai_user_to_profile_mappings: [
      {
        hsai_user_profile: {
          email: "user6@example.com",
          first_name: "FirstName6",
          last_name: "LastName6",
          gender: "Male",
          date_of_birth: "1993-10-04",
          created_at: "2023-10-03T14:26:06.402343+00:00",
          phone: "+000000000006",
          practice_address: "Address6",
          practice_name: "PracticeName6",
          profile_id: "profileid6",
          profile_type: "Personal",
          updated_at: "2023-10-03T15:26:06.642505+00:00",
        },
      },
    ],
    hsai_site_to_user_mappings: [
      {
        hsai_site: {
          site_address: "SiteAddress8",
          site_alias: "Alias8",
          site_id: "siteid8",
          site_name: "SiteName8",
          hsai_site_to_system_mappings: [{ hsai_system: { system_full_name: "SystemName10" } }],
        },
      },
      {
        hsai_site: {
          site_address: "SiteAddress9",
          site_alias: "Alias9",
          site_id: "siteid9",
          site_name: "SiteName9",
          hsai_site_to_system_mappings: [{ hsai_system: { system_full_name: "SystemName11" } }],
        },
      },
    ],
    hsai_system_user_mappings: [
      {
        hsai_system: {
          system_address: "SystemAddress8",
          system_alias: "SystemAlias8",
          system_guid: "systemguid8",
          system_full_name: "SystemName10",
        },
      },
      {
        hsai_system: {
          system_address: "SystemAddress9",
          system_alias: "SystemAlias9",
          system_guid: "systemguid9",
          system_full_name: "SystemName11",
        },
      },
    ],
  },
  {
    hsai_guid: "id7",
    hsai_id: 69,
    created_at: "2023-09-30T18:16:09.128886+00:00",
    role: "Clinician",
    user: "user7@example.com",
    hsai_user_to_profile_mappings: [
      {
        hsai_user_profile: {
          email: "user7@example.com",
          first_name: "FirstName7",
          last_name: "LastName7",
          gender: "Male",
          date_of_birth: "1997-09-26",
          created_at: "2023-09-30T18:16:09.205106+00:00",
          phone: "+000000000007",
          practice_address: "Address7",
          practice_name: "PracticeName7",
          profile_id: "profileid7",
          profile_type: "Personal",
          updated_at: "2023-09-30T18:16:09.722337+00:00",
        },
      },
    ],
    hsai_site_to_user_mappings: [
      {
        hsai_site: {
          site_address: "SiteAddress10",
          site_alias: "Alias10",
          site_id: "siteid10",
          site_name: "SiteName10",
          hsai_site_to_system_mappings: [{ hsai_system: { system_full_name: "SystemName12" } }],
        },
      },
    ],
    hsai_system_user_mappings: [
      {
        hsai_system: {
          system_address: "SystemAddress10",
          system_alias: "SystemAlias10",
          system_guid: "systemguid10",
          system_full_name: "SystemName12",
        },
      },
    ],
  },
  {
    hsai_guid: "id8",
    hsai_id: 58,
    created_at: "2023-09-28T10:18:23.407278+00:00",
    role: "Clinician",
    user: "user8@example.com",
    hsai_user_to_profile_mappings: [
      {
        hsai_user_profile: {
          email: "user8@example.com",
          first_name: "FirstName8",
          last_name: "LastName8",
          gender: "Male",
          date_of_birth: "1990-05-02",
          created_at: "2023-09-28T10:18:23.490509+00:00",
          phone: "+000000000008",
          practice_address: "Address8",
          practice_name: "PracticeName8",
          profile_id: "profileid8",
          profile_type: "Personal",
          updated_at: "2023-09-28T11:18:23.64167+00:00",
        },
      },
    ],
    hsai_site_to_user_mappings: [
      {
        hsai_site: {
          site_address: "SiteAddress11",
          site_alias: "Alias11",
          site_id: "siteid11",
          site_name: "SiteName11",
          hsai_site_to_system_mappings: [{ hsai_system: { system_full_name: "SystemName13" } }],
        },
      },
    ],
    hsai_system_user_mappings: [
      {
        hsai_system: {
          system_address: "SystemAddress11",
          system_alias: "SystemAlias11",
          system_guid: "systemguid11",
          system_full_name: "SystemName13",
        },
      },
    ],
  },
];

export default mockClinicians;
