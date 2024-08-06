import { AxiosClient } from "@/hooks/axios";
import getAccessToken from "@/utils/get_acess_token";
import { StoreReturnType } from "@/utils/typedef";

export default async function deleteFunction({
  data,
  axios,
}: {
  data: {
    hsai_guid: string;
    profile_id: string;
    email: string;
  }[];
  axios: AxiosClient;
}): Promise<StoreReturnType<string[]>> {
  if (data === undefined)
    return {
      error: {
        status: 400,
        statusText: "Bad Request",
        data: "Clinician not found",
      },
    };
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
    const json = {
      hsai_guid: item.hsai_guid,
      profile_id: item.profile_id,
      email: item.email,
      type: "delete",
      systems_id: [],
      sites_id: [],
    };

    const res = await axios.delete({
      path: "/data/clinician",
      data: JSON.stringify(json),
      headers: AxiosClient.getAuthHeaders({ token }),
    });

    const { data: response, error } = await AxiosClient.parseResponseForStore({
      res,
      parseData: async (_) => item.hsai_guid,
    });
    if (response) {
      deleted.push(response);
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
