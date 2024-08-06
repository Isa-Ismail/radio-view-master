import { useAppSnackbar } from "@/hooks/snackbar";
import { useChangePasswordMutation } from "@/store/auth/authApi";
import { selectAuth } from "@/store/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Dialog, DialogActions, DialogContent, Typography } from "@mui/material";
import { useFormik } from "formik";

import { useClientAxiosClient } from "@/hooks/axios";
import { getValidAuthTokens } from "@/utils/cookie";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as yup from "yup";
import AppButton from "./Button";
import Input from "./Input";
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
export default function PasswordUpdateDialog({
  open,
  close,
  nonce,
}: {
  open: boolean;
  close: () => void;
  nonce: string;
}) {
  const { user } = useAppSelector(selectAuth);
  const { token } = getValidAuthTokens();

  const { email } = user || {};
  const [mutate] = useChangePasswordMutation();
  const { errorSnackbar, successSnackbar } = useAppSnackbar();
  const [loading, setLoading] = useState(false);

  const axios = useClientAxiosClient();
  const router = useRouter();
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
      console.log("res", error);
      if ("data" in error) {
        console.log("error.data", error.data);
        if (error.data.error) {
          message = error.data.error;
        } else {
          message = error.data;
        }
      }
      errorSnackbar(message);
    } else {
      successSnackbar("Password changed successfully");
      //   router.push("/settings");
      close();
    }
    setLoading(false);
  };

  const dispatch = useAppDispatch();

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

  return (
    <Dialog
      open={open}
      aria-labelledby="form-dialog-title"
      PaperProps={{
        style: {
          width: "500px",
          overflowY: "auto",
        },
      }}>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Typography variant="h6">
            Your password has expired please update it to continue
          </Typography>
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
        </DialogContent>
        <DialogActions>
          <AppButton
            nonce={nonce}
            type="submit"
            variant="contained"
            color="primary"
            loading={loading}>
            Change Password
          </AppButton>
          {/* <AppButton variant="contained" color="primary" onClick={() => dispatch(logout({}))}>
            Logout
          </AppButton> */}
        </DialogActions>
      </form>
    </Dialog>
  );
}
