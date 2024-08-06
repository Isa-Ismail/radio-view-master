import { authAxiosClient } from "@/utils/server_axios";
import serverAxiosHeader from "@/utils/server_axios_header";
import { AxiosError } from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse<any>) {
  const { oldPassword: oldPassword, newPassword: newPassword, email: email } = await req.json();

  const url = `change-password/`;
  const body = {
    email: email,
    old_password: oldPassword,
    new_password: newPassword,
  };
  try {
    const response = await authAxiosClient(url, {
      data: body,
      method: "POST",
      headers: serverAxiosHeader({ req }),
    });
    const data = await response.data;
    const { status, message } = data;

    if (!status) {
      console.log("error", message);
      if (message.includes("Incorrect current password")) {
        return NextResponse.json({ error: "Your current password is incorrect" }, { status: 400 });
      }

      return NextResponse.json({ error: message }, { status: 400 });
    }

    return NextResponse.json({ message: "Password changed Successfully" }, { status: 200 });
  } catch (e) {
    if (e instanceof AxiosError) {
      console.log("Error", e.response?.data);
      if (e.response?.data) {
        return NextResponse.json({ error: e.response.data }, { status: 400 });
      }
      return NextResponse.json({ error: e.response?.data }, { status: e.status ?? 400 });
    }
    return NextResponse.json({ error: "Something went wrong" }, { status: 400 });
  }
}
