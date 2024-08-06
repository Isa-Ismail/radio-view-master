"use client";
import Input from "@/app/components/Input";
import { useClientAxiosClient } from "@/hooks/axios";
import { useAppSnackbar } from "@/hooks/snackbar";
import {
  useForgotPasswordMutation,
  useVerifyForgotPasswordOtpMutation,
} from "@/store/auth/authApi";
import { LoadingButton } from "@mui/lab";
import { CircularProgress, Typography } from "@mui/material";
import { useFormik } from "formik";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useRef, useState } from "react";
import { PinInput } from "react-input-pin-code";
import * as yup from "yup";

type ForgetPasswordForm = {
  email: string | undefined;
};

const validationSchema = yup.object<ForgetPasswordForm>().shape({
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email"),
});

export default function ForgetPassword({ nonce }: { nonce: string }) {
  return (
    <Suspense>
      <ForgetPasswordForm nonce={nonce}></ForgetPasswordForm>
    </Suspense>
  );
}

function ForgetPasswordForm({ nonce }: { nonce: string }) {
  const [isLoading, setLoading] = useState(false);
  const { errorSnackbar, successSnackbar } = useAppSnackbar();

  const [isSent, setSent] = useState(false);
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const queryParams = useSearchParams();

  const router = useRouter();
  const [mutate] = useForgotPasswordMutation();
  const [mutateVerify] = useVerifyForgotPasswordOtpMutation();
  const [canResend, setCanResend] = useState(false);
  const [resending, setResending] = useState(false);
  const resendTimer = useRef<any>(null);
  const resendInTimer = useRef<any>(null);
  const [resendIn, setResendIn] = useState(30);
  const setTimer = () => {
    setCanResend(false);
    setResendIn(30);
    if (resendTimer.current) clearTimeout(resendTimer.current);
    if (resendInTimer.current) clearInterval(resendInTimer.current);
    resendTimer.current = setTimeout(() => {
      setCanResend(true);
      setResendIn(30);
      clearInterval(resendInTimer.current);
    }, 30000);
    resendInTimer.current = setInterval(() => {
      setResendIn((prev) => prev - 1);
    }, 1000);
  };
  const axios = useClientAxiosClient();

  const resendOtp = async () => {
    setResending(true);
    const res = await mutate({
      email: values.email!,
      axios,
    });
    if ("error" in res) {
      let message = "Something went wrong";
      const error = res.error as any;
      if ("data" in error) {
        message = (error.data as any).error;
      }

      errorSnackbar(message);
    } else {
      successSnackbar("OTP sent to your email");
      setSent(true);
    }
    setResending(false);
    setTimer();
  };
  const onSubmit = async (data: ForgetPasswordForm) => {
    setLoading(true);
    const { email } = data;
    if (isSent) {
      const res = await mutateVerify({
        email: email!,
        otp: otpValues.join(""),
        axios,
      });
      if ("error" in res) {
        console.log("Error", res.error);
        let message = "Something went wrong";
        const error = res.error as any;
        if ("data" in error) {
          message = (error.data as any).error;
          if (!message) {
            message = error.data;
          }
        }

        errorSnackbar(message);
      } else {
        successSnackbar(
          "OTP verified successfully please reset your password now"
        );
        router.push("/forgot-password/reset?email=" + email);
      }
      setLoading(false);
      return;
    }
    setCanResend(false);

    const res = await mutate({
      email: email!,
      axios,
    });
    if ("error" in res) {
      console.log("error", res.error);
      let message = "Something went wrong";
      const error = res.error as any;
      if ("data" in error) {
        message = (error.data as any).error;
        if (!message) {
          message = error.data;
        }
      }
      setLoading(false);
      console.log("error", message);
      errorSnackbar(message);
    } else {
      successSnackbar("Password reset link sent to your email");
      setSent(true);
    }
    setLoading(false);
    setTimer();
  };

  const {
    handleSubmit,
    errors,
    values,
    getFieldProps,
    setFieldValue,
    getFieldMeta,
  } = useFormik<ForgetPasswordForm>({
    validateOnChange: false,
    validateOnBlur: true,
    initialValues: {
      email: "",
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
          alt="RadioView Logo"
          width={150}
          height={150}
          priority={true}
        />
        <Typography className="pt-2" variant="h6">
          RadioView.AI
        </Typography>
        <br />
        <Typography variant="h4">
          {!isSent ? <div>Reset Password</div> : <div>OTP verification</div>}
        </Typography>
        <br />
        <Typography className="text-center">
          {!isSent ? (
            <div>
              Please enter your email address associated with your RadioView.AI
              account to receive a reset code
            </div>
          ) : (
            <div>OTP was sent to your email</div>
          )}
        </Typography>

        <br />
        {!isSent && (
          <Input
            hint="E-mail Address"
            field={getFieldProps}
            meta={getFieldMeta}
            fieldName="email"
            isEmail={true}
          />
        )}
        {isSent && (
          <>
            <PinInput
              values={otpValues}
              placeholder="*"
              onChange={(value, index, values) => setOtpValues(values)}
            />
            <br />
            <div className="flex flex-row justify-center">
              <Typography className="text-center" variant="caption">
                Didnt receive the code?
                <LoadingButton
                  disabled={!canResend}
                  onClick={resendOtp}
                  variant="text"
                  loading={resending}
                  loadingIndicator={
                    <CircularProgress
                      size={20}
                      sx={{
                        color: "white",
                      }}
                      nonce={nonce}
                    />
                  }
                  nonce={nonce}
                  sx={{
                    borderRadius: 20,
                    minWidth: "100px",
                  }}
                >
                  {!resending && (
                    <Typography
                      variant="caption"
                      className={`${
                        !canResend ? "text-gray-500" : "text-blue-500"
                      } underline`}
                    >
                      {canResend ? "Resend" : "Resend in " + resendIn + "s"}
                    </Typography>
                  )}
                </LoadingButton>
              </Typography>
            </div>
          </>
        )}
        <br />
        <LoadingButton
          disabled={isSent && otpValues.join("").length < 6}
          variant="contained"
          type="submit"
          loading={isLoading}
          nonce={nonce}
          sx={{
            minWidth: "200px",
            borderRadius: 20,
          }}
        >
          {isSent ? "Verify OTP" : "Send OTP"}
        </LoadingButton>
      </div>
    </form>
  );
}
