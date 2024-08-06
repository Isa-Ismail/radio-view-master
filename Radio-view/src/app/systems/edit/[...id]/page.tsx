import { headers } from "next/headers";
import AddEditSystemForm from "../../components/add_edit_form";

export default function SystemsEdit({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const nonce = headers().get("x-nonce")!;
  return <AddEditSystemForm nonce={nonce} id={params.id}></AddEditSystemForm>;
}
