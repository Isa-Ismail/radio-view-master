import AppConfig from "@/utils/config";
import serverAxiosHeader from "@/utils/server_axios_header";
import axios, { AxiosError } from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = `${AppConfig.authUrl}refresh-token/`;
  try {
    const res = await axios.get(url, {
      headers: serverAxiosHeader({ req }),
    });
    const data = res.data;
    const { status, message } = data;
    if (!status) {
      return NextResponse.json(
        { error: "Refresh token expired please login again" },
        { status: 401 }
      );
    }
    const { token: token, refresh_token: refreshToken } = data.data;
    return NextResponse.json({ token, refreshToken });
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
