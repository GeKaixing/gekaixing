import { describe, expect, it } from "vitest";

import { decodeAuthToken, encodeAuthToken } from "@/lib/auth/jwt";

describe("Auth JWT encode/decode", () => {
  it("encodes token with HS256 and decodes payload", async () => {
    const secret = "test-auth-secret";
    const encoded = await encodeAuthToken({
      token: {
        sub: "user_001",
        email: "user@example.com",
      },
      secret,
      maxAge: 60,
      salt: "test-salt",
    });

    const decoded = await decodeAuthToken({
      token: encoded,
      secret,
      salt: "test-salt",
    });

    expect(decoded).not.toBeNull();
    expect(decoded?.sub).toBe("user_001");
    expect(decoded?.email).toBe("user@example.com");
  });

  it("returns null for empty token", async () => {
    const decoded = await decodeAuthToken({
      token: undefined,
      secret: "test-auth-secret",
      salt: "test-salt",
    });

    expect(decoded).toBeNull();
  });
});
