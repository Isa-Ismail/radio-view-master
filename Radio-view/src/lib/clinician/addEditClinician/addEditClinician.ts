import { AddEditClinicianFormType } from "@/app/clinicians/components/form";
import { AxiosClient, AxiosResponse } from "@/hooks/axios";
import getAccessToken from "@/utils/get_acess_token";
import { StoreReturnType } from "@/utils/typedef";
import dayjs from "dayjs";

export default async function addEditClinician({
  clinicianData,
  axios,
}: {
  clinicianData: AddEditClinicianFormType;
  axios: AxiosClient;
}): Promise<StoreReturnType<string>> {
  const { data: tokenData, error: tokenError } = await getAccessToken({});
  let token: string = "";

  if (tokenData) {
    token = tokenData.token;
  } else {
    axios.logout();
    return {
      error: {
        status: 401,
        statusText: "Unauthorized",
        data: tokenError,
      },
    };
  }
  let practiceName = clinicianData.practice_name;
  let practiceAddress = clinicianData.practice_address;
  if (!practiceName || practiceName === "") {
    practiceName = clinicianData.first_name;
  }
  if (!practiceAddress || practiceAddress === "") {
    practiceAddress = "NOT PROVIDED";
  }

  let data: AddEditClinicianFormType = clinicianData;
  data.phone = data.phone?.trim().replace(/\s/g, "");
  const dob = dayjs(data.date_of_birth);
  let json = {
    first_name: data.first_name,
    last_name: data.last_name,
    practice_name: practiceName,
    phone: data.phone,
    date_of_birth: dob.format("YYYY-MM-DD"),
    practice_address: practiceAddress,
    email: data.email,
    gender: data.gender,
    sites_id: data.site_ids?.map((e) => e.id),
    systems_id: data.system_ids?.map((e) => e.id),

    profile_id: data.profile_id,
    hsai_guid: data.hsai_guid,
  };
  let res: AxiosResponse;
  if (data.hsai_guid) {
    res = await axios.put({
      path: "/data/clinician",
      data: JSON.stringify(json),
      headers: AxiosClient.getAuthHeaders({ token }),
    });
  } else {
    res = await axios.post({
      path: "/data/clinician",
      data: JSON.stringify({
        ...json,
        site_id: json.sites_id,
        system_id: json.systems_id,
      }),
      headers: AxiosClient.getAuthHeaders({ token }),
    });
  }

  if (
    (data.system_changed && data.deleted_systems && data.deleted_systems.length > 0) ||
    (data.site_changed && data.deleted_sites && data.deleted_sites.length > 0)
  ) {
    const json = {
      hsai_guid: data?.hsai_guid,

      profile_id: data?.profile_id,
      email: data?.email,
      type: "edit",
      systems_id: data.deleted_systems,
      sites_id: data.deleted_sites,
    };
    const res = await axios.delete({
      path: "/data/clinician",

      data: JSON.stringify(json),
      headers: AxiosClient.getAuthHeaders({ token }),
    });

    if (!res.ok) {
      return {
        error: {
          status: 400,
          statusText: "Clinician not updated",
          data: "Clinician not updated",
        },
      };
    }
  }

  return AxiosClient.parseResponseForStore({
    res,
    parseData: async (_) => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return data.hsai_guid ? "Clinician updated successfully" : "Clinician added successfully";
    },
  });
}
