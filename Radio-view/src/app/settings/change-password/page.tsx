import { headers } from "next/headers";
import ChangePassword from "./change-password-page";

export default function Page() {
  const nonce = headers().get("x-nonce")!;

  return <ChangePassword nonce={nonce} />;
}
