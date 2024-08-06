"use client";
import DefaultViewLayout from "@/app/components/DataViewLayout";
import { useAddSystemDataMutation } from "@/store/system/systemApi";

export default function SystemsLayout({
  children,
  nonce,
}: {
  children: React.ReactNode;
  nonce: string;
}) {
  const [mutate, { isLoading }] = useAddSystemDataMutation({ fixedCacheKey: "system-mutate" });
  return (
    <DefaultViewLayout route="systems" name="System" formLoading={isLoading} nonce={nonce}>
      {children}
    </DefaultViewLayout>
  );
}
