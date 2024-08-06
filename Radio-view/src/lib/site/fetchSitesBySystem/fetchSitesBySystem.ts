import { AxiosClient } from "@/hooks/axios";
import { Site } from "@/models/site";
import { StoreReturnType } from "@/utils/typedef";

export default async function fetchSitesBySystem({
  token,
  systemIds,
  axios,
}: {
  token: string;
  systemIds?: string[] | undefined;
  axios: AxiosClient;
}): Promise<StoreReturnType<Site[]>> {
  if (!systemIds || systemIds.length === 0) {
    return { data: [] };
  }
  const res = await axios.get({
    path: `/data/site?system_ids=${systemIds?.join(",")}`,

    headers: AxiosClient.getAuthHeaders({
      token: token,
    }),
  });
  const parsedData = await AxiosClient.parseResponseForStore({
    res,
    parseData: async (data) => {
      let { hsai_sites } = data;
      const _sites: Site[] = [];
      for (const site of hsai_sites) {
        const system = site.system;
        const _site = site.sites.map(
          (s: any) =>
            new Site({
              id: s.site_id,
              name: s.site_name,
              system: system,
              alias: s.site_alias,
            })
        );
        _sites.push(..._site);
      }
      return _sites;
    },
  });
  return parsedData;
}
