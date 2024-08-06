import { headers } from "next/headers";
import AddEditSiteForm from "../../components/form";

export default function SystemsEdit({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const nonce = headers().get("x-nonce")!;
  return <AddEditSiteForm nonce={nonce} id={params.id.toString()}></AddEditSiteForm>;
}
