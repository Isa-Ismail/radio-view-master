import { AxiosClient } from "@/hooks/axios";
import { HsaiUser } from "@/models/hsai_user";
import { HsaiSystem, SystemAdmin } from "@/models/system";
import { StoreReturnType } from "@/utils/typedef";

export default async function fetchSystemById({
  token,
  id,
  axios,
}: {
  token: string;
  id: string;
  axios: AxiosClient;
}): Promise<StoreReturnType<SystemAdmin>> {
  const res = await axios.get({
    path: `/data/system/${id}`,
    headers: AxiosClient.getAuthHeaders({
      token: token,
    }),
  });

  const parsedData = AxiosClient.parseResponseForStore({
    res,
    parseData: async (data) => {
      let { hsai_users } = data;

      const user = hsai_users[0];
      const userProfile = user.hsai_user_to_profile_mappings[0].hsai_user_profile;
      const systemAdmin = new SystemAdmin({
        hsaiGuid: user.hsai_guid,
        hsaiSystem: new HsaiSystem({
          systemAlias: user.hsai_system.system_alias,
          systemGuid: user.hsai_system.system_guid,
          sytemAddress: user.hsai_system.system_address,
          sytemFullName: user.hsai_system.system_full_name,
        }),

        hsaiUser: HsaiUser.fromJson(userProfile),
        user: user.user,
      });

      return systemAdmin;
    },
  });

  return parsedData;
}
