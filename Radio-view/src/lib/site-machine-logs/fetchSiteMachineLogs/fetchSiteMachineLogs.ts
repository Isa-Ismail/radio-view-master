import { AxiosClient } from "@/hooks/axios";
import { SiteMachineLog, SiteMachineLogFilter } from "@/store/site-machine-logs/slice";
import { StoreReturnType } from "@/utils/typedef";

export default async function fetchSiteMachineLogs({
  token,
  axios,
  filter,
}: {
  token: string;
  axios: AxiosClient;
  filter?: SiteMachineLogFilter;
}): Promise<StoreReturnType<SiteMachineLog[]>> {
  const query = new URLSearchParams();
  if (filter?.siteName) {
    query.append("site_name", filter!.siteName!);
  }
  if (filter?.dateRange) {
    query.append("start_date", filter!.dateRange![0]!.toISOString());
    query.append("end_date", filter!.dateRange![1]!.toISOString());
  }

  const res = await axios.get({
    path: `/data/site-machine-logs?${query.toString()}`,
    headers: AxiosClient.getAuthHeaders({ token }),
  });
  return AxiosClient.parseResponseForStore({
    res,
    parseData(data) {
      const { logs } = data;
      return logs;
    },
  });
}
