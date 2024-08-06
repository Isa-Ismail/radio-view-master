import { Site } from "./site";

export enum Gender {
  male = "male",
  female = "female",
}

export class Study {
  institutionName: string;
  studyInstanceUid: string;
  studyDate?: Date | undefined;
  studyUid: string;
  series: Series[];
  patient: Patient;

  constructor({
    institutionName,
    studyInstanceUid,
    studyDate,
    studyUid,
    series,
    patient,
  }: {
    institutionName: string;
    studyDate: Date | undefined;
    studyInstanceUid: string;
    studyUid: string;
    series: Series[];
    patient: Patient;
  }) {
    this.institutionName = institutionName;
    this.studyInstanceUid = studyInstanceUid;
    this.studyDate = studyDate;
    this.studyUid = studyUid;
    this.series = series;
    this.patient = patient;
  }

  static getStudyDateAndTime(studyDate: string, studyTime: string): Date {
    const hour = studyTime.slice(0, 2);
    const minute = studyTime.slice(2, 4);
    const second = studyTime.slice(4, 6);

    const date = new Date(studyDate);
    date.setHours(parseInt(hour));
    date.setMinutes(parseInt(minute));
    date.setSeconds(parseInt(second));
    return date;
  }
}

export class Series {
  modality: string;
  protocol: string;
  bodyPart: string;
  instances: Instance[];
  seriesOrthancId: string;
  seriesUid: string;
  seriesDescription: string;

  constructor({
    modality,
    protocol,
    bodyPart,
    instances,
    seriesOrthancId,
    seriesUid,
    seriesDescription,
  }: {
    modality: string;
    protocol: string;
    bodyPart: string;
    instances: Instance[];
    seriesOrthancId: string;
    seriesUid: string;
    seriesDescription: string;
  }) {
    this.modality = modality;
    this.protocol = protocol;
    this.bodyPart = bodyPart;
    this.instances = instances;
    this.seriesOrthancId = seriesOrthancId;
    this.seriesUid = seriesUid;
    this.seriesDescription = seriesDescription;
  }
}
export enum Detected {
  bleed,
  normal,
  notDetected,
}

export class Instance {
  detected: Detected;
  instanceOrthancId: string;
  indexInSeries: number;
  isAiReviewed: boolean;
  isClinicalReviewed: boolean;

  constructor({
    detected,
    instanceOrthancId,
    indexInSeries,
    isAiReviewed,
    isClinicalReviewed,
  }: {
    detected: Detected;
    instanceOrthancId: string;
    indexInSeries: number;
    isAiReviewed: boolean;
    isClinicalReviewed: boolean;
  }) {
    this.detected = detected;
    this.instanceOrthancId = instanceOrthancId;
    this.indexInSeries = indexInSeries;
    this.isAiReviewed = isAiReviewed;
    this.isClinicalReviewed = isClinicalReviewed;
  }
}
export class Patient {
  patientName: string;
  patientBirthDate: Date;
  patientSex: Gender;
  patientId: string;
  createdAt: Date;
  site: Site;

  constructor({
    patientName,
    patientBirthDate,
    patientSex,
    patientId,
    createdAt,
    site,
  }: {
    patientName: string;
    patientBirthDate: Date;
    patientSex: Gender;
    patientId: string;
    createdAt: Date;
    site: Site;
  }) {
    this.patientName = patientName;
    this.patientBirthDate = patientBirthDate;
    this.patientSex = patientSex;
    this.patientId = patientId;
    this.createdAt = createdAt;
    this.site = site;
  }
}

export class StudyFilter {
  modalities: string[];
  body_part: string[];
  protocool_name: string[];

  constructor({
    modalities,
    body_part,
    protocool_name,
  }: {
    modalities: string[];
    body_part: string[];
    protocool_name: string[];
  }) {
    this.modalities = modalities;
    this.body_part = body_part;
    this.protocool_name = protocool_name;
  }
}
