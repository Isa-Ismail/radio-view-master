import { Site } from "./site";
import { HsaiSystem } from "./system";

export class Clinician {
  id: string;
  hsaiGuid: string;
  firstName: string;
  lastName: string;
  practiceName?: string | undefined;
  practiceAddress?: string | undefined;
  phoneNumber: string;
  dob?: Date | undefined;
  email: string;
  gender: string;
  profileType: string;
  // siteIds: string[];
  // systemIds: string[];
  sites: Site[];
  systemIds: HsaiSystem[];

  constructor({
    id,
    hsaiGuid,
    firstName,
    lastName,
    practiceName,
    practiceAddress,
    phoneNumber,
    dob,
    email,
    gender,
    profileType,
    siteIds,
    systemIds,
  }: {
    id: string;
    hsaiGuid: string;
    firstName: string;
    lastName: string;
    practiceName?: string;
    practiceAddress?: string;
    phoneNumber: string;
    dob?: Date;
    email: string;
    gender: string;
    profileType: string;
    siteIds: Site[];
    systemIds: HsaiSystem[];
  }) {
    this.id = id;
    this.hsaiGuid = hsaiGuid;
    this.firstName = firstName;
    this.lastName = lastName;
    this.practiceName = practiceName;
    this.practiceAddress = practiceAddress;
    this.phoneNumber = phoneNumber;
    this.dob = dob;
    this.email = email;
    this.gender = gender;
    this.profileType = profileType;
    this.sites = siteIds;
    this.systemIds = systemIds;
  }
}
