import { headers } from "next/headers";
import SignIn from "./LoginComponent";

export default function Page() {
  const nonce = headers().get("x-nonce")!;
  return <SignIn nonce={nonce} />;
}
