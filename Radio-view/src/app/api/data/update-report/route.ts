import { runGqlQuery } from "@/utils/run_gql_query";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { id, reportContent } = await req.json();

    if (!id || !reportContent) {
      return NextResponse.json(
        { error: "ID and report content are required" },
        { status: 400 }
      );
    }

    const mutation = `
      mutation MyMutation {
        update_radiology_reports_by_pk(
          pk_columns: { id: "${id}" },
          _set: { report_content: """${reportContent}""" }
        ) {
          id
        }
      }
    `;

    const response = await runGqlQuery({
      req,
      query: () => mutation,
    });

    const { data, errors, status } = response;

    if (errors) {
      return NextResponse.json({ error: errors }, { status: status });
    }

    if (!data.update_radiology_reports_by_pk) {
      return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }

    return NextResponse.json(
      {
        success: true,
        id: data.update_radiology_reports_by_pk.id,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
