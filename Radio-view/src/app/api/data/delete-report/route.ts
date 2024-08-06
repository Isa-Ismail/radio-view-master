import { runGqlQuery } from "@/utils/run_gql_query";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  return runGqlQuery({
    req,
    query: () => {
      const mutation = `
        mutation MyMutation {
          delete_radiology_reports_by_pk(id: "${id}") {
            id
          }
        }
      `;
      return mutation;
    },
  }).then((value) => {
    const { data, errors, status } = value;
    if (errors) {
      return NextResponse.json({ error: errors }, { status: status });
    }

    if (!data.delete_radiology_reports_by_pk) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, id: data.delete_radiology_reports_by_pk.id }, { status: 200 });
  });
}
