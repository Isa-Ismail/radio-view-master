import axios from "axios";
import AppConfig from "./config";

const authAxiosClient = axios.create({
  baseURL: AppConfig.authUrl,
});
const graphqlAxiosClient = axios.create({
  baseURL: AppConfig.graphqlUrl,
});

const loggerAxiosClient = axios.create({
  baseURL: AppConfig.loggerUrl,
});

export { authAxiosClient, graphqlAxiosClient, loggerAxiosClient };
