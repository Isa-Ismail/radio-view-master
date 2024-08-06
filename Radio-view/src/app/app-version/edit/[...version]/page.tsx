import { headers } from "next/headers";
import AddEditAppVersionForm from "../../components/form";

export default function AppVersionEdit({
  params,
}: {
  params: {
    version: string;
  };
}) {
  const nonce = headers().get("x-nonce")!;
  return (
    <AddEditAppVersionForm
      nonce={nonce}
      version={params.version.toString()}></AddEditAppVersionForm>
  );
}
