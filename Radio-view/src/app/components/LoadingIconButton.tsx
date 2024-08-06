import { CircularProgress, IconButton } from "@mui/material";
import { useEffect, useState } from "react";

export default function LoadingIconButton({
  loading,
  id,
  children,
  onClick,
  ...props
}: {
  loading?: boolean;

  children: React.ReactNode;
  onClick?: (setLoading: (loading: boolean) => void) => void;
  id?: string;
}) {
  let [loadingState, setLoadingState] = useState(false);

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
    <>
      <IconButton id={id} onClick={_onClick} {...props}>
        {loadingState ? <CircularProgress size={24} color="inherit" /> : children}
      </IconButton>
    </>
  );
}
