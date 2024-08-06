import { loggerAxiosClient } from "@/utils/server_axios";
import serverAxiosHeader from "@/utils/server_axios_header";
import { AxiosError } from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  let url = `/`;
  const json = req.nextUrl.searchParams;

  url = `${url}?${json.toString()}`;

  try {
    const response = await loggerAxiosClient(url, {
      method: "GET",
      headers: serverAxiosHeader({ req }),
    });
    const { data } = await response.data;

    return NextResponse.json({ data: data });
  } catch (e) {
    if (e instanceof AxiosError) {
      console.log("Error", e);
      console.log("Error", e.response?.data);
      if (e.response?.data) {
        return NextResponse.json({ error: e.response.data }, { status: 400 });
      }
      return NextResponse.json({ error: e.response?.data }, { status: e.status ?? 400 });
    }
    return NextResponse.json({ error: "Something went wrong" }, { status: 400 });
  }
}
