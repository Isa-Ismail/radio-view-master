import AuthChecker from "@/app/components/AuthChecker";
import { headers } from "next/headers";
import ClinicianLayout from "./clinician_layout";

export default function Layout({ children }: { children: React.ReactNode }) {
  const nonce = headers().get("x-nonce")!;
  return (
    <AuthChecker nonce={nonce}>
      <ClinicianLayout nonce={nonce}>{children}</ClinicianLayout>
    </AuthChecker>
  );
}
