import { headers } from "next/headers";
import ActivtiesPage from "./activities_page";

export default function Page() {
  const nonce = headers().get("x-nonce")!;

  return <ActivtiesPage nonce={nonce} />;
}
