import useGetStatesByCountry from "@/hooks/states";
import { Autocomplete, TextField } from "@mui/material";
import { FieldConfig, FieldInputProps, FieldMetaProps } from "formik";
import { Country } from "./CountryPicker";
import Input from "./Input";

export default function StatePicker({
  field,
  meta,
  // value,
  setFieldValue,

  fieldName,
  hint,
  sameLabelAndHint = false,
  required = true,
  country,
  nonce,
}: {
  field: (e: string | FieldConfig<string>) => FieldInputProps<string>;
  meta: (e: string) => FieldMetaProps<string>;
  // value: Country | undefined;
  setFieldValue: (e: string, v: string | null) => void;
  fieldName: string;
  hint?: string;
  sameLabelAndHint?: boolean;
  required?: boolean;
  country?: Country;
  nonce: string;
}) {
  //   const { current: countries } = useRef(countriesList());
  // const axios = useClientAxiosClient();
  // const { states } = useAppSelector(selectCountries);

  // const { error, isLoading, isFetching } = useGetStatesByCountryQuery(
  //   {
  //     axios,
  //     country: country?.label || "",
  //   },
  //   {
  //     skip: !country,
  //     refetchOnMountOrArgChange: true,
  //   }
  // );
  const { states, error, loading } = useGetStatesByCountry(country?.label);

  const isLoadingOrFetching = loading;
  return (
    <div>
      <Input
        field={field}
        fieldName={fieldName}
        meta={meta}
        hint={hint}
        sameLabelAndHint={sameLabelAndHint}
        required={required}>
        {(props) => {
          return (
            <Autocomplete
              id={fieldName}
              key={`${props.value}-${props.error}`}
              options={isLoadingOrFetching ? [] : states || []}
              filterSelectedOptions={false}
              isOptionEqualToValue={(option, value) => option === value}
              value={props.value}
              loading={isLoadingOrFetching}
              noOptionsText={error || country ? "No states found" : "Select a country first"}
              onChange={(_, newValue) => {
                setFieldValue(fieldName, newValue);
              }}
              filterOptions={(options, params) => {
                const filtered = options.filter((option) => {
                  return option.toLowerCase().includes(params.inputValue.toLowerCase());
                });
                // Suggest the creation of a new value
                if (filtered.length === 0 && params.inputValue !== "") {
                  filtered.push(params.inputValue);
                }
                return filtered;
              }}
              nonce={nonce}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 8,
                },
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder={props.hint}
                  name={props.name}
                  error={props.error}
                  helperText={props.helperText}></TextField>
              )}></Autocomplete>
          );
        }}
      </Input>
    </div>
  );
}
