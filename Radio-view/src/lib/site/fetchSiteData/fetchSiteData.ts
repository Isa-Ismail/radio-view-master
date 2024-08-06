import { AxiosClient } from "@/hooks/axios";
import { HsaiUser } from "@/models/hsai_user";
import { SiteAdmin } from "@/models/site";
import { HsaiSystem } from "@/models/system";
import { SitesFilterProps } from "@/store/site/siteSlice";
import { StoreReturnType } from "@/utils/typedef";

export default async function fetchSiteData({
  token,
  offset,
  limit,
  systemId,
  filter,
  axios,
}: {
  token: string;
  offset: number;
  limit: number;
  systemId?: string | undefined;
  filter?: SitesFilterProps | undefined;
  axios: AxiosClient;
}): Promise<StoreReturnType<{ total: number; data: SiteAdmin[] }>> {
  let url = `/data/site?offset=${offset}&limit=${limit}`;
  if (systemId) {
    url += `&system_id=${systemId}`;
  }
  if (filter) {
    if (filter.name) {
      url += `&name=${filter.name}`;
    }
    if (filter.alias) {
      url += `&alias=${filter.alias}`;
    }
    if (filter.system) {
      url += `&system_id=${filter.system?.id}`;
    }
    if (filter.email) {
      url += `&email=${filter.email}`;
    }
  }
  const res = await axios.get({
    path: url,

    headers: AxiosClient.getAuthHeaders({
      token: token,
    }),
  });
  const parsedData = await AxiosClient.parseResponseForStore({
    res,
    parseData: async (data) => {
      let { hsai_sites, count } = data;

      const users = (hsai_sites as any[]).map((user) => {
        // const userProfile = user.hsai_user_to_profile_mappings[0].hsai_user_profile;
        const userProfile = user.hsai_user.hsai_user_to_profile_mappings[0].hsai_user_profile;
        const hsaiUser = HsaiUser.fromJson(userProfile);
        return new SiteAdmin({
          hsaiGuid: user.hsai_user.hsai_guid,
          hsaiUser: hsaiUser,
          siteAddress: user.site_address,
          siteAlias: user.site_alias,
          siteContact: user.site_contact,
          siteId: user.site_id,
          siteName: user.site_name,
          city: user.site_city,
          country: user.site_country,
          state: user.site_state,
          systems: user.hsai_site_to_system_mappings.map(
            (system: any) =>
              new HsaiSystem({
                systemAlias: system.hsai_system.system_alias,
                systemGuid: system.hsai_system.system_guid,
                sytemFullName: system.hsai_system.system_full_name,
              })
          ),
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
