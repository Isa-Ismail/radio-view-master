import { AxiosClient } from "@/hooks/axios";
import { DashboardGraph } from "@/store/dashboard/dashboardSlice";
import { StoreReturnType } from "@/utils/typedef";

export async function fetchDashboardGraph({
  token,
  year,
  id,
  axios,
}: {
  token: string;
  year: number;
  id?: string;
  axios: AxiosClient;
}): Promise<StoreReturnType<DashboardGraph[]>> {
  const query = new URLSearchParams();
  if (id) {
    query.append("id", id);
  }
  if (year) {
    query.append("year", year.toString());
  }
  const res = await axios.get({
    path: `/data/dashboard/graph?${query}`,
    headers: AxiosClient.getAuthHeaders({
      token: token,
    }),
  });
  const parsedData = AxiosClient.parseResponseForStore({
    res: res,
    parseData: async (data) => {
      const { months_name, months_data } = data;
      return months_data.map((data: number, index: number) => {
        return {
          month_name: months_name[index],
          data: data,
        };
      });
    },
  });
  return parsedData;
}
