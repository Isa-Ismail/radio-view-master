"use client";
import Input, { dateFormat } from "@/app/components//Input";
import Loader from "@/app/components//Loading";
import { useClientAxiosClient } from "@/hooks/axios";
import { useAppSnackbar } from "@/hooks/snackbar";
import { Site } from "@/models/site";
import { System } from "@/models/system";
import { selectAuth } from "@/store/auth/authSlice";
import { useAddClinicianDataMutation, useClinicianByIdQuery } from "@/store/clinician/clinicianApi";
import { useAppSelector } from "@/store/hooks";
import { useGetAllSitesQuery } from "@/store/site/siteApi";
import { useGetSystemsForSiteQuery } from "@/store/system/systemApi";
import { genders } from "@/utils/constants";
import { getValidAuthTokens } from "@/utils/cookie";
import validatePhoneNumber from "@/utils/validatePhoneNumber";
import { Autocomplete, Checkbox, Grid, TextField } from "@mui/material";
import differenceInYears from "date-fns/differenceInYears";
import dayjs from "dayjs";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import * as yup from "yup";
export type AddEditClinicianFormType = {
  email: string | undefined;
  first_name: string | undefined;
  last_name: string | undefined;
  phone: string | undefined;
  gender: string | undefined;
  date_of_birth: dayjs.Dayjs | undefined;
  system_ids: System[] | undefined;
  site_ids: Site[] | undefined;
  practice_address: string | undefined;
  practice_name: string | undefined;
  system_changed: boolean;
  deleted_systems: string[] | undefined;
  site_changed: boolean;
  deleted_sites: string[] | undefined;
  hsai_guid: string | undefined;
  profile_id: string | undefined;
};
// const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
// const checkedIcon = <CheckBoxIcon fontSize="small" />;

const minYearsForDOB = 21;

const schema = yup.object<AddEditClinicianFormType>().shape({
  email: yup.string().email("Please enter a valid email").required("Email is required"),
  first_name: yup
    .string()
    .required("First name is required")
    .max(50, "First name is too long")
    .min(3, "First name is too short"),
  last_name: yup
    .string()
    .required("Last name is required")
    .max(50, "Last name is too long")
    .min(3, "Last name is too short"),
  /// Add phone validation to have a + coutnry code
  phone: yup
    .string()
    .required("Phone is required")
    .test("phone", (value, { createError }) => {
      const validate = validatePhoneNumber({ value });
      if (!validate) {
        return true;
      }
      return createError({ message: validate });
    }),
  gender: yup.string().required("Gender is required"),
  // date_of_birth: yup.date().required("Date of birth is required"),
  date_of_birth: yup
    .string()
    .required("Date of birth is required")
    .test("dob", "Invalid Date", function (value) {
      const date = Date.parse(value!);
      return !isNaN(date);
    })
    .test("dob", "You must be at least 21 years old", function (value) {
      if (!value) {
        return false;
      }
      const diff = differenceInYears(new Date(), new Date(value));
      return diff >= minYearsForDOB;
    }),
  system_ids: yup.array().required("System is required").min(1, "System is required"),
  site_ids: yup.array().required("Site is required").min(1, "Site is required"),
  practice_address: yup
    .string()
    .max(255, "Practice address is too long")
    .min(5, "Practice address is too short"),
  practice_name: yup
    .string()
    .max(50, "Practice name is too long")
    .min(3, "Practice name is too short"),
});

export default function AddEditClinicianForm({ id, nonce }: { id?: string; nonce: string }) {
  const { token } = getValidAuthTokens();
  const { user } = useAppSelector(selectAuth);
  const axios = useClientAxiosClient();

  const { data: clinicianData, isLoading: clinicianLoading } = useClinicianByIdQuery(
    {
      id: id || "",
      token: token || "",
      axios,
    },
    {
      skip: !id || !token,
    }
  );

  const [mutate] = useAddClinicianDataMutation({ fixedCacheKey: "clinician-mutate" });

  const { errorSnackbar, successSnackbar } = useAppSnackbar();
  const router = useRouter();
  const onSubmit = async (data: AddEditClinicianFormType) => {
    const sites = data.site_ids;
    const systems = data.system_ids;
    if (!sites || !systems) {
      return;
    }
    const systemsWithoutSite = [...systems!].filter((item) => {
      const site = sites?.find((site) => site.system === item.name);
      return site === undefined;
    });
    if (systemsWithoutSite.length > 0) {
      successSnackbar("The systems that do not have a site will be removed.");
      setFieldValue(
        "system_ids",
        systems?.filter((item) => {
          const site = sites?.find((site) => site.system === item.name);
          return site !== undefined;
        })
      );
    }
    let systemChanged = false;
    let deletedSystems: string[] | undefined = undefined;
    let siteChanged = false;
    let deletedSites: string[] | undefined = undefined;
    if (clinicianData) {
      const clinicianSystems = clinicianData.systemIds?.map((item) => item.toSystem.id);
      const clinicianSites = clinicianData.sites?.map((item) => item.id);
      const newSystems = systems?.map((item) => item.id);
      const newSites = sites?.map((item) => item.id);
      systemChanged = JSON.stringify(clinicianSystems) !== JSON.stringify(newSystems);
      siteChanged = JSON.stringify(clinicianSites) !== JSON.stringify(newSites);
      if (systemChanged) {
        deletedSystems = clinicianSystems?.filter((item) => !newSystems?.includes(item));
      }
      if (siteChanged) {
        deletedSites = clinicianSites?.filter((item) => !newSites?.includes(item));
      }
    }
    let system = [...data.system_ids!];
    let site = [...data.site_ids!];
    if (clinicianData) {
      system = system.filter((item) => {
        if (typeof item === "string") {
          return !clinicianData.systemIds?.map((item) => item.toSystem.id).includes(item);
        } else {
          return !clinicianData.systemIds?.map((item) => item.toSystem.id).includes(item.id);
        }
      });
      site = site.filter((item) => {
        if (typeof item === "string") {
          return !clinicianData.sites?.map((item) => item.id).includes(item);
        } else {
          return !clinicianData.sites?.map((item) => item.id).includes(item.id);
        }
      });
    }
    data = {
      ...data,
      system_changed: systemChanged,
      deleted_systems: deletedSystems,
      system_ids: system,
      site_changed: siteChanged,
      deleted_sites: deletedSites,
      site_ids: site,
      date_of_birth: dayjs(data.date_of_birth!, dateFormat),
    };

    const res = await mutate({
      clinicianData: data,
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

      errorSnackbar(message);
    } else {
      const isEdit = id !== undefined;
      if (isEdit) {
        successSnackbar("Clinician updated successfully");
      } else {
        successSnackbar("An email has been sent to the email with further instructions to login.");
      }
      router.replace("/clinicians");
    }
  };
  const { handleSubmit, values, getFieldProps, setFieldValue, getFieldMeta, errors } =
    useFormik<AddEditClinicianFormType>({
      validateOnChange: false,
      validateOnBlur: true,
      initialValues: {
        hsai_guid: id,
        system_changed: false,
        deleted_systems: undefined,
        site_changed: false,
        deleted_sites: undefined,
        email: clinicianData?.email || undefined,
        first_name: clinicianData?.firstName || undefined,
        last_name: clinicianData?.lastName || undefined,
        date_of_birth: clinicianData?.dob ? dayjs(clinicianData?.dob, "YYYY-MM-DD") : undefined,
        gender: clinicianData?.gender || undefined,
        phone: clinicianData?.phoneNumber || undefined,
        practice_address: clinicianData?.practiceAddress || "",
        practice_name: clinicianData?.practiceName || "",
        site_ids: clinicianData?.sites.map((item) => item) || undefined,
        system_ids: clinicianData?.systemIds.map((item) => item.toSystem),
        profile_id: clinicianData?.id || undefined,
      },
      enableReinitialize: true,
      onSubmit,
      validationSchema: schema,
    });

  const {
    data: systemsData,
    isLoading: systemsLoading,
    isFetching: systemsRefetching,
  } = useGetSystemsForSiteQuery(
    {
      token: token || "",
      axios,
    },
    {
      skip: !token,
    }
  );

  const {
    data: sitesData,
    isLoading: sitesLoading,
    isFetching: sitesRefetching,
  } = useGetAllSitesQuery(
    {
      token: token || "",
      systemIds: values.system_ids?.map((item) => item.id) || [],
      axios,
    },
    {
      skip: !token,
    }
  );
  const [systems, setSystems] = useState<System[]>([]);
  const [sites, setSites] = useState<Site[]>([]);

  useEffect(() => {
    if (systemsData) {
      const systems: System[] = [
        {
          id: "all",
          name: "All",
        },
        ...systemsData.map((item) => item.toSystem),
      ];

      setSystems(systems);
    } else {
      setSystems([]);
    }
  }, [systemsData]);
  useEffect(() => {
    if (sitesData) {
      let sites: Site[] = [...sitesData.map((item) => item)];
      if (sites.length > 0) {
        sites = [
          {
            id: "all",
            name: "All",
            alias: "",
            system: "",
          },
          ...sites,
        ];
      }
      setSites(sites);
    } else {
      setSites([]);
    }
  }, [sitesData]);

  useEffect(() => {
    if (user?.systemId && systems) {
      const _system: System | undefined = systems.find((item) => item!.id === user?.systemId);
      if (_system) {
        setFieldValue("system_ids", [_system]);
      }
    }
  }, [setFieldValue, systems, user?.systemId]);

  useEffect(() => {
    if (user?.siteId && sites) {
      const _site: Site | undefined = sites.find((item) => item.id === user?.siteId);
      if (_site) {
        setFieldValue("site_ids", [_site]);
      }
    }
  }, [setFieldValue, sites, user?.siteId]);
  useEffect(() => {
    const sites = values.site_ids;
    if (!sites) {
      return;
    }
    const siteWithoutSystem = [...sites!].filter((item) => {
      const system = values.system_ids?.find((system) => system.name === item.system);
      return system === undefined;
    });

    if (siteWithoutSystem.length > 0) {
      setFieldValue(
        "site_ids",
        sites?.filter((item) => {
          const system = values.system_ids?.find((system) => system.name === item.system);
          return system !== undefined;
        })
      );
    }
  }, [setFieldValue, successSnackbar, values.site_ids, values.system_ids]);

  if (clinicianLoading) {
    return <Loader nonce={nonce}></Loader>;
  }
  return (
    <form onSubmit={handleSubmit} id="Clinician">
      <div className=" mb-5">
        <Grid container spacing={2}>
          <Grid item xs={6} md={4} lg={4}>
            <Input
              hint="First Name"
              maxLength={50}
              sameLabelAndHint={true}
              field={getFieldProps}
              meta={getFieldMeta}
              fieldName="first_name"></Input>
          </Grid>
          <Grid item xs={6} md={4} lg={4}>
            <Input
              hint="Last Name"
              maxLength={50}
              sameLabelAndHint={true}
              field={getFieldProps}
              meta={getFieldMeta}
              fieldName={"last_name"}></Input>
          </Grid>
        </Grid>
      </div>
      <div className="mb-5">
        <Grid container spacing={2}>
          <Grid item xs={6} md={4} lg={4}>
            <Input
              hint="Email"
              sameLabelAndHint={true}
              readOnly={id !== undefined}
              field={getFieldProps}
              meta={getFieldMeta}
              isEmail={true}
              fieldName="email"></Input>
          </Grid>
          <Grid item xs={6} md={4} lg={4}>
            <Input
              hint="Phone"
              sameLabelAndHint={true}
              as="phone"
              field={getFieldProps}
              meta={getFieldMeta}
              fieldName={"phone"}></Input>
          </Grid>
        </Grid>
      </div>
      <div className="mb-5">
        <Grid container spacing={2}>
          <Grid item xs={6} md={4} lg={4}>
            <Input
              hint="Gender"
              sameLabelAndHint={true}
              field={getFieldProps}
              meta={getFieldMeta}
              fieldName={"gender"}>
              {(props) => (
                <Autocomplete
                  id="gender-select"
                  options={genders}
                  isOptionEqualToValue={(option, value) => option === value}
                  getOptionLabel={(option) => {
                    return option || "";
                  }}
                  value={props.value || []}
                  onChange={(_, newValue) => {
                    if (newValue !== null && newValue !== undefined) {
                      setFieldValue(props.name, newValue);
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
                      placeholder="Gender"
                      name={props.name}
                      error={props.error}
                      helperText={props.helperText}
                    />
                  )}></Autocomplete>
              )}
            </Input>
          </Grid>
          <Grid item xs={6} md={4} lg={4}>
            <Input
              hint="Date of Birth"
              sameLabelAndHint={true}
              as="date"
              field={getFieldProps}
              meta={getFieldMeta}
              max={dayjs().subtract(minYearsForDOB, "years")}
              fieldName={"date_of_birth"}></Input>
          </Grid>
        </Grid>
      </div>
      <div className="mb-5">
        <Grid container spacing={2}>
          <Grid item xs={6} md={4} lg={4}>
            <Input
              hint="System"
              sameLabelAndHint={true}
              field={getFieldProps}
              meta={getFieldMeta}
              fieldName={"system_ids"}>
              {(props) => {
                return (
                  <Autocomplete
                    id="system-select"
                    multiple
                    disableCloseOnSelect={true}
                    popupIcon={user?.systemId !== undefined ? null : undefined}
                    readOnly={user?.systemId !== undefined}
                    renderOption={(props, option, { selected }) => {
                      return (
                        <li {...props}>
                          <Checkbox
                            nonce={nonce}
                            // icon={icon}
                            // checkedIcon={checkedIcon}
                            style={{ marginRight: 8 }}
                            checked={selected}
                          />
                          {option.name}
                        </li>
                      );
                    }}
                    options={systems || []}
                    loading={!systems || systemsLoading || systemsRefetching}
                    getOptionLabel={(option) => {
                      const system = systems?.find(
                        (item) => item.id === option || item.id === option?.id
                      )?.name;
                      return system || "";
                    }}
                    value={props.value || []}
                    isOptionEqualToValue={(option, value) => {
                      if (option.id === "all" || value.id === "all") {
                        return props.value.length === systems?.length - 1;
                      }
                      return option.id === value.id;
                    }}
                    onChange={(_, __, reason, details) => {
                      let selectedSystems: System[] = [];
                      if (props.value instanceof Array) {
                        selectedSystems = props.value;
                      }

                      if (reason === "removeOption") {
                        if (details?.option.id === "all") {
                          selectedSystems = [];
                        } else {
                          selectedSystems = selectedSystems.filter(
                            (item) => item.id !== details?.option.id
                          );
                        }
                      } else if (reason === "selectOption") {
                        if (details?.option.id === "all") {
                          selectedSystems = systems?.filter((item) => item.id !== "all") || [];
                        } else {
                          selectedSystems = [
                            ...selectedSystems,
                            systems?.find((item) => item.id === details?.option.id) ||
                              details?.option,
                          ];
                        }
                      } else if (reason === "clear") {
                        selectedSystems = [];
                      }
                      setFieldValue(props.name, selectedSystems);
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
          <Grid item xs={6} md={4} lg={4}>
            <Input
              hint="Sites"
              sameLabelAndHint={true}
              field={getFieldProps}
              meta={getFieldMeta}
              fieldName={"site_ids"}>
              {(props) => {
                return (
                  <Autocomplete
                    id="site-select"
                    multiple
                    readOnly={user?.siteId !== undefined}
                    options={(sites || []).map((item) => item) || []}
                    disableCloseOnSelect={true}
                    popupIcon={user?.siteId !== undefined ? null : undefined}
                    groupBy={(option) => option.system}
                    noOptionsText={
                      values.system_ids?.length === 0 || !values.system_ids
                        ? "Please select a system first"
                        : "No sites found for the selected system"
                    }
                    renderOption={(props, option, { selected }) => {
                      return (
                        <li {...props}>
                          <Checkbox
                            // icon={icon}
                            // checkedIcon={checkedIcon}
                            style={{ marginRight: 8 }}
                            nonce={nonce}
                            checked={selected}
                          />
                          {option.name}
                        </li>
                      );
                    }}
                    loading={!sites || sitesLoading || sitesRefetching}
                    getOptionLabel={(option) => {
                      const site = sites?.find(
                        (item) => item.id === option || item.id === option?.id
                      )?.name;
                      return site || "";
                    }}
                    value={props.value || []}
                    isOptionEqualToValue={(option, value) => {
                      if (option.id === "all" || value.id === "all") {
                        return props.value.length === sites?.length - 1;
                      }
                      return option.id === value.id;
                    }}
                    onChange={(_, __, reason, details) => {
                      let selectedSites: Site[] = [];
                      if (props.value instanceof Array) {
                        selectedSites = props.value;
                      }

                      if (reason === "removeOption") {
                        if (details?.option.id === "all") {
                          selectedSites = [];
                        } else {
                          selectedSites = selectedSites.filter(
                            (item) => item.id !== details?.option.id
                          );
                        }
                      } else if (reason === "selectOption") {
                        if (details?.option.id === "all") {
                          selectedSites = sites?.filter((item) => item.id !== "all") || [];
                        } else {
                          selectedSites = [
                            ...selectedSites,
                            sites?.find((item) => item.id === details?.option.id) ||
                              details?.option,
                          ];
                        }
                      } else if (reason === "clear") {
                        selectedSites = [];
                      }
                      setFieldValue(props.name, selectedSites);
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
                        placeholder="Sites"
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
      <div>
        <Grid container spacing={2}>
          <Grid item xs={6} md={4} lg={4}>
            <Input
              hint="Practice Name"
              sameLabelAndHint={true}
              maxLength={50}
              field={getFieldProps}
              meta={getFieldMeta}
              required={false}
              fieldName={"practice_name"}></Input>
          </Grid>
          <Grid item xs={6} md={4} lg={4}>
            <Input
              hint="Practice Address"
              sameLabelAndHint={true}
              maxLength={255}
              field={getFieldProps}
              meta={getFieldMeta}
              required={false}
              fieldName={"practice_address"}></Input>
          </Grid>
        </Grid>
      </div>
    </form>
  );
}
