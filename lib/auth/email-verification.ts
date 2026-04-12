import { createHash, randomUUID } from "node:crypto";

import { SignJWT, jwtVerify } from "jose";

import { getAuthSecret } from "@/lib/auth/jwt";

const VERIFY_EMAIL_TTL_SECONDS = 24 * 60 * 60;

type VerifyEmailPayload = {
  purpose: "verify_email";
  email: string;
  jti: string;
  exp: number;
};

function getSecretBytes(): Uint8Array {
  return new TextEncoder().encode(getAuthSecret());
}

export function hashVerificationToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function createVerificationToken(email: string): Promise<{ token: string; expiresAt: Date }> {
  const now = Math.floor(Date.now() / 1000);
  const exp = now + VERIFY_EMAIL_TTL_SECONDS;
  const jti = randomUUID();

  const token = await new SignJWT({
    purpose: "verify_email",
    email,
  })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt(now)
    .setExpirationTime(exp)
    .setJti(jti)
    .sign(getSecretBytes());

  return {
    token,
    expiresAt: new Date(exp * 1000),
  };
}

export async function verifyVerificationToken(token: string): Promise<VerifyEmailPayload | null> {
  try {
    const verified = await jwtVerify(token, getSecretBytes(), { algorithms: ["HS256"] });
    const payload = verified.payload;

    if (payload.purpose !== "verify_email") {
      return null;
    }
    if (typeof payload.email !== "string" || !payload.email) {
      return null;
    }
    if (typeof payload.jti !== "string" || !payload.jti) {
      return null;
    }
    if (typeof payload.exp !== "number") {
      return null;
    }

    return {
      purpose: "verify_email",
      email: payload.email,
      jti: payload.jti,
      exp: payload.exp,
    };
  } catch {
    return null;
  }
}
