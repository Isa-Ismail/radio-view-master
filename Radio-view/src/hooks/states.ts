import fetchStates from "@/lib/fetchStates/fetchStates";
import { useCallback, useEffect, useRef, useState } from "react";
import { useClientAxiosClient } from "./axios";

export default function useGetStatesByCountry(country?: string | undefined) {
  const [states, setStates] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const axios = useRef(useClientAxiosClient());

  const getStates = useCallback(
    async (country: string) => {
      setLoading(true);
      try {
        const res = await fetchStates(country, axios.current);

        setStates(res);
      } catch (error) {
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
    if (country) {
      getStates(country);
    } else {
      setStates([]);
    }
  }, [country, getStates]);
  return { states, loading, error };
}
