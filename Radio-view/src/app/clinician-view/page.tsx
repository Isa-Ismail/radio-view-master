"use client";

import { QueryClient, QueryClientProvider } from "react-query";
import SidePanel from "./SidePanel";
import { useState } from "react";
import { Skeleton, Typography } from "@mui/material";
import Image from "next/image";

const Page = () => {
  // make a loading logic where screen is stuck for 5 minutes
  const [loading, setLoading] = useState(true);

  setTimeout(() => {
    setLoading(false);
  }, 3000);

  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      {loading ? (
        <div className="flex mt-[7rem] justify-center items-center h-[25rem]">
          <div className="flex justify-center items-center flex-col gap-2">
            <Image alt="logo" src={"/logo.png"} width={70} height={70} />
            <Skeleton width={200} height={30} />
            <Typography variant="h6">Loading... </Typography>
            You’re almost done! Sometimes it will take time, so be patient...
          </div>
        </div>
      ) : (
        <SidePanel />
      )}
    </QueryClientProvider>
  );
};

export default Page;
