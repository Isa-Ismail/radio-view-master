import { AxiosClient } from "@/hooks/axios";
import { HsaiSystem } from "@/models/system";
import { StoreReturnType } from "@/utils/typedef";

export default async function fetchSystemsForFilter({
  token,
  axios,
}: {
  token: string;
  axios: AxiosClient;
}): Promise<StoreReturnType<HsaiSystem[]>> {
  const res = await axios.get({
    path: `/data/system?all=true`,

    headers: AxiosClient.getAuthHeaders({
      token: token,
    }),
  });

  return AxiosClient.parseResponseForStore({
    res,
    parseData: async (data) => {
      let { hsai_systems } = data;

      return (hsai_systems as any[]).map((system) => {
        return new HsaiSystem({
          systemAlias: system.system_alias,
          systemGuid: system.system_guid,
          sytemAddress: system.system_address,
          sytemFullName: system.system_full_name,
        });
      });
    },
  });
}
