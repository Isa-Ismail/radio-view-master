export function parseJwt({ token }: { token?: string | undefined }) {
  const _token = token;
  if (_token === undefined) {
    return;
  } else {
    const buffer = Buffer.from(_token.split(".")[1], "base64").toString();
    if (buffer === undefined) {
      return;
    }
    return JSON.parse(buffer);
  }
}
