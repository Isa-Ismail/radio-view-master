"use client";

import { QueryClient, QueryClientProvider } from "react-query";
import SidePanel from "./SidePanel";

const Page = () => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <SidePanel />
    </QueryClientProvider>
  );
};

export default Page;
