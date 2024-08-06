import { AxiosClient } from "@/hooks/axios";
import { DashboardData } from "@/store/dashboard/dashboardSlice";
import { StoreReturnType } from "@/utils/typedef";

export async function fetchDashboardData({
  token,
  axios,
}: {
  token: string;
  axios: AxiosClient;
}): Promise<StoreReturnType<DashboardData>> {
  const res = await axios.get({
    path: "/data/dashboard",
    headers: AxiosClient.getAuthHeaders({
      token: token,
    }),
  });
  const parsedData = AxiosClient.parseResponseForStore({
    res: res,
    parseData: async (data) => {
      const { clinician, site_admin, system_admin, study, patient } = data.data;

      return {
        clincians: clinician,
        sites: site_admin,
        studies: study,
        systems: system_admin,
        patients: patient,
      } as DashboardData;
    },
  });
  return parsedData;
}
