import { http, HttpResponse } from "msw";
import mockClinicians from "./clinicians";
import mockSites from "./sites";
import mockStudies from "./studies";
import dummySystems from "./systems";
export const handlers = [
  http.get("http://localhost/api/cities", () => {
    return HttpResponse.json(["city1", "city2"]);
  }),
  http.get("http://localhost/api/states", () => {
    return HttpResponse.json(["state1", "state2"]);
  }),
  http.get("http://localhost/api/data/activities", ({ request }) => {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const api_call = searchParams.get("api_call");
    const api_status = searchParams.get("api_status");
    const email = searchParams.get("email");

    let data = [
      {
        user_id: "8ebc8a5a-28b4-4ea4-a64e-9c190d8f1703",
        email: "superadmin@aineurocare.com",
        date: "2024-04-15",
        time: "06:28:02",
        status: "success",
        api_call: "login",
        description: "Login successfully",
      },
      {
        user_id: "8ebc8a5a-28b4-4ea4-a64e-9c190d8f1703",
        email: "superadmin@aineurocare.com",
        date: "2024-04-15",
        time: "06:28:02",
        status: "success",
        api_call: "login",
        description: "Login successfully",
      },
      {
        user_id: "8ebc8a5a-28b4-4ea4-a64e-9c190d8f1703",
        email: "superadmin@aineurocare.com",
        date: "2024-04-16",
        time: "08:17:24",
        status: "success",
        api_call: "site-admin",
        description: "Site admin created successfully",
        api_action: "create",
      },
      {
        user_id: "8ebc8a5a-28b4-4ea4-a64e-9c190d8f1703",
        email: "superadmin@aineurocare.com",
        date: "2024-04-16",
        time: "08:08:57",
        status: "success",
        api_call: "clinician",
        description: "Clinician Deleted successfully",
        api_action: "delete",
      },
    ];
    if (api_call) {
      data = data.filter((activity) => activity.api_call === api_call);
    }
    if (api_status) {
      data = data.filter((activity) => activity.status === api_status);
    }
    if (email) {
      data = data.filter((activity) => activity.email === email);
    }
    return HttpResponse.json({ data });
  }),
  http.get("http://localhost/api/data/site-machine-logs", ({ request }) => {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const site_name = searchParams.get("site_name");

    let data: {
      site_id: string;
      site_name: string;
      site_alias: string;
      site_address: string;
      site_contact: string;
      last_study: {
        study_date: string;
        study_time: string;
        patient_name: string;
      };
      service_logs: { timestamp: string }[];
    }[] = [
      {
        site_id: "1",
        site_name: "site2",
        site_alias: "main2",
        site_address: "123 Oak St",
        site_contact: "John Doe",
        last_study: {
          study_date: "2024-04-16",
          study_time: "14:30:00",
          patient_name: "John Smith",
        },
        service_logs: [{ timestamp: "2024-04-16" }, { timestamp: "2024-04-16" }],
      },
      {
        site_id: "2",
        site_name: "site3",
        site_alias: "main3",
        site_address: "456 Pine Ave",
        site_contact: "Jane Smith",
        last_study: {
          study_date: "2024-04-17",
          study_time: "09:15:00",
          patient_name: "Emily Johnson",
        },
        service_logs: [{ timestamp: "2024-04-17" }, { timestamp: "2024-04-17" }],
      },
      {
        site_id: "3",
        site_name: "site4",
        site_alias: "main4",
        site_address: "789 Maple Blvd",
        site_contact: "Alice Brown",
        last_study: {
          study_date: "2024-04-10",
          study_time: "08:45:00",
          patient_name: "Michael Lee",
        },
        service_logs: [{ timestamp: "2024-04-10" }, { timestamp: "2024-04-11" }],
      },
      {
        site_id: "4",
        site_name: "site5",
        site_alias: "main5",
        site_address: "101 Elm St",
        site_contact: "Robert Jones",
        last_study: {
          study_date: "2024-04-12",
          study_time: "16:30:00",
          patient_name: "Lisa White",
        },
        service_logs: [{ timestamp: "2024-04-12" }, { timestamp: "2024-04-13" }],
      },
      {
        site_id: "5",
        site_name: "site6",
        site_alias: "main6",
        site_address: "202 Birch Rd",
        site_contact: "Mary Davis",
        last_study: {
          study_date: "2024-04-14",
          study_time: "13:20:00",
          patient_name: "James Wilson",
        },
        service_logs: [{ timestamp: "2024-04-14" }, { timestamp: "2024-04-14" }],
      },
      {
        site_id: "6",
        site_name: "site7",
        site_alias: "main7",
        site_address: "303 Cedar Ln",
        site_contact: "William Martinez",
        last_study: {
          study_date: "2024-04-18",
          study_time: "10:10:00",
          patient_name: "Sophia Anderson",
        },
        service_logs: [{ timestamp: "2024-04-18" }, { timestamp: "2024-04-19" }],
      },
      {
        site_id: "7",
        site_name: "site8",
        site_alias: "main8",
        site_address: "404 Oak Park Dr",
        site_contact: "Charles Taylor",
        last_study: {
          study_date: "2024-04-09",
          study_time: "11:55:00",
          patient_name: "Elizabeth Moore",
        },
        service_logs: [{ timestamp: "2024-04-09" }, { timestamp: "2024-04-09" }],
      },
      {
        site_id: "8",
        site_name: "site9",
        site_alias: "main9",
        site_address: "505 Pine Circle",
        site_contact: "Patricia Thomas",
        last_study: {
          study_date: "2024-04-13",
          study_time: "12:40:00",
          patient_name: "Joseph Jackson",
        },
        service_logs: [{ timestamp: "2024-04-13" }, { timestamp: "2024-04-13" }],
      },
      {
        site_id: "9",
        site_name: "site10",
        site_alias: "main10",
        site_address: "606 Maple Pl",
        site_contact: "Barbara Harris",
        last_study: {
          study_date: "2024-04-11",
          study_time: "15:25:00",
          patient_name: "Christopher Garcia",
        },
        service_logs: [{ timestamp: "2024-04-11" }, { timestamp: "2024-04-11" }],
      },
      {
        site_id: "10",
        site_name: "site11",
        site_alias: "main11",
        site_address: "707 Maple Ave",
        site_contact: "Jennifer Martin",
        last_study: {
          study_date: "2024-04-08",
          study_time: "17:00:00",
          patient_name: "Dorothy Robinson",
        },
        service_logs: [{ timestamp: "2024-04-08" }, { timestamp: "2024-04-08" }],
      },
    ];

    if (site_name) {
      data = data.filter((site) => site_name.includes(site.site_name));
    }
    return HttpResponse.json({ logs: data });
  }),
  http.get("http://localhost/api/data/dashboard", ({ request }) => {
    let data = {
      clinician: 10,
      site_admin: 20,
      system_admin: 5,
      study: 30,
      patient: 40,
    };
    return HttpResponse.json({ data });
  }),
  http.get("http://localhost/api/data/dashboard/graph", ({ request }) => {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    let year = searchParams.get("year");
    const months_name = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const data: {
      [key: number]: {
        months_name: string[];
        months_data: number[];
      };
    } = {
      2024: {
        months_name,
        months_data: [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      },

      2023: {
        months_name,
        months_data: [1, 23, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      },
    };

    if (year === undefined || year === null) {
      year = "2024";
    }
    return HttpResponse.json(data[Number(year)]);
  }),
  http.get("http://localhost/api/data/system/:id", ({ params }) => {
    const systems = dummySystems;
    const { id } = params;

    const system = systems.find((system) => system.hsai_guid === id);
    if (system) {
      return HttpResponse.json({
        hsai_users: [system],
      });
    } else {
      return HttpResponse.json({
        error: {
          status: 404,
          statusText: "Not Found",
          data: "System not found",
        },
      });
    }
  }),
  http.get("http://localhost/api/data/system", ({ request }) => {
    let systems = dummySystems;
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const all = searchParams.get("all");
    const limit = searchParams.get("limit");
    if (all) {
      return HttpResponse.json({ hsai_systems: systems });
    }
    systems = systems.slice(0, Number(limit));
    return HttpResponse.json({ hsai_users: systems, count: dummySystems.length });
  }),
  http.post("http://localhost/api/data/system", async () => {
    return HttpResponse.json({ data: "System added successfully" });
  }),
  http.put("http://localhost/api/data/system", async () => {
    return HttpResponse.json({ data: "System updated successfully" });
  }),
  http.delete("http://localhost/api/data/system", async () => {
    return HttpResponse.json({ data: "System deleted successfully" });
  }),
  http.post("http://localhost/api/data/site", () => {
    return HttpResponse.json({
      data: "Site added successfully",
    });
  }),
  http.put("http://localhost/api/data/site", () => {
    return HttpResponse.json({
      data: "Site updated successfully",
    });
  }),
  http.delete("http://localhost/api/data/site", () => {
    return HttpResponse.json({
      data: "Site deleted successfully",
    });
  }),
  http.get("http://localhost/api/data/site/:id", ({ params }) => {
    const sites = mockSites;
    const { id } = params;
    const site = sites.find((site) => site.site_id === id);
    if (site) {
      return HttpResponse.json({ hsai_sites: site });
    } else {
      return HttpResponse.json({
        error: {
          status: 404,
          statusText: "Not Found",
          data: "Site not found",
        },
      });
    }
  }),
  http.get("http://localhost/api/data/site", ({ request }) => {
    let sites = mockSites;
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const system_ids = searchParams.get("system_ids");
    const limit = searchParams.get("limit");
    if (system_ids) {
      sites = sites.filter((site) =>
        system_ids.includes(site.hsai_site_to_system_mappings[0].hsai_system.system_guid)
      );
      return HttpResponse.json({
        hsai_sites: sites.map((site) => site.hsai_site_to_system_mappings),
      });
    } else {
      sites = sites.slice(0, Number(limit));
    }
    return HttpResponse.json({ hsai_sites: sites, count: mockSites.length });
  }),
  http.get("http://localhost/api/data/studies", () => {
    return HttpResponse.json({
      studies: mockStudies,
      count: mockStudies.length,
    });
  }),

  http.get("http://localhost/api/data/clinician", ({ request }) => {
    const url = new URL(request.url);
    const searchParams = url.searchParams;

    const limit = searchParams.get("limit");

    let clinicians = mockClinicians;
    if (limit) {
      clinicians = clinicians.slice(0, Number(limit));
    }

    return HttpResponse.json({
      hsai_users: clinicians,
      count: mockClinicians.length,
    });
  }),
  http.get("http://localhost/api/data/clinician/:id", ({ params }) => {
    const { id } = params;
    let clinicians = mockClinicians;

    return HttpResponse.json({
      hsai_users: clinicians.find((clinician) => clinician.hsai_guid === id),
    });
  }),
  http.post("http://localhost/api/data/clinician", ({ request }) => {
    return HttpResponse.json({ data: "Clinician successfully added" });
  }),
  http.put("http://localhost/api/data/clinician", ({ request }) => {
    return HttpResponse.json({ data: "Clinician successfully updated" });
  }),
  http.delete("http://localhost/api/data/clinician", ({ request }) => {
    return HttpResponse.json({ data: "Clinician successfully deleted" });
  }),
];
