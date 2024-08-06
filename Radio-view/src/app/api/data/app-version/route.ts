import {
  addAppVersionMutation,
  appVersionQuery,
  deleteAppVersionMutation,
  updateAppVersionMutation,
} from "@/utils/queries";
import { runGqlQuery } from "@/utils/run_gql_query";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  return runGqlQuery({
    req,
    query: ({ offset, limit, json }) => {
      let version: string | undefined = json.get("version");
      const start_date = json.get("start_date");
      const end_date = json.get("end_date");
      const description = json.get("description");

      return appVersionQuery({
        limit,
        offset,
        version: version,
        endDate: end_date,
        startDate: start_date,
        description: description,
      });
    },
  }).then((value) => {
    const { data, errors, status } = value;

    if (errors) {
      return NextResponse.json({ error: errors }, { status: status });
    }
    const count = data.app_updates_aggregate.aggregate.count;
    const updatedData = data.app_updates;
    return NextResponse.json(
      {
        data: updatedData,
        count: count,
      },
      { status: 200 }
    );
  });
}

export async function POST(req: NextRequest) {
  const json = await req.json();
  return runGqlQuery({
    req,
    query: ({}) => {
      const { appstore_review, description, force_update, playstore_review, version } = json;

      return addAppVersionMutation({
        appstore_review,
        description,
        force_update,
        playstore_review,
        version,
      });
    },
  }).then((value) => {
    const { data, errors, status } = value;
    if (errors) {
      return NextResponse.json({ error: errors }, { status: status });
    }
    const id = data.insert_app_updates_one.app_update_id;
    return NextResponse.json(
      {
        data: id,
      },
      { status: 200 }
    );
  });
}
export async function PUT(req: NextRequest) {
  const json = await req.json();
  return runGqlQuery({
    req,
    query: ({}) => {
      const { appstore_review, description, force_update, playstore_review, version } = json;

      return updateAppVersionMutation({
        appstore_review,
        description,
        force_update,
        playstore_review,
        version,
      });
    },
  }).then((value) => {
    const { data, errors, status } = value;

    if (errors) {
      return NextResponse.json({ error: errors }, { status: status });
    }
    const affected_rows = data.update_app_updates.affected_rows;
    return NextResponse.json(
      {
        data: affected_rows,
      },
      { status: 200 }
    );
  });
}

export async function DELETE(req: NextRequest) {
  const json = await req.json();
  return runGqlQuery({
    req,
    query: ({}) => {
      const { version } = json;
      return deleteAppVersionMutation({
        version,
      });
    },
  }).then((value) => {
    const { data, errors, status } = value;

    if (errors) {
      return NextResponse.json({ error: errors }, { status: status });
    }

    return NextResponse.json(
      {
        message: "App Version Deleted",
      },
      { status: 200 }
    );
  });
}
