import { systemsByIdQuery } from "@/utils/queries";
import { runGqlQuery } from "@/utils/run_gql_query";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params;

  return runGqlQuery({
    req,
    query: ({ offset, limit, json }) => {
      return systemsByIdQuery({
        id: id,
      });
    },
  }).then((value) => {
    const { data, errors, status } = value;
    if (errors) {
      return NextResponse.json({ error: errors }, { status: status });
    }
    const count = data.hsai_users_aggregate.aggregate.count;

    return NextResponse.json({ hsai_users: data.hsai_users, count }, { status: 200 });
  });
}
