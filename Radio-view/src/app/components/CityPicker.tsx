import useGetCitiesByCountryAndState from "@/hooks/cities";
import { Autocomplete, TextField } from "@mui/material";
import { FieldConfig, FieldInputProps, FieldMetaProps } from "formik";
import { Country } from "./CountryPicker";
import Input from "./Input";

export default function CityPicker({
  field,
  meta,
  // value,
  setFieldValue,

  fieldName,
  hint,
  sameLabelAndHint = false,
  required = true,
  country,
  state,
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
  state?: string;
  nonce: string;
}) {
  //   const { current: countries } = useRef(countriesList());
  const { cities, error, loading } = useGetCitiesByCountryAndState(country?.label, state);
  const _field = field(fieldName);
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
          console.log("Error", props.error, props.helperText);
          return (
            <Autocomplete
              id={fieldName}
              key={`${props.value}-${props.error}`}
              options={cities || []}
              filterSelectedOptions={false}
              isOptionEqualToValue={(option, value) => option === value}
              value={props.value}
              loading={isLoadingOrFetching}
              noOptionsText={
                error || (country && state) ? "No Cities found" : "Select a state first"
              }
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
              onChange={(e, newValue) => {
                setFieldValue(fieldName, newValue);
              }}
              // freeSolo={true}
              // clearOnBlur={false}
              autoComplete={true}
              nonce={nonce}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 8,
                },
              }}
              renderInput={(params) => {
                return (
                  <TextField
                    {...params}
                    placeholder={props.hint}
                    name={props.name}
                    error={props.error}
                    helperText={props.helperText}></TextField>
                );
              }}></Autocomplete>
          );
        }}
      </Input>
    </div>
  );
}
