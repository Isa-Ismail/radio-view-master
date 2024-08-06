import { systemsQuery, systemsQueryForSite } from "@/utils/queries";
import { runGqlQuery } from "@/utils/run_gql_query";
import { authAxiosClient } from "@/utils/server_axios";
import serverAxiosHeader from "@/utils/server_axios_header";
import { AxiosError } from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  let json = req.nextUrl.searchParams;
  return runGqlQuery({
    req,
    query: ({ offset, limit, json }) => {
      if (json.get("all") === "true") {
        return systemsQueryForSite();
      }
      const email = json.get("email");
      const name = json.get("name");
      return systemsQuery({
        limit: Number(limit || 10),
        offset: Number(offset || 0),
        email: email,
        name: name,
      });
    },
  }).then((value) => {
    const { data, errors, status } = value;
    if (errors) {
      return NextResponse.json({ error: errors }, { status: status });
    }
    if (json.get("all") === "true") {
      return NextResponse.json({ hsai_systems: data.hsai_systems }, { status: 200 });
    }
    const count = data.hsai_users_aggregate.aggregate.count;

    return NextResponse.json({ hsai_users: data.hsai_users, count }, { status: 200 });
  });
}

export async function POST(req: NextRequest) {
  const json = await req.json();
  try {
    const res = await authAxiosClient(`create-system/`, {
      data: json,
      method: "POST",
      headers: serverAxiosHeader({ req }),
    });
    if (res.data.status === false) {
      return NextResponse.json({ error: res.data.nessage }, { status: 400 });
    }
    console.log("Res", res.data);
    return NextResponse.json({ data: "System created" }, { status: 200 });
  } catch (e) {
    if (e instanceof AxiosError) {
      console.log("Error", e.response?.data);
      if (e.response?.data) {
        return NextResponse.json({ error: e.response.data }, { status: 400 });
      }
      return NextResponse.json({ error: e.response?.data }, { status: e.status ?? 400 });
    }
    return NextResponse.json({ error: "Unknown Error" }, { status: 500 });
  }
}
export async function PUT(req: NextRequest) {
  const json = await req.json();

  try {
    const res = await authAxiosClient(`editsystem/`, {
      data: json,
      headers: serverAxiosHeader({ req }),
      method: "PUT",
    });
    if (res.data.status === false) {
      return NextResponse.json({ error: res.data.nessage }, { status: 400 });
    }
    return NextResponse.json({ data: "System Updated" }, { status: 200 });
  } catch (e) {
    if (e instanceof AxiosError) {
      console.log("Error", e.response?.data);
      if (e.response?.data) {
        return NextResponse.json({ error: e.response.data }, { status: 400 });
      }
      return NextResponse.json({ error: e.response?.data }, { status: e.status ?? 400 });
    }
    return NextResponse.json({ error: "Unknown Error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const json = await req.json();

  try {
    const res = await authAxiosClient(`delete-system/`, {
      data: json,
      method: "DELETE",
      headers: serverAxiosHeader({ req }),
    });
    if (res.data.status === false) {
      return NextResponse.json({ error: res.data.nessage }, { status: 400 });
    }
    return NextResponse.json({ data: "System deleted" }, { status: 200 });
  } catch (e) {
    if (e instanceof AxiosError) {
      console.log("Error", e.response?.data);
      if (e.response?.data) {
        return NextResponse.json({ error: e.response.data }, { status: 400 });
      }
      return NextResponse.json({ error: e.response?.data }, { status: e.status ?? 400 });
    }
    return NextResponse.json({ error: "Unknown Error" }, { status: 500 });
  }
}
