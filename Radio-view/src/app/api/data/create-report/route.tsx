import { runGqlQuery } from "@/utils/run_gql_query";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { reportContent, reportStatus, userId, studyId, reportTitle } =
      await req.json();

    if (
      !reportContent ||
      !reportStatus ||
      !userId ||
      !studyId ||
      !reportTitle
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const response = await runGqlQuery({
      req,
      query: () => {
        // const mutation = `
        //   mutation MyMutation {
        //     insert_radiology_reports(objects: {
        //       report_content: "${reportContent}",
        //       report_status: "${reportStatus}",
        //       user_id: "${userId}",
        //       study_id: "${studyId}",
        //       report_title: "${reportTitle}"
        //     }) {
        //       affected_rows
        //     }
        //   }
        // `;
        const mutation = `
        mutation MyMutation(
          $report_content: String = """${reportContent}"""
          $report_status: String = "${reportStatus}"
          $report_title: String = "${reportTitle}"
          $study_id: String = "${studyId}"
          $user_id: uuid = "${userId}"
        ) {
          insert_radiology_reports(
            objects: {
              report_content: $report_content
              report_status: $report_status
              user_id: $user_id
              study_id: $study_id
              report_title: $report_title
            }
          ) {
            affected_rows
          }
        }
        `;
        return mutation;
      },
    });

    const { data, errors, status } = response;

    if (errors) {
      return NextResponse.json({ error: errors }, { status: status });
    }

    if (data.insert_radiology_reports.affected_rows === 0) {
      return NextResponse.json({ error: "Insertion failed" }, { status: 500 });
    }

    return NextResponse.json(
      {
        success: true,
        affected_rows: data.insert_radiology_reports.affected_rows,
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
