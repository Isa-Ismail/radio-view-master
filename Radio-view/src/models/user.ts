export enum AdminRole {
  superAdmin,
  systemAdmin,
  siteAdmin,
}

export class AppUser {
  userId: string;
  username: string;
  firstName: string;
  lastName: string;
  practiceName: string;
  phoneNumber: string;
  dob: string;
  practiceAddress: string;
  profileType: string;
  email: string;
  role: string;
  /// Populated when the user is a system admin
  systemId: string;
  /// Populated when the user is a system admin
  systemFullName: string;
  /// Populated when the user is a system admin
  systemAlias: string;
  /// Populated when the user is a system admins
  systemAddress: string;
  /// Populated when the user is a site admin
  siteId: string;
  /// Populated when the user is a site admin
  siteName: string;
  /// Populated when the user is a site admin
  siteAlias: string;
  /// Populated when the user is a site admin
  siteAddress: string;
  gender: string;

  constructor({
    userId,
    username,
    firstName,
    lastName,
    practiceName,
    phoneNumber,
    dob,
    practiceAddress,
    profileType,
    email,
    role,
    systemId,
    systemFullName,
    systemAlias,
    systemAddress,
    siteId,
    siteName,
    siteAlias,
    siteAddress,
    gender,
  }: {
    userId: string;
    username: string;
    firstName: string;
    lastName: string;
    practiceName: string;
    phoneNumber: string;
    dob: string;
    practiceAddress: string;
    profileType: string;
    email: string;
    role: string;
    systemId: string;
    systemFullName: string;
    systemAlias: string;
    systemAddress: string;
    siteId: string;
    siteName: string;
    siteAlias: string;
    siteAddress: string;
    gender: string;
  }) {
    this.userId = userId;
    this.username = username;
    this.firstName = firstName;
    this.lastName = lastName;
    this.practiceName = practiceName;
    this.phoneNumber = phoneNumber;
    this.dob = dob;
    this.practiceAddress = practiceAddress;
    this.profileType = profileType;
    this.email = email;
    this.role = role;
    this.systemId = systemId;
    this.systemFullName = systemFullName;
    this.systemAlias = systemAlias;
    this.systemAddress = systemAddress;
    this.siteId = siteId;
    this.siteName = siteName;
    this.siteAlias = siteAlias;
    this.siteAddress = siteAddress;
    this.gender = gender;
  }

  adminRole(): AdminRole {
    switch (this.role) {
      case "SuperAdmin":
        return AdminRole.superAdmin;
      case "SystemAdmin":
        return AdminRole.systemAdmin;
      case "SiteAdmin":
        return AdminRole.siteAdmin;
      default:
        return AdminRole.superAdmin;
    }
  }

  isSuperAdmin(): boolean {
    return this.adminRole() === AdminRole.superAdmin || this.email.includes("superadmin");
  }

  static fromJson(json: any): AppUser {
    return new AppUser({
      userId: json["userid"],
      username: json["user"],
      firstName: json["first_name"],
      lastName: json["last_name"],
      practiceName: json["practice_name"],
      phoneNumber: json["phone"],
      dob: json["date_of_birth"],
      practiceAddress: json["practice_address"],
      profileType: json["profile_type"],
      email: json["email"],
      role: json["role"],
      systemId: json["system_guid"] ?? json["system_id"],
      systemFullName: json["system_full_name"],
      systemAlias: json["system_alias"],
      systemAddress: json["system_address"],
      siteId: json["site_id"],
      siteName: json["site_name"],
      siteAlias: json["site_alias"],
      siteAddress: json["site_address"],
      gender: json["gender"],
    });
  }
}
