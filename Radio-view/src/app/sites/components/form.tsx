"use client";
import CityPicker from "@/app/components/CityPicker";
import CountryPicker, { Country } from "@/app/components/CountryPicker";
import Input from "@/app/components/Input";
import Loader from "@/app/components/Loading";
import StatePicker from "@/app/components/StatePicker";
import { useClientAxiosClient } from "@/hooks/axios";
import { useGetCountryByLabel } from "@/hooks/countries";
import { System } from "@/models/system";
import { selectAuth } from "@/store/auth/authSlice";
import { useAppSelector } from "@/store/hooks";
import { useAddSiteDataMutation, useGetSiteByIdQuery } from "@/store/site/siteApi";
import { useGetSystemsForSiteQuery } from "@/store/system/systemApi";
import { getValidAuthTokens } from "@/utils/cookie";

import { useAppSnackbar } from "@/hooks/snackbar";
import validatePhoneNumber from "@/utils/validatePhoneNumber";
import { Autocomplete, Grid, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import * as yup from "yup";

export type AddEditSiteFormType = {
  hsaiGuid: string | undefined;
  profile_id: string | undefined;
  site_id: string | undefined;
  name: string | undefined;
  alias: string | undefined;
  address: string | undefined;
  system: System[] | string[] | undefined;
  contact_name: string | undefined;
  contact_username: string | undefined;
  contact_email: string | undefined;
  contact_phone: string | undefined;
  system_changed: boolean;
  deleted_systems: string[] | undefined;
  site_country: Country | undefined;
  site_state: string | undefined;
  site_city: string | undefined;
};

const schema = yup.object<AddEditSiteFormType>().shape({
  name: yup
    .string()
    .required("Name is required")
    .max(50, "Name is too long")
    .min(3, "Name is too short"),
  alias: yup
    .string()
    .required("Alias is required")
    .max(10, "Alias is too long")
    .min(2, "Alias is too short"),
  address: yup
    .string()
    .required("Address is required")
    .max(255, "Address is too long")
    .min(5, "Address is too short"),
  system: yup.array().required("System ID is required").min(1, "System ID is required"),
  contact_name: yup
    .string()
    .required("Name is required")
    .max(50, "Name is too long")
    .min(3, "Name is too short"),
  contact_email: yup.string().required("Email is required").email("Please enter a valid email"),
  contact_phone: yup
    .string()
    .required("Phone is required")
    .test("phone", (value, { createError }) => {
      const validate = validatePhoneNumber({ value });
      if (!validate) {
        return true;
      }
      return createError({ message: validate });
    }),
  site_country: yup.object().required("Country is required"),
  site_state: yup
    .string()
    .required("State is required")
    .min(2, "State is too short")
    .max(50, "State is too long"),
  site_city: yup
    .string()
    .required("City is required")
    .min(2, "City is too short")
    .max(50, "City is too long"),
});

export default function AddEditSiteForm({ id, nonce }: { id?: string; nonce: string }) {
  const { user } = useAppSelector(selectAuth);

  const userSystemId = user?.systemId;
  const [mutate] = useAddSiteDataMutation({ fixedCacheKey: "site-mutate" });
  const { token, refreshToken } = getValidAuthTokens();
  const axios = useClientAxiosClient();

  const { data: siteData } = useGetSiteByIdQuery(
    {
      siteId: id || "",
      token: token || "",
      axios,
    },
    { skip: !id || !token || !refreshToken }
  );

  const { errorSnackbar, successSnackbar } = useAppSnackbar();
  const router = useRouter();
  const onSubmit = async (data: AddEditSiteFormType) => {
    let systemChanged = false;
    let deletedSystems: string[] | undefined = undefined;
    if (siteData) {
      const systems = siteData.systems?.map((item) => item.toSystem.id);
      const dataSystems = data.system?.map((item) => {
        if (typeof item === "string") {
          return item;
        }
        return item.id;
      });
      systemChanged = JSON.stringify(systems) !== JSON.stringify(dataSystems);
      if (systemChanged) {
        deletedSystems = systems?.filter((item) => !dataSystems?.includes(item));
      }
    }
    // let system = [...data.system!];
    // if (siteData) {
    //   system = system.filter((item) => {
    //     if (typeof item === "string") {
    //       return !siteData.systems?.map((item) => item.toSystem.id).includes(item);
    //     } else {
    //       return !siteData.systems?.map((item) => item.toSystem.id).includes(item.id);
    //     }
    //   });
    // }
    const _data = {
      ...data,
      contact_username: data!.contact_email!.split("@")[0],
      hsaiGuid: id,
      system_changed: systemChanged,
      deleted_systems: deletedSystems,
      system: data.system,
    };
    const res = await mutate({
      siteData: _data as AddEditSiteFormType,
      axios,
    });

    if ("error" in res) {
      let message = "Something went wrong";
      const error = res.error as any;
      console.log("Error", error);
      if ("data" in error) {
        console.log("Error.data", error.data);
        message = error.data;
      }

      // enqueueSnackbar(message, {
      //   variant: "error",
      //   autoHideDuration: 2000,
      //   hideIconVariant: true,
      // });
      errorSnackbar(message);
    } else {
      const isEdit = id !== undefined;
      if (isEdit) {
        successSnackbar("Site updated successfully");
      } else {
        successSnackbar("An email has been sent to the email with further instructions to login.");
      }
      router.replace("/sites");
    }
  };
  const getCountryByLabel = useGetCountryByLabel();
  const { handleSubmit, values, getFieldProps, setFieldValue, getFieldMeta, errors } =
    useFormik<AddEditSiteFormType>({
      validateOnChange: false,
      validateOnBlur: true,
      initialValues: {
        hsaiGuid: id,
        deleted_systems: undefined,
        system_changed: false,
        profile_id: siteData?.hsaiUser?.profileId,
        site_id: siteData?.siteId,
        name: siteData?.siteName,
        alias: siteData?.siteAlias,
        address: siteData?.siteAddress,
        system:
          siteData?.systems?.map((item) => item.toSystem) ??
          (userSystemId !== undefined ? [userSystemId] : []),
        contact_name: siteData?.hsaiUser?.practiceName,
        contact_username: siteData?.hsaiUser?.email?.split("@")[0],
        contact_email: siteData?.hsaiUser?.email,
        contact_phone: siteData?.hsaiUser?.phone,
        site_country: getCountryByLabel.get(siteData?.country),
        site_state: siteData?.state,
        site_city: siteData?.city,
      },
      onSubmit,
      enableReinitialize: true,
      validationSchema: schema,
    });
  console.log("Errors", errors);
  const {
    data: systems,
    isLoading: systemsLoading,
    isFetching: systemsRefetching,
  } = useGetSystemsForSiteQuery(
    {
      token: token || "",
      axios,
    },
    {
      skip: !token || !refreshToken,
    }
  );
  useEffect(() => {
    if (userSystemId && systems) {
      const _system: System | undefined = systems.find(
        (item) => item!.systemGuid === userSystemId
      )?.toSystem;
      if (_system) {
        setFieldValue("system_ids", [_system]);
      }
    }
  }, [setFieldValue, systems, userSystemId]);

  if (id && !siteData) {
    return <Loader nonce={nonce}></Loader>;
  }
  return (
    <form onSubmit={handleSubmit} id="Site">
      <div className="mb-3">
        <Typography variant="h6">Site Details</Typography>
      </div>
      <div className=" mb-5">
        <Grid container spacing={2}>
          <Grid item xs={6} md={4} lg={4}>
            <Input
              hint="Name"
              sameLabelAndHint={true}
              field={getFieldProps}
              meta={getFieldMeta}
              maxLength={50}
              fieldName="name"></Input>
          </Grid>
          <Grid item xs={6} md={4} lg={4}>
            <Input
              hint="Alias"
              sameLabelAndHint={true}
              field={getFieldProps}
              meta={getFieldMeta}
              maxLength={10}
              fieldName="alias"></Input>
          </Grid>
          <Grid item xs={6} md={4} lg={4}>
            <Input
              hint="System"
              sameLabelAndHint={true}
              field={getFieldProps}
              meta={getFieldMeta}
              fieldName={"system"}>
              {(props) => {
                return (
                  <Autocomplete
                    id="system-autocomplete"
                    readOnly={userSystemId !== undefined}
                    popupIcon={userSystemId !== undefined ? null : undefined}
                    options={systems?.map((item) => item.toSystem) || []}
                    filterSelectedOptions={true}
                    loading={!systems || systemsLoading || systemsRefetching}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    getOptionLabel={(_option) => {
                      if ("length" in _option) {
                        const option = _option[0];

                        const system = systems?.find(
                          (item) => item.systemGuid === option || item.systemGuid === option?.id
                        )?.sytemFullName;
                        return system || "";
                      }
                      const system = systems?.find(
                        (item) => item.systemGuid === _option || item.systemGuid === _option?.id
                      )?.sytemFullName;
                      return system || "";
                    }}
                    value={props.value || []}
                    onChange={(_, newValue) => {
                      if (newValue !== null && newValue !== undefined) {
                        let systems: System[] = [];
                        systems.push(newValue);
                        setFieldValue(props.name, systems);
                      }
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
                        placeholder="System"
                        name={props.name}
                        error={props.error}
                        helperText={props.helperText}
                      />
                    )}></Autocomplete>
                );
              }}
            </Input>
          </Grid>
        </Grid>
      </div>
      <div className=" mb-5">
        <Grid container spacing={2}>
          <Grid item xs={6} md={4} lg={4}>
            <Input
              hint="Address"
              sameLabelAndHint={true}
              field={getFieldProps}
              meta={getFieldMeta}
              maxLength={255}
              fieldName="address"></Input>
          </Grid>
          <Grid item xs={6} md={4} lg={4}>
            <CountryPicker
              nonce={nonce}
              hint="Country"
              sameLabelAndHint={true}
              field={getFieldProps}
              meta={getFieldMeta}
              setFieldValue={(key, value) => {
                setFieldValue(key, value);
                setFieldValue("site_state", undefined);
                setFieldValue("site_city", undefined);
              }}
              fieldName="site_country"></CountryPicker>
          </Grid>
          <Grid item xs={6} md={4} lg={4}>
            <StatePicker
              hint="State"
              sameLabelAndHint={true}
              country={values.site_country}
              field={getFieldProps}
              meta={getFieldMeta}
              setFieldValue={(key, value) => {
                setFieldValue(key, value);
                setFieldValue("site_city", undefined);
              }}
              nonce={nonce}
              fieldName="site_state"></StatePicker>
          </Grid>
        </Grid>
      </div>
      <div className=" mb-5">
        <Grid container spacing={2}>
          <Grid item xs={6} md={4} lg={4}>
            <CityPicker
              nonce={nonce}
              hint="City"
              sameLabelAndHint={true}
              field={getFieldProps}
              meta={getFieldMeta}
              setFieldValue={setFieldValue}
              country={values.site_country}
              state={values.site_state}
              fieldName="site_city"></CityPicker>
          </Grid>
        </Grid>
      </div>
      <div className=" mt-10 mb-3">
        <Typography variant="h6">Site Contact</Typography>
      </div>
      <div className=" mb-5">
        <Grid container spacing={2}>
          <Grid item xs={6} md={4} lg={4}>
            <Input
              hint="Name"
              sameLabelAndHint={true}
              field={getFieldProps}
              meta={getFieldMeta}
              maxLength={50}
              fieldName="contact_name"></Input>
          </Grid>
          {/* <Grid item xs={6} md={4} lg={4}> */}
          {/* <Input
              hint="Username"
              sameLabelAndHint={true}
              field={getFieldProps}
              meta={getFieldMeta}
              fieldName="contact_username"></Input> */}
          {/* </Grid> */}
          <Grid item xs={6} md={4} lg={4}>
            <Input
              hint="Email"
              readOnly={id !== undefined}
              sameLabelAndHint={true}
              isEmail={true}
              field={getFieldProps}
              meta={getFieldMeta}
              fieldName="contact_email"></Input>
          </Grid>
          <Grid item xs={6} md={4} lg={4}>
            <Input
              hint="Phone"
              as="phone"
              sameLabelAndHint={true}
              field={getFieldProps}
              meta={getFieldMeta}
              fieldName="contact_phone"></Input>
          </Grid>
        </Grid>
      </div>
    </form>
  );
}
