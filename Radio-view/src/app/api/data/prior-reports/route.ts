import { runGqlQuery } from "@/utils/run_gql_query";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  return runGqlQuery({
    req,
    query: ({ offset, limit, json }) => {
      const user_id = json.get("user_id");
      const modality = json.get("modality");
      const body_part_examined = json.get("body_part_examined");
      const dateRange = json.get("dateRange");
      const name = json.get("name");
      const report_status = json.get("report_status");
      const site_id = json.get("site_id");

      let filters = `user_id: {_eq: "${user_id}"}`;

      if (site_id) {
        filters += `, study: {patient: {hsai_site_to_patient_mappings: {site_id: {_eq: "${site_id}"}}}`;
        if (modality || body_part_examined) {
          filters += `, series: {`;
          if (modality) {
            filters += `modality: {_eq: "${modality}"}`;
          }
          if (modality && body_part_examined) {
            filters += `, `;
          }
          if (body_part_examined) {
            filters += `body_part_examined: {_eq: "${body_part_examined}"}`;
          }
          filters += `}`;
        }
        filters += `}`;
      } else if (modality || body_part_examined) {
        filters += `, study: {series: {`;
        if (modality) {
          filters += `modality: {_eq: "${modality}"}`;
        }
        if (modality && body_part_examined) {
          filters += `, `;
        }
        if (body_part_examined) {
          filters += `body_part_examined: {_eq: "${body_part_examined}"}`;
        }
        filters += `}}`;
      }

      if (dateRange) {
        console.log(dateRange)
        const startDate = dateRange.split(",")[0];
        const endDate = dateRange.split(",")[1];
        if (startDate && endDate) {
          filters += `, updated_at: { _gte: "${startDate}", _lte: "${endDate}" }`;
        } else if (startDate) {
          filters += `, updated_at: { _gte: "${startDate}" }`;
        } else if (endDate) {
          filters += `, updated_at: { _lte: "${endDate}" }`;
        }
      }
      if (name) {
        filters += `, report_title: {_ilike: "%${name}%"}`;
      }
      if (report_status) {
        filters += `, report_status: {_eq: "${report_status}"}`;
      }

      const query = `
        query MyQuery {
          radiology_reports(
            limit: ${limit},
            offset: ${offset},
            where: {${filters}}
          ) {
            created_at
            report_status
            id
            report_title
            report_content
            user_id
            updated_at
            study_id
            study {
              study_instance_uid
              id
              study_orthanc_id_2
              series {
                body_part_examined
                modality
              }
              patient {
                patient_name
                patient_birth_date
                patient_sex
                created_at
                patient_orthanc_id
                hsai_site_to_patient_mappings {
                  site {
                    site_id
                    site_name
                    site_alias
                    site_address
                    hsai_site_to_system_mappings {
                      hsai_system {
                        system_full_name
                        system_address
                        system_alias
                        system_guid
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `;
      return query;
    },
  }).then((value) => {
    const { data, errors, status } = value;
    if (errors) {
      return NextResponse.json({ error: errors }, { status: status });
    }
    const reports = data.radiology_reports;
    const count = reports.length; // Note: This doesn't provide the total count, just the count of returned items

    return NextResponse.json({ radiology_reports: reports, count }, { status: 200 });
  });
}
