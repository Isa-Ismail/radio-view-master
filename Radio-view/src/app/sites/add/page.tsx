import { headers } from "next/headers";
import AddEditSiteForm from "../components/form";

export default function SystemAdd() {
  const nonce = headers().get("x-nonce")!;
  return <AddEditSiteForm nonce={nonce}></AddEditSiteForm>;
}
