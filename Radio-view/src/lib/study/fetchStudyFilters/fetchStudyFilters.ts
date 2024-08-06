import { AxiosClient } from "@/hooks/axios";
import { StudyFilter } from "@/models/study";
import { StoreReturnType } from "@/utils/typedef";

export default async function fetchStudyFilters({
  token,
  axios,
}: {
  token: string;
  axios: AxiosClient;
}): Promise<StoreReturnType<StudyFilter>> {
  const query = new URLSearchParams();

  const res = await axios.get({
    path: `/data/study-filter?${query}`,

    headers: AxiosClient.getAuthHeaders({ token }),
  });
  const parsedData = await AxiosClient.parseResponseForStore({
    res,
    parseData: async (resData) => {
      return new StudyFilter({
        modalities: resData.modalities,
        body_part: resData.body_part,
        protocool_name: resData.protocool_name,
      });
    },
  });
  return parsedData;
}
