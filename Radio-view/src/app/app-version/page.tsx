import { headers } from "next/headers";
import AppVersionPage from "./app-version-page";

export default function Page() {
  const nonce = headers().get("x-nonce")!;
  return <AppVersionPage nonce={nonce}></AppVersionPage>;
}
