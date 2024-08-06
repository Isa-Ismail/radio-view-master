export class HsaiUser {
  firstName: string | undefined;
  dateOfBirth: Date | undefined;
  lastName: string | undefined;
  phone: string | undefined;
  practiceAddress: string | undefined;
  practiceName: string | undefined;
  profileId: string | undefined;
  email: string | undefined;

  constructor({
    firstName,
    dateOfBirth,
    lastName,
    phone,
    practiceAddress,
    practiceName,
    profileId,
    email,
  }: {
    firstName?: string;
    dateOfBirth?: Date;
    lastName?: string;
    phone?: string;
    practiceAddress?: string;
    practiceName?: string;
    profileId?: string;
    email?: string;
  }) {
    this.firstName = firstName;
    this.dateOfBirth = dateOfBirth;
    this.lastName = lastName;
    this.phone = phone;
    this.practiceAddress = practiceAddress;
    this.practiceName = practiceName;
    this.profileId = profileId;
    this.email = email;
  }

  static fromJson(json: any) {
    return new HsaiUser({
      firstName: json.first_name,
      dateOfBirth: json.date_of_birth,
      lastName: json.last_name,
      phone: json.phone,
      practiceAddress: json.practice_address,
      practiceName: json.practice_name,
      profileId: json.profile_id,
      email: json.email,
    });
  }

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}
