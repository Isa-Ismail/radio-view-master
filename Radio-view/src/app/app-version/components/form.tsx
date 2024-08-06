"use client";

import Input from "@/app/components/Input";
import Loader from "@/app/components/Loading";
import { useClientAxiosClient } from "@/hooks/axios";
import { useAppSnackbar } from "@/hooks/snackbar";
import {
  useAddUpdateVersionMutation,
  useGetSingleVersionQuery,
} from "@/store/app-version/appVersionApi";
import AppConfig from "@/utils/config";
import { getValidAuthTokens } from "@/utils/cookie";
import { Checkbox, FormControlLabel, Grid } from "@mui/material";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import * as yup from "yup";

export type AddEditAppVersionFormType = {
  id?: string;
  appstore_review: boolean;
  description: string;
  force_update: boolean;
  playstore_review: boolean;
  version: string;
  dev_password?: string;
};
const schema = yup.object<AddEditAppVersionFormType>().shape({
  appstore_review: yup.boolean().required("Please select if reviewed by appstore"),
  description: yup.string().required("Please enter a description"),
  force_update: yup.boolean().required("Please select if this is a force update"),
  playstore_review: yup.boolean().required("Please select if reviewed by playstore"),
  version: yup.string().required("Version is required"),
  dev_password: yup.string().required("Dev Password is required to update or add app version"),
});

export default function AddEditAppVersionForm({
  version,
  nonce,
}: {
  version?: string;
  nonce: string;
}) {
  const { token } = getValidAuthTokens();
  const axios = useClientAxiosClient();
  const { data: appVersion, isLoading } = useGetSingleVersionQuery(
    {
      token: token ?? "",
      version: version ?? "",
      axios,
    },
    {
      skip: version === undefined || token === undefined,
    }
  );
  const { handleSubmit, getFieldProps, getFieldMeta, setFieldValue, values, setValues } =
    useFormik<AddEditAppVersionFormType>({
      initialValues: {
        id: appVersion?.id ?? undefined,
        appstore_review: appVersion?.appstore_review ?? false,
        description: appVersion?.description ?? "",
        force_update: appVersion?.force_update ?? false,
        playstore_review: appVersion?.playstore_review ?? false,
        version: appVersion?.version ?? "",
        dev_password: "",
      },
      validationSchema: schema,
      validateOnChange: false,
      validateOnBlur: true,
      onSubmit,
      enableReinitialize: true,
    });

  const [mutate] = useAddUpdateVersionMutation({
    fixedCacheKey: "app-version-mutate",
  });
  const { successSnackbar, errorSnackbar } = useAppSnackbar();
  const router = useRouter();
  async function onSubmit(data: AddEditAppVersionFormType) {
    if (data.dev_password !== AppConfig.devPassword) {
      errorSnackbar("Dev Password is incorrect");
      return;
    }
    const description = data.description.trim().replace(/\n/g, "\\n");
    data.description = description;
    const res = await mutate({
      postData: data,
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
      const isEdit = version !== undefined;
      if (isEdit) {
        successSnackbar("App Version updated successfully");
      } else {
        successSnackbar("App Version added successfully");
      }
      router.replace("/app-version");
    }
  }
  if (isLoading) {
    return <Loader nonce={nonce}></Loader>;
  }
  return (
    <form onSubmit={handleSubmit} id="App Version History">
      <div className=" mb-5">
        <FormControlLabel
          control={
            <Checkbox
              checked={values.appstore_review}
              inputProps={{ "aria-label": "controlled" }}
              onChange={(e) => {
                // setFieldValue("appstore_review", e.target.checked);
                setValues({
                  ...values,
                  appstore_review: e.target.checked,
                });
              }}></Checkbox>
          }
          label="Appstore Reviewed?"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={values.playstore_review}
              inputProps={{ "aria-label": "controlled" }}
              onChange={(e) => {
                // setFieldValue("playstore_review", e.target.checked);
                setValues({
                  ...values,
                  playstore_review: e.target.checked,
                });
              }}></Checkbox>
          }
          label="Playstore Reviewed?"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={values.force_update}
              inputProps={{ "aria-label": "controlled" }}
              onChange={(e) => {
                // setFieldValue("force_update", e.target.checked);
                setValues({
                  ...values,
                  force_update: e.target.checked,
                });
              }}></Checkbox>
          }
          label="Force Update?"
        />
      </div>
      <Grid container spacing={2}>
        <Grid item xs={6} md={4} lg={4}>
          <Input
            hint="Version"
            readOnly={version !== undefined}
            sameLabelAndHint={true}
            field={getFieldProps}
            meta={getFieldMeta}
            fieldName="version"></Input>
        </Grid>
        <Grid item xs={6} md={4} lg={4}>
          <Input
            hint="Description"
            as="textarea"
            sameLabelAndHint={true}
            field={getFieldProps}
            meta={getFieldMeta}
            fieldName={"description"}></Input>
        </Grid>
        <Grid item xs={6} md={4} lg={4}>
          <Input
            hint="Dev Password"
            as="password"
            sameLabelAndHint={true}
            field={getFieldProps}
            meta={getFieldMeta}
            fieldName={"dev_password"}></Input>
        </Grid>
      </Grid>
    </form>
  );
}
