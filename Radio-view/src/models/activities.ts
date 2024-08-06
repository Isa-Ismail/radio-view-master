export default class ActivitiesModel {
  id: string;
  userId: string;
  email: string;
  date: string;
  time: string;
  status: string;
  apiCall: string;
  description: string;

  constructor(
    id: string,
    userId: string,
    email: string,
    date: string,
    time: string,
    status: string,
    apiCall: string,
    description: string
  ) {
    this.id = id;
    this.userId = userId;
    this.email = email;
    this.date = date;
    this.time = time;
    this.status = status;
    this.apiCall = apiCall;
    this.description = description;
  }

  static fromJson(json: any): ActivitiesModel {
    return new ActivitiesModel(
      json._id,
      json.user_id,
      json.email,
      json.date,
      json.time,
      json.status,
      json.api_call,
      json.description
    );
  }

  get dateObject(): Date {
    const dateTimeStr = `${this.date}T${this.time}.000Z`;
    let dateTime = new Date(dateTimeStr).toUTCString();

    return new Date(dateTime);
  }

  get timeZoneBasedTime(): string {
    const time = this.dateObject.toLocaleTimeString();
    let hour = time.split(":")[0];
    let minutes = time.split(":")[1];
    let ampm = parseInt(hour) >= 12 ? "PM" : "AM";
    hour = (parseInt(hour) % 12).toString();

    return `${hour}:${minutes} ${ampm}`;
  }

  get timeZoneBasedDate(): string {
    return this.dateObject.toLocaleDateString();
  }
}

export enum ActivitySource {
  web = "web",
  app = "app",
}
export enum ActivityStatus {
  success = "success",
  fail = "fail",
}

export enum WebActivityApiCall {
  login = "login",
  logout = "logout",
  change_password = "change-password",
  forget_password = "forgot-password",
  update_password = "update-password",
  site_admin = "site-admin",
  clinician = "clinician",
}

export enum AppActivityApiCall {
  login = "login",
  logout = "logout",
  biometric_login = "biometric-login",
  register_biometric = "register-biometric",
  change_password = "change-password",
  forget_password = "forgot-password",
  update_password = "update-password",
  site_admin = "site-admin",
  clinician = "clinician",
}

export const normalizeCollectionName = (collection: string) => {
  return collection
    .replace(/_/g, " ")
    .replace(/\w\S*/g, (w) => w.replace(/^\w/, (c) => c.toUpperCase()));
};
