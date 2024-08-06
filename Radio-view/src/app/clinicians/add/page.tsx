import { headers } from "next/headers";
import AddEditClinicianForm from "../components/form";

export default function AddClinician() {
  const nonce = headers().get("x-nonce")!;
  return <AddEditClinicianForm nonce={nonce}></AddEditClinicianForm>;
}
