import { redirect } from "next/dist/client/components/navigation";

export default function Settings() {
  redirect("/settings/change-password");
  return <div></div>;
}
