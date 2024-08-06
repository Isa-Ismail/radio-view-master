import { Theme, ThemeProvider, useTheme } from "@emotion/react";
import { LoadingButton } from "@mui/lab";
import { CircularProgress, createTheme } from "@mui/material";
import { useEffect, useState } from "react";

export default function AppButton({
  children,
  variant,
  onClick,
  loading,
  className,
  color,
  type,
  form,
  fullWidth,
  small,
  nonce,
}: {
  children?: React.ReactNode;
  variant?: "outlined" | "contained";
  onClick?: (setLoading: (loading: boolean) => void) => void;
  loading?: boolean;
  className?: string;
  color?: string;
  type?: "submit" | "reset" | "button" | undefined;
  form?: string;
  fullWidth?: boolean;
  small?: boolean;
  nonce: string;
}) {
  variant = variant ?? "contained";
  let theme: Theme = useTheme();
  if (color != "primary") {
    theme = createTheme({
      palette: {
        primary: {
          main: color ?? "#FFFFFF",
        },
      },
    });
  }
  const [loadingState, setLoadingState] = useState(false);

  async function _onClick() {
    if (loadingState) return;
    if (onClick) {
      onClick(setLoadingState);
    }
  }

  useEffect(() => {
    setLoadingState(loading || false);
  }, [loading]);
  return (
    <span className={className}>
      <ThemeProvider theme={theme}>
        <LoadingButton
          fullWidth={fullWidth}
          form={form}
          type={type}
          onClick={_onClick}
          loadingIndicator={<CircularProgress className="p-2" />}
          variant={variant}
          loading={loadingState}
          nonce={nonce}
          sx={{
            border: "1px solid #FFFFFF",
            height: small ? null : 40,
            borderRadius: 20,
            minWidth: 100,
          }}>
          {children}
        </LoadingButton>
      </ThemeProvider>
    </span>
  );
}
