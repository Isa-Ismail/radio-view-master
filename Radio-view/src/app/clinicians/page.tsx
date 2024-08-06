import { headers } from "next/headers";
import ClinicianPage from "./clinician_page";

export default function Page() {
  const nonce = headers().get("x-nonce")!;
  return <ClinicianPage nonce={nonce}></ClinicianPage>;
}
