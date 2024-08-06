import { getStudiesQuery } from "@/utils/queries";
import { runGqlQuery } from "@/utils/run_gql_query";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  return runGqlQuery({
    req,
    query: ({ offset, limit, json }) => {
      const site_id = json.get("site_id");
      const system_id = json.get("system_id");
      const modality = json.get("modality");
      const date_range = json.get("date_range");
      const name = json.get("name");
      const body_part = json.get("body_part");

      const query = getStudiesQuery({
        limit: Number(limit || 10),
        offset: Number(offset || 0),
        systemId: system_id,
        siteId: site_id,
        bodyPart: body_part,
        modality: modality,
        dateRange: date_range,
        name: name,
      });
      return query;
    },
  }).then((value) => {
    const { data, errors, status } = value;
    if (errors) {
      return NextResponse.json({ error: errors }, { status: status });
    }
    const count = data.study_aggregate.aggregate.count;
    const rrg = data.radiology_reports

    return NextResponse.json({ studies: data.study, count, rrg }, { status: 200 });
  });
}
