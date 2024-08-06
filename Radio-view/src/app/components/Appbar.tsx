"use client";
import { AdminRole } from "@/models/user";
import { selectAuth } from "@/store/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import useLogout from "@/utils/logout";
import { Logout, Settings } from "@mui/icons-material";
import { AppBar, Box, Toolbar, Typography, styled } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import LoadingIconButton from "./LoadingIconButton";

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  minHeight: "var(--appbar-height)",
  alignItems: "center",
}));

export default function Appbar({ nonce }: { nonce: string }) {
  const { user, logging_out } = useAppSelector(selectAuth) ?? {};
  let title: string;
  switch (user?.adminRole()) {
    case AdminRole.superAdmin:
      title = "RadioView Super Admin";
      break;
    case AdminRole.systemAdmin:
      title = user?.systemFullName ?? "RadioView System Admin";
      break;
    case AdminRole.siteAdmin:
      title = user?.siteName ?? "RadioView Site Admin";
      break;
    default:
      title = "";
  }
  const dispatch = useAppDispatch();
  const path = usePathname();
  const isSettings = path.includes("/settings");
  const router = useRouter();
  const logout = useLogout();
  return (
    <Box sx={{ flexGrow: 1 }} nonce={nonce}>
      <AppBar
        position="static"
        style={{
          background: "var(--surface)",
          position: "absolute",
          zIndex: "1000000",
        }}
        elevation={0}
        nonce={nonce!}
      >
        <StyledToolbar className="appbar">
          <Typography variant="h5" component={"div"}>
            {title}
          </Typography>
          <div
            style={{
              flexGrow: 1,
            }}
            nonce={nonce}
          >
            <span className="mr-5">
              <LoadingIconButton
                onClick={() => {
                  // href="/settings" LinkComponent={Link} target="_self"
                  router.push("/settings");
                }}
              >
                <Settings
                  fontSize="medium"
                  color={isSettings ? "inherit" : "disabled"}
                />
              </LoadingIconButton>
            </span>
            <LoadingIconButton
              loading={logging_out}
              onClick={() => {
                logout.call();
                // router.replace("/signin");
              }}
            >
              <Logout fontSize="medium" color="disabled" />
            </LoadingIconButton>
          </div>
        </StyledToolbar>
      </AppBar>
    </Box>
  );
}
