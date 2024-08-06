import { sitesBySystemQuery, sitesQuery } from "@/utils/queries";
import { runGqlQuery } from "@/utils/run_gql_query";
import { authAxiosClient } from "@/utils/server_axios";
import serverAxiosHeader from "@/utils/server_axios_header";
import { AxiosError } from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  return runGqlQuery({
    req,
    query: ({ offset, limit, json }) => {
      const systemId = json.get("system_id");
      const system_ids = json.get("system_ids");
      const alias = json.get("alias");
      const name = json.get("name");
      const email = json.get("email");
      if (system_ids) {
        return sitesBySystemQuery({
          systemIds: system_ids.split(","),
        });
      }

      return sitesQuery({
        limit: Number(limit || 10),
        offset: Number(offset || 0),
        systemId: systemId,
        alias: alias,
        name: name,
        email: email,
      });
    },
  }).then((value) => {
    const { data, errors, status } = value;
    if (errors) {
      return NextResponse.json({ error: errors }, { status: status });
    }
    if (data.hsai_site_to_system_mapping) {
      const sites: { system: string; sites: any[] }[] = [];

      for (const mapping of data.hsai_site_to_system_mapping) {
        const system = mapping.hsai_system.system_full_name;
        const site = mapping.hsai_site;
        const existing = sites.find((s) => s.system === system);
        if (existing) {
          existing.sites.push(site);
        } else {
          sites.push({ system, sites: [site] });
        }
      }
      return NextResponse.json({ hsai_sites: sites }, { status: 200 });
    }
    const count = data.hsai_sites_aggregate.aggregate.count;

    return NextResponse.json({ hsai_sites: data.hsai_sites, count }, { status: 200 });
  });
}

export async function POST(req: NextRequest) {
  const json = await req.json();
  try {
    const res = await authAxiosClient(`create-site/`, {
      method: "POST",
      data: json,
      headers: serverAxiosHeader({ req }),
    });
    const data = res.data;
    if (data.Status === false) {
      return NextResponse.json({ error: data.Message }, { status: 400 });
    }

    return NextResponse.json({ data: "Site created" }, { status: 200 });
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
    const res = await authAxiosClient(`editsite/`, {
      data: json,
      headers: serverAxiosHeader({ req }),
      method: "PUT",
    });
    const data = res.data;
    if (data.Status === false) {
      return NextResponse.json({ error: data.Message }, { status: 400 });
    }
    console.log("Data", data);

    return NextResponse.json({ data: "Site Edited" }, { status: 200 });
  } catch (e) {
    console.log("Error", e);
    if (e instanceof AxiosError) {
      console.log("Error", e.response?.data);
      if (e.response?.data) {
        return NextResponse.json({ error: e.response.data }, { status: 400 });
      }
      return NextResponse.json({ error: e.message }, { status: e.status ?? 400 });
    }
    return NextResponse.json({ error: "Unknown Error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const json = await req.json();

  try {
    const res = await authAxiosClient(`delete-site/`, {
      data: json,
      method: "DELETE",
      headers: serverAxiosHeader({ req }),
    });
    const data = res.data;
    if (data.Status === false) {
      return NextResponse.json({ error: data.Message }, { status: 400 });
    }
    return NextResponse.json({ data: "Site deleted" }, { status: 200 });
  } catch (e) {
    if (e instanceof AxiosError) {
      console.log("Error", e.response?.data);
      if (e.response?.data) {
        return NextResponse.json({ error: e.response.data }, { status: 400 });
      }

      return NextResponse.json({ error: e.message }, { status: e.status ?? 400 });
    }
    return NextResponse.json({ error: "Unknown Error" }, { status: 500 });
  }
}
