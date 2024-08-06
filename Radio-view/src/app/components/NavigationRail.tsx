"use client";
import { AdminRole } from "@/models/user";
import { selectAuth } from "@/store/auth/authSlice";
import { setClinicianFilter } from "@/store/clinician/clinicianSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSiteFilter } from "@/store/site/siteSlice";
import { setSystemFilter } from "@/store/system/systemSlice";
import { Tab, Tabs } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type Route = {
  label: string;
  icon: string;
  path: string;
};

export const NavigationRailIcon = ({
  name,
  active,
  size = 24,
}: {
  name: string;
  active: boolean;
  size?: number;
}) => {
  let path = `/navigation_rail_icons/${name}/normal.png`;
  if (active) {
    path = `/navigation_rail_icons/${name}/active.png`;
  }
  return <Image src={path} alt="Icon" width={size} height={size} />;
};

const dashboardRoute: Route = {
  label: "Dashboard",
  icon: "dashboard",
  path: "/dashboard",
};
const systemsRoute: Route = {
  label: "Systems",
  icon: "systems",

  path: "/systems",
};
const sitesRoute: Route = {
  label: "Sites",
  icon: "sites",
  path: "/sites",
};
const clinciansRoute: Route = {
  label: "Clinicians",
  icon: "clinicians",
  path: "/clinicians",
};
const studiesRoute: Route = {
  label: "Studies",
  icon: "studies",
  path: "/studies",
};
const siteMachineLogsRoute: Route = {
  label: "Logs",
  icon: "logs",
  path: "/site-machine-logs",
};
const activitiesRoute: Route = {
  label: "Activities",
  icon: "activities",
  path: "/activities",
};
const appVersionRoute: Route = {
  label: "App Version History",
  icon: "version-history",
  path: "/app-version",
};

export const superAdminRoutes: Route[] = [
  dashboardRoute,
  systemsRoute,
  sitesRoute,
  clinciansRoute,
  studiesRoute,
  siteMachineLogsRoute,
  activitiesRoute,
  appVersionRoute,
];
export const systemAdminRoutes: Route[] = [
  dashboardRoute,
  sitesRoute,
  clinciansRoute,
  studiesRoute,
];
export const siteAdminRoutes: Route[] = [dashboardRoute, clinciansRoute, studiesRoute];

const routes = {
  [AdminRole.superAdmin]: superAdminRoutes,
  [AdminRole.systemAdmin]: systemAdminRoutes,
  [AdminRole.siteAdmin]: siteAdminRoutes,
};
export default function NavigationRail({ nonce }: { nonce: string }) {
  const [value, setValue] = useState<number | undefined>(0);
  const dispatch = useAppDispatch();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    dispatch(setSiteFilter(undefined));
    dispatch(setSystemFilter(undefined));
    dispatch(setClinicianFilter(undefined));
  };
  const { user } = useAppSelector(selectAuth);

  const items = useMemo<Route[]>(() => {
    const adminRole = user?.adminRole();
    if (adminRole === undefined) {
      return [];
    }

    const _routes = routes[adminRole].filter((route) => {
      return route.path !== "/settings";
    });

    return _routes;
  }, [user]);

  const router = useRouter();
  const path = usePathname();
  const isSettings = path.includes("/settings");

  useEffect(() => {
    items.forEach((item, index) => {
      if (isSettings) {
        setValue(undefined);
      } else if (path.includes(item.path)) {
        setValue(index);
      }
    });
  }, [path, value, router, items, isSettings]);
  return (
    <>
      <div className="navigation-rail">
        <div
          className="flex items-center justify-center mb-3"
          onClick={() => {
            router.push("/dashboard");
          }}
          style={{ cursor: "pointer" }}
          nonce={nonce}>
          <Image src="/logo.png" width={70} height={70} alt="logo" />
        </div>
        <div className="navigation-rail-items ">
          <div className="flex flex-col items-center">
            <br />
            <Tabs
              orientation="vertical"
              variant="scrollable"
              indicatorColor="secondary"
              value={value}
              onChange={handleChange}
              aria-label="Vertical tabs example"
              TabIndicatorProps={{
                sx: {
                  left: 0,
                  backgroundColor: "white",
                },
              }}
              nonce={nonce}
              sx={{
                "& .MuiTab-root.Mui-selected": {
                  color: "white",
                },
                "& .MuiTab-root": {
                  color: "grey",
                  textTransform: "none",
                },
              }}>
              {items.map((item, index) => {
                return (
                  <Tab
                    id={`vertical-tab-${index}`}
                    label={item.label}
                    nonce={nonce}
                    sx={{
                      "& button": {},
                    }}
                    icon={<NavigationRailIcon name={item.icon} active={value === index} />}
                    LinkComponent={Link}
                    href={item.path}
                    key={index}
                  />
                );
              })}
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
}
