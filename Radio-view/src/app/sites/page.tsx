import { headers } from "next/headers";
import SitesPage from "./sites_page";

export default function Page() {
  const nonce = headers().get("x-nonce")!;
  return <SitesPage nonce={nonce} />;
}
