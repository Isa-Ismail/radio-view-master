"use client";
import DefaultViewLayout from "@/app/components/DataViewLayout";
import { useAddUpdateVersionMutation } from "@/store/app-version/appVersionApi";

export default function AppVersionLayout({
  children,
  nonce,
}: {
  children: React.ReactNode;
  nonce: string;
}) {
  const [mutate, { isLoading }] = useAddUpdateVersionMutation({
    fixedCacheKey: "app-version-mutate",
  });
  return (
    <DefaultViewLayout
      nonce={nonce}
      route="app-version"
      pruralTitle={false}
      name="App Version History"
      formLoading={isLoading}
      actionsTitle="Version">
      {children}
    </DefaultViewLayout>
  );
}
