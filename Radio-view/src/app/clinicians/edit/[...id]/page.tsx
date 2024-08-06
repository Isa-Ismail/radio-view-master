import { headers } from "next/headers";
import AddEditClinicianForm from "../../components/form";

export default function ClinicianEdit({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const nonce = headers().get("x-nonce")!;
  return <AddEditClinicianForm nonce={nonce} id={params.id.toString()}></AddEditClinicianForm>;
}
