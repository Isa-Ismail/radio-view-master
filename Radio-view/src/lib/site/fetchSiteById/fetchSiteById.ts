import { AxiosClient } from "@/hooks/axios";
import { HsaiUser } from "@/models/hsai_user";
import { SiteAdmin } from "@/models/site";
import { HsaiSystem } from "@/models/system";
import { StoreReturnType } from "@/utils/typedef";

export default async function fetchSiteById({
  token,
  siteId,
  axios,
}: {
  token: string;
  siteId: string;
  axios: AxiosClient;
}): Promise<StoreReturnType<SiteAdmin>> {
  const res = await axios.get({
    path: `/data/site/${siteId}`,

    headers: AxiosClient.getAuthHeaders({
      token: token,
    }),
  });

  const parsedData = await AxiosClient.parseResponseForStore({
    res,
    parseData: async (data) => {
      let { hsai_sites } = data;
      const userProfile = hsai_sites.hsai_user.hsai_user_to_profile_mappings[0].hsai_user_profile;
      const hsaiUser = HsaiUser.fromJson(userProfile);

      const site = new SiteAdmin({
        hsaiGuid: hsai_sites.hsai_user.hsai_guid,
        hsaiUser: hsaiUser,
        siteAddress: hsai_sites.site_address,
        siteAlias: hsai_sites.site_alias,
        siteContact: hsai_sites.site_contact,
        siteId: hsai_sites.site_id,
        siteName: hsai_sites.site_name,
        city: hsai_sites.site_city,
        country: hsai_sites.site_country,
        state: hsai_sites.site_state,
        systems: hsai_sites.hsai_site_to_system_mappings.map(
          (system: any) =>
            new HsaiSystem({
              systemAlias: system.hsai_system.system_alias,
              systemGuid: system.hsai_system.system_guid,
              sytemFullName: system.hsai_system.system_full_name,
            })
        ),
      });
      return site;
    },
  });
  return parsedData;
}
