"use client";

import { useClientAxiosClient } from "@/hooks/axios";
import { useAppSnackbar } from "@/hooks/snackbar";
import { AdminRole } from "@/models/user";
import { selectApp } from "@/store/app/appSlice";
import { useGetAuthDataQuery } from "@/store/auth/authApi";
import { selectAuth } from "@/store/auth/authSlice";
import { useAppSelector } from "@/store/hooks";
import { getValidAuthTokens } from "@/utils/cookie";
import { CircularProgress } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import Appbar from "./Appbar";
import Footer from "./Footer";
import NavigationRail, {
  siteAdminRoutes,
  superAdminRoutes,
  systemAdminRoutes,
} from "./NavigationRail";
import PasswordUpdateChecker from "./PasswordUpdateChecker";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
};

export default function AuthChecker({
  children,
  nonce,
}: {
  children: React.ReactNode;
  nonce: string;
}) {
  return (
    <Suspense>
      <AuthCheckerSuspense nonce={nonce}>{children}</AuthCheckerSuspense>
    </Suspense>
  );
}

function AuthCheckerSuspense({
  children,
  nonce,
}: {
  children: React.ReactNode;
  nonce: string;
}) {
  const dispatch = useDispatch();
  const { push } = useRouter();
  const { user } = useAppSelector(selectAuth) ?? {};
  const {} = useAppSelector(selectApp);

  const { token, refreshToken } = getValidAuthTokens();

  const axios = useClientAxiosClient();

  const [hasShownToast, setHasShownToast] = useState(false);

  const { isLoading, currentData, isFetching } = useGetAuthDataQuery(
    { token: token || "", refreshToken: refreshToken || "", axios },
    { skip: !token }
  );

  const pathName = usePathname();

  // useEffect(() => {
  //   if (!token || (!currentData && !isFetching && !isLoading)) {
  //     if (pathName.includes("/clinician-login")) {
  //       return;
  //     }
  //     push("/clinician-login");
  //   }
  // }, [token, push, dispatch, currentData, isFetching, isLoading, pathName]);

  const snackbar = useRef(useAppSnackbar());
  useEffect(() => {
    const { errorSnackbar } = snackbar.current;
    let authenticatedRoutes: string[] = [];
    const adminRole = user?.adminRole();
    if (adminRole === AdminRole.superAdmin) {
      authenticatedRoutes = superAdminRoutes.map((route) => route.path);
    } else if (adminRole === AdminRole.systemAdmin) {
      authenticatedRoutes = systemAdminRoutes.map((route) => route.path);
    } else if (adminRole === AdminRole.siteAdmin) {
      authenticatedRoutes = siteAdminRoutes.map((route) => route.path);
    }
    let canNavigate = true;
    if (authenticatedRoutes.length > 0) {
      authenticatedRoutes.push("/settings");
      for (let i = 0; i < authenticatedRoutes.length; i++) {
        if (pathName.includes(authenticatedRoutes[i])) {
          canNavigate = true;
          break;
        } else {
          canNavigate = false;
        }
      }
    }
    if (!canNavigate) {
      errorSnackbar("You are not authorized to access this page");
      push("/");
    }
  }, [snackbar, pathName, push, user]);

  useEffect(() => {
    const { infoSnackbar } = snackbar.current;

    const handleResize = () => {
      if (window.innerWidth < 890 && !hasShownToast) {
        infoSnackbar(
          "Preview the admin panel in landscape mode to enhance the screen size in tablet view"
        );
        setHasShownToast(true);
      }
    };

    window.addEventListener("resize", handleResize);

    // Check initial size
    handleResize();

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, [hasShownToast, snackbar]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <CircularProgress size={50} />
      </div>
    );
  }

  if (!currentData?.user) {
    return <>{children}</>;
  }
  return (
    <PasswordUpdateChecker nonce={nonce} user={currentData.user!}>
      <div className="flex flex-row">
        <NavigationRail nonce={nonce}></NavigationRail>
        <div
          style={{
            width: "calc(100vw - 120px)",
          }}
          nonce={nonce}
        >
          <div className="content">
            <div className="mb-[5rem]">
              <Appbar nonce={nonce}></Appbar>
            </div>
            <div className="content-inner">{children}</div>
            <Footer />
          </div>
        </div>
      </div>
    </PasswordUpdateChecker>
  );
}
