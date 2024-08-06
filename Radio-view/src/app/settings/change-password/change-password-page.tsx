"use client";
import AppButton from "@/app/components/Button";
import Input from "@/app/components/Input";
import { useClientAxiosClient } from "@/hooks/axios";
import { useAppSnackbar } from "@/hooks/snackbar";
import { AdminRole } from "@/models/user";
import { useChangePasswordMutation } from "@/store/auth/authApi";
import { selectAuth } from "@/store/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getValidAuthTokens } from "@/utils/cookie";
import { Typography } from "@mui/material";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as yup from "yup";
type ChangePasswordForm = {
  email: string | undefined;
  currentPassword: string | undefined;
  password: string | undefined;
  confirmPassword: string | undefined;
};

const validationSchema = yup.object<ChangePasswordForm>().shape({
  email: yup.string().email().required(),
  currentPassword: yup.string().required("Current password is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be atleast 8 characters")
    .max(30, "Password must be less then 30 characters")

    .matches(RegExp("[A-Z]"), "Password must contain at least one uppercase letter")
    .matches(RegExp("[a-z]"), "Password must contain at least one lowercase letter")
    .matches(RegExp("[0-9]"), "Password must contain at least one number")
    .matches(
      RegExp('[!@#$%^&*(),.?":{}|<>]'),
      "Password must contain at least one special character"
    )
    .notOneOf([yup.ref("currentPassword")], "New password must be different from current password"),
  confirmPassword: yup
    .string()
    .required("Confirm your password")
    .oneOf([yup.ref("password")], "Passwords do not match"),
});

export default function ChangePassword({ nonce }: { nonce: string }) {
  const { user } = useAppSelector(selectAuth);
  const [loading, setLoading] = useState(false);
  const [mutate] = useChangePasswordMutation();
  const { errorSnackbar, successSnackbar } = useAppSnackbar();
  const { token } = getValidAuthTokens();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const axios = useClientAxiosClient();

  const onSubmit = async (data: ChangePasswordForm) => {
    setLoading(true);

    const { email, password, currentPassword } = data;
    const res = await mutate({
      email: email!,
      oldPassword: currentPassword!,

      newPassword: password!,
      token: token!,
      axios,
    });
    if ("error" in res) {
      let message = "Something went wrong";
      const error = res.error as any;
      console.log("Error", res.error);
      if ("data" in error) {
        message = (error.data as any).error;
        if (!message) {
          message = error.data;
        }
      }

      errorSnackbar(message);
    } else {
      successSnackbar("Password changed successfully");
    }
    setLoading(false);
  };

  const { handleSubmit, getFieldProps, getFieldMeta } = useFormik<ChangePasswordForm>({
    initialValues: {
      email: user?.email || "",
      currentPassword: "",
      confirmPassword: "",
      password: "",
    },
    validateOnBlur: false,
    onSubmit,
    validationSchema: validationSchema,
  });
  if (user?.adminRole() === AdminRole.superAdmin) {
    return (
      <Typography variant="h6">
        You are logged in as super admin. Password changing is not allowed.
      </Typography>
    );
  }
  return (
    <form
      onSubmit={handleSubmit}
      nonce={nonce}
      style={{
        maxWidth: "500px",
      }}>
      <Typography variant="h6">Change Password</Typography>

      <br />
      <Input
        field={getFieldProps}
        fieldName="currentPassword"
        meta={getFieldMeta}
        as="password"
        label="Current Password"></Input>
      <br />
      <br />
      <Input
        field={getFieldProps}
        fieldName="password"
        meta={getFieldMeta}
        as="password"
        label="New Password"></Input>
      <br />
      <br />
      <Input
        field={getFieldProps}
        fieldName="confirmPassword"
        meta={getFieldMeta}
        as="password"
        label="Confirm Password"></Input>
      <br />
      <br />
      <AppButton nonce={nonce} type="submit" variant="contained" color="primary" loading={loading}>
        Change Password
      </AppButton>
    </form>
  );
}
