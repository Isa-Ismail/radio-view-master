import { AxiosHeaders } from "axios";
import { headers } from "next/headers";
import { NextRequest, userAgent } from "next/server";

export default function serverAxiosHeader({
  token,
  req,
}: {
  token?: string;
  req: NextRequest;
}): AxiosHeaders {
  let ip = getIp();
  const user_agent = userAgent(req);

  if (token === undefined) {
    token = req.headers.get("authorization")!;
  }
  if (token !== undefined && token !== null) {
    if (!token.includes("Bearer")) {
      token = `Bearer ${token}`;
    }
  }
  const headers = new AxiosHeaders({
    "X-Client-IP": ip,
    "User-Agent": user_agent.ua,
    // Authorization: token,
    Authorization: token,
  });
  console.log("AuthHeaders", headers);
  return headers;
}

export function getIp() {
  const headersList = headers();
  let ip = headersList.get("X-Client-IP");
  if (ip === null) {
    console.log("Client ip is null using real ip");
    ip = headersList.get("x-real-ip");
    if (ip === null) {
      console.log("Real IP is null using forwarded for");
      ip = headersList.get("x-forwarded-for");
    }
  } else {
    console.log("Client IP is not null", ip);
  }
  /// This is the case for localhost
  if (ip === "::1") {
    ip = "192.168.234.23";
  }
  console.log("IP", ip);
  return ip;
}
