import { Country } from "@/app/components/CountryPicker";
import fetchCountries from "@/lib/fetchCountries/fetchCountries";
import { useEffect, useState } from "react";

const useGetCountryByLabel = () => {
  // return countriesList().find((country) => country.label === label);
  const { countries } = useGetCountries();
  const get = (label?: string | undefined) => {
    return countries.find((country) => country.label === label);
  };

  return {
    get,
  };
};

function useGetCountries() {
  const [countries, setCountries] = useState<Country[]>([]);

  const getCountries = () => {
    const countriesRes = fetchCountries();
    setCountries(countriesRes);
  };

  useEffect(() => {
    getCountries();
  }, []);

  return {
    countries,
  };
}

export { useGetCountries, useGetCountryByLabel };
