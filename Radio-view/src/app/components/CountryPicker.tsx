import { useGetCountries } from "@/hooks/countries";
import { Autocomplete, TextField } from "@mui/material";
import { FieldConfig, FieldInputProps, FieldMetaProps } from "formik";
import Input from "./Input";

export type Country = {
  label: string;
  emoji: string;
  code: string;
};

export default function CountryPicker({
  field,
  meta,
  // value,
  setFieldValue,

  fieldName,
  hint,
  sameLabelAndHint = false,
  required = true,
  nonce,
}: {
  field: (e: string | FieldConfig<Country>) => FieldInputProps<Country>;
  meta: (e: string) => FieldMetaProps<Country>;
  // value: Country | undefined;
  setFieldValue: (e: string, v: Country | null) => void;
  fieldName: string;
  hint?: string;
  sameLabelAndHint?: boolean;
  required?: boolean;
  nonce: string;
}) {
  const { countries } = useGetCountries();

  return (
    <div>
      {/* <div className="mb-2">
        <Typography fontSize={18} fontWeight="bold">
          {hint}
          {required ? <span className="text-red-500"> *</span> : null}
        </Typography>
      </div> */}
      <Input
        field={field}
        fieldName={fieldName}
        meta={meta}
        hint={hint}
        sameLabelAndHint={sameLabelAndHint}
        required={required}>
        {(props) => (
          <Autocomplete
            id={fieldName}
            options={countries}
            filterSelectedOptions={false}
            isOptionEqualToValue={(option, value) => option.code === value.code}
            getOptionLabel={(option) => {
              if (!option || !option.code) {
                return "";
              }
              return `${option.emoji} ${option.label}`;
            }}
            value={props.value || []}
            onChange={(_, newValue) => {
              setFieldValue(fieldName, newValue);
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
        )}
      </Input>
    </div>
  );
}
