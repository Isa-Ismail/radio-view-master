import { AxiosClient } from "@/hooks/axios";
const mockAxios = new AxiosClient({
  defaultUrl: "/api",
  logout() {},
});

export default mockAxios;
