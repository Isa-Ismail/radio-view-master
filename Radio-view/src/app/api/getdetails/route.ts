import { authAxiosClient } from "@/utils/server_axios";
import serverAxiosHeader from "@/utils/server_axios_header";
import { AxiosError } from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse<any>) {
  const url = `getdetails/`;
  try {
    const response = await authAxiosClient(url, {
      method: "GET",
      headers: serverAxiosHeader({ req }),
      withCredentials: true,
    });
    const data = await response.data;
    const { status, message, data: userData } = data;

    if (!status) {
      if (message.includes("Invalid")) {
        return NextResponse.json({ error: "Invalid username or password" }, { status: 400 });
      }
      return NextResponse.json({ error: message }, { status: 400 });
    }

    return NextResponse.json({
      ...userData,
    });
  } catch (error) {
    if (error instanceof AxiosError) {
      const data = error.response?.data;

      console.log("Error", data);
      return NextResponse.json({ error: data.detail }, { status: 400 });
    }
    return NextResponse.json({ error: "Something went wrong" }, { status: 400 });
  }
}
