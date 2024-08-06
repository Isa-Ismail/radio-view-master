import { AxiosClient } from "@/hooks/axios";
import ActivitiesModel, {
  ActivitySource,
  ActivityStatus,
  AppActivityApiCall,
  WebActivityApiCall,
} from "@/models/activities";
import { StoreReturnType } from "@/utils/typedef";
import dayjs from "dayjs";

export default async function fetchActivities({
  source,
  status,
  webApiCall,
  appApiCall,
  token,
  dateRange,
  email,
  axios,
}: {
  source: ActivitySource;
  status?: ActivityStatus;

  webApiCall?: WebActivityApiCall;
  appApiCall?: AppActivityApiCall;
  token: string;
  dateRange?: dayjs.Dayjs[];
  email?: string;
  axios: AxiosClient;
}): Promise<StoreReturnType<ActivitiesModel[]>> {
  let url = `/data/activities?source=${source}`;
  if (source === ActivitySource.web && webApiCall) {
    url += `&api_call=${webApiCall}`;
  }
  if (source === ActivitySource.app && appApiCall) {
    url += `&api_call=${appApiCall}`;
  }

  if (status) {
    url += `&api_status=${status}`;
  }
  if (dateRange) {
    const startDate = dateRange[0].format("YYYY-MM-DD");
    const endDate = dateRange[1].format("YYYY-MM-DD");
    const startTime = dateRange[0].format("HH:mm:ss");
    const endTime = dateRange[1].format("HH:mm:ss");

    url += `&start_date=${startDate}&end_date=${endDate}&start_time=${startTime}&end_time=${endTime}`;
  }

  if (email) {
    url += `&email=${email}`;
  }

  const res = await axios.get({ path: url, headers: AxiosClient.getAuthHeaders({ token: token }) });
  const parsedRes = AxiosClient.parseResponseForStore({
    res,
    parseData: async (data) => {
      const { data: activities } = data;
      return activities.map((activity: any) => {
        return ActivitiesModel.fromJson(activity);
      });
    },
  });
  return parsedRes;
}
