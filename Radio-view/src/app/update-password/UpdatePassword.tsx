"use client";
import Input from "@/app/components/Input";
import { useClientAxiosClient } from "@/hooks/axios";
import { useAppSnackbar } from "@/hooks/snackbar";
import { useLoginMutation } from "@/store/auth/authApi";
import { Close } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Typography } from "@mui/material";
import { useFormik } from "formik";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import * as yup from "yup";
type SignInForm = {
  username: string | undefined;
  newPassword: string | undefined;
  confirmPassword: string | undefined;
};

const validationSchema = yup.object<SignInForm>().shape({
  username: yup
    .string()
    .required("Email is required")
    .email("Email is not valid"),
  newPassword: yup.string().required("New Password is required"),
  confirmPassword: yup.string().required("Confirm password is required"),
});
export default function SignIn({ nonce }: { nonce: string }) {
  return (
    <Suspense>
      <SignInForm nonce={nonce} />
    </Suspense>
  );
}

function SignInForm({ nonce }: { nonce: string }) {
  const searchParams = useSearchParams();

  const [isLoading, setLoading] = useState(false);
  const { errorSnackbar, successSnackbar } = useAppSnackbar();
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    if (searchParams.get("session_expired")) {
      setSessionExpired(true);
    } else {
      setSessionExpired(false);
    }
  }, [searchParams, errorSnackbar]);

  const router = useRouter();
  const [mutate] = useLoginMutation();
  const axios = useClientAxiosClient();
  const onSubmit = async (data: SignInForm) => {
    setLoading(true);
    const { username, newPassword, confirmPassword } = data;
    try {
      const res = await fetch("/api/update-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: username,
          password: newPassword,
        }),
      });

      const result = await res.json();

      if (result.error) {
        let message = "Something went wrong";
        const error = result.error;
        if (error.data) {
          message = error.data.error || error.data;
        }
        errorSnackbar(message);
      } else {
        router.push("/clinician-login");
      }
    } catch (error) {
      console.error("Error", error);
      errorSnackbar("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
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
  } = useFormik<SignInForm>({
    validateOnChange: false,
    validateOnBlur: true,
    initialValues: {
      username: undefined,
      newPassword: undefined,
      confirmPassword: undefined,
    },
    onSubmit,
    validationSchema: validationSchema,
  });

  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  useEffect(() => {
    const password = values.newPassword || "";
    setPasswordRequirements({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  }, [values.newPassword]);

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center justify-center py-[4rem]"
    >
      <div
        className="flex flex-col items-center justify-start"
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
        <Typography variant="h4">Create New Password</Typography>
        <br />
        <Typography className="text-center">
          Please enter new password and Continue to create new password on
          RadioView.AI
        </Typography>

        <br />
        <Input
          hint="Email"
          isEmail={true}
          field={getFieldProps}
          meta={getFieldMeta}
          fieldName="username"
        />
        <br />
        <Input
          hint="New Password"
          as="password"
          field={getFieldProps}
          meta={getFieldMeta}
          fieldName="newPassword"
        />
        <br />
        <Input
          hint="Confirm Password"
          as="password"
          field={getFieldProps}
          meta={getFieldMeta}
          fieldName="confirmPassword"
        />
        <br />
        <div className="flex flex-col items-start justify-start mr-[22rem]">
          <RequirementItem
            met={passwordRequirements.length}
            text="Must be 8+ characters"
          />
          <RequirementItem
            met={passwordRequirements.uppercase}
            text="Must have 1 uppercase letter"
          />
          <RequirementItem
            met={passwordRequirements.lowercase}
            text="Must have 1 lowercase letter"
          />
          <RequirementItem
            met={passwordRequirements.number}
            text="Must have 1 number"
          />
          <RequirementItem
            met={passwordRequirements.special}
            text="Must have 1 special character"
          />
        </div>
        <br />
        <br />
        <div>
          <LoadingButton
            variant="contained"
            type="submit"
            loading={isLoading}
            nonce={nonce}
            sx={{
              borderRadius: 20,
              textTransform: "none",
              minWidth: "200px",

              fontSize: "1rem",
            }}
          >
            Continue
          </LoadingButton>
        </div>
        {sessionExpired && (
          <div className="p-4 rounded-md w-full mt-5">
            <Typography variant="body2" className="text-center" color="red">
              Your session was expired. Please login again.
            </Typography>
          </div>
        )}
      </div>
    </form>
  );
}

function RequirementItem({ met, text }: { met: boolean; text: string }) {
  return (
    <div className="flex items-center gap-2">
      {met ? (
        <Image
          height={15}
          width={15}
          src={met ? "/Tick.svg" : "/Cross.svg"}
          alt=""
        />
      ) : (
        <Close
          className="text-red-500 text-lg"
          style={{ height: 15, width: 15 }}
        />
      )}
      <Typography style={{ textDecoration: met ? "none" : "line-through" }}>
        {text}
      </Typography>
    </div>
  );
}
