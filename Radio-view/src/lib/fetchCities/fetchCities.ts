import { AxiosClient } from "@/hooks/axios";
import { AxiosError } from "axios";

const fetchCities = async (
  country: string,
  state: string,
  axios: AxiosClient
): Promise<Array<string>> => {
  try {
    const res = await axios.get({ path: `/cities?country=${country}&state=${state}` });
    const data = await res.data;
    if (data.length === 0) {
      throw new Error("No cities found for the given country and state.");
    }
    return data;
  } catch (error) {
    let errorMsg: string = "An error occurred while fetching cities.";
    if (error instanceof AxiosError) {
      if (error.response?.data) {
        errorMsg = error.response.data.error;
      }
    } else if (error instanceof Error) {
      errorMsg = error.message;
    }
    throw new Error(errorMsg);
  }
};

export default fetchCities;
