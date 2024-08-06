import { headers } from "next/headers";
import AddEditSystemForm from "../components/add_edit_form";

export default function SystemAdd() {
  const nonce = headers().get("x-nonce")!;
  return <AddEditSystemForm nonce={nonce}></AddEditSystemForm>;
}
