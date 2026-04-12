import { SignJWT, jwtVerify } from "jose";
import type { JWTDecodeParams, JWTEncodeParams } from "next-auth/jwt";

const DEFAULT_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

function getSecretForJose(secret: string | Buffer): Uint8Array {
  if (typeof secret !== "string") {
    return new Uint8Array(secret);
  }
  return new TextEncoder().encode(secret);
}

export function getAuthSecret(): string {
  const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error("Missing AUTH_SECRET or NEXTAUTH_SECRET");
  }
  return secret;
}

export async function encodeAuthToken({ token, secret, maxAge }: JWTEncodeParams): Promise<string> {
  if (!token) {
    return "";
  }

  const now = Math.floor(Date.now() / 1000);
  const ttl = maxAge ?? DEFAULT_MAX_AGE_SECONDS;
  const payload = { ...token };

  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt(now)
    .setExpirationTime(now + ttl)
    .sign(getSecretForJose(secret));
}

export async function decodeAuthToken({ token, secret }: JWTDecodeParams) {
  if (!token) {
    return null;
  }

  const verified = await jwtVerify(token, getSecretForJose(secret), {
    algorithms: ["HS256"],
  });

  return verified.payload;
}
