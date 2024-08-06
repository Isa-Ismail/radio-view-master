import AuthChecker from "@/app/components/AuthChecker";
import { headers } from "next/headers";
import SitesLayout from "./sites_layout";

export default function Layout({ children }: { children: React.ReactNode }) {
  const nonce = headers().get("x-nonce")!;
  return (
    <AuthChecker nonce={nonce}>
      <SitesLayout nonce={nonce}>{children}</SitesLayout>
    </AuthChecker>
  );
}
