import { headers } from "next/headers";
import SiteMachineLogsPage from "./site-machine-logs-page";

export default function Page() {
  const nonce = headers().get("x-nonce")!;
  return <SiteMachineLogsPage nonce={nonce} />;
}
