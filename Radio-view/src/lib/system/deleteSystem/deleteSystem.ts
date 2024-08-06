import { AxiosClient } from "@/hooks/axios";
import getAccessToken from "@/utils/get_acess_token";
import { StoreReturnType } from "@/utils/typedef";

export default async function deleteSystem({
  data,
  axios,
}: {
  data: {
    hsaiGuid: string;
    systemGuid: string;
    profileId: string;
    email: string;
  }[];
  axios: AxiosClient;
}): Promise<StoreReturnType<string[]>> {
  if (data === undefined) {
    return {
      error: {
        status: 400,
        statusText: "Bad Request",
        data: "Invalid system",
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
      path: "/data/system",

      data: JSON.stringify({
        hsai_guid: item.hsaiGuid,
        system_guid: item?.systemGuid,
        profile_id: item?.profileId,
        email: item?.email,
      }),
      headers: AxiosClient.getAuthHeaders({ token }),
    });

    const { error } = await AxiosClient.parseResponseForStore({
      res,
      parseData: async (data) => {
        return data;
      },
    });
    if (error) {
      errorObject = error;
    } else {
      deleted.push(item.hsaiGuid);
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
