import { studyFilterQuery } from "@/utils/queries";
import { runGqlQuery } from "@/utils/run_gql_query";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  return runGqlQuery({
    req,
    query: studyFilterQuery,
  }).then((value) => {
    const { data, errors, status } = value;
    if (errors) {
      return NextResponse.json({ error: errors }, { status: status });
    }
    const { modalities, body_part, protocool_name } = data;
    return NextResponse.json(
      {
        modalities: modalities.map((m: any) => m.modality),
        body_part: body_part.map((m: any) => m.body_part_examined),
        protocool_name: protocool_name.map((m: any) => m.protocol_name),
      },
      { status: status }
    );
  });
}
