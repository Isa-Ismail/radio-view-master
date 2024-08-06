import { headers } from "next/headers";
import DashboardPage from "./dashboard_page";
export const dynamic = "force-dynamic";
export default function Page() {
  const nonce = headers().get("x-nonce")!;
  return <DashboardPage nonce={nonce}></DashboardPage>;
}
