import { clinicianEndpoint } from "@/utils/axiosConfig";
import AppConfig from "@/utils/config";
import { getIp } from "@/utils/server_axios_header";
import axios, { AxiosError } from "axios";
import { NextRequest, NextResponse, userAgent } from "next/server";

export async function POST(req: NextRequest, res: NextResponse<any>) {
  const user_agent = userAgent(req);
  const ip = getIp();

  try {
    const { email, password } = await req.json();

    const url = `${clinicianEndpoint}login/`;
    const body = {
        email: email,
        pswrd: password,
        device_token: "string",
        device_type: "string",
        device_model: "string",
        device_os: "string"
    };
    console.log("Login body");

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
