"use client";
import Input from "@/app/components/Input";
import { useClientAxiosClient } from "@/hooks/axios";
import { useAppSnackbar } from "@/hooks/snackbar";
import { useLoginMutation } from "@/store/auth/authApi";
import { LoadingButton } from "@mui/lab";
import { Typography } from "@mui/material";
import { useFormik } from "formik";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import useUserStore from "@/store/zustand/context";
import * as yup from "yup";
import { setCookie } from "cookies-next";
type SignInForm = {
  username: string | undefined;
  password: string | undefined;
};

const validationSchema = yup.object<SignInForm>().shape({
  username: yup
    .string()
    .required("Email is required")
    .email("Email is not valid"),
  password: yup.string().required("Password is required"),
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
  const { setUserData, setToken, setRefreshToken } = useUserStore();
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
  const onSubmit = async (data: SignInForm) => {
    setLoading(true);
    const { username, password } = data;
    const passwordContainsDigit = /\d/.test(password!);
    if (!passwordContainsDigit) {
      successSnackbar(
        "Please reset your password using the forget-password method to continue."
      );
      setLoading(false);
      router.push("/forgot-password?email=" + username);
      return;
    }
    try {
      const res = await fetch("/api/clinician-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: username,
          password: password,
        }),
      });

      const result = await res.json();

      if (result.error) {
        let message = "Invalid Credentials.";
        const error = result.error;
        if (error.data) {
          message = error.data.error || error.data;
        }
        errorSnackbar(message);
      } else {
        // Set cookies
        // setCookie("userData", JSON.stringify(result.User_Info), {
        //   maxAge: 30 * 24 * 60 * 60, // 30 days
        //   path: "/",
        //   secure: process.env.NODE_ENV === "production",
        //   sameSite: "strict",
        // });
        setCookie("auth_token", result.token, {
          maxAge: 30 * 24 * 60 * 60, // 30 days
          path: "/",
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });
        setCookie("auth_refresh_token", result.refresh_token, {
          maxAge: 30 * 24 * 60 * 60, // 30 days
          path: "/",
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });
        setUserData(result.User_Info);
        setToken(result.token);
        setRefreshToken(result.refresh_token);
        router.push("/studies");
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
      password: undefined,
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
        <Typography variant="h4">Let’s Get Started </Typography>
        <br />
        <Typography className="text-center">
          Welcome to RadioView.AI Sign in as Clinician
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
          hint="Password"
          as="password"
          field={getFieldProps}
          meta={getFieldMeta}
          fieldName="password"
        />
        <br />
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
          Sign In
        </LoadingButton>
        <br />
        <div className="flex justify-center w-full">
          <Link
            href="/forgot-password"
            target="_self"
            aria-disabled={isLoading}
            className={`${isLoading ? "pointer-events-none" : ""}`}
          >
            <Typography
              variant="body1"
              className="cursor-pointer text-blue-500 hover:underline"
            >
              Forgot Password?
            </Typography>
          </Link>
        </div>
        <br />
        <div className="flex justify-center w-full">
          <Link
            href="/guest-login"
            target="_self"
            aria-disabled={isLoading}
            className={`${isLoading ? "pointer-events-none" : ""}`}
          >
            <Typography
              variant="body1"
              className="cursor-pointer hover:underline"
            >
              Sign in as Guest
            </Typography>
          </Link>
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
