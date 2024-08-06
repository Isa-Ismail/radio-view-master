import { authAxiosClient } from "@/utils/server_axios";
import serverAxiosHeader from "@/utils/server_axios_header";
import { AxiosError } from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    const url = `check-password-update/`;
    const body = {
      email: email,
    };

    const response = await authAxiosClient.post(url, body, {
      headers: serverAxiosHeader({ req }),
    });
    const data = await response.data;
    const { status, message } = data;

    if (!status || status === "False") {
      return NextResponse.json({
        "password-update": true,
      });
    }

    return NextResponse.json({
      "password-update": false,
    });
  } catch (e) {
    console.log("E", e);
    if (e instanceof AxiosError) {
      console.log("Error", e.response?.data);
      return NextResponse.json(
        { error: e.message },
        { status: e.response?.status ?? e.status ?? 400 }
      );
    }
    return NextResponse.json({ error: "Unknown Error" }, { status: 500 });
  }
}
