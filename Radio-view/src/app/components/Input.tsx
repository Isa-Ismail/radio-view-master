import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  FilledInputProps,
  IconButton,
  InputAdornment,
  InputProps as MuiInputProps,
  OutlinedInputProps,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { FieldConfig, FieldInputProps, FieldMetaProps } from "formik";

import { MuiTelInput } from "mui-tel-input";
import { useState } from "react";
import { Country } from "./CountryPicker";
type As = "text" | "password" | "textarea" | "date" | "number" | "email" | "phone";

export const dateFormat = "MM/DD/YYYY";

export const StyledDatePicker = styled(DatePicker<dayjs.Dayjs>)({
  ".MuiInputBase-root": {
    borderRadius: 30,
  },
});

export const StyledTimePicker = styled(TimePicker<dayjs.Dayjs>)({
  ".MuiInputBase-root": {
    borderRadius: 30,
  },
});

export const StyledTextField = styled(TextField)({
  ".MuiInputBase-root": {
    borderRadius: 30,

    minWidth: 300,
  },
});

type InputFieldProps<T> = {
  hint?: string;
  label?: string;
  value: T;
  onChange: (e: T) => void;
  onBlur: (e: T) => void;
  name: string;
  error?: boolean;
  helperText?: string;
  readOnly?: boolean;
};

interface InputProps<T extends string | number | dayjs.Dayjs | Country> {
  hint?: string;
  label?: string;
  sameLabelAndHint?: boolean;
  sufix?: React.ReactNode;
  prefix?: React.ReactNode;
  as?: As;
  field: (e: string | FieldConfig<T>) => FieldInputProps<T>;
  meta: (e: string) => FieldMetaProps<T>;
  fieldName: string;
  max?: number | dayjs.Dayjs;
  min?: number | dayjs.Dayjs;
  children?: (props: InputFieldProps<T>) => React.ReactNode;
  required?: boolean;
  readOnly?: boolean;
  isEmail?: boolean;
  maxLength?: number;
}

export default function Input<T extends string | number | dayjs.Dayjs | Country>({
  hint,
  label,
  sameLabelAndHint = false,

  sufix,
  prefix,
  as = "text",
  field: _field,
  meta: _meta,
  max,
  min,
  fieldName,
  required = true,
  children,
  readOnly,
  isEmail,
  maxLength,
}: InputProps<T>) {
  const field = _field(fieldName);
  const meta = _meta(fieldName);
  // const [field, meta] = useField(fieldName);
  let [type, setType] = useState<As>(as);
  const showPassword = type === "text";
  var _lable = label;
  var _hint = hint;
  if (isEmail) {
    _hint = "Email(e.g abc@company.com)";
    if (sameLabelAndHint) {
      _lable = "Email";
    }
  } else {
    if (sameLabelAndHint) {
      if (!label && hint) {
        _lable = hint;
      } else if (label && !hint) {
        _hint = label;
      }
    }
  }

  let inputProps:
    | Partial<FilledInputProps>
    | Partial<OutlinedInputProps>
    | Partial<MuiInputProps>
    | undefined;
  if (as === "password") {
    sufix = (
      <IconButton
        aria-label="toggle password visibility"
        onClick={() => setType(type === "text" ? "password" : "text")}
        onMouseDown={(e) => e.preventDefault()}
        edge="end">
        {showPassword ? <VisibilityOff /> : <Visibility />}
      </IconButton>
    );
  }

  if (sufix) {
    inputProps = { endAdornment: <InputAdornment position="end">{sufix}</InputAdornment> };
  } else if (prefix) {
    inputProps = { startAdornment: <InputAdornment position="start">{prefix}</InputAdornment> };
  } else if (sufix && prefix) {
    inputProps = {
      startAdornment: <InputAdornment position="start">{prefix}</InputAdornment>,
      endAdornment: <InputAdornment position="end">{sufix}</InputAdornment>,
    };
  }
  inputProps = {
    ...inputProps,
    sx: { borderRadius: 8 },
    readOnly: readOnly,
    "aria-label": "controlled",
  };
  let length: number | undefined;
  if (field.value && field.value.hasOwnProperty("length")) {
    length = (field.value as string).length;
  }
  if (!inputProps.endAdornment && maxLength && length) {
    inputProps = {
      ...inputProps,
      endAdornment: (
        <InputAdornment position="end">
          <div className="mr-2">
            {length}/{maxLength ?? 0}
          </div>
        </InputAdornment>
      ),
    };
  }
  let labelComp = undefined;
  if (_lable) {
    labelComp = (
      <div className="mb-2">
        <Typography fontSize={18} fontWeight="bold">
          {_lable}
          {required ? <span className="text-red-500"> *</span> : null}
        </Typography>
      </div>
    );
  }
  let error = undefined;
  if (meta.touched && meta.error) {
    error = meta.error;
  }
  if (children) {
    return (
      <>
        {labelComp}
        {children({
          hint: _hint,
          label: _lable,
          readOnly: readOnly,
          value: field.value,
          onChange: field.onChange,
          onBlur: field.onBlur,
          name: field.name,
          error: error !== undefined,
          helperText: error,
        })}
      </>
    );
  }
  if (as === "phone") {
    return (
      <>
        {labelComp}
        <MuiTelInput
          onChange={(e) => {
            if (e) {
              field.onChange(field.name)(e.toString());
            }
          }}
          name={field.name}
          value={field.value as string}
          error={error !== undefined}
          helperText={error}
          fullWidth
          placeholder={hint}
          InputProps={inputProps}></MuiTelInput>
      </>
    );
  }
  if (as === "date") {
    let _value: dayjs.Dayjs | undefined = undefined;
    if (field.value) {
      _value = dayjs(field.value as dayjs.Dayjs, dateFormat);
    }
    return (
      <>
        {labelComp}
        <StyledDatePicker
          views={["year", "month", "day"]}
          className="w-full"
          format={dateFormat}
          maxDate={max as dayjs.Dayjs}
          minDate={min as dayjs.Dayjs}
          slotProps={{
            textField: {
              helperText: error ?? undefined,
              error: error !== undefined,
            },
          }}
          onChange={(date) => {
            if (date) {
              field.onChange(field.name)(date!.format(dateFormat));
            }
          }}
          value={_value || null}></StyledDatePicker>
      </>
    );
  }

  return (
    <>
      {labelComp}

      <StyledTextField
        placeholder={_hint}
        InputProps={inputProps}
        fullWidth
        error={error !== undefined}
        helperText={error}
        onChange={(value) => {
          // if (maxLength && value.target.value.length > maxLength) {
          //   return;
          // }
          field.onChange(value);
        }}
        onBlur={field.onBlur}
        type={type}
        value={field.value}
        name={field.name}
        maxRows={as === "textarea" ? 5 : undefined}
        multiline={as === "textarea"}
      />
    </>
  );
}
