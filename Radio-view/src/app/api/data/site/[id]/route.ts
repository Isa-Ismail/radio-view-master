import { siteByIdQuery } from "@/utils/queries";
import { runGqlQuery } from "@/utils/run_gql_query";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params;

  return runGqlQuery({
    req,
    query: ({ offset, limit, json }) => {
      return siteByIdQuery({
        id: id,
      });
    },
  }).then((value) => {
    const { data, errors, status } = value;
    if (errors) {
      return NextResponse.json({ error: errors }, { status: status });
    }
    return NextResponse.json({ hsai_sites: data.hsai_sites[0] }, { status: 200 });
  });
}
