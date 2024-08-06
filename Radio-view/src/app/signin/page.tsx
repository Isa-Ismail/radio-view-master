import { headers } from "next/headers";
import SignIn from "./sign-in-page";
import { redirect } from "next/navigation";

export default function Page() {
  redirect("/clinician-login");
}
