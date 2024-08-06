"use client";
import Input from "@/app/components/Input";
import { useClientAxiosClient } from "@/hooks/axios";
import { useAppSnackbar } from "@/hooks/snackbar";
import { useCreateNewPasswordMutation } from "@/store/auth/authApi";
import { LoadingButton } from "@mui/lab";
import { Typography } from "@mui/material";
import { useFormik } from "formik";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import * as yup from "yup";

type ResetPasswordForm = {
  password: string | undefined;
  confirmPassword: string | undefined;
  email: string | undefined;
};

const validationSchema = yup.object<ResetPasswordForm>().shape({
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be 8 characters")
    .max(30, "Password must be 30 characters or less")

    .matches(
      RegExp("[A-Z]"),
      "Password must contain at least one uppercase letter"
    )
    .matches(
      RegExp("[a-z]"),
      "Password must contain at least one lowercase letter"
    )
    .matches(RegExp("[0-9]"), "Password must contain at least one number")
    .matches(
      RegExp('[!@#$%^&*(),.?":{}|<>]'),
      "Password must contain at least one special character"
    ),
  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("password")], "Passwords do not match"),
});

export default function ResetPassword({ nonce }: { nonce: string }) {
  return (
    <Suspense>
      <ResetPasswordForm nonce={nonce} />
    </Suspense>
  );
}

function ResetPasswordForm({ nonce }: { nonce: string }) {
  const query = useSearchParams();
  const email = query.get("email");
  const [isLoading, setLoading] = useState(false);
  const { errorSnackbar, successSnackbar } = useAppSnackbar();

  const router = useRouter();
  const [mutate] = useCreateNewPasswordMutation();
  const axios = useClientAxiosClient();

  const onSubmit = async (data: ResetPasswordForm) => {
    setLoading(true);
    const { password } = data;

    const res = await mutate({
      email: email!,
      password: password!,
      axios,
    });
    if ("error" in res) {
      //
      let message = "Something went wrong";
      const error = res.error as any;
      if ("data" in error) {
        // message = (error.data as any).error;
        message = (error.data as any).error;
        if (!message) {
          message = error.data;
        }
      }

      errorSnackbar(message);
    } else {
      successSnackbar("Password reset successfully you can login now");
      router.push("/clinician-login");
    }
    setLoading(false);
  };
  const {
    handleSubmit,
    errors,
    values,
    getFieldProps,
    setFieldValue,
    getFieldMeta,
  } = useFormik<ResetPasswordForm>({
    validateOnChange: false,
    validateOnBlur: true,
    initialValues: {
      password: "",
      confirmPassword: "",
      email: email!,
    },
    onSubmit,
    validationSchema: validationSchema,
  });
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col h-screen items-center justify-center min-h-screen
    "
    >
      <div
        className="flex flex-col items-center justify-center"
        style={{ width: "600px" }}
        nonce={nonce}
      >
        <Image
          src={"/logo.png"}
          alt="NeuroICH Logo"
          width={150}
          height={150}
          priority={true}
        />
        <Typography className="pt-2" variant="h6">
          RadioView.AI
        </Typography>
        <br />
        <Typography variant="h4">Create new password</Typography>
        <br />
        <Typography className="text-center">
          Please enter new password and Continue Logging in RadioView.AI
        </Typography>

        <br />
        <Input
          hint="Email Address"
          field={getFieldProps}
          meta={getFieldMeta}
          fieldName="email"
          isEmail={true}
          readOnly={true}
        />
        <br />
        <Input
          hint="New Password"
          field={getFieldProps}
          meta={getFieldMeta}
          fieldName="password"
          as="password"
          isEmail={false}
        />
        <br />
        <Input
          hint="Confirm Password"
          field={getFieldProps}
          meta={getFieldMeta}
          fieldName="confirmPassword"
          as="password"
          isEmail={false}
        />
        <br />

        <LoadingButton
          variant="contained"
          type="submit"
          loading={isLoading}
          nonce={nonce}
          sx={{
            minWidth: "200px",
            borderRadius: 20,
          }}
        >
          Continue
        </LoadingButton>
      </div>
    </form>
  );
}
