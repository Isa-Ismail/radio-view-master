import { useSnackbar } from "notistack";

export const useAppSnackbar = () => {
  const { enqueueSnackbar } = useSnackbar();
  return {
    enqueueSnackbar: (message: string, variant: "error" | "success") => {
      enqueueSnackbar(message, {
        variant,
        autoHideDuration: 2000,
        hideIconVariant: true,
      });
    },
    errorSnackbar: (message: string) => {
      enqueueSnackbar(message, {
        variant: "error",
        autoHideDuration: 2000,
        hideIconVariant: true,
      });
    },
    successSnackbar: (message: string) => {
      enqueueSnackbar(message, {
        variant: "success",
        autoHideDuration: 2000,
        hideIconVariant: true,
      });
    },
    infoSnackbar: (message: string) => {
      enqueueSnackbar(message, {
        variant: "info",
        autoHideDuration: 2000,
        hideIconVariant: true,
      });
    },
  };
};
