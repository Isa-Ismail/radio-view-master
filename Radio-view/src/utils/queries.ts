export function clinicianQuery({
  systemId,
  siteId,
  limit = 10,
  offset = 0,
  email,
  name,
}: {
  systemId?: string | undefined;
  siteId?: string | undefined;
  limit?: number;
  offset?: number;
  email?: string | undefined;
  name?: string | undefined;
}): string {
  if (email != null) {
    email = email.trim();
  }
  if (name != null) {
    name = name.trim();
  }
  let siteFilter = "";
  let userFilter = "";
  let systemFilter = "";
  let nameFilter = "";
  let emailFilter = "";
  if (systemId) {
    systemFilter = `
        system_id: { _eq: "${systemId}" }
      `;
  }
  if (siteId) {
    siteFilter = `site_id: { _eq: "${siteId}" }`;
  }
  if (email) {
    emailFilter = `    
      user: { _ilike: "%${email}%" }
    `;
  }
  if (name) {
    nameFilter = `    
      hsai_user_to_profile_mappings: {
        hsai_user_profile: {                   
              _or: [
                {first_name: { _ilike: "%${name}%" }}
                {last_name: { _ilike: "%${name}%" }}
              ]
        }
      }
    `;
  }
  let filter = "";
  if (email && name) {
    filter = `_or: [
      {${emailFilter}}
      {${nameFilter}}          
    ]`;
  } else if (email) {
    filter = emailFilter;
  } else if (name) {
    filter = nameFilter;
  }

  const query = `query GetClinician {
   hsai_users(
    where: {
      role: { _eq: Clinician }
      
        hsai_system_user_mappings: {
          ${systemFilter}
        }
        hsai_site_to_user_mappings: {
          ${siteFilter}
        }
        ${filter}
      
    }
    order_by: { created_at: desc }
    limit: ${limit}
    offset: ${offset}
  ) {
    hsai_guid
    hsai_id
    created_at
    role
    user
    hsai_user_to_profile_mappings {
      hsai_user_profile {
        email
        first_name
        last_name
        gender
        date_of_birth
        created_at
        phone
        practice_address
        practice_name
        profile_id
        profile_type
        updated_at
      }
    }
    hsai_site_to_user_mappings {
      hsai_site {
        site_address
        site_alias
        site_id
        site_name
        hsai_site_to_system_mappings {
          hsai_system {
            system_full_name
          }
        }
      }
    }
    hsai_system_user_mappings {
      hsai_system {
        system_address
        system_alias
        system_guid
        system_full_name
      }
    }
  }
  hsai_users_aggregate(
     where: {
      role: { _eq: Clinician }
      
        hsai_system_user_mappings: {
          ${systemFilter}
        }
        hsai_site_to_user_mappings: {
          ${siteFilter}
        }
        ${filter}
      
    }
    order_by: { created_at: desc }
  ) {
    aggregate {
      count
    }
  }
}`;
  return query;
}

export function clinicianByIdQuery({ id }: { id: string }): string {
  return `query GetClinician {
   hsai_users(
    where: {
      role: { _eq: Clinician }
      hsai_guid: { _eq: "${id}" }
    }
    order_by: { created_at: desc }
    
  ) {
    hsai_guid
    hsai_id
    created_at
    role
    user
    hsai_user_to_profile_mappings {
      hsai_user_profile {
        email
        first_name
        last_name
        gender
        date_of_birth
        created_at
        phone
        practice_address
        practice_name
        profile_id
        profile_type
        updated_at
      }
    }
    hsai_site_to_user_mappings {
      hsai_site {
        site_address
        site_alias
        site_id
        site_name
        hsai_site_to_system_mappings {
          hsai_system {
            system_full_name
          }
        }
      }
    }
    hsai_system_user_mappings {
      hsai_system {
        system_address
        system_alias
        system_guid
        system_full_name
      }
    }
  }
}`;
}

export function systemsQuery({
  limit = 10,
  offset = 0,
  email,
  name,
}: {
  limit?: number;
  offset?: number;
  email?: string | undefined;
  name?: string | undefined;
}): string {
  if (email != null) {
    email = email.trim();
  }
  if (name != null) {
    name = name.trim();
  }
  let userFilter = "";
  let nameFilter = "";
  if (email) {
    userFilter = `
    {
      user: { _ilike: "%${email}%" }
    }`;
  }

  if (name && !name.includes("@")) {
    nameFilter = `
    {
      hsai_system: {
        system_full_name: { _ilike: "%${name}%" }
      }
    }`;
  }
  let filter = "";
  if (email && name) {
    filter = `_or: [
      ${userFilter}
      ${nameFilter}          
    ]`;
  } else if (email) {
    filter = userFilter;
  } else if (name) {
    filter = nameFilter;
  }
  return `query GetSystemAdmin {
  hsai_users(
    where: {
      role: { _eq: SystemAdmin }
      ${filter}
    }
    order_by: { created_at: desc }
    limit: ${limit}
    offset: ${offset}
  ) {
    hsai_guid
    hsai_id
    user
    hsai_system {
      system_guid
      system_full_name
      system_alias
      system_address
    }
    hsai_user_to_profile_mappings {
      hsai_user_profile {
        email
        first_name
        phone
        profile_id
        last_name
        practice_name
      }
    }
  }
  hsai_users_aggregate(
    where: { 
      role: { _eq: SystemAdmin } 
      ${filter}
    }
  ) {
    aggregate {
      count
    }
  }
}`;
}

export function systemsByIdQuery({ id }: { id: string }): string {
  return `query GetSystemAdmin {
  hsai_users(
    where: {
      role: { _eq: SystemAdmin }
      hsai_guid: { _eq: "${id}" }
    }
    order_by: { created_at: desc }
    
  ) {
    hsai_guid
    hsai_id
    user
    hsai_system {
      system_guid
      system_full_name
      system_alias
      system_address
    }
    hsai_user_to_profile_mappings {
      hsai_user_profile {
        email
        first_name
        phone
        profile_id
        last_name
        practice_name
      }
    }
  }
  hsai_users_aggregate(
    where: { role: { _eq: SystemAdmin } }
  ) {
    aggregate {
      count
    }
  }
}`;
}

export function systemsQueryForSite() {
  return `query GetSystems {
  hsai_systems {
      system_guid
      system_full_name
      system_alias
      system_address
    }
}`;
}

export function sitesQuery({
  systemId,
  limit = 10,
  offset = 0,
  alias,
  name,
  email,
}: {
  systemId?: string | undefined;
  limit?: number;
  offset?: number;
  alias?: string | undefined;
  name?: string | undefined;
  email?: string | undefined;
}): string {
  if (email != null) {
    email = email.trim();
  }
  if (name != null) {
    name = name.trim();
  }
  let sitesFilter = "";
  let systemFilter = "";
  let userFilter = "";
  if (systemId) {
    systemFilter = ` 
        hsai_system: {
          system_guid: { _eq: "${systemId}" }
        }
      `;
  }
  if (alias) {
    sitesFilter += `site_alias: { _eq: "${alias}" }`;
  }
  if (name) {
    sitesFilter += `{site_name: { _ilike: "%${name}%" }}`;
  }
  if (email) {
    userFilter = `
    {
      hsai_user: {
      user: { _ilike: "%${email}%" }
     }
    }`;
  }
  let filter = "";
  if (name && email) {
    filter = `_or: [
      ${sitesFilter}
      ${userFilter}          
    ]`;
  } else if (name) {
    filter = sitesFilter;
  } else if (email) {
    filter = userFilter;
  }

  return `query GetSites {
  hsai_sites(
    where: {
      hsai_site_to_system_mappings: {
        ${systemFilter}
      }
      ${filter}
    }
    limit: ${limit}
    offset: ${offset}
    order_by: {created_at: desc}
  ) {
    site_id
    site_name
    site_alias
    site_address
    site_country
    site_city
    site_state
    hsai_site_to_system_mappings {
      hsai_system {
        system_guid
        system_full_name
        system_alias
      }
    }
    hsai_user {
      user
      hsai_guid
      hsai_user_to_profile_mappings {
        hsai_user_profile {
          email
          first_name
          phone
          profile_id
          last_name
          practice_name
        }
      }
    }
  }
  hsai_sites_aggregate(
    where: {
      hsai_site_to_system_mappings: {
        ${systemFilter}
      }
            ${filter}

    }
  ) {
    aggregate {
      count
    }
  }
}`;
}

export function siteByIdQuery({ id }: { id: string }): string {
  return `query GetSites {
  hsai_sites(
    where: {
      hsai_user: {
        hsai_guid: { _eq: "${id}" }
      }
    }
  
    order_by: {created_at: desc}
  ) {
    site_id
    site_name
    site_alias
    site_address
    site_country
    site_city
    site_state
    hsai_site_to_system_mappings {
      hsai_system {
        system_guid
        system_full_name
        system_alias
      }
    }
    hsai_user {
      user
      hsai_guid
      hsai_user_to_profile_mappings {
        hsai_user_profile {
          email
          first_name
          phone
          profile_id
          last_name
          practice_name
        }
      }
    }
  }
}`;
}

export function sitesBySystemQuery({ systemIds }: { systemIds?: string[] | undefined }): string {
  let filter = "";
  if (systemIds) {
    systemIds = systemIds.filter(
      (e) => e !== undefined && e !== null && e !== "undefined" && e !== "null" && e !== ""
    );
    filter = `hsai_system: {
        system_guid: { _in: [${systemIds?.map((e) => `"${e}"`).join(", ") || ""}] }
      }`;
  }
  return `query GetSiteBySystem {
    hsai_site_to_system_mapping(
      where: {
        ${filter}
      }
      order_by: { hsai_site: { created_at: desc } }
    ) {
      hsai_site {
        site_id
        site_name
      }
      hsai_system {
        system_full_name
      }
    }
  }`;
}

export function getStudiesQuery({
  systemId,
  siteId,
  modality,
  dateRange,
  bodyPart,
  name,
  offset = 0,
  limit = 10,
}: {
  systemId?: string | undefined;
  siteId?: string | undefined;
  modality?: string | undefined;
  dateRange?: string | undefined;
  bodyPart?: string | undefined;
  name?: string | undefined;
  limit?: number;
  offset?: number;
}): string {
  if (name != null) {
    name = name.trim();
  }

  let patientFilter = "";
  let studyFilter = "";
  let dateFilter = "";

  if (siteId) {
    patientFilter = `
      hsai_site_to_patient_mappings: {
        site_id: {
          _eq: "${siteId}"
        }
      }
    `;
  }

  if (systemId) {
    patientFilter += `
      hsai_site_to_patient_mappings: {
        site: {
          hsai_site_to_system_mappings: {
            system_id: {
              _eq: "${systemId}"
            }
          }
        }
      }
    `;
  }

  if (modality || bodyPart) {
    studyFilter += `series: {`;
    if (modality) {
      studyFilter += `
        modality: {
          _eq: "${modality}"
        }
      `;
    }
    if (modality && bodyPart) {
      studyFilter += `, `;
    }
    if (bodyPart) {
      studyFilter += `
        body_part_examined: {
          _eq: "${bodyPart}"
        }
      `;
    }
    studyFilter += `}`;
  }

  if (dateRange) {
    const startDate = dateRange.split(",")[0];
    const endDate = dateRange.split(",")[1];
    if (startDate && endDate) {
      dateFilter += `
        study_date: {
          _gte: "${startDate}"
          _lte: "${endDate}"
        }
      `;
    } else if (startDate) {
      dateFilter += `
        study_date: {
          _gte: "${startDate}"
        }
      `;
    } else if (endDate) {
      dateFilter += `
        study_date: {
          _lte: "${endDate}"
        }
      `;
    }
  }

  let siteFilter = ""
  if (siteId) {
    siteFilter = `patient: {hsai_site_to_patient_mappings: {site_id: {_eq: "${siteId}"}}}`
  }

  if (name) { 
    siteFilter = `patient: {patient_name: {_ilike: "%${name}%"}}`
  }

  if (name && siteId) {
    siteFilter = `patient: {patient_name: {_ilike: "%${name}%"}, hsai_site_to_patient_mappings: {site_id: {_eq: "${siteId}"}}}`
  }

  return `
    query GetStudies {
      study(
        order_by: {study_time: desc, study_date: desc}
        where: {
          ${siteFilter}
          ${dateFilter}
          ${studyFilter ? `, ${studyFilter}` : ''}
          series_aggregate: {count: {predicate: {_gte: 1}}}
        }
        limit: ${limit}
        offset: ${offset}
      ) {
        study_instance_uid
        study_date
        study_time
        study_orthanc_id_2
        institution_name
        series {
          series_instance_uid
          series_description
          modality
          protocol_name
          body_part_examined
          series_orthanc_id
          series_orthanc_id_2
          instances(
            order_by: { index_in_series: desc }
          ) {
            detected
            index_in_series
            instance_orthanc_id
            is_ai_reviewed
            is_clinician_reviewed
          }
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
      study_aggregate(
        where: {
          ${dateFilter}
          patient: {
            ${patientFilter}
            hsai_site_to_patient_mappings_aggregate: {count: {predicate: {_gte: 1}}}
          }
          ${studyFilter ? `, ${studyFilter}` : ''}
          series_aggregate: {count: {predicate: {_gte: 1}}}
        }
        order_by: {study_time: desc, study_date: desc}
      ) {
        aggregate {
          count
        }
      }
        radiology_reports(
                limit: ${limit},
                offset: ${offset},
                where: {
                study: {
                  ${siteFilter}
                  ${dateFilter}
                  ${studyFilter ? `, ${studyFilter}` : ''}
                  series_aggregate: {count: {predicate: {_gte: 1}}}
                }
                }
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
                  study_orthanc_id_2
                  study_instance_uid
                  id
                  series {
                    body_part_examined
                    modality
                  }
                  patient {
                    hsai_site_to_patient_mappings {
                      site {
                        site_name
                        site_id
                      }
                    }
                  }
                }
              }
      }
  `;
}


export function studyFilterQuery() {
  return `
query GetStudyFilter {
	modalities: series(distinct_on: modality) {
      modality
    }
  body_part: series(distinct_on: body_part_examined) {
      body_part_examined
    }
  protocool_name: series(distinct_on: protocol_name) {
      protocol_name
    }
}

  `;
}

export function appVersionQuery({
  limit = 10,
  offset = 0,
  version,
  startDate,
  endDate,
  description,
}: {
  limit?: number;
  offset?: number;
  version?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}) {
  let versionQuery = "";
  let dateQuery = "";
  let descriptionQuery = "";
  if (version) {
    versionQuery = `version: { _ilike: "%${version}%" }`;
  }

  if (startDate && endDate) {
    dateQuery = `created_at: {
        _gte: "${startDate}",
        _lte: "${endDate}"
      }`;
  }
  if (description) {
    descriptionQuery = `description: { _ilike: "%${description}%" }`;
  }

  return `query GetAppUpdates {
  app_updates(
    order_by: { created_at: desc }
    limit: ${limit}
    offset: ${offset}
    where: {
      ${versionQuery}
      ${dateQuery}
      ${descriptionQuery}
    }
  ) {
    app_update_id
    appstore_review
    created_at
    description
    force_update
    playstore_review
    version
  }
  app_updates_aggregate {
    aggregate {
      count
    }
  }
}
`;
}

export function addAppVersionMutation({
  appstore_review,
  description,
  force_update,
  playstore_review,
  version,
}: {
  appstore_review: string;
  description: string;
  force_update: string;
  playstore_review: string;
  version: string;
}) {
  return `mutation AddAppVersion {
  insert_app_updates_one(
    object: {
      appstore_review: "${appstore_review}"
      description: "${description}"
      force_update: "${force_update}"
      playstore_review: "${playstore_review}"
      version: "${version}"
    }
  ) {
    app_update_id
  }
}
`;
}

export function updateAppVersionMutation({
  appstore_review,
  description,
  force_update,
  playstore_review,
  version,
}: {
  appstore_review: string;
  description: string;
  force_update: string;
  playstore_review: string;
  version: string;
}) {
  return `mutation UpdateAppVersion {
    update_app_updates(
        where: {version: {_eq: "${version}"}}
        _set: {
          appstore_review: "${appstore_review}", 
          description: "${description}", 
          force_update: "${force_update}", 
          playstore_review: "${playstore_review}", 
          version: "${version}"
        }
  ) {
    affected_rows
  }
}
`;
}

export function deleteAppVersionMutation({ version }: { version: string }) {
  return `mutation DeleteAppVersion {
  delete_app_updates(where: {version: {_eq: "${version}"}}) {
    affected_rows
  }
}
`;
}

export function sitesForLogs({ name }: { name?: string | undefined }) {
  if (name != null && name) {
    name = name.trim();
  }
  let filter = "";
  if (name) {
    filter = `site_name: { _ilike: "%${name}%" }`;
  }
  return `
  query GetSites {
  hsai_sites(
    order_by: {created_at: desc}
    where: {
      ${filter}
    }
  ) {
    site_id
    site_name
    site_alias
    site_address
  }
}
`;
}

export function siteMachineLogsAndLastStudy({
  siteId,
  startDate,
  endDate,
}: {
  siteId?: string | undefined;
  startDate?: string | undefined;
  endDate?: string | undefined;
}) {
  let siteFilter = "";
  let dateFilter = "";
  if (siteId) {
    siteFilter = `site_id: { _eq: "${siteId}" }`;
  }
  if (startDate && endDate) {
    dateFilter = `timestamp: {
        _gte: "${startDate}",
        _lte: "${endDate}"
      }`;
  }
  return `query GetSiteLogs {
  site_logs(
    order_by: {created_at: desc}
    where: {
      ${siteFilter}
      ${dateFilter}
    }
    ) {
    timestamp    
  }
  study(
    order_by: {created_at: desc}, 
    where: 
    {
      patient: 
      {
        hsai_site_to_patient_mappings: 
        {
          site_id: {_eq: "${siteId}"}
        }
      }
    }
    limit: 1
  ) {
    study_date
    study_time
    patient {
      patient_name
    }
  }
}
`;
}
