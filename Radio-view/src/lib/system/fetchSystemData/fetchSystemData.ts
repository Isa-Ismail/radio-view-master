import { AxiosClient } from "@/hooks/axios";
import { HsaiUser } from "@/models/hsai_user";
import { HsaiSystem, SystemAdmin } from "@/models/system";
import { SystemFilterProps } from "@/store/system/systemSlice";
import { StoreReturnType } from "@/utils/typedef";

export default async function fetchSystemData({
  token,
  offset,
  limit,
  filter,
  axios,
}: {
  token: string;
  offset: number;
  limit: number;
  filter: SystemFilterProps | undefined;
  axios: AxiosClient;
}): Promise<
  StoreReturnType<{
    total: number;
    data: SystemAdmin[];
  }>
> {
  const query = new URLSearchParams({ limit: `${limit}`, offset: `${offset}` });
  if (filter) {
    if (filter.email) {
      query.append("email", filter.email);
    }
    if (filter.name) {
      query.append("name", filter.name);
    }
  }

  const res = await axios.get({
    path: `/data/system?${query}`,

    headers: AxiosClient.getAuthHeaders({
      token: token,
    }),
  });

  const parsedData = AxiosClient.parseResponseForStore<{
    total: number;
    data: SystemAdmin[];
  }>({
    res: res,
    parseData: async (data) => {
      let { hsai_users, count } = data;

      const users = (hsai_users as any[]).map((user) => {
        const userProfile = user.hsai_user_to_profile_mappings[0].hsai_user_profile;
        return new SystemAdmin({
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
      });
      return {
        data: users,
        total: count,
      };
    },
  });
  return parsedData;
}
