import AuthChecker from "@/app/components/AuthChecker";
import { headers } from "next/headers";
import AppVersionLayout from "./app_version_layout";

export default function Layout({ children }: { children: React.ReactNode }) {
  const nonce = headers().get("x-nonce")!;
  return (
    <AuthChecker nonce={nonce}>
      <AppVersionLayout nonce={nonce}>{children}</AppVersionLayout>
    </AuthChecker>
  );
}
