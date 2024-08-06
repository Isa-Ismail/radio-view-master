export default class AppVersion {
  id: string;
  appstore_review: boolean;
  created_at: Date;
  description: string;
  force_update: boolean;
  playstore_review: boolean;
  version: string;

  constructor({
    id,
    appstore_review,
    created_at,
    description,
    force_update,
    playstore_review,
    version,
  }: {
    id: string;
    appstore_review: boolean;
    created_at: Date;
    description: string;
    force_update: boolean;
    playstore_review: boolean;
    version: string;
  }) {
    this.id = id;
    this.appstore_review = appstore_review;
    this.created_at = created_at;
    this.description = description;
    this.force_update = force_update;
    this.playstore_review = playstore_review;
    this.version = version;
  }

  static fromJSON(json: any) {
    return new AppVersion({
      id: json.app_update_id,
      appstore_review: json.appstore_review === "yes" ? true : false,
      created_at: json.created_at,
      description: json.description,
      force_update: json.force_update === "yes" ? true : false,
      playstore_review: json.playstore_review === "yes" ? true : false,
      version: json.version,
    });
  }
}
