import { headers } from "next/headers";
import ResetPassword from "./reset-password-page";

export default function Page() {
  const nonce = headers().get("x-nonce")!;
  return <ResetPassword nonce={nonce} />;
}
