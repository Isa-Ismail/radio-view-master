import { useClientAxiosClient } from "@/hooks/axios";
import { AppUser } from "@/models/user";
import {
  hidePasswordUpdateDialog,
  selectApp,
  showPasswordUpdateDialog,
} from "@/store/app/appSlice";
import { useCheckPasswordUpdateQuery } from "@/store/auth/authApi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect } from "react";
import PasswordUpdateDialog from "./PasswordUpdateDialog";

export default function PasswordUpdateChecker({
  user,
  children,
  nonce,
}: {
  user: AppUser;
  children: React.ReactNode;
  nonce: string;
}) {
  const axios = useClientAxiosClient();
  const dispatch = useAppDispatch();

  const { data } = useCheckPasswordUpdateQuery(
    {
      email: user.email,
      axios,
    },
    {
      skip: !user?.email,
      refetchOnMountOrArgChange: true,
    }
  );

  const { passwordUpdateDialogOpen, passwordUpdateDialogShownOnce } = useAppSelector(selectApp);

  let isSuperAdmin: boolean;
  let shouldShowUpdatePasswordDialog = false;
  if (user === null) {
    isSuperAdmin = true;
    shouldShowUpdatePasswordDialog = false;
  } else {
    isSuperAdmin = user?.isSuperAdmin() === true;
    shouldShowUpdatePasswordDialog =
      data === true && !isSuperAdmin && !passwordUpdateDialogShownOnce;
  }
  useEffect(() => {
    if (shouldShowUpdatePasswordDialog) {
      dispatch(showPasswordUpdateDialog());
    }
  }, [dispatch, shouldShowUpdatePasswordDialog]);

  return (
    <>
      {children}

      <PasswordUpdateDialog
        nonce={nonce}
        open={passwordUpdateDialogOpen}
        close={() => {
          dispatch(hidePasswordUpdateDialog());
        }}></PasswordUpdateDialog>
    </>
  );
}
