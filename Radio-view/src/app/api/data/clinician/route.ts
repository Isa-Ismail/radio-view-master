import { clinicianQuery } from "@/utils/queries";
import { runGqlQuery } from "@/utils/run_gql_query";
import { authAxiosClient } from "@/utils/server_axios";
import serverAxiosHeader from "@/utils/server_axios_header";
import { AxiosError } from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  return runGqlQuery({
    req,
    query: ({ offset, limit, json }) => {
      const system_id = json.get("system_id");
      const site_id = json.get("site_id");
      const email = json.get("email");
      const name = json.get("name");

      return clinicianQuery({
        name: name ?? undefined,
        limit: Number(limit || 10),
        offset: Number(offset || 0),
        siteId: site_id ?? undefined,
        systemId: system_id ?? undefined,
        email: email ?? undefined,
      });
    },
  }).then((value) => {
    if (value.errors) {
      return NextResponse.json({ error: value.errors }, { status: value.status });
    }
    const count = value.data.hsai_users_aggregate.aggregate.count;
    return NextResponse.json({ hsai_users: value.data.hsai_users, count }, { status: 200 });
  });
}

export async function POST(req: NextRequest) {
  const json = await req.json();

  try {
    const res = await authAxiosClient(`create-clinician/`, {
      data: json,
      method: "POST",
      headers: serverAxiosHeader({ req }),
    });
    const data = res.data;
    if (data.status === false) {
      return NextResponse.json({ error: data.message }, { status: 400 });
    }
    return NextResponse.json({ data: "Clinician created" }, { status: 200 });
  } catch (e) {
    if (e instanceof AxiosError) {
      console.log("Error", e.response?.data);
      if (e.response?.data) {
        return NextResponse.json({ error: e.response?.data }, { status: 400 });
      }
      return NextResponse.json({ error: e.message }, { status: e.status ?? 400 });
    }
    return NextResponse.json({ error: "Unknown Error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const json = await req.json();
  try {
    const res = await authAxiosClient(`editclinician/`, {
      data: json,
      headers: serverAxiosHeader({ req }),
      method: "PUT",
    });
    const data = res.data;
    if (data.status === false) {
      return NextResponse.json({ error: data.message }, { status: 400 });
    }

    return NextResponse.json({ data: "Clinician Edited" }, { status: 200 });
  } catch (e) {
    if (e instanceof AxiosError) {
      console.log("Error", e.response?.data);
      if (e.response?.data) {
        return NextResponse.json({ error: e.response?.data }, { status: 400 });
      }
      return NextResponse.json({ error: e.message }, { status: e.status ?? 400 });
    }
    return NextResponse.json({ error: "Unknown Error" }, { status: 500 });
  }
}
export async function DELETE(req: NextRequest) {
  const json = await req.json();

  try {
    const res = await authAxiosClient(`delete-clinician/`, {
      data: json,
      method: "DELETE",
      headers: serverAxiosHeader({ req }),
    });
    const data = res.data;
    if (data.Status === false) {
      return NextResponse.json({ error: data.Message }, { status: 400 });
    }
    return NextResponse.json({ data: "Clinician deleted" }, { status: 200 });
  } catch (e) {
    if (e instanceof AxiosError) {
      console.log("Error", e.response?.data);
      if (e.response?.data) {
        return NextResponse.json({ error: e.response?.data }, { status: 400 });
      }
      return NextResponse.json({ error: e.message }, { status: e.status ?? 400 });
    }
    return NextResponse.json({ error: "Unknown Error" }, { status: 500 });
  }
}
