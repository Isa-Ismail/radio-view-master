"use client";
import Input from "@/app/components/Input";
import Loader from "@/app/components/Loading";
import { useClientAxiosClient } from "@/hooks/axios";
import { useAppSnackbar } from "@/hooks/snackbar";
import { useAddSystemDataMutation, useGetSystemByIdQuery } from "@/store/system/systemApi";
import { getValidAuthTokens } from "@/utils/cookie";
import validatePhoneNumber from "@/utils/validatePhoneNumber";
import { Grid, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import * as yup from "yup";

type Country = {
  id: string;
  label: string;
  emoji: string;
  code: string;
};

export type AddEditSystemFormType = {
  profile_id: string | undefined;
  system_id: string | undefined;
  name: string | undefined;
  alias: string | undefined;
  contact_name: string | undefined;
  contact_email: string | undefined;
  contact_phone: string | undefined;
  contact_username: string | undefined;
  // country: Country | undefined;
};

const schema = yup.object<AddEditSystemFormType>().shape({
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
  contact_name: yup
    .string()
    .required("Name is required")
    .max(50, "Name is too long")
    .min(3, "Name is too short"),
  contact_email: yup.string().required("Email is required").email("Please enter a valid email"),
  contact_phone: yup
    .string()
    .required("Phone number is required")
    .test("phone", (value, { createError }) => {
      const validate = validatePhoneNumber({ value });
      if (!validate) {
        return true;
      }
      return createError({ message: validate });
    }),
});

export default function AddEditSystemForm({ id, nonce }: { id?: string; nonce: string }) {
  const { token, refreshToken } = getValidAuthTokens();
  const axios = useClientAxiosClient();

  const { data } = useGetSystemByIdQuery(
    {
      id: id || "",
      token: token || "",
      axios,
    },
    { skip: !id || !token || !refreshToken }
  );

  const edit = id ? true : false;
  const [mutate] = useAddSystemDataMutation({ fixedCacheKey: "system-mutate" });

  const { successSnackbar, errorSnackbar } = useAppSnackbar();
  const router = useRouter();

  const onSubmit = async (data: AddEditSystemFormType) => {
    data = { ...data, contact_username: data!.contact_email!.split("@")[0] };
    const res = await mutate({
      systemData: data,
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
        successSnackbar("System updated successfully");
      } else {
        successSnackbar("An email has been sent to the email with further instructions to login.");
      }
      router.replace("/systems");
    }
  };

  const { handleSubmit, getFieldProps, getFieldMeta, setFieldValue } =
    useFormik<AddEditSystemFormType>({
      validateOnBlur: true,
      validateOnChange: false,
      initialValues: {
        // country: undefined,
        profile_id: data?.hsaiUser?.profileId,
        system_id: data?.hsaiSystem?.systemGuid,
        name: data?.hsaiSystem?.sytemFullName,
        alias: data?.hsaiSystem?.systemAlias,
        contact_name: data?.hsaiUser?.practiceName,
        contact_email: data?.hsaiUser?.email,
        contact_phone: data?.hsaiUser?.phone,
        contact_username: data?.hsaiUser?.email?.split("@")[0],
      },
      onSubmit,
      enableReinitialize: true,
      validationSchema: schema,
    });

  if (id && !data) {
    return <Loader nonce={nonce}></Loader>;
  }

  return (
    <form onSubmit={handleSubmit} id="System">
      <div className="mb-3">
        <Typography variant="h6">System Details</Typography>
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
        </Grid>
      </div>

      <div className=" mt-10 mb-3">
        <Typography variant="h6">System Contact</Typography>
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
          <Grid item xs={6} md={4} lg={4}>
            <Input
              readOnly={edit}
              hint="Email"
              isEmail={true}
              sameLabelAndHint={true}
              field={getFieldProps}
              meta={getFieldMeta}
              fieldName="contact_email"></Input>
          </Grid>
          <Grid item xs={6} md={4} lg={4}>
            <Input
              readOnly={edit}
              hint="Phone"
              as="phone"
              sameLabelAndHint={true}
              field={getFieldProps}
              meta={getFieldMeta}
              fieldName="contact_phone"></Input>
          </Grid>
        </Grid>
        {/* <div className="mt-5">
          <Grid container spacing={2}>
            <Grid item xs={6} md={4} lg={4}>
              <CountryPicker
                getFieldProps={getFieldProps}
                getFieldMeta={getFieldMeta}
                setFieldValue={setFieldValue}
                fieldName="country"
                hint="Country"
                sameLabelAndHint={true}></CountryPicker>
            </Grid>
          </Grid>
        </div> */}
      </div>
    </form>
  );
}
