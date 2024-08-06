import { headers } from "next/headers";
import ForgetPassword from "./forget-password-page";

export default function Page() {
  const nonce = headers().get("x-nonce")!;
  return <ForgetPassword nonce={nonce}></ForgetPassword>;
}
