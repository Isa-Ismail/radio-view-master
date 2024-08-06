"use client";
import DefaultViewLayout from "@/app/components/DataViewLayout";
import { useAddSiteDataMutation } from "@/store/site/siteApi";

export default function SitesLayout({
  children,
  nonce,
}: {
  children: React.ReactNode;
  nonce: string;
}) {
  const [mutate, { isLoading }] = useAddSiteDataMutation({ fixedCacheKey: "site-mutate" });
  return (
    <DefaultViewLayout route="sites" name="Site" formLoading={isLoading} nonce={nonce}>
      {children}
    </DefaultViewLayout>
  );
}
