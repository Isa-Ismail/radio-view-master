import { authAxiosClient } from "@/utils/server_axios";
import serverAxiosHeader from "@/utils/server_axios_header";
import { AxiosError } from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse<any>) {
  try {
    const res = await authAxiosClient.get("logout/", {
      headers: serverAxiosHeader({ req }),
      withCredentials: true,
    });
    console.log("Response", res.data);
    return NextResponse.json({ message: "Logged out successfully" }, { status: 200 });
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
