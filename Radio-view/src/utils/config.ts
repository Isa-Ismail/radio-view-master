export default class AppConfig {
  static authUrl: string = process.env.NEXT_AUTH_URL as string;
  static graphqlUrl: string = process.env.NEXT_GRAPHQL_URL as string;
  static devPassword: string = process.env.NEXT_DEV_PASSWORD as string;
  static loggerUrl: string = process.env.NEXT_LOGGER_URL as string;
  static countryUrl: string = process.env.NEXT_COUNTRY_URL as string;
}
