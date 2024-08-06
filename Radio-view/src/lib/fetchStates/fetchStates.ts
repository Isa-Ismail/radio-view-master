import { AxiosClient } from "@/hooks/axios";
import { AxiosError } from "axios";

const fetchStates = async (country: string, axios: AxiosClient): Promise<Array<string>> => {
  try {
    const res = await axios.get({ path: `/states?country=${country}` });
    const data = await res.data;
    return data;
  } catch (error) {
    let errorMsg: string = "An error occurred while fetching states.";
    if (error instanceof AxiosError) {
      if (error.response?.data) {
        // setError(error.response.data.error);
        errorMsg = error.response.data.error;
      }
    }
    throw new Error(errorMsg);
  }
};

export default fetchStates;
