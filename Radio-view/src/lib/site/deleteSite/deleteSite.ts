import { AxiosClient } from "@/hooks/axios";
import getAccessToken from "@/utils/get_acess_token";
import { StoreReturnType } from "@/utils/typedef";

export default async function deleteSite({
  data,
  axios,
}: {
  data: {
    hsaiGuid: string;
    siteId: string;
    profile_id: string;
    email: string;
    systems: string[];
  }[];
  axios: AxiosClient;
}): Promise<StoreReturnType<string[]>> {
  if (!data) {
    return {
      error: {
        status: 400,
        statusText: "Bad Request",
        data: "Invalid site",
      },
    };
  }

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
  let deleted: string[] = [];
  let errorObject: { status: number; statusText: string; data: string } | undefined;
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    const res = await axios.delete({
      path: "/data/site",
      data: JSON.stringify({
        hsai_guid: item.hsaiGuid,
        site_id: item.siteId,
        profile_id: item.profile_id,
        email: item.email,
        type: "delete",
        system_id: item.systems,
      }),
      headers: AxiosClient.getAuthHeaders({ token }),
    });

    const { data: responseData, error } = await AxiosClient.parseResponseForStore({
      res,
      parseData: async (_) => {
        return item.hsaiGuid;
      },
    });
    if (responseData) {
      deleted.push(responseData);
    } else {
      errorObject = error;
    }
  }
  if (!errorObject) {
    return {
      data: deleted,
    };
  } else {
    return { error: errorObject };
  }
}
