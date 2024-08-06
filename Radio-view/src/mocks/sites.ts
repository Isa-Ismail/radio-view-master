const mockSites = [
  {
    site_id: "site_1",
    site_name: "Site Name 1",
    site_alias: "Alias1",
    site_address: "Address1",
    site_country: "United Arab Emirates",
    site_city: "City1",
    site_state: "State1",
    hsai_site_to_system_mappings: [
      {
        hsai_system: {
          system_guid: "system_guid_1",
          system_full_name: "System Full Name1",
          system_alias: "SFA1",
        },
      },
    ],
    hsai_user: {
      user: "user1@domain.com",
      hsai_guid: "hsai_guid1",
      hsai_user_to_profile_mappings: [
        {
          hsai_user_profile: {
            email: "user1@domain.com",
            first_name: "FirstName1",
            phone: "Phone1",
            profile_id: "profile_id1",
            last_name: "LastName1",
            practice_name: "PracticeName1",
          },
        },
      ],
    },
  },
  {
    site_id: "site_2",
    site_name: "Site Name 2",
    site_alias: "Alias2",
    site_address: "Address2",
    site_country: "Andorra",
    site_city: "City2",
    site_state: "State2",
    hsai_site_to_system_mappings: [
      {
        hsai_system: {
          system_guid: "system_guid_1",
          system_full_name: "System Full Name1",
          system_alias: "SFA1",
        },
      },
    ],
    hsai_user: {
      user: "user2@domain.com",
      hsai_guid: "hsai_guid2",
      hsai_user_to_profile_mappings: [
        {
          hsai_user_profile: {
            email: "user2@domain.com",
            first_name: "FirstName2",
            phone: "Phone2",
            profile_id: "profile_id2",
            last_name: "LastName2",
            practice_name: "PracticeName2",
          },
        },
      ],
    },
  },
  {
    site_id: "site_3",
    site_name: "Site Name 3",
    site_alias: "Alias3",
    site_address: "Address3",
    site_country: "Andorra",
    site_city: "City3",
    site_state: "State3",
    hsai_site_to_system_mappings: [
      {
        hsai_system: {
          system_guid: "system_guid_2",
          system_full_name: "System Full Name2",
          system_alias: "SFA2",
        },
      },
    ],
    hsai_user: {
      user: "user3@domain.com",
      hsai_guid: "hsai_guid3",
      hsai_user_to_profile_mappings: [
        {
          hsai_user_profile: {
            email: "user3@domain.com",
            first_name: "FirstName3",
            phone: "Phone3",
            profile_id: "profile_id3",
            last_name: "LastName3",
            practice_name: "PracticeName3",
          },
        },
      ],
    },
  },
  {
    site_id: "site_4",
    site_name: "Site Name 4",
    site_alias: "Alias4",
    site_address: "Address4",
    site_country: "Andorra",
    site_city: "City4",
    site_state: "State4",
    hsai_site_to_system_mappings: [
      {
        hsai_system: {
          system_guid: "system_guid_2",
          system_full_name: "System Full Name2",
          system_alias: "SFA2",
        },
      },
    ],
    hsai_user: {
      user: "user4@domain.com",
      hsai_guid: "hsai_guid4",
      hsai_user_to_profile_mappings: [
        {
          hsai_user_profile: {
            email: "user4@domain.com",
            first_name: "FirstName4",
            phone: "Phone4",
            profile_id: "profile_id4",
            last_name: "LastName4",
            practice_name: "PracticeName4",
          },
        },
      ],
    },
  },
  {
    site_id: "site_5",
    site_name: "Site Name 5",
    site_alias: "Alias5",
    site_address: "Address5",
    site_country: "Afghanistan",
    site_city: "City5",
    site_state: "State5",
    hsai_site_to_system_mappings: [
      {
        hsai_system: {
          system_guid: "system_guid_3",
          system_full_name: "System Full Name3",
          system_alias: "SFA3",
        },
      },
    ],
    hsai_user: {
      user: "user5@domain.com",
      hsai_guid: "hsai_guid5",
      hsai_user_to_profile_mappings: [
        {
          hsai_user_profile: {
            email: "user5@domain.com",
            first_name: "FirstName5",
            phone: "Phone5",
            profile_id: "profile_id5",
            last_name: "LastName5",
            practice_name: "PracticeName5",
          },
        },
      ],
    },
  },
  {
    site_id: "site_6",
    site_name: "Site Name 6",
    site_alias: "Alias6",
    site_address: "Address6",
    site_country: "Andorra",
    site_city: "City6",
    site_state: "State6",
    hsai_site_to_system_mappings: [
      {
        hsai_system: {
          system_guid: "system_guid_3",
          system_full_name: "System Full Name3",
          system_alias: "SFA3",
        },
      },
    ],
    hsai_user: {
      user: "user6@domain.com",
      hsai_guid: "hsai_guid6",
      hsai_user_to_profile_mappings: [
        {
          hsai_user_profile: {
            email: "user6@domain.com",
            first_name: "FirstName6",
            phone: "Phone6",
            profile_id: "profile_id6",
            last_name: "LastName6",
            practice_name: "PracticeName6",
          },
        },
      ],
    },
  },
  {
    site_id: "site_7",
    site_name: "Site Name 7",
    site_alias: "Alias7",
    site_address: "Address7",
    site_country: "Afghanistan",
    site_city: "City7",
    site_state: "State7",
    hsai_site_to_system_mappings: [
      {
        hsai_system: {
          system_guid: "system_guid_3",
          system_full_name: "System Full Name3",
          system_alias: "SFA3",
        },
      },
    ],
    hsai_user: {
      user: "user7@domain.com",
      hsai_guid: "hsai_guid7",
      hsai_user_to_profile_mappings: [
        {
          hsai_user_profile: {
            email: "user7@domain.com",
            first_name: "FirstName7",
            phone: "Phone7",
            profile_id: "profile_id7",
            last_name: "LastName7",
            practice_name: "PracticeName7",
          },
        },
      ],
    },
  },
  {
    site_id: "site_8",
    site_name: "Site Name 8",
    site_alias: "Alias8",
    site_address: "Address8",
    site_country: "Pakistan",
    site_city: "City8",
    site_state: "State8",
    hsai_site_to_system_mappings: [
      {
        hsai_system: {
          system_guid: "system_guid_1",
          system_full_name: "System Full Name1",
          system_alias: "SFA1",
        },
      },
    ],
    hsai_user: {
      user: "user8@domain.com",
      hsai_guid: "hsai_guid8",
      hsai_user_to_profile_mappings: [
        {
          hsai_user_profile: {
            email: "user8@domain.com",
            first_name: "FirstName8",
            phone: "Phone8",
            profile_id: "profile_id8",
            last_name: "LastName8",
            practice_name: "PracticeName8",
          },
        },
      ],
    },
  },

  {
    site_id: "site_9",
    site_name: "Site Name 9",
    site_alias: "Alias9",
    site_address: "Address9",
    site_country: null,
    site_city: null,
    site_state: null,
    hsai_site_to_system_mappings: [
      {
        hsai_system: {
          system_guid: "system_guid_5",
          system_full_name: "System Full Name5",
          system_alias: "SFA5",
        },
      },
    ],
    hsai_user: {
      user: "user9@domain.com",
      hsai_guid: "hsai_guid9",
      hsai_user_to_profile_mappings: [
        {
          hsai_user_profile: {
            email: "user9@domain.com",
            first_name: "FirstName9",
            phone: "Phone9",
            profile_id: "profile_id9",
            last_name: "LastName9",
            practice_name: "PracticeName9",
          },
        },
      ],
    },
  },
  {
    site_id: "site_10",
    site_name: "Site Name 10",
    site_alias: "Alias10",
    site_address: "Address10",
    site_country: null,
    site_city: null,
    site_state: null,
    hsai_site_to_system_mappings: [
      {
        hsai_system: {
          system_guid: "system_guid_6",
          system_full_name: "System Full Name6",
          system_alias: "SFA6",
        },
      },
    ],
    hsai_user: {
      user: "user10@domain.com",
      hsai_guid: "hsai_guid10",
      hsai_user_to_profile_mappings: [
        {
          hsai_user_profile: {
            email: "user10@domain.com",
            first_name: "FirstName10",
            phone: "Phone10",
            profile_id: "profile_id10",
            last_name: "LastName10",
            practice_name: "PracticeName10",
          },
        },
      ],
    },
  },
];

export default mockSites;
