import { AxiosClient } from "@/hooks/axios";
import { Clinician } from "@/models/clinician";
import { Site } from "@/models/site";
import { HsaiSystem } from "@/models/system";
import { StoreReturnType } from "@/utils/typedef";

export default async function fetchClinicianById({
  id,
  token,
  axios,
}: {
  id: string;
  token: string;
  axios: AxiosClient;
}): Promise<StoreReturnType<Clinician>> {
  let url = `/data/clinician/${id}`;

  const res = await axios.get({
    path: url,

    headers: AxiosClient.getAuthHeaders({
      token: token,
    }),
  });
  const parsedData = await AxiosClient.parseResponseForStore({
    res,
    parseData: async (data) => {
      let { hsai_users: user } = await data;

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
              name: e.hsai_site.site_alias,
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
    },
  });
  return parsedData;
}
