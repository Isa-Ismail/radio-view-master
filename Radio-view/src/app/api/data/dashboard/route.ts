import { authAxiosClient } from "@/utils/server_axios";
import serverAxiosHeader from "@/utils/server_axios_header";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const res = await authAxiosClient(`dashboard-data/`, {
    method: "GET",
    headers: serverAxiosHeader({ req }),
  });
  const { data } = await res.data;
  return NextResponse.json(
    {
      data: data ?? {
        clinician: 0,
        site_admin: 0,
        system_admin: 0,
        study: 0,
        patient: 0,
      },
    },
    { status: 200 }
  );
}
