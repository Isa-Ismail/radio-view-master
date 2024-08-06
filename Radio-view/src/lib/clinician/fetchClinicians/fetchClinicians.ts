import { AxiosClient } from "@/hooks/axios";
import { Clinician } from "@/models/clinician";
import { Site } from "@/models/site";
import { HsaiSystem } from "@/models/system";
import { ClinicianFilterProps } from "@/store/clinician/clinicianSlice";
import { StoreReturnType } from "@/utils/typedef";

export default async function fetchClinician({
  token,
  offset,
  limit,
  systemId,
  siteId,
  filter,
  axios,
}: {
  token: string;
  offset: number;
  limit: number;
  systemId?: string | undefined;
  siteId?: string | undefined;
  filter?: ClinicianFilterProps | undefined;
  axios: AxiosClient;
}): Promise<
  StoreReturnType<{
    data: Clinician[];
    total: number;
  }>
> {
  let url = `/data/clinician?offset=${offset}&limit=${limit}`;
  let system_id = systemId ?? filter?.systemId?.id;
  let site_id = siteId ?? filter?.siteId?.id;
  if (system_id) {
    url += `&system_id=${system_id}`;
  }
  if (site_id) {
    url += `&site_id=${site_id}`;
  }
  if (filter) {
    if (filter.email) {
      url += `&email=${filter.email}`;
    }
    if (filter.name) {
      url += `&name=${filter.name}`;
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
      let { hsai_users, count } = data;
      const users = (hsai_users as any[]).map((user) => {
        const userProfile = user.hsai_user_to_profile_mappings[0].hsai_user_profile;

        return new Clinician({
          hsaiGuid: user.hsai_guid,
          email: user.user,
          dob: userProfile.date_of_birth,
          firstName: userProfile.first_name,
          lastName: userProfile.last_name,
          phoneNumber: userProfile.phone,
          practiceAddress: userProfile.practice_address,
          practiceName: userProfile.practice_name,
          id: userProfile.profile_id,
          gender: userProfile.gender,
          profileType: userProfile.profile_type,
          siteIds: user.hsai_site_to_user_mappings.map(
            (e: any) =>
              new Site({
                alias: e.hsai_site.site_alias,
                id: e.hsai_site.site_id,
                name: e.hsai_site.site_name,
                system: e.hsai_site.hsai_site_to_system_mappings[0].hsai_system.system_full_name,
              })
          ),
          systemIds: user.hsai_system_user_mappings.map(
            (e: any) =>
              new HsaiSystem({
                systemAlias: e.hsai_system.system_alias,
                systemGuid: e.hsai_system.system_guid,
                sytemAddress: e.hsai_system.system_address,
                sytemFullName: e.hsai_system.system_full_name,
              })
          ),
        });
      });

      return { data: users, total: count as number };
    },
  });
  return parsedData;
}
