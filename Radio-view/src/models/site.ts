import { HsaiUser } from "./hsai_user";
import { HsaiSystem } from "./system";

export class Site {
  id: string;
  name: string;
  alias: string;
  system: string;
  constructor({
    id,
    name,
    alias,
    system,
  }: {
    id: string;
    name: string;
    system: string;
    alias: string;
  }) {
    this.id = id;
    this.name = name;
    this.system = system;
    this.alias = alias;
  }
}

export class SitesBySystem {
  system: string;
  sites: Site[];

  constructor({ system, sites }: { system: string; sites: Site[] }) {
    this.system = system;
    this.sites = sites;
  }
}

export class SiteAdmin {
  hsaiGuid: string | undefined;
  user: string | undefined;
  hsaiUser: HsaiUser | undefined;
  systems: HsaiSystem[] | undefined;
  siteContact: string | undefined;
  siteAddress: string | undefined;
  siteAlias: string | undefined;
  siteName: string | undefined;
  siteId: string | undefined;
  country: string | undefined;
  city: string | undefined;
  state: string | undefined;

  constructor({
    hsaiGuid,
    user,
    hsaiUser,
    systems,
    siteContact,
    siteAddress,
    siteAlias,
    siteName,
    siteId,
    country,
    city,
    state,
  }: {
    hsaiGuid?: string;
    user?: string;
    hsaiUser?: HsaiUser;
    systems?: HsaiSystem[];
    siteContact?: string;
    siteAddress?: string;
    siteAlias?: string;
    siteName?: string;
    siteId?: string;
    country?: string;
    city?: string;
    state?: string;
  }) {
    this.hsaiGuid = hsaiGuid;
    this.user = user;
    this.hsaiUser = hsaiUser;
    this.systems = systems;
    this.siteContact = siteContact;
    this.siteAddress = siteAddress;
    this.siteAlias = siteAlias;
    this.siteName = siteName;
    this.siteId = siteId;
    this.country = country;
    this.city = city;
    this.state = state;
  }

  get toSite(): Site {
    return {
      id: this.siteId || "",
      name: this.siteName || "",
      alias: this.siteAlias || "",
      system: this.systems?.[0].sytemFullName || "",
    };
  }
}
