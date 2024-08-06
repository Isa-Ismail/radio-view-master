import { AxiosClient } from "@/hooks/axios";
import { Site } from "@/models/site";
import { Instance, Patient, Series, Study } from "@/models/study";
import { AdminRole, AppUser } from "@/models/user";
import { StoreReturnType } from "@/utils/typedef";
import dayjs from "dayjs";

export default async function fetchStudies({
  token,
  offset,
  limit,
  user,
  bodyPart,
  modality,
  dateRange,
  site,
  name,
  axios,
}: {
  token: string;
  offset: number;
  site?: string | undefined;
  bodyPart?: string;
  limit: number;
  user: AppUser | undefined;
  modality?: string;
  dateRange?: dayjs.Dayjs[] | undefined;
  name?: string | undefined;
  axios: AxiosClient;
}): Promise<StoreReturnType<{ total: number; data: Study[], rrg: any }>> {
  const query = new URLSearchParams({
    limit: `${limit}`,

    offset: `${offset}`,
  });
  if (site) {
    query.append("site_id", site);
  }

  if (modality) {
    query.append("modality", modality);
  }
  if (dateRange) {
    query.append("date_range", dateRange.map((date) => date.format("YYYY-MM-DD")).join(","));
  }
  if (bodyPart) {
    query.append("body_part", bodyPart);
  }
  if (name) {
    query.append("name", name);
  }
  const res = await axios.get({
    path: `/data/studies?${query}`,
    headers: AxiosClient.getAuthHeaders({ token }),
  });
  const parsedData = await AxiosClient.parseResponseForStore({
    res,
    parseData: async (resData) => {
      const { studies, count, rrg } = resData;
      const data: Study[] = [];

      // const data = studies.map((item: any) => {
      for (let i = 0; i < studies.length; i++) {
        const item = studies[i];
        const { patient, series } = item;

        const date = Study.getStudyDateAndTime(item.study_date, item.study_time);
        const site = patient.hsai_site_to_patient_mappings[0]?.site;
        const system = site?.hsai_site_to_system_mappings[0].hsai_system;
        if (!site || !system || series.length == 0) {
          continue;
        }

        const study = new Study({
          institutionName: item.institution_name,
          studyDate: date,
          studyInstanceUid: item.study_instance_uid,
          studyUid: item.study_orthanc_id_2,
          series: series.map((series: any) => {
            const { instances } = series;
            return new Series({
              modality: series.modality,
              protocol: series.protocol,
              bodyPart: series.body_part_examined,

              instances: instances.map((instance: any) => {
                return new Instance({
                  detected: instance.detected,
                  indexInSeries: instance.index_in_series,
                  instanceOrthancId: instance.instance_orthanc_id,
                  isAiReviewed: instance.is_ai_reviewed,
                  isClinicalReviewed: instance.is_clinical_reviewed,
                });
              }),
              seriesOrthancId: series.series_orthanc_id,
              seriesUid: series.series_uid,
              seriesDescription: series.series_description,
            });
          }),
          patient: new Patient({
            patientName: patient.patient_name,
            createdAt: patient.created_at,
            patientBirthDate: patient.patient_birth_date,
            patientId: patient.patient_orthanc_id,
            patientSex: patient.patient_sex,
            site: new Site({
              id: site?.site_id,
              name: site?.site_name,
              alias: site?.site_alias,
              system: system?.system_full_name || "",
            }),
          }),
        });
        data.push(study);
      }
      return {
        total: count,
        data: data,
        rrg: rrg
      };
    },
  });
  return parsedData;
}
