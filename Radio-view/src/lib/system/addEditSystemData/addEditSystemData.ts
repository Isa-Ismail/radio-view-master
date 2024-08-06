import { AddEditSystemFormType } from "@/app/systems/components/add_edit_form";
import { AxiosClient, AxiosResponse } from "@/hooks/axios";
import getAccessToken from "@/utils/get_acess_token";
import { StoreReturnType } from "@/utils/typedef";

export default async function addEditSystemData({
  systemData,
  axios,
}: {
  systemData: AddEditSystemFormType;
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
  let res: AxiosResponse;
  let data: AddEditSystemFormType = systemData;
  data.contact_phone = data.contact_phone?.trim().replace(/\s/g, "");

  if (data.profile_id) {
    res = await axios.put({
      path: "/data/system",

      data: JSON.stringify({
        system_id: data.system_id,
        profile_id: data.profile_id,
        system_name: data.name,
        system_alias: data.alias,
        name: data.contact_name,
        phone: data.contact_phone,
      }),
      headers: AxiosClient.getAuthHeaders({ token }),
    });
  } else {
    res = await axios.post({
      path: "/data/system",

      data: JSON.stringify({
        system_name: data.name,
        system_alias: data.alias,
        name: data.contact_name,
        username: data.contact_username,
        phone: data.contact_phone,
        email: data.contact_email,
      }),
      headers: AxiosClient.getAuthHeaders({ token }),
    });
  }

  const parsedData = await AxiosClient.parseResponseForStore({
    res,
    parseData: async (_) => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return data.profile_id ? "System updated successfully" : "System added successfully";
    },
  });
  return parsedData;
}
