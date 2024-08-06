import { headers } from "next/headers";
import SignIn from "./GuestLogin";

export default function Page() {
  const nonce = headers().get("x-nonce")!;
  return <SignIn nonce={nonce} />;
}
