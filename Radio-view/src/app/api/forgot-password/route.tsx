import { authAxiosClient } from "@/utils/server_axios";
import { AxiosError } from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse<any>) {
  // const data: Login = await req.json();
  const { email } = await req.json();

  const url = `send-forgot-otp/`;
  const body = {
    email: email,
  };
  try {
    const response = await authAxiosClient(url, {
      method: "POST",
      data: body,
    });
    const data = await response.data;
    const { status, message } = data;

    if (!status) {
      console.log("error", message);
      return NextResponse.json({ error: message }, { status: 400 });
    }

    return NextResponse.json({ message: "Please check your email" }, { status: 200 });
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
