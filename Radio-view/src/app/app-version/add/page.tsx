import { headers } from "next/headers";
import AddEditAppVersionForm from "../components/form";

export default function AddAppVersion() {
  const nonce = headers().get("x-nonce")!;
  return <AddEditAppVersionForm nonce={nonce}></AddEditAppVersionForm>;
}
