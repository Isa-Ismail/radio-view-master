import AppConfig from "@/utils/config";
import { getIp } from "@/utils/server_axios_header";
import axios, { AxiosError } from "axios";
import { NextRequest, NextResponse, userAgent } from "next/server";

export async function POST(req: NextRequest, res: NextResponse<any>) {
  const user_agent = userAgent(req);
  const ip = getIp();

  try {
    const { username, password } = await req.json();

    const url = `${AppConfig.authUrl}login/`;
    const body = {
      user: username,
      pswrd: password,
      ip_address: ip,
      user_agent: user_agent.ua,
    };
    console.log("Login body", body.ip_address, body.user_agent);

    const response = await axios.post(url, body);
    const data = await response.data;
    const { status, message, data: userData } = data;
    console.log("Login response", data);

    if (!status) {
      if (message.includes("Invalid")) {
        return NextResponse.json({ error: "Invalid username or password" }, { status: 400 });
      }
      return NextResponse.json({ error: message }, { status: 400 });
    }

    return NextResponse.json(userData);
  } catch (e) {
    if (e instanceof AxiosError) {
      console.log("Error", e.response?.data);
      return NextResponse.json(
        { error: e.response?.data },
        { status: e.response?.status ?? e.status ?? 400 }
      );
    }
    return NextResponse.json({ error: "Unknown Error" }, { status: 500 });
  }
}
