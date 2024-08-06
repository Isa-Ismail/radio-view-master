"use client";
import DashboardCards, { DashboardCardItem } from "@/app/components/DashboardCards";
import { AdminRole } from "@/models/user";
import { selectAuth } from "@/store/auth/authSlice";
import { useGetDataQuery, useGetGraphQuery } from "@/store/dashboard/dashboardApi";
import { useAppSelector } from "@/store/hooks";
import { getValidAuthTokens } from "@/utils/cookie";
import { BarChart } from "@mui/x-charts/BarChart";

import { useClientAxiosClient } from "@/hooks/axios";
import {
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useEffect, useRef, useState } from "react";

export default function DashboardPage({ nonce }: { nonce: string }) {
  const { user } = useAppSelector(selectAuth);
  const { token } = getValidAuthTokens();
  const axios = useClientAxiosClient();

  const { isLoading: isDashboardLoading, data: dashboardData } = useGetDataQuery(
    {
      token: token || "",

      axios,
    },
    { skip: !token }
  );
  const [dashboardCards, setDashboardCards] = useState<DashboardCardItem[] | undefined>(undefined);
  useEffect(() => {
    if (dashboardData) {
      const role = user?.adminRole();
      const { systems, sites, studies, clincians } = dashboardData;
      const cards: DashboardCardItem[] = [
        {
          title: "Total No. of Clinicians",
          value: `${clincians}`,
          icon: "clinicians",
        },
        {
          title: "Total No. of Studies",
          value: `${studies}`,
          icon: "studies",
        },
      ];
      if (role === AdminRole.superAdmin) {
        cards.push({
          title: "Total No. of Systems",
          value: `${systems}`,
          icon: "systems",
        });
      }
      if (role !== AdminRole.siteAdmin) {
        cards.push({
          title: "Total No. of Sites",
          value: `${sites}`,
          icon: "sites",
        });
      }

      setDashboardCards(cards);
    }
  }, [user, dashboardData]);

  const [id, setId] = useState<string | undefined>(undefined);
  const now = useRef(new Date());
  const [year, setYear] = useState<number>(0);

  const [years, setYears] = useState<number[]>([]);

  useEffect(() => {
    setYear(now.current.getFullYear());
    setYears(Array.from({ length: 10 }, (_, i) => now.current.getFullYear() - i));
  }, []);
  useEffect(() => {
    switch (user?.adminRole()) {
      case AdminRole.systemAdmin:
        setId(user.systemId!);
        break;
      case AdminRole.siteAdmin:
        setId(user.siteId!);
        break;
    }
  }, [id, user]);

  const {
    isLoading: isGraphLoading,
    data: graphData,
    error: graphError,
    isFetching: isGraphFetching,
  } = useGetGraphQuery(
    {
      token: token || "",
      year: year,
      id: id || "",
      axios,
    },
    {
      skip: !token || year === 0,
    }
  );
  const theme = useTheme();

  const primaryColor = theme.palette.primary.main;

  return (
    <div className="dashboard">
      <div className="dashboard-cards">
        <DashboardCards
          nonce={nonce}
          items={dashboardCards}
          loading={isDashboardLoading}></DashboardCards>
      </div>

      <br />
      <div className="graph">
        <Card
          nonce={nonce}
          sx={{
            width: "100%",

            borderRadius: 4,
          }}>
          <CardContent>
            <div className="flex justify-between">
              <Typography variant="h5">
                Total No. of Studies
                {isGraphFetching && <CircularProgress size={30} className="ml-2" />}
              </Typography>
              <div>
                <FormControl fullWidth size="small">
                  <InputLabel id="year-select-label">Year</InputLabel>
                  <Select
                    labelId="year-select-label"
                    id="year-select"
                    value={year}
                    label="Year"
                    onChange={(e) => {
                      setYear(e.target.value as number);
                    }}>
                    {years.map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </div>
          </CardContent>

          {isGraphLoading || isGraphFetching || graphError || !graphData ? (
            <></>
          ) : (
            <BarChart
              dataset={graphData!}
              colors={[primaryColor]}
              xAxis={[{ scaleType: "band", dataKey: "month_name" }]}
              series={[{ type: "bar", dataKey: "data" }]}
              height={500}
            />
          )}
        </Card>
      </div>
    </div>
  );
}
