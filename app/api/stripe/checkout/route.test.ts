import { beforeEach, describe, expect, it, vi } from "vitest";

const { authMock, findUniqueMock, updateMock, customerCreateMock, sessionCreateMock } = vi.hoisted(() => ({
  authMock: vi.fn(),
  findUniqueMock: vi.fn(),
  updateMock: vi.fn(),
  customerCreateMock: vi.fn(),
  sessionCreateMock: vi.fn(),
}));

vi.mock("@/auth", () => ({
  auth: authMock,
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: findUniqueMock,
      update: updateMock,
    },
  },
}));

vi.mock("@/lib/stripe", () => ({
  stripe: {
    customers: {
      create: customerCreateMock,
    },
    checkout: {
      sessions: {
        create: sessionCreateMock,
      },
    },
  },
}));

import { POST } from "@/app/api/stripe/checkout/route";

describe("POST /api/stripe/checkout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.STRIPE_PRICE_BASIC;
    delete process.env.STRIPE_PRICE_PREMIUM;
    delete process.env.STRIPE_PRICE_PREMIUM_PLUS;
    delete process.env.NEXT_PUBLIC_STRIPE_PRICE_BASIC;
    delete process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM;
    delete process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM_PLUS;

    authMock.mockResolvedValue({ user: { id: "user-1" } });
    findUniqueMock.mockResolvedValue({
      id: "user-1",
      email: "user@example.com",
      stripeCustomerId: null,
    });
    updateMock.mockResolvedValue({ id: "user-1", stripeCustomerId: "cus_123" });
    customerCreateMock.mockResolvedValue({ id: "cus_123" });
    sessionCreateMock.mockResolvedValue({ url: "https://checkout.stripe.com/c/pay_123" });
  });

  it("returns 401 when session is missing", async () => {
    authMock.mockResolvedValue(null);

    const request = new Request("http://localhost/api/stripe/checkout", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ priceId: "price_123" }),
    });

    const response = await POST(request);
    const payload = (await response.json()) as { success: boolean; error: string };

    expect(response.status).toBe(401);
    expect(payload.success).toBe(false);
    expect(payload.error).toBe("Unauthorized");
  });

  it("returns 400 when body is invalid JSON", async () => {
    const request = new Request("http://localhost/api/stripe/checkout", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{",
    });

    const response = await POST(request);
    const payload = (await response.json()) as { success: boolean; error: string };

    expect(response.status).toBe(400);
    expect(payload.success).toBe(false);
    expect(payload.error).toBe("Invalid JSON body");
  });

  it("returns 400 when price id is not allowed", async () => {
    process.env.STRIPE_PRICE_PREMIUM = "price_allowed";

    const request = new Request("http://localhost/api/stripe/checkout", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ priceId: "price_forbidden" }),
    });

    const response = await POST(request);
    const payload = (await response.json()) as { success: boolean; error: string };

    expect(response.status).toBe(400);
    expect(payload.success).toBe(false);
    expect(payload.error).toBe("Invalid Stripe price id");
  });

  it("creates stripe customer and checkout session", async () => {
    process.env.STRIPE_PRICE_PREMIUM = "price_allowed";

    const request = new Request("http://localhost/api/stripe/checkout", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ priceId: "price_allowed" }),
    });

    const response = await POST(request);
    const payload = (await response.json()) as {
      success: boolean;
      data?: { url?: string };
    };

    expect(response.status).toBe(200);
    expect(payload.success).toBe(true);
    expect(payload.data?.url).toBe("https://checkout.stripe.com/c/pay_123");
    expect(customerCreateMock).toHaveBeenCalledTimes(1);
    expect(updateMock).toHaveBeenCalledTimes(1);
    expect(sessionCreateMock).toHaveBeenCalledTimes(1);
  });

  it("returns 502 when stripe returns empty checkout url", async () => {
    process.env.STRIPE_PRICE_PREMIUM = "price_allowed";
    sessionCreateMock.mockResolvedValue({ url: null });

    const request = new Request("http://localhost/api/stripe/checkout", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ priceId: "price_allowed" }),
    });

    const response = await POST(request);
    const payload = (await response.json()) as { success: boolean; error: string };

    expect(response.status).toBe(502);
    expect(payload.success).toBe(false);
    expect(payload.error).toBe("Stripe checkout URL is unavailable");
  });

  it("returns 500 when upstream throws", async () => {
    process.env.STRIPE_PRICE_PREMIUM = "price_allowed";
    sessionCreateMock.mockRejectedValue(new Error("stripe unavailable"));

    const request = new Request("http://localhost/api/stripe/checkout", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ priceId: "price_allowed" }),
    });

    const response = await POST(request);
    const payload = (await response.json()) as { success: boolean; error: string };

    expect(response.status).toBe(500);
    expect(payload.success).toBe(false);
    expect(payload.error).toBe("Stripe checkout failed");
  });
});
