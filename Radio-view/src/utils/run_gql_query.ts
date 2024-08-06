import { AxiosInstance } from "axios";
import { NextRequest } from "next/server";
import { graphqlAxiosClient } from "./server_axios";

export type GqlResponse = {
  data?: any;
  errors?: any;
  status: number;
};

export async function runGqlQuery({
  req,
  query,
  axiosClient,
}: {
  req: NextRequest;
  query: ({ offset, limit, json }: { offset: number; limit: number; json: any }) => string;
  axiosClient?: AxiosInstance;
}): Promise<GqlResponse> {
  let json = req.nextUrl.searchParams;

  const limit = Number(json.get("limit") ?? 10);
  let offset = Number(json.get("offset") ?? 0);
  if (offset > 0) {
    offset = offset * Number(limit);
  }

  // try {
  const _query = query({ offset, limit, json });
  const auth = req.headers.get("authorization");
  const res = await (axiosClient ?? graphqlAxiosClient)({
    method: "POST",
    data: {
      query: _query,
    },
    headers: {
      Authorization: auth,
    },
  });
  // let res: AxiosResponse;
  // if (axiosClient) {
  //   res = await axiosClient({
  //     method: "POST",
  //     data: {
  //       query: _query,
  //     },
  //     headers: {
  //       Authorization: auth,
  //     },
  //   });
  // } else {
  //   res = await graphqlAxiosClient({
  //     method: "POST",
  //     data: {
  //       query: _query,
  //     },
  //     headers: {
  //       Authorization: auth,
  //     },
  //   });
  // }

  const { data, errors } = await res.data;

  if (errors && errors.length > 0) {
    if (errors[0].extensions?.code === "invalid-jwt" && errors[0].message.includes("expired")) {
      return { errors: "JWT expired", status: 401 };
    }
    return { errors: errors, status: 400 };
  }
  // if (!res.ok) {
  //   const message = res.message ?? "An unknown error occurred";
  //   console.log("message", message, "data", res);
  //   return { errors: message, status: 400 };
  // }

  return { data, status: 200 };
  // if
  // } catch (e) {

  // }
}
