import AuthChecker from "@/app/components/AuthChecker";
import { headers } from "next/dist/client/components/headers";
import Script from "next/script";

export default function Layout({ children }: { children: React.ReactNode }) {
  const nonce = headers().get("x-nonce");
  return (
    <>
      <AuthChecker nonce={nonce!}>{children}</AuthChecker>
      <Script nonce={nonce!} />
    </>
  );
}
