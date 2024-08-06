"use client";
import DefaultViewLayout from "@/app/components/DataViewLayout";
import { useAddClinicianDataMutation } from "@/store/clinician/clinicianApi";

export default function ClinicianLayout({
  children,
  nonce,
}: {
  children: React.ReactNode;
  nonce: string;
}) {
  const [mutate, { isLoading }] = useAddClinicianDataMutation({
    fixedCacheKey: "clinician-mutate",
  });
  return (
    <DefaultViewLayout nonce={nonce} route="clinicians" name="Clinician" formLoading={isLoading}>
      {children}
    </DefaultViewLayout>
  );
}
