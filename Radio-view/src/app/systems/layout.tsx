import AuthChecker from "@/app/components/AuthChecker";
import { headers } from "next/headers";
import SystemsLayout from "./systems_layout";

export default function Layout({ children }: { children: React.ReactNode }) {
  const nonce = headers().get("x-nonce")!;
  return (
    <AuthChecker nonce={nonce}>
      <SystemsLayout nonce={nonce}>{children}</SystemsLayout>
    </AuthChecker>
  );
}
