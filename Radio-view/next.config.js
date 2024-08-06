/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_AUTH_URL: process.env.NEXT_AUTH_URL,
    NEXT_GRAPHQL_URL: process.env.NEXT_GRAPHQL_URL,
    NEXT_DEV_PASSWORD: process.env.NEXT_DEV_PASSWORD,
    NEXT_LOGGER_URL: process.env.NEXT_LOGGER_URL,
  },
  output: "standalone",
};

module.exports = nextConfig;
