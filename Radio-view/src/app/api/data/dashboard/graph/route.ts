import { authAxiosClient } from "@/utils/server_axios";
import serverAxiosHeader from "@/utils/server_axios_header";
import { AxiosError } from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // year=2023&id=
  let json = req.nextUrl.searchParams;
  const year = json.get("year");
  const id = json.get("id");
  const query = `?year=${year}&id=${id}`;
  try {
    const res = await authAxiosClient(`analytics/${query}`, {
      method: "GET",
      headers: serverAxiosHeader({ req }),
    });
    const data = await res.data;
    const { status, months_name, months_data } = data;
    if (!status) throw new Error("An error occurred");
    console.log("Data", months_name, months_data);
    return NextResponse.json(
      {
        months_name: months_name,
        months_data: months_data,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log(error.response?.data);
      return NextResponse.json(
        {
          error: error.response?.data,
        },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json(
      {
        error: "An error occurred",
      },
      { status: 500 }
    );
  }
}
