import { siteMachineLogsAndLastStudy, sitesForLogs } from "@/utils/queries";
import { runGqlQuery } from "@/utils/run_gql_query";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";

// export async function GET(req: NextRequest) {
//   const url = `sites-logs/`;
//   const auth = req.headers.get("authorization");
//   try {
//     const response = await authAxiosClient(url, {
//       method: "GET",
//       headers: {
//         Authorization: auth,
//       },
//     });
//     const { data } = await response.data;
//     console.log("data", data);

//     return NextResponse.json({
//       ...data,
//       headers: {
//         Authorization: auth,
//       },
//     });
//   } catch (e) {
//     if (e instanceof AxiosError) {
//       console.log("Error", e.response?.data);
//       if (e.response?.data) {
//         return NextResponse.json({ error: e.response.data }, { status: 400 });
//       }
//       return NextResponse.json({ error: e.response?.data }, { status: e.status ?? 400 });
//     }
//     return NextResponse.json({ error: "Something went wrong" }, { status: 400 });
//   }
// }

export async function GET(req: NextRequest) {
  return runGqlQuery({
    req,
    query: ({ offset, limit, json }) => {
      const siteName = json.get("site_name");

      return sitesForLogs({
        name: siteName,
      });
    },
  }).then(async (value) => {
    const { data, errors, status } = value;

    if (errors) {
      return NextResponse.json({ error: errors }, { status: status });
    }
    const sites = data?.hsai_sites;
    const promises = [];
    for (let i = 0; i < sites.length; i++) {
      const site = sites[i];
      const promise = runGqlQuery({
        req,
        query: ({ offset, limit, json }) => {
          const startDate = json.get("start_date");
          const endDate = json.get("end_date");

          return siteMachineLogsAndLastStudy({
            siteId: site.site_id,
            startDate: startDate,
            endDate: endDate,
          });
        },
      })
        .then((value) => {
          const { data, errors, status } = value;
          console.log("AppData", data);
          if (errors) {
            return NextResponse.json({ error: errors }, { status: status });
          }
          const siteMachineLogs = data?.site_logs;
          const study = data?.study;
          if (study.length > 0) {
            const lastStudy = study[0];
            const patientName = lastStudy.patient.patient_name;
            return {
              lastStudy: {
                study_date: lastStudy.study_date,
                study_time: lastStudy.study_time,
                patient_name: patientName,
              },
              logsData: siteMachineLogs,
            };
          }

          return {
            lastStudy: undefined,
            logsData: siteMachineLogs,
          };
        })
        .then((logs) => {
          if ("error" in logs) {
            return NextResponse.json({ error: logs.error }, { status: 400 });
          }

          // const { lastStudy, logsData } = logs;
          if ("lastStudy" in logs && "logsData" in logs) {
            const { lastStudy, logsData } = logs;

            site.service_logs = logsData;
            site.last_study = lastStudy;
          } else {
            site.service_logs = [];
            site.last_study = undefined;
          }
        });
      promises.push(promise);
    }
    // await Promise.all(promises);
    for (let i = 0; i < promises.length; i++) {
      await promises[i];
    }
    sites.sort((a: any, b: any) => {
      if (a.last_study && b.last_study) {
        return b.last_study.study_date - a.last_study.study_date;
      }
      return -1;
    });

    return NextResponse.json({ logs: sites });
  });
}
