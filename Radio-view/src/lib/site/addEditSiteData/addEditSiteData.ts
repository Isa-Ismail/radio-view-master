import { AddEditSiteFormType } from "@/app/sites/components/form";
import { AxiosClient, AxiosResponse } from "@/hooks/axios";
import getAccessToken from "@/utils/get_acess_token";
import { StoreReturnType } from "@/utils/typedef";

export default async function addSiteData({
  siteData,
  axios,
}: {
  siteData: AddEditSiteFormType;
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
  let data: AddEditSiteFormType = siteData;
  data.contact_phone = data.contact_phone?.trim().replace(/\s/g, "");

  let json: {} = {
    site_id: data.site_id,
    profile_id: data.profile_id,
    site_name: data.name,
    site_alias: data.alias,
    site_address: data.address,
    name: data.contact_name,
    phone: data.contact_phone,
    username: data.contact_username,
    email: data.contact_email,
    system_id: data.system!.map((system) => {
      if (typeof system === "string") {
        return system;
      }
      return system.id;
    }),
    site_country: data.site_country?.label,
    site_state: data.site_state,
    site_city: data.site_city,
  };
  let res: AxiosResponse;
  if (data.site_id) {
    res = await axios.put({
      path: "/data/site",
      data: JSON.stringify(json),
      headers: AxiosClient.getAuthHeaders({ token }),
    });
  } else {
    res = await axios.post({
      path: "/data/site",
      data: JSON.stringify(json),
      headers: AxiosClient.getAuthHeaders({ token }),
    });
  }

  if (data.system_changed && data.deleted_systems && data.deleted_systems.length > 0) {
    const json = {
      hsai_guid: data?.hsaiGuid,
      site_id: data?.site_id,
      profile_id: data?.profile_id,
      email: data?.contact_email,
      type: "edit",
      system_id: data.deleted_systems,
    };
    await axios.delete({
      path: "/data/site",

      data: JSON.stringify(json),
      headers: AxiosClient.getAuthHeaders({ token }),
    });
  }

  const parsedData = await AxiosClient.parseResponseForStore({
    res,
    parseData: async (_) => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return data.site_id ? "Site updated successfully" : "Site added successfully";
    },
  });
  return parsedData;
}
