import { headers } from "next/headers";
import SystemsPage from "./systems_page";

export default function Page() {
  const nonce = headers().get("x-nonce")!;
  return <SystemsPage nonce={nonce} />;
}
