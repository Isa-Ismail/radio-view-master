import { HsaiUser } from "./hsai_user";
export type System = {
  id: string;
  name: string;
};
export class SystemAdmin {
  hsaiGuid: string | undefined;
  user: string | undefined;
  hsaiSystem: HsaiSystem | undefined;
  hsaiUser: HsaiUser | undefined;

  constructor({
    hsaiGuid,
    user,
    hsaiSystem,
    hsaiUser,
  }: {
    hsaiGuid?: string;
    user?: string;
    hsaiSystem?: HsaiSystem;
    hsaiUser?: HsaiUser;
  }) {
    this.hsaiGuid = hsaiGuid;
    this.user = user;
    this.hsaiSystem = hsaiSystem;
    this.hsaiUser = hsaiUser;
  }
}

export class HsaiSystem {
  systemGuid: string | undefined;
  sytemFullName: string | undefined;
  systemAlias: string | undefined;
  sytemAddress: string | undefined;

  constructor({
    systemGuid,
    sytemFullName,
    systemAlias,
    sytemAddress,
  }: {
    systemGuid?: string;
    sytemFullName?: string;
    systemAlias?: string;
    sytemAddress?: string;
  }) {
    this.systemGuid = systemGuid;
    this.sytemFullName = sytemFullName;
    this.systemAlias = systemAlias;
    this.sytemAddress = sytemAddress;
  }
  get toSystem(): System {
    return {
      id: this.systemGuid || "",
      name: this.sytemFullName || "",
    };
  }
}
