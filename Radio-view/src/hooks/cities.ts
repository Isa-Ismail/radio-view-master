import fetchCities from "@/lib/fetchCities/fetchCities";
import { useCallback, useEffect, useRef, useState } from "react";
import { useClientAxiosClient } from "./axios";

export default function useGetCitiesByCountryAndState(
  country?: string | undefined,
  state?: string | undefined
) {
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const axios = useRef(useClientAxiosClient());

  const getCities = useCallback(
    async (country: string, state: string) => {
      setLoading(true);
      try {
        const res = fetchCities(country, state, axios.current);
        const data = await res;
        setCities(data);
      } catch (error) {
        console.log("Erro", error);
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Unknown Error");
        }
      } finally {
        setLoading(false);
      }
    },
    [axios]
  );
  useEffect(() => {
    if (country && state) {
      getCities(country, state);
    } else {
      setCities([]);
    }
  }, [country, getCities, state]);
  return { cities, loading, error };
}
